import {
  ArrowRight,
  Brain,
  HandHeart,
  Truck,
} from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    icon: HandHeart,
    title: "Donate surplus food",
    description:
      "Donors list available surplus food with details such as food type, quantity, location, preparation time, and expiry time.",
  },
  {
    number: "02",
    icon: Brain,
    title: "AI finds the best match",
    description:
      "FoodBridge AI evaluates factors such as location, food type, quantity, freshness, and urgency to recommend suitable verified recipients.",
  },
  {
    number: "03",
    icon: Truck,
    title: "Coordinate delivery",
    description:
      "Once a match is accepted, the food moves through the delivery process with volunteers helping coordinate pickup, transit, and delivery to the recipient.",
  },
];

function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 bg-white px-6 py-20 md:px-12 md:py-24 lg:px-20"
    >
      <div className="mx-auto max-w-7xl">
        {/* =====================================================
            SECTION HEADER
        ===================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-[#1F7A4D]">
            How it works
          </p>

          <h2 className="text-3xl font-bold leading-tight tracking-tight text-[#14532D] sm:text-4xl md:text-5xl">
            From surplus food to meaningful impact.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
            FoodBridge AI connects donors, recipients, and volunteers through
            an intelligent redistribution network designed to move surplus
            food where it can make the greatest difference.
          </p>
        </motion.div>

        {/* =====================================================
            STEPS
        ===================================================== */}

        <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-3 md:gap-5 lg:gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                className="group relative rounded-3xl border border-gray-100 bg-[#FAFAF7] p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#A7D7B8] hover:shadow-xl sm:p-8"
              >
                {/* =================================================
                    TOP ROW
                ================================================= */}

                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold tracking-[0.15em] text-[#1F7A4D]">
                    {step.number}
                  </span>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8F3EC] text-[#14532D] transition-all duration-300 group-hover:bg-[#14532D] group-hover:text-white">
                    <Icon size={22} strokeWidth={2} />
                  </div>
                </div>

                {/* =================================================
                    CONTENT
                ================================================= */}

                <h3 className="mt-9 text-xl font-bold tracking-tight text-[#14532D] sm:text-2xl">
                  {step.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-gray-600 sm:text-base">
                  {step.description}
                </p>

                {/* =================================================
                    PROGRESS INDICATOR
                ================================================= */}

                <div className="mt-8 h-1 w-12 rounded-full bg-[#A7D7B8] transition-all duration-300 group-hover:w-20" />

                {/* =================================================
                    CONNECTING ARROW
                ================================================= */}

                {index < steps.length - 1 && (
                  <div className="absolute -right-5 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-100 bg-white text-[#1F7A4D] shadow-sm md:flex">
                    <ArrowRight size={18} strokeWidth={2} />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* =====================================================
            BOTTOM MESSAGE
        ===================================================== */}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mx-auto mt-12 max-w-3xl text-center md:mt-14"
        >
          <p className="text-sm leading-6 text-gray-500 sm:text-base">
            Every successful connection helps reduce food waste and get
            nutritious food to communities that need it.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default HowItWorks;