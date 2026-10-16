const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
const root = path.resolve(__dirname, "..");
function harness(options = {}) {
  const calls = [];
  const cache = new Map();
  let sends = 0;
  const env = {
    NODE_ENV: "production",
    RATE_LIMIT_SECRET: "local-test-secret-".repeat(3),
    TRUSTED_IP_HEADER: "x-real-ip",
    UPSTASH_REDIS_REST_URL: "https://test.upstash.io",
    UPSTASH_REDIS_REST_TOKEN: "mock",
    OPENAI_API_KEY: "mock",
    RESEND_API_KEY: "mock",
    CONTACT_FROM_EMAIL: "test@example.com",
    ...options.env,
  };
  async function fetchMock(url, init) {
    calls.push({ url: String(url), ...init });
    if (String(url).includes("upstash")) {
      if (options.redisDown) throw new Error("Offline");
      const command = JSON.parse(init.body);
      let result =
        command[0] === "EVAL"
          ? options.quota || [1, 0]
          : command[0] === "SET"
            ? options.duplicate
              ? null
              : "OK"
            : 1;
      return Response.json({ result });
    }
    if (String(url) !== "https://api.resend.com/emails")
      throw new Error("Unexpected network target");
    sends++;
    if (options.mailTimeout)
      throw new DOMException("Timed out", "TimeoutError");
    return Response.json(options.mailBody || { id: "local-test-id" }, {
      status: options.mailStatus || 200,
    });
  }
  function load(name) {
    let file = path.resolve(root, name);
    if (!file.endsWith(".ts")) file += ".ts";
    if (cache.has(file)) return cache.get(file).exports;
    const loadedModule = { exports: {} };
    cache.set(file, loadedModule);
    const code = ts.transpileModule(fs.readFileSync(file, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        esModuleInterop: true,
      },
    }).outputText;
    const req = (n) => {
      if (n === "openai")
        return class {
          responses = {
            create: async (body) => {
              calls.push({ ai: body });
              return { output_text: "Local mock answer" };
            },
          };
        };
      if (n.startsWith("@/")) return load(n.slice(2));
      if (n.startsWith(".")) return load(path.resolve(path.dirname(file), n));
      return require(n);
    };
    new Function(
      "require",
      "module",
      "exports",
      "process",
      "fetch",
      "console",
      code,
    )(req, loadedModule, loadedModule.exports, { env }, fetchMock, {
      error() {},
    });
    return loadedModule.exports;
  }
  return {
    load,
    calls,
    get sends() {
      return sends;
    },
  };
}
const validContact = {
  name: "Local test",
  phone: "+94721312154",
  email: "example@example.com",
  company: "",
  service: "Website Development",
  budget: "",
  message: "This is a local mocked test.",
  website: "",
};
const validChat = { messages: [{ role: "user", content: "Website enquiry" }] };
function request(body, headers = {}) {
  return new Request("https://infinotech.com/api/test", {
    method: "POST",
    headers: {
      Origin: "https://infinotech.com",
      "Content-Type": "application/json",
      "x-real-ip": "192.0.2.10",
      ...headers,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}
for (const kind of ["ai", "contact"]) {
  const valid = kind === "ai" ? validChat : validContact;
  for (const [label, body, headers, status] of [
    ["foreign origin", valid, { Origin: "https://untrusted.example" }, 403],
    ["missing origin", valid, { Origin: "" }, 403],
    ["text/plain", valid, { "Content-Type": "text/plain" }, 415],
    ["encoded body", valid, { "Content-Encoding": "gzip" }, 415],
    ["null body", "null", {}, 400],
    ["malformed JSON", "{", {}, 400],
    ["array body", "[]", {}, 400],
    ["unknown field", { ...valid, extra: "x" }, {}, 400],
    ["oversized body", { ...valid, extra: "x".repeat(65536) }, {}, 413],
    ["oversized declared length", valid, { "Content-Length": "1000000" }, 413],
  ])
    test(`${kind}: reject ${label} before provider`, async () => {
      const h = harness();
      const r = await h
        .load(`app/api/${kind}/route`)
        .POST(request(body, headers));
      assert.equal(r.status, status);
      assert.equal(h.calls.length, 0);
      assert.equal(r.headers.get("cache-control"), "no-store");
    });
  test(`${kind}: shared limiter outage fails closed`, async () => {
    const h = harness({ redisDown: true });
    const r = await h.load(`app/api/${kind}/route`).POST(request(valid));
    assert.equal(r.status, 503);
    assert.equal(h.sends, 0);
    assert.equal(
      h.calls.some((c) => c.ai),
      false,
    );
  });
  test(`${kind}: limit rejects before paid provider`, async () => {
    const h = harness({ quota: [0, 42] });
    const r = await h.load(`app/api/${kind}/route`).POST(request(valid));
    assert.equal(r.status, 429);
    assert.equal(r.headers.get("retry-after"), "42");
    assert.equal(h.sends, 0);
    assert.equal(
      h.calls.some((c) => c.ai),
      false,
    );
  });
  test(`${kind}: missing trusted client identity fails closed`, async () => {
    const h = harness({ env: { TRUSTED_IP_HEADER: "" } });
    const r = await h.load(`app/api/${kind}/route`).POST(request(valid));
    assert.equal(r.status, 503);
    assert.equal(h.calls.length, 0);
  });
}
for (const body of [
  { messages: [{ role: ["user"], content: "x" }] },
  { messages: [{ role: "user", content: "  " }] },
  { messages: [{ role: "system", content: "x" }] },
  { messages: [{ role: "assistant", content: "x" }] },
  { messages: [{ role: "user", content: "x".repeat(1001) }] },
]) {
  test("AI rejects malformed/empty/untrusted role", async () => {
    const h = harness();
    assert.equal(
      (await h.load("app/api/ai/route").POST(request(body))).status,
      400,
    );
    assert.equal(h.calls.length, 0);
  });
}
test("AI keeps structured roles and disables response storage", async () => {
  const h = harness();
  const r = await h.load("app/api/ai/route").POST(request(validChat));
  assert.equal(r.status, 200);
  const call = h.calls.find((c) => c.ai).ai;
  assert.deepEqual(call.input, validChat.messages);
  assert.equal(call.store, false);
  assert.ok(call.max_output_tokens <= 1000);
});
for (const changes of [
  { website: "bot.example" },
  { phone: "123" },
  { service: "invented" },
  { budget: "invented" },
  { name: "x".repeat(101) },
  { name: "test\nBcc" },
]) {
  test("contact rejects invalid fields and honeypot", async () => {
    const h = harness();
    assert.equal(
      (
        await h
          .load("app/api/contact/route")
          .POST(request({ ...validContact, ...changes }))
      ).status,
      400,
    );
    assert.equal(h.calls.length, 0);
  });
}
test("contact sends fixed-recipient plain-text email with idempotency", async () => {
  const h = harness();
  const r = await h.load("app/api/contact/route").POST(request(validContact));
  assert.equal(r.status, 200);
  assert.equal(h.sends, 1);
  const mail = h.calls.find((c) => c.url.includes("resend"));
  const payload = JSON.parse(mail.body);
  assert.deepEqual(payload.to, ["info@infinotech.com"]);
  assert.ok(payload.text);
  assert.equal(payload.html, undefined);
  assert.ok(mail.headers["Idempotency-Key"]);
});
test("duplicate enquiry never sends again", async () => {
  const h = harness({ duplicate: true });
  assert.equal(
    (await h.load("app/api/contact/route").POST(request(validContact))).status,
    409,
  );
  assert.equal(h.sends, 0);
});
for (const options of [
  { mailTimeout: true },
  { mailStatus: 500 },
  { mailBody: {} },
])
  test("ambiguous email result never claims success or releases duplicate guard", async () => {
    const h = harness(options);
    const r = await h.load("app/api/contact/route").POST(request(validContact));
    assert.ok(r.status >= 500);
    assert.equal(
      h.calls.some(
        (c) => c.url.includes("upstash") && JSON.parse(c.body)[0] === "DEL",
      ),
      false,
    );
  });
test("definitively rejected email can be retried", async () => {
  const h = harness({ mailStatus: 422 });
  assert.equal(
    (await h.load("app/api/contact/route").POST(request(validContact))).status,
    502,
  );
  assert.ok(
    h.calls.some(
      (c) => c.url.includes("upstash") && JSON.parse(c.body)[0] === "DEL",
    ),
  );
});
test("limits do not store raw IP address and reserve three quotas atomically", async () => {
  const h = harness();
  await h.load("app/api/ai/route").POST(request(validChat));
  const c = JSON.parse(h.calls[0].body);
  assert.equal(c[0], "EVAL");
  assert.equal(c[2], 3);
  assert.equal(h.calls[0].body.includes("192.0.2.10"), false);
});
