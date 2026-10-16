"use client";
import { site } from "@/lib/site";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ArrowUpRight, Menu, Sparkles, X } from "lucide-react";

const navigation = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Work",
    href: "/work",
  },
  {
    name: "Services",
    href: "/services",
  },
  {
    name: "About",
    href: "/about",
  },
  {
    name: "AI Lab",
    href: "/ai-lab",
    ai: true,
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const menuPanel = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);

  const [mobileOpen, setMobileOpen] = useState(false);

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const background = Array.from(
      document.querySelectorAll<HTMLElement>(
        "#main-content, footer, #site-chat",
      ),
    );
    const previous = background.map((element) => element.inert);
    background.forEach((element) => {
      element.inert = true;
    });
    const links = () =>
      Array.from(
        menuPanel.current?.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled])",
        ) || [],
      );
    links()[0]?.focus();
    const close = () => setMobileOpen(false);
    const breakpoint = window.matchMedia("(min-width: 1024px)");
    const resize = () => {
      if (breakpoint.matches) close();
    };
    function keyboard(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close();
        menuButton.current?.focus();
      }
      if (event.key !== "Tab") return;
      const items = [menuButton.current, ...links()].filter(
        (item): item is HTMLElement => Boolean(item),
      );
      const index = items.indexOf(document.activeElement as HTMLElement);
      if (event.shiftKey && index <= 0) {
        event.preventDefault();
        items.at(-1)?.focus();
      } else if (
        !event.shiftKey &&
        (index === items.length - 1 || index === -1)
      ) {
        event.preventDefault();
        items[0]?.focus();
      }
    }
    window.addEventListener("keydown", keyboard);
    window.addEventListener("popstate", close);
    breakpoint.addEventListener("change", resize);
    return () => {
      background.forEach((element, index) => {
        element.inert = previous[index];
      });
      window.removeEventListener("keydown", keyboard);
      window.removeEventListener("popstate", close);
      breakpoint.removeEventListener("change", resize);
    };
  }, [mobileOpen]);

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  }

  return (
    <>
      <header
        className="
          fixed
          inset-x-0
          top-0
          z-[999]
          px-3
          pt-3
          sm:px-5
          sm:pt-4
        "
      >
        <div
          className={`
            mx-auto
            flex
            max-w-[1400px]
            items-center
            justify-between
            rounded-[22px]
            border
            px-4
            py-3
            transition-all
            duration-500
            sm:px-5
            lg:px-6

            ${
              scrolled
                ? `
                  border-black/10
                  bg-white/90
                  shadow-[0_16px_60px_rgba(0,0,0,0.08)]
                  backdrop-blur-xl
                `
                : `
                  border-transparent
                  bg-white/70
                  backdrop-blur-md
                `
            }
          `}
        >
          {/* LOGO */}

          <Link
            href="/"
            aria-label="Infinotech home"
            className="
              relative
              z-10
              flex
              shrink-0
              items-center
            "
          >
            <Image
              src="/logo/infinotech-logo.png"
              alt="Infinotech"
              width={170}
              height={50}
              priority
              className="
                h-auto
                w-[135px]
                object-contain
                sm:w-[150px]
                lg:w-[165px]
              "
            />
          </Link>

          {/* DESKTOP NAVIGATION */}

          <nav
            className="
              absolute
              left-1/2
              hidden
              -translate-x-1/2
              items-center
              gap-1
              rounded-full
              border
              border-black/[0.06]
              bg-white/60
              p-1.5
              shadow-sm
              backdrop-blur
              lg:flex
            "
          >
            {navigation.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    relative
                    flex
                    items-center
                    gap-1.5
                    rounded-full
                    px-4
                    py-2.5
                    text-[13px]
                    font-medium
                    transition-all
                    duration-300

                    ${
                      active
                        ? `
                          bg-black
                          text-white
                          shadow-sm
                        `
                        : `
                          text-black/65
                          hover:bg-black/[0.04]
                          hover:text-black
                        `
                    }
                  `}
                >
                  {item.ai && (
                    <Sparkles
                      size={13}
                      className={active ? "text-orange-400" : "text-orange-500"}
                    />
                  )}

                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* DESKTOP RIGHT */}

          <div className="hidden items-center gap-3 lg:flex">
            <a
              href={site.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="
                hidden
                rounded-full
                px-4
                py-3
                text-xs
                font-medium
                text-black/65
                transition
                hover:bg-black/[0.04]
                hover:text-black
                xl:inline-flex
              "
            >
              Quick WhatsApp
            </a>

            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="
                group
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-black
                px-5
                py-3
                text-sm
                font-semibold
                text-white
                shadow-[0_8px_25px_rgba(0,0,0,0.16)]
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-orange-500
                hover:shadow-[0_12px_35px_rgba(249,115,22,0.25)]
              "
            >
              Let&apos;s Talk
              <ArrowUpRight
                size={16}
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-0.5
                  group-hover:-translate-y-0.5
                "
              />
            </Link>
          </div>

          {/* MOBILE BUTTON */}

          <button
            ref={menuButton}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            type="button"
            onClick={() => setMobileOpen((current) => !current)}
            className="
              relative
              z-[1001]
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              border
              border-black/10
              bg-white
              text-black
              shadow-sm
              transition
              hover:bg-black
              hover:text-white
              lg:hidden
            "
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* MOBILE MENU */}

      <div
        ref={menuPanel}
        id="mobile-navigation"
        inert={!mobileOpen}
        aria-hidden={!mobileOpen}
        className={`
          fixed
          inset-0
          z-[998]
          transition-all
          duration-500
          lg:hidden

          ${
            mobileOpen
              ? `
                pointer-events-auto
                opacity-100
              `
              : `
                pointer-events-none
                opacity-0
              `
          }
        `}
      >
        {/* BACKDROP */}

        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
          className="
            absolute
            inset-0
            bg-black/20
            backdrop-blur-md
          "
        />

        {/* PANEL */}

        <div
          className={`
            absolute
            inset-x-3
            top-[82px]
            max-h-[calc(100dvh-100px)]
            overflow-y-auto
            rounded-[30px]
            border
            border-black/10
            bg-white
            shadow-[0_30px_100px_rgba(0,0,0,0.18)]
            transition-all
            duration-500
            sm:inset-x-5

            ${
              mobileOpen
                ? `
                  translate-y-0
                  scale-100
                `
                : `
                  -translate-y-4
                  scale-[0.98]
                `
            }
          `}
        >
          <div className="p-5 sm:p-6">
            {/* LABEL */}

            <div className="flex items-center justify-between">
              <p
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-black/65
                "
              >
                Navigation
              </p>

              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  bg-orange-50
                  px-3
                  py-1.5
                  text-[10px]
                  font-semibold
                  text-orange-600
                "
              >
                <Sparkles size={11} />
                Digital Studio
              </div>
            </div>

            {/* LINKS */}

            <nav className="mt-5 space-y-1">
              {navigation.map((item, index) => {
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setMobileOpen(false)}
                    className={`
                        group
                        flex
                        items-center
                        justify-between
                        rounded-[18px]
                        px-4
                        py-4
                        transition-all

                        ${
                          active
                            ? `
                              bg-black
                              text-white
                            `
                            : `
                              text-black
                              hover:bg-[#f5f5f5]
                            `
                        }
                      `}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`
                            text-[10px]
                            font-medium

                            ${active ? "text-white/70" : "text-black/65"}
                          `}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span
                        className="
                            flex
                            items-center
                            gap-2
                            text-lg
                            font-semibold
                            tracking-tight
                          "
                      >
                        {item.ai && (
                          <Sparkles size={15} className="text-orange-500" />
                        )}

                        {item.name}
                      </span>
                    </div>

                    <ArrowUpRight
                      size={17}
                      className={`
                          transition-transform
                          duration-300
                          group-hover:translate-x-0.5
                          group-hover:-translate-y-0.5

                          ${active ? "text-orange-400" : "text-black/65"}
                        `}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* CONTACT CTA */}

            <div
              className="
                mt-5
                border-t
                border-black/10
                pt-5
              "
            >
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="
                  group
                  flex
                  items-center
                  justify-between
                  rounded-[20px]
                  bg-black
                  px-5
                  py-4
                  text-white
                  transition
                  hover:bg-orange-500
                "
              >
                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-white/70">
                    Have a project?
                  </p>

                  <p className="mt-1 font-semibold">Talk With Infinotech</p>
                </div>

                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    bg-white
                    text-black
                  "
                >
                  <ArrowUpRight size={17} />
                </div>
              </Link>

              {/* MOBILE WHATSAPP */}

              <a
                href={site.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  mt-3
                  flex
                  items-center
                  justify-center
                  rounded-[18px]
                  border
                  border-black/10
                  px-5
                  py-3.5
                  text-sm
                  font-medium
                  text-black/60
                  transition
                  hover:border-orange-200
                  hover:bg-orange-50
                  hover:text-orange-600
                "
              >
                Quick reply on WhatsApp
              </a>
            </div>

            {/* BOTTOM */}

            <div className="mt-5 flex items-center justify-between px-1">
              <p className="text-[10px] text-black/65">
                Infinite ideas. Engineered into reality.
              </p>

              <span
                className="
                  flex
                  items-center
                  gap-1.5
                  text-[10px]
                  font-medium
                  text-black/65
                "
              >
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                Infinotech
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
