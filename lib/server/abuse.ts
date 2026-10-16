import { createHmac } from "node:crypto";
import { isIP } from "node:net";
import { HttpError } from "./http";

// Atomically check and reserve all quotas. TTL windows start on the first request.
// Counts include failed provider requests, so outages cannot amplify paid retries.
export const QUOTA_SCRIPT = `
for i=1,#KEYS do
  if tonumber(redis.call('GET',KEYS[i]) or '0') >= tonumber(ARGV[(i-1)*2+1]) then
    return {0, math.max(1,redis.call('TTL',KEYS[i]))}
  end
end
for i=1,#KEYS do
  local n=redis.call('INCR',KEYS[i])
  if n == 1 then redis.call('EXPIRE',KEYS[i],ARGV[(i-1)*2+2]) end
end
return {1,0}`;
export function fingerprint(value: string) {
  const secret = process.env.RATE_LIMIT_SECRET;
  if (!secret || secret.length < 32)
    throw new Error("Rate limit secret not configured");
  return createHmac("sha256", secret).update(value).digest("hex");
}
async function redis(command: (string | number)[]): Promise<unknown> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error("Shared rate limits not configured");
  const endpoint = new URL(url);
  if (endpoint.protocol !== "https:" || endpoint.username || endpoint.password)
    throw new Error("Invalid Redis endpoint");
  const response = await fetch(endpoint, {
    method: "POST",
    redirect: "error",
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    signal: AbortSignal.timeout(3000),
  });
  if (!response.ok) throw new Error("Rate limit service unavailable");
  const result = await response.json();
  if (result.error || !("result" in result))
    throw new Error("Rate limit service error");
  return result.result;
}
function clientIdentity(request: Request) {
  // Host must STRIP incoming copies and SET this single-IP header itself.
  // Never trust the first item in a client-supplied X-Forwarded-For chain.
  const header = process.env.TRUSTED_IP_HEADER;
  if (!header) {
    if (process.env.NODE_ENV !== "production") return "local-development";
    throw new Error("Trusted proxy IP header not configured");
  }
  const raw = request.headers.get(header)?.trim();
  if (!raw || !isIP(raw)) throw new Error("Trusted client IP unavailable");
  // Normalize equivalent IPv6 spellings. Global quotas also bound address rotation.
  const ip = raw.includes(":") ? new URL(`http://[${raw}]/`).hostname : raw;
  return ip;
}
function dailyLimit(kind: "ai" | "contact") {
  const value = Number(
    process.env[
      kind === "ai" ? "AI_DAILY_REQUEST_LIMIT" : "CONTACT_DAILY_REQUEST_LIMIT"
    ] || 100,
  );
  if (!Number.isSafeInteger(value) || value < 1 || value > 10000)
    throw new Error("Invalid daily quota");
  return value;
}
export async function limitRequests(request: Request, kind: "ai" | "contact") {
  const client = fingerprint(clientIdentity(request));
  const base = `infinotech:${kind}`;
  const response = await redis([
    "EVAL",
    QUOTA_SCRIPT,
    3,
    `${base}:client:${client}`,
    `${base}:minute`,
    `${base}:day`,
    kind === "ai" ? 6 : 3,
    kind === "ai" ? 60 : 600,
    kind === "ai" ? 30 : 10,
    60,
    dailyLimit(kind),
    86400,
  ]);
  if (
    !Array.isArray(response) ||
    response.length !== 2 ||
    ![0, 1].includes(response[0])
  )
    throw new Error("Invalid quota response");
  if (response[0] === 0)
    throw new HttpError(
      429,
      "Too many requests. Please try later or contact us on WhatsApp.",
      Math.max(1, Number(response[1]) || 60),
    );
}
export async function reserveEnquiry(payload: string) {
  const digest = fingerprint(payload);
  const key = `infinotech:contact:duplicate:${digest}`;
  const result = await redis(["SET", key, "pending", "NX", "EX", 86400]);
  if (result === null)
    throw new HttpError(
      409,
      "This enquiry was already submitted recently. Please contact us on WhatsApp if you need help.",
    );
  if (result !== "OK") throw new Error("Invalid reservation response");
  return { key, idempotencyKey: `enquiry-${digest}` };
}
export async function releaseEnquiry(key: string) {
  await redis(["DEL", key]);
}
