import type { Metadata } from "next";
import ContactClient from "./ContactClient";
export const metadata: Metadata = {
  title: "Contact",
  description:
    "Discuss your website, software, mobile application or AI project with Infinotech.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Infinotech",
    description: "Tell us about your next digital project.",
    url: "/contact",
    images: ["/og-image.png"],
  },
};
export default function ContactPage() {
  return <ContactClient />;
}
