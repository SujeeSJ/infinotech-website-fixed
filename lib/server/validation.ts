import { isValidPhoneNumber } from "libphonenumber-js";
import { services, budgets } from "../contact-options";
import { HttpError, onlyKeys } from "./http";
export function contactFields(body: Record<string, unknown>) {
  const limits = {
    name: 100,
    email: 254,
    phone: 30,
    company: 200,
    service: 100,
    budget: 100,
    message: 5000,
    website: 200,
  };
  onlyKeys(body, Object.keys(limits));
  const fields = {} as Record<keyof typeof limits, string>;
  for (const key of Object.keys(limits) as (keyof typeof limits)[]) {
    const value = body[key] ?? "";
    if (
      typeof value !== "string" ||
      value.length > limits[key] ||
      /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)
    )
      throw new HttpError(
        400,
        "Please check the form fields and their length.",
      );
    fields[key] = value.trim();
  }
  if (fields.website)
    throw new HttpError(400, "Unable to submit this enquiry.");
  if (
    !fields.name ||
    /[\r\n]/.test(fields.name) ||
    !fields.message ||
    !isValidPhoneNumber(fields.phone)
  )
    throw new HttpError(
      400,
      "Enter your name, valid phone number and project message.",
    );
  if (
    !services.some((s) => s === fields.service) ||
    !budgets.some((b) => b === fields.budget)
  )
    throw new HttpError(400, "Choose a valid service and budget.");
  if (fields.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
    throw new HttpError(400, "Enter a valid email address.");
  return fields;
}
export type ChatMessage = { role: "user" | "assistant"; content: string };
export function chatMessages(body: Record<string, unknown>): ChatMessage[] {
  onlyKeys(body, ["messages"]);
  if (
    !Array.isArray(body.messages) ||
    body.messages.length < 1 ||
    body.messages.length > 8
  )
    throw new HttpError(400, "Send between one and eight messages.");
  const messages = body.messages.map((message: unknown) => {
    if (!message || typeof message !== "object" || Array.isArray(message))
      throw new HttpError(400, "Invalid message.");
    const m = message as Record<string, unknown>;
    onlyKeys(m, ["role", "content"]);
    if (
      (m.role !== "user" && m.role !== "assistant") ||
      typeof m.content !== "string" ||
      !m.content.trim() ||
      m.content.length > 5000
    )
      throw new HttpError(400, "Invalid message or message too long.");
    if (m.role === "user" && m.content.length > 1000)
      throw new HttpError(400, "Keep your message under 1,000 characters.");
    return { role: m.role, content: m.content.trim() } as ChatMessage;
  });
  if (messages.at(-1)?.role !== "user")
    throw new HttpError(400, "The last message must be from you.");
  return messages;
}
