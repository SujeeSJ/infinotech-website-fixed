import Image from "next/image";
import Link from "next/link";

import {
  ArrowUpRight,
  Bot,
  Cloud,
  Code2,
  Globe2,
  Layers3,
  Smartphone,
  Sparkles,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[8%] top-32 h-[420px] w-[420px] rounded-full bg-orange-100/70 blur-[120px]" />

        <div className="absolute right-[5%] top-[18%] h-[500px] w-[500px] rounded-full bg-rose-100/50 blur-[140px]" />

        <div
          className="
            absolute inset-0
            bg-[linear-gradient(to_right,rgba(0,0,0,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.025)_1px,transparent_1px)]
            bg-[size:72px_72px]
            [mask-image:linear-gradient(to_bottom,black,transparent_85%)]
          "
        />
      </div>

      <div
        className="
          relative
          mx-auto
          grid
          min-h-[calc(100vh-70px)]
          max-w-[1440px]
          items-center
          gap-16
          px-6
          pb-20
          pt-32
          lg:grid-cols-[1.05fr_0.95fr]
          lg:px-10
          xl:px-16
        "
      >
        {/* LEFT */}
        <div className="relative z-10">
          <div
            className="
              mb-7
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-orange-200
              bg-orange-50
              px-4
              py-2
              text-xs
              font-semibold
              uppercase
              tracking-[0.22em]
              text-orange-600
            "
          >
            <Sparkles size={14} />
            Digital Product Studio
          </div>

          <div>
            <h1
              className="
                max-w-[860px]
                text-[clamp(3.3rem,6vw,6.4rem)]
                font-semibold
                leading-[0.95]
                tracking-[-0.055em]
                text-black
              "
            >
              We build digital
              <br />
              <span
                className="
                  bg-gradient-to-r
                  from-orange-500
                  via-rose-500
                  to-orange-400
                  bg-clip-text
                  text-transparent
                "
              >
                products
              </span>{" "}
              that move
              <br />
              businesses forward.
            </h1>
          </div>

          <div>
            <p
              className="
                mt-8
                max-w-2xl
                text-lg
                leading-8
                text-black/65
                md:text-xl
              "
            >
              Infinotech partners with ambitious businesses to design, engineer
              and scale websites, software, mobile products, AI solutions and
              modern digital experiences.
            </p>
          </div>

          {/* BUTTONS */}
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="
                group
                inline-flex
                items-center
                gap-3
                rounded-full
                bg-black
                px-7
                py-4
                text-sm
                font-semibold
                text-white
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-orange-500
                hover:shadow-xl
              "
            >
              Start Your Project
              <ArrowUpRight
                size={17}
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-0.5
                  group-hover:-translate-y-0.5
                "
              />
            </Link>

            <Link
              href="/work"
              className="
                group
                inline-flex
                items-center
                gap-3
                rounded-full
                border
                border-black/15
                bg-white/70
                px-7
                py-4
                text-sm
                font-semibold
                text-black
                backdrop-blur
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-black
              "
            >
              Explore Our Work
              <ArrowUpRight
                size={17}
                className="
                  text-black/65
                  transition-transform
                  group-hover:translate-x-0.5
                  group-hover:-translate-y-0.5
                "
              />
            </Link>
          </div>

          {/* GLOBAL POSITIONING */}
          <div
            className="
              mt-12
              flex
              flex-col
              gap-4
              border-t
              border-black/10
              pt-6
              sm:flex-row
              sm:items-center
              sm:gap-8
            "
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-black/10
                  bg-white
                "
              >
                <Globe2 size={18} className="text-orange-500" />
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-black/65">
                  Global Focus
                </p>

                <p className="mt-1 text-sm font-medium text-black/70">
                  Digital solutions without borders
                </p>
              </div>
            </div>

            <div className="hidden h-9 w-px bg-black/10 sm:block" />

            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-black/65">
              <span>Canada</span>
              <span>USA</span>
              <span>Worldwide</span>
            </div>
          </div>
        </div>

        {/* RIGHT VISUAL */}
        <div
          className="
            relative
            mx-auto
            flex
            w-full
            max-w-[620px]
            items-center
            justify-center
            lg:mx-0
          "
        >
          {/* GLOW */}
          <div
            className="
              pointer-events-none
              absolute
              h-[520px]
              w-[520px]
              rounded-full
              bg-gradient-to-br
              from-orange-200/60
              via-rose-100/40
              to-transparent
              blur-[90px]
            "
          />

          {/* MAIN PRODUCT FRAME */}
          <div
            className="
              relative
              w-full
              overflow-hidden
              rounded-[36px]
              border
              border-black/10
              bg-white/90
              p-3
              shadow-[0_40px_120px_rgba(0,0,0,0.13)]
              backdrop-blur-xl
              sm:p-5
            "
          >
            {/* TOP BAR */}
            <div
              className="
                flex
                items-center
                justify-between
                rounded-t-[24px]
                border
                border-black/5
                bg-[#fafafa]
                px-5
                py-4
              "
            >
              <div className="flex gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
              </div>

              <div
                className="
                  rounded-full
                  border
                  border-black/5
                  bg-white
                  px-4
                  py-1.5
                  text-[10px]
                  text-black/65
                "
              >
                infinotech.com
              </div>

              <div className="w-[43px]" />
            </div>

            {/* PRODUCT AREA */}
            <div
              className="
                relative
                overflow-hidden
                rounded-b-[24px]
                border-x
                border-b
                border-black/5
                bg-white
                p-6
                sm:p-8
              "
            >
              <div className="flex items-start justify-between">
                <div>
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
                      uppercase
                      tracking-[0.16em]
                      text-orange-600
                    "
                  >
                    <Sparkles size={11} />
                    Digital Ecosystem
                  </div>

                  <h2 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">
                    One technology partner.
                    <br />
                    Infinite possibilities.
                  </h2>
                </div>

                <div
                  className="
                    flex
                    h-14
                    w-14
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-black/10
                    bg-white
                    shadow-sm
                  "
                >
                  <Image
                    src="/logo/infinotech-icon.png"
                    alt="Infinotech icon"
                    width={38}
                    height={38}
                    priority
                  />
                </div>
              </div>

              {/* MAIN DARK PANEL */}
              <div
                className="
                  relative
                  mt-8
                  overflow-hidden
                  rounded-[24px]
                  bg-black
                  p-6
                  text-white
                "
              >
                <div
                  className="
                    absolute
                    -right-10
                    -top-10
                    h-36
                    w-36
                    rounded-full
                    bg-orange-500/30
                    blur-3xl
                  "
                />

                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-white/70">
                        From idea to impact
                      </p>

                      <p className="mt-2 text-xl font-semibold">
                        Built around your business.
                      </p>
                    </div>

                    <Layers3 size={26} className="text-orange-400" />
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <Code2 size={18} />

                      <p className="mt-5 text-sm font-medium">Web Platforms</p>

                      <p className="mt-1 text-xs text-white/70">
                        Fast. Modern. Scalable.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <Bot size={18} />

                      <p className="mt-5 text-sm font-medium">
                        AI & Automation
                      </p>

                      <p className="mt-1 text-xs text-white/70">
                        Intelligent workflows.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* LOWER CARDS */}
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div
                  className="
                    rounded-[20px]
                    border
                    border-black/10
                    bg-[#fafafa]
                    p-5
                  "
                >
                  <Smartphone size={20} className="text-orange-500" />

                  <p className="mt-4 text-sm font-semibold">Mobile Products</p>

                  <p className="mt-1 text-xs leading-5 text-black/65">
                    Experiences built for every screen.
                  </p>
                </div>

                <div
                  className="
                    rounded-[20px]
                    border
                    border-black/10
                    bg-[#fafafa]
                    p-5
                  "
                >
                  <Cloud size={20} className="text-orange-500" />

                  <p className="mt-4 text-sm font-semibold">Cloud Systems</p>

                  <p className="mt-1 text-xs leading-5 text-black/65">
                    Infrastructure designed to scale.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FLOATING CARD — TOP */}
          <div
            className="
              absolute
              -left-4
              top-20
              hidden
              rounded-2xl
              border
              border-black/10
              bg-white/95
              px-4
              py-3
              shadow-xl
              backdrop-blur-xl
              sm:block
              lg:-left-8
            "
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  bg-orange-50
                "
              >
                <Sparkles size={16} className="text-orange-500" />
              </div>

              <div>
                <p className="text-xs font-semibold">Product Strategy</p>

                <p className="text-[10px] text-black/65">
                  Think → Design → Build
                </p>
              </div>
            </div>
          </div>

          {/* FLOATING CARD — BOTTOM */}
          <div
            className="
              absolute
              -right-3
              bottom-20
              hidden
              rounded-2xl
              border
              border-black/10
              bg-white/95
              px-4
              py-3
              shadow-xl
              backdrop-blur-xl
              sm:block
              lg:-right-8
            "
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  bg-black
                  text-white
                "
              >
                <Bot size={16} />
              </div>

              <div>
                <p className="text-xs font-semibold">AI Ready</p>

                <p className="text-[10px] text-black/65">
                  Modern intelligent systems
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM FADE */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
