// Render testimonials only when a client-approved quote has been supplied.
export default function Testimonial({
  quote,
  client,
}: {
  quote?: string;
  client?: string;
}) {
  if (!quote || !client) return null;
  return (
    <figure className="mx-auto max-w-4xl px-6 py-20">
      <blockquote className="text-2xl">{quote}</blockquote>
      <figcaption className="mt-5 font-semibold">{client}</figcaption>
    </figure>
  );
}
