import { ArrowRight, Brain, HandHeart, Truck } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    label: "DONATE",
    icon: HandHeart,
    title: "Give surplus a destination.",
    description:
      "List surplus food with the details that matter — what it is, how much is available, where it is, and when it should be collected.",
  },
  {
    number: "02",
    label: "MATCH",
    icon: Brain,
    title: "Find the right recipient.",
    description:
      "FoodBridge AI considers location, food type, quantity, freshness, and urgency to identify suitable verified recipients.",
  },
  {
    number: "03",
    label: "DELIVER",
    icon: Truck,
    title: "Move food where it matters.",
    description:
      "Once a match is accepted, volunteers help coordinate pickup and delivery so surplus food reaches the people who need it.",
  },
];

function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 border-b border-line bg-paper"
    >
      <div className="mx-auto max-w-[1400px]">
        {/* =====================================================
            SECTION INTRO
        ===================================================== */}

        <div className="grid border-b border-line lg:grid-cols-[0.8fr_1.2fr]">
          <div className="border-b border-line px-6 py-10 md:px-10 lg:border-b-0 lg:border-r lg:px-12">
            <p className="fb-label text-green">02 — The bridge</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="px-6 py-12 md:px-10 md:py-16 lg:px-12 lg:py-20"
          >
            <h2 className="fb-heading max-w-5xl">
              HOW FOOD
              <br />
              <span className="text-green">MOVES.</span>
            </h2>

            <p className="mt-10 max-w-2xl text-base leading-7 text-muted md:text-lg md:leading-8">
              FoodBridge connects donors, verified recipients, and volunteers
              through a simple redistribution network designed to move surplus
              food where it can create the greatest impact.
            </p>
          </motion.div>
        </div>

        {/* =====================================================
            STEPS
        ===================================================== */}

        <div className="grid lg:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.article
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                className={`group min-h-[390px] px-6 py-10 md:px-10 md:py-12 lg:px-12 lg:py-14 ${
                  index > 0 ? "border-t border-line lg:border-l lg:border-t-0" : ""
                }`}
              >
                {/* NUMBER + ICON */}

                <div className="flex items-start justify-between">
                  <span className="text-[clamp(3rem,5vw,5rem)] font-normal leading-none tracking-[-0.06em] text-ash transition-colors duration-300 group-hover:text-green">
                    {step.number}
                  </span>

                  <Icon
                    size={28}
                    strokeWidth={1.2}
                    className="text-ink transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </div>

                {/* LABEL */}

                <p className="fb-label mt-16 text-green">{step.label}</p>

                {/* TITLE */}

                <h3 className="mt-4 max-w-sm text-2xl font-normal leading-tight tracking-[-0.03em] md:text-3xl">
                  {step.title}
                </h3>

                {/* DESCRIPTION */}

                <p className="mt-5 max-w-md text-sm leading-6 text-muted md:text-base md:leading-7">
                  {step.description}
                </p>

                {/* ARROW */}

                <div className="mt-10 flex items-center gap-3 text-muted transition-all duration-300 group-hover:gap-5 group-hover:text-green">
                  <span className="text-[11px] uppercase tracking-[0.08em]">
                    Step {step.number}
                  </span>

                  <ArrowRight size={15} strokeWidth={1.2} />
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* =====================================================
            BOTTOM STATEMENT
        ===================================================== */}

        <div className="grid border-t border-line md:grid-cols-[0.8fr_1.2fr]">
          <div className="border-b border-line px-6 py-8 md:px-10 lg:border-b-0 lg:border-r lg:px-12">
            <p className="fb-label text-muted">The principle</p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex items-center justify-between gap-8 px-6 py-10 md:px-10 lg:px-12 lg:py-14"
          >
            <p className="max-w-2xl text-xl font-normal leading-tight tracking-[-0.02em] md:text-3xl">
              Every connection turns food that might have been wasted into
              something useful.
            </p>

            <ArrowRight
              size={28}
              strokeWidth={1}
              className="hidden shrink-0 text-green md:block"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;