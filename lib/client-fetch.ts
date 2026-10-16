export async function postJson(url: string, body: unknown, timeoutMs: number) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(timeoutMs),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok)
    throw new Error(
      typeof data?.error === "string"
        ? data.error
        : "Unable to complete your request. Please contact us on WhatsApp.",
    );
  if (!data || typeof data !== "object")
    throw new Error("Invalid response. Please contact our team.");
  return data;
}
