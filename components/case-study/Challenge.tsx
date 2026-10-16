import type { Project } from "@/data/projects";

import { ArrowDownRight, Eye, LayoutGrid, Sparkles, Users } from "lucide-react";

export default function Challenge({ project }: { project: Project }) {
  const objectives = [
    {
      icon: Eye,
      title: "Clearer Presence",
      text: "Present the business and its experiences in a more professional digital environment.",
    },
    {
      icon: LayoutGrid,
      title: "Better Structure",
      text: "Organize information so visitors can understand the offering quickly and naturally.",
    },
    {
      icon: Users,
      title: "Stronger Experience",
      text: "Create a modern customer journey across desktop, tablet and mobile.",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-white py-28 md:py-32">
      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-20 h-[450px] w-[450px] rounded-full bg-orange-100/45 blur-[140px]" />

        <div
          className="
            absolute inset-0
            bg-[linear-gradient(to_right,rgba(0,0,0,0.018)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.018)_1px,transparent_1px)]
            bg-[size:72px_72px]
          "
        />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10 xl:px-16">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          {/* LEFT */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <div
              className="
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
                tracking-[0.2em]
                text-orange-600
              "
            >
              <Sparkles size={13} />
              The Challenge
            </div>

            <h2
              className="
                mt-7
                max-w-2xl
                text-4xl
                font-semibold
                leading-[1]
                tracking-[-0.045em]
                text-black
                md:text-6xl
              "
            >
              Turning a physical
              <br />
              <span className="text-black/65">
                experience into a
                <br />
                digital one.
              </span>
            </h2>

            <p className="mt-7 max-w-lg text-base leading-8 text-black/65">
              The challenge was not simply creating a website. The digital
              experience needed to communicate the business clearly while
              feeling relevant to its audience.
            </p>

            <div className="mt-10 flex items-center gap-3">
              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-black/10
                  bg-white
                "
              >
                <ArrowDownRight size={17} className="text-orange-500" />
              </div>

              <p className="text-xs font-medium uppercase tracking-[0.16em] text-black/65">
                From challenge to direction
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div>
            {/* MAIN CHALLENGE CARD */}
            <div
              className="
                relative
                overflow-hidden
                rounded-[34px]
                bg-black
                p-8
                text-white
                md:p-12
              "
            >
              <div className="pointer-events-none absolute -right-20 -top-20 h-[260px] w-[260px] rounded-full bg-orange-500/25 blur-[90px]" />

              <div className="relative">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-400">
                  Business Challenge
                </p>

                <p
                  className="
                    mt-8
                    text-2xl
                    font-medium
                    leading-[1.5]
                    tracking-[-0.025em]
                    text-white/85
                    md:text-3xl
                  "
                >
                  {project.challenge}
                </p>

                <div className="mt-10 border-t border-white/10 pt-7">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/70">
                    Core Objective
                  </p>

                  <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">
                    Build a professional, visually engaging digital presence
                    that makes the business and its experiences easier for
                    customers to discover and understand.
                  </p>
                </div>
              </div>
            </div>

            {/* OBJECTIVES */}
            <div className="mt-5 grid gap-5 md:grid-cols-3">
              {objectives.map((objective) => {
                const Icon = objective.icon;

                return (
                  <div
                    key={objective.title}
                    className="
                      group
                      rounded-[26px]
                      border
                      border-black/10
                      bg-[#fafafa]
                      p-6
                      transition-all
                      duration-500
                      hover:-translate-y-2
                      hover:bg-white
                      hover:shadow-[0_25px_70px_rgba(0,0,0,0.07)]
                    "
                  >
                    <div
                      className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-2xl
                        border
                        border-black/10
                        bg-white
                        transition
                        group-hover:border-orange-200
                        group-hover:bg-orange-50
                      "
                    >
                      <Icon
                        size={18}
                        className="transition group-hover:text-orange-500"
                      />
                    </div>

                    <h3 className="mt-6 text-lg font-semibold tracking-tight">
                      {objective.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-black/65">
                      {objective.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
