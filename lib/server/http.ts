import { site } from "../site";

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public retryAfter?: number,
  ) {
    super(message);
  }
}
export function json(
  data: unknown,
  status = 200,
  headers: Record<string, string> = {},
) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
}
export function errorResponse(error: unknown) {
  if (error instanceof HttpError)
    return json(
      { success: false, error: error.message },
      error.status,
      error.retryAfter ? { "Retry-After": String(error.retryAfter) } : {},
    );
  // Do not log user messages, credentials or provider response bodies.
  console.error("Website API request failed", {
    type: error instanceof Error ? error.name : "UnknownError",
  });
  return json(
    {
      success: false,
      error: "Temporarily unavailable. Please call or WhatsApp our team.",
    },
    503,
  );
}
export function assertBrowserRequest(request: Request) {
  const allowed = new Set([site.url, "https://www.infinotech.com"]);
  if (process.env.NODE_ENV !== "production") {
    allowed.add("http://localhost:3000");
    allowed.add("http://127.0.0.1:3000");
  }
  for (const entry of (process.env.ADDITIONAL_ALLOWED_ORIGINS || "")
    .split(",")
    .filter(Boolean)) {
    const url = new URL(entry.trim());
    if (
      url.protocol !== "https:" &&
      !(process.env.NODE_ENV !== "production" && url.protocol === "http:")
    )
      throw new Error("Invalid origin configuration");
    allowed.add(url.origin);
  }
  if (
    !allowed.has(request.headers.get("origin") || "") ||
    request.headers.get("sec-fetch-site") === "cross-site"
  )
    throw new HttpError(403, "Please submit this request from our website.");
  if (
    request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !==
    "application/json"
  )
    throw new HttpError(415, "Content-Type must be application/json.");
  if (
    request.headers.has("content-encoding") &&
    request.headers.get("content-encoding") !== "identity"
  )
    throw new HttpError(415, "Encoded request bodies are not supported.");
}
export async function readObject(
  request: Request,
  maxBytes: number,
): Promise<Record<string, unknown>> {
  const length = request.headers.get("content-length");
  if (length && (!/^\d+$/.test(length) || Number(length) > maxBytes))
    throw new HttpError(413, "Request is too large.");
  if (!request.body) throw new HttpError(400, "Invalid request body.");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new HttpError(408, "Request timed out."));
      void reader.cancel().catch(() => {});
    }, 5000);
  });
  try {
    while (true) {
      const { done, value } = await Promise.race([reader.read(), timeout]);
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) {
        void reader.cancel().catch(() => {});
        throw new HttpError(413, "Request is too large.");
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.length;
    }
    let body: unknown;
    try {
      body = JSON.parse(
        new TextDecoder("utf-8", { fatal: true }).decode(bytes),
      );
    } catch {
      throw new HttpError(400, "Invalid JSON.");
    }
    if (!body || typeof body !== "object" || Array.isArray(body))
      throw new HttpError(400, "Expected an object.");
    return body as Record<string, unknown>;
  } finally {
    clearTimeout(timer);
    reader.releaseLock();
  }
}
export function onlyKeys(
  body: Record<string, unknown>,
  keys: readonly string[],
) {
  if (Object.keys(body).some((key) => !keys.includes(key)))
    throw new HttpError(400, "Unexpected form fields.");
}
