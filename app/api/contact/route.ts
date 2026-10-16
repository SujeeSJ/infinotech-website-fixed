import {
  assertBrowserRequest,
  readObject,
  errorResponse,
  json,
  HttpError,
} from "@/lib/server/http";
import {
  limitRequests,
  reserveEnquiry,
  releaseEnquiry,
} from "@/lib/server/abuse";
import { contactFields } from "@/lib/server/validation";
import { site } from "@/lib/site";
export const runtime = "nodejs";
export const maxDuration = 30;
export async function POST(request: Request) {
  try {
    assertBrowserRequest(request);
    const fields = contactFields(await readObject(request, 24 * 1024));
    if (!process.env.RESEND_API_KEY || !process.env.CONTACT_FROM_EMAIL)
      throw new HttpError(
        503,
        "The enquiry form is unavailable. Please call or WhatsApp our team.",
      );
    await limitRequests(request, "contact");
    const { key, idempotencyKey } = await reserveEnquiry(
      JSON.stringify(fields),
    );
    const { name, email, phone, company, service, budget, message } = fields;
    // On an ambiguous network timeout retain the reservation: mail may have been accepted.
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      redirect: "error",
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL,
        to: [process.env.CONTACT_TO_EMAIL || site.email],
        ...(email ? { reply_to: email } : {}),
        subject: `New Infinotech enquiry from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nCompany: ${company}\nService: ${service}\nBudget: ${budget}\n\n${message}`,
      }),
    });
    if (!response.ok) {
      // Only definitive validation/auth rejection is safe to release for a retry.
      if ([400, 401, 403, 422].includes(response.status))
        await releaseEnquiry(key);
      throw new HttpError(
        502,
        "We could not confirm your enquiry. Please contact us on WhatsApp before retrying.",
      );
    }
    const result = await response.json();
    if (typeof result.id !== "string" || !result.id)
      throw new HttpError(
        502,
        "We could not confirm your enquiry. Please contact us on WhatsApp.",
      );
    return json({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
