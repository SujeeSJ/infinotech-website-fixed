"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { postJson } from "@/lib/client-fetch";
import { site } from "@/lib/site";
type Message = { role: "user" | "assistant"; content: string };
export default function InfinotechAI() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! Tell me about your website, software or AI project. For a quotation, contact our team directly.",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const pending = useRef(false);
  const launcher = useRef<HTMLButtonElement>(null);
  const field = useRef<HTMLInputElement>(null);
  const log = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    field.current?.focus();
    function escape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        launcher.current?.focus();
      }
    }
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [open]);
  useEffect(() => {
    if (log.current) log.current.scrollTop = log.current.scrollHeight;
  }, [messages, busy]);
  async function send(e: FormEvent) {
    e.preventDefault();
    if (!input.trim() || pending.current) return;
    pending.current = true;
    const next: Message[] = [
      ...messages,
      { role: "user", content: input.trim() },
    ];
    setMessages(next.slice(-24));
    setInput("");
    setBusy(true);
    setError("");
    try {
      const result = await postJson(
        "/api/ai",
        { messages: next.slice(-8) },
        35000,
      );
      if (typeof result.message !== "string")
        throw new Error("Please contact our team.");
      setMessages(
        [...next, { role: "assistant", content: result.message }].slice(
          -24,
        ) as Message[],
      );
    } catch (error) {
      setError(
        error instanceof Error && error.name !== "TimeoutError"
          ? error.message
          : "The assistant timed out. Please contact us on WhatsApp.",
      );
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }
  return (
    <div id="site-chat">
      {open && (
        <section
          aria-label="Infinotech AI assistant"
          className="fixed bottom-24 right-4 z-[1100] flex max-h-[min(580px,75dvh)] w-[calc(100%-2rem)] max-w-sm flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-2xl"
        >
          <div className="flex items-center justify-between bg-neutral-950 p-5 text-white">
            <h2 className="font-bold">Infinotech AI</h2>
            <button
              className="h-11 w-11 rounded-full border border-white/40"
              aria-label="Close AI assistant"
              onClick={() => {
                setOpen(false);
                launcher.current?.focus();
              }}
            >
              ×
            </button>
          </div>
          <div
            ref={log}
            role="log"
            aria-live="polite"
            className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4"
          >
            {messages.map((message, index) => (
              <p
                key={index}
                className={`whitespace-pre-wrap break-words rounded-xl p-3 text-sm leading-6 ${message.role === "user" ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-800"}`}
              >
                <span className="sr-only">
                  {message.role === "user" ? "You: " : "Assistant: "}
                </span>
                {message.content}
              </p>
            ))}
            {busy && (
              <p role="status" className="text-sm">
                Thinking…
              </p>
            )}
          </div>
          {error && (
            <p role="alert" className="px-4 text-sm text-red-700">
              {error}
            </p>
          )}
          <form
            onSubmit={send}
            className="flex gap-2 border-t border-neutral-200 p-4"
          >
            <label className="sr-only" htmlFor="ai-message">
              Your message
            </label>
            <input
              ref={field}
              id="ai-message"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={1000}
              placeholder="Tell us your idea…"
              className="min-w-0 flex-1 rounded-xl border border-neutral-300 p-3"
            />
            <button
              disabled={busy || !input.trim()}
              className="rounded-xl bg-black px-4 text-white disabled:opacity-50"
            >
              Send
            </button>
          </form>
          <p className="px-4 pb-4 text-xs leading-5 text-neutral-600">
            AI responses may be inaccurate. Avoid sharing sensitive information.{" "}
            <a href="/privacy" className="underline">
              Privacy &amp; data use
            </a>
            .{" "}
            <a
              href={site.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-neutral-950 underline"
            >
              Talk to our team
            </a>
          </p>
        </section>
      )}
      <button
        ref={launcher}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={open ? "Close chat" : "Ask Infinotech — open AI assistant"}
        className="fixed bottom-5 right-4 z-[1100] min-h-12 rounded-full bg-neutral-950 px-5 py-3 font-semibold text-white shadow-lg"
      >
        {open ? "Close chat" : "Ask Infinotech"}
      </button>
    </div>
  );
}
