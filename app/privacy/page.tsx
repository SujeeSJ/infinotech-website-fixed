import type { Metadata } from "next";
import { site } from "@/lib/site";
export const metadata: Metadata = {
  title: "Privacy & data use",
  description:
    "How this website handles project enquiries and AI conversations.",
  alternates: { canonical: "/privacy" },
};
export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 pb-24 pt-40 text-neutral-800">
      <h1 className="text-4xl font-semibold tracking-tight">
        Privacy &amp; data use
      </h1>
      <p className="mt-6 leading-7">
        Infinotech is a digital technology brand under Apexx Private Limited.
        This page explains the enquiry and AI features of this website.
      </p>
      <h2 className="mt-10 text-2xl font-semibold">Project enquiries</h2>
      <p className="mt-4 leading-7">
        When you submit the form, your name, phone number, optional email and
        business details, service choice and project message are sent to our
        team through Resend, our email delivery provider. We use these details
        to respond to your enquiry. Please share only what is necessary for that
        conversation.
      </p>
      <h2 className="mt-10 text-2xl font-semibold">AI conversations</h2>
      <p className="mt-4 leading-7">
        The assistant sends the most recent eight messages to OpenAI to generate
        a response. This website keeps a limited conversation history in your
        browser memory, which resets on reload, and does not save a chat
        database. Requests ask OpenAI not to store response objects; provider
        security and abuse-monitoring policies may still apply. AI replies may
        be inaccurate. Do not enter passwords, payment details or confidential
        information.
      </p>
      <h2 className="mt-10 text-2xl font-semibold">
        Security and service providers
      </h2>
      <p className="mt-4 leading-7">
        The site uses a keyed hash of your network address for short-lived
        request limits in Upstash Redis. It also stores a keyed fingerprint of
        enquiries for up to 24 hours to reduce duplicate submissions; enquiry
        text is not stored in that security database. Hosting and delivery
        providers may process technical logs. These services may process data
        outside your country.
      </p>
      <h2 className="mt-10 text-2xl font-semibold">Retention and questions</h2>
      <p className="mt-4 leading-7">
        Enquiry emails remain in our team’s mailbox and provider systems subject
        to their retention settings. You can contact us to ask about retention,
        access, correction or deletion of information you have sent. We will
        explain what we can do and any records that need to be kept.
      </p>
      <p className="mt-4 leading-7">
        Email{" "}
        <a className="underline" href={`mailto:${site.email}`}>
          {site.email}
        </a>{" "}
        or call{" "}
        <a className="underline" href={`tel:${site.phone}`}>
          {site.phoneDisplay}
        </a>
        .
      </p>
      <p className="mt-8 text-sm leading-6">
        Links to client sites and WhatsApp take you to external services with
        their own privacy practices.
      </p>
    </article>
  );
}
