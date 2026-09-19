import {
  ArrowUpRight,
  Brain,
  Check,
  Clock3,
  Heart,
  Leaf,
  MapPin,
  Sparkles,
  TrendingUp,
  Utensils,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://foodbridge-ai-qj9q.onrender.com";

const features = [
  {
    icon: Brain,
    title: "Smart Matching",
    description:
      "FoodBridge evaluates food type, quantity, location, freshness, and recipient needs to identify suitable redistribution opportunities.",
    type: "matching",
  },
  {
    icon: Clock3,
    title: "Freshness Intelligence",
    description:
      "Preparation and expiry information help the platform understand freshness and highlight food that may need faster redistribution.",
    type: "freshness",
  },
  {
    icon: Zap,
    title: "Priority Engine",
    description:
      "Urgency, freshness, quantity, and community need help determine which available donations deserve attention first.",
    type: "priority",
  },
  {
    icon: TrendingUp,
    title: "Impact Intelligence",
    description:
      "Completed redistribution activities are transformed into measurable impact, including meals rescued and people supported.",
    type: "impact",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 35,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: "easeOut",
    },
  },
};

/* =========================
   SMART MATCHING VISUAL
========================= */

function SmartMatchingVisual() {
  return (
    <div className="mt-7 rounded-2xl border border-[#1F7A4D]/10 bg-[#F7FAF8] p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1F7A4D]/10 text-[#1F7A4D]">
            <Utensils size={18} />
          </div>

          <div className="min-w-0">
            <p className="text-xs text-[#0B2F1A]/40">Donation</p>
            <p className="truncate text-sm font-semibold text-[#0B2F1A]">
              Available food
            </p>
          </div>
        </div>

        <motion.div
          animate={{ x: [0, 4, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1F7A4D]/10 text-[#1F7A4D]"
        >
          <ArrowUpRight size={16} />
        </motion.div>

        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1F7A4D]/10 text-[#1F7A4D]">
            <Heart size={18} />
          </div>

          <div className="min-w-0">
            <p className="text-xs text-[#0B2F1A]/40">
              AI recommendation
            </p>
            <p className="truncate text-sm font-semibold text-[#0B2F1A]">
              Suitable recipient
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-[#0B2F1A]/10 pt-4">
        <span className="text-xs text-[#0B2F1A]/45">
          Match compatibility
        </span>

        <span className="rounded-full bg-[#1F7A4D]/10 px-3 py-1 text-xs font-bold text-[#1F7A4D]">
          HIGH MATCH
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {["Location", "Food type", "Community need"].map((item) => (
          <div
            key={item}
            className="flex items-center gap-1.5 rounded-lg bg-white px-2 py-2"
          >
            <Check
              size={12}
              className="shrink-0 text-[#1F7A4D]"
            />

            <span className="text-[10px] text-[#0B2F1A]/45">
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================
   FRESHNESS VISUAL
========================= */

function FreshnessVisual() {
  return (
    <div className="mt-7 rounded-2xl border border-[#1F7A4D]/10 bg-[#F7FAF8] p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-[#0B2F1A]/40">
            Freshness assessment
          </p>

          <p className="mt-1 text-lg font-bold text-[#1F7A4D]">
            Good condition
          </p>
        </div>

        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1F7A4D]/10 text-[#1F7A4D]"
        >
          <Leaf size={19} />
        </motion.div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs text-[#0B2F1A]/40">
            Freshness signal
          </span>

          <span className="text-xs font-semibold text-[#0B2F1A]/60">
            Assessed
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-[#1F7A4D]/10">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "82%" }}
            viewport={{ once: true }}
            transition={{
              duration: 1.2,
              ease: "easeOut",
            }}
            className="h-full rounded-full bg-[#1F7A4D]"
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl bg-white px-3 py-3">
        <div className="flex items-center gap-2">
          <Clock3 size={14} className="text-[#0B2F1A]/45" />

          <span className="text-xs text-[#0B2F1A]/45">
            Suggested action
          </span>
        </div>

        <span className="text-xs font-semibold text-[#D97706]">
          Donate soon
        </span>
      </div>
    </div>
  );
}

/* =========================
   PRIORITY VISUAL
========================= */

function PriorityVisual() {
  return (
    <div className="mt-7 rounded-2xl border border-[#1F7A4D]/10 bg-[#F7FAF8] p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-[#0B2F1A]/40">
            Example priority assessment
          </p>

          <motion.p
            initial={{
              opacity: 0,
              scale: 0.7,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.5,
            }}
            className="mt-1 text-3xl font-bold text-[#0B2F1A]"
          >
            High
          </motion.p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-[#F59E0B]/20 text-[#F59E0B]">
          <Zap size={20} />
        </div>
      </div>

      <div className="mt-5 space-y-2">
        {[
          ["Urgency", "High"],
          ["Freshness", "Good"],
          ["Quantity", "Large"],
        ].map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between rounded-xl bg-white px-3 py-2.5"
          >
            <span className="text-xs text-[#0B2F1A]/45">
              {label}
            </span>

            <span className="text-xs font-semibold text-[#0B2F1A]/75">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================
   IMPACT VISUAL
========================= */

function ImpactVisual({ impact }) {
  const mealsRescued = impact?.meals_rescued ?? 0;
  const peopleSupported = impact?.people_supported ?? 0;
  const completedDeliveries =
    impact?.completed_deliveries ?? 0;

  return (
    <div className="mt-7 grid grid-cols-2 gap-3">
      <div className="rounded-2xl border border-[#1F7A4D]/10 bg-[#F7FAF8] p-4">
        <p className="text-xs text-[#0B2F1A]/40">
          Meals rescued
        </p>

        <motion.p
          initial={{
            opacity: 0,
            y: 10,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          className="mt-2 text-2xl font-bold text-[#0B2F1A]"
        >
          {mealsRescued.toLocaleString()}
        </motion.p>

        <p className="mt-1 text-[11px] leading-5 text-[#1F7A4D]">
          Recorded from completed redistribution
        </p>
      </div>

      <div className="rounded-2xl border border-[#1F7A4D]/10 bg-[#F7FAF8] p-4">
        <p className="text-xs text-[#0B2F1A]/40">
          People supported
        </p>

        <motion.p
          initial={{
            opacity: 0,
            y: 10,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            delay: 0.15,
          }}
          className="mt-2 text-2xl font-bold text-[#0B2F1A]"
        >
          {peopleSupported.toLocaleString()}
        </motion.p>

        <p className="mt-1 text-[11px] leading-5 text-[#1F7A4D]">
          Based on recorded impact
        </p>
      </div>

      <div className="col-span-2 flex items-center justify-between rounded-2xl border border-[#1F7A4D]/10 bg-[#F7FAF8] p-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F59E0B]/10 text-[#D97706]">
            <TrendingUp size={17} />
          </div>

          <div className="min-w-0">
            <p className="text-xs text-[#0B2F1A]/40">
              Completed deliveries
            </p>

            <p className="mt-1 text-xs font-semibold text-[#0B2F1A]/70 sm:text-sm">
              {completedDeliveries.toLocaleString()} successful
              redistribution deliveries
            </p>
          </div>
        </div>

        <ArrowUpRight
          size={17}
          className="shrink-0 text-[#0B2F1A]/25"
        />
      </div>
    </div>
  );
}

/* =========================
   AI VISUAL SELECTOR
========================= */

function AIVisual({ type, impact }) {
  switch (type) {
    case "matching":
      return <SmartMatchingVisual />;

    case "freshness":
      return <FreshnessVisual />;

    case "priority":
      return <PriorityVisual />;

    case "impact":
      return <ImpactVisual impact={impact} />;

    default:
      return null;
  }
}

/* =========================
   MAIN SECTION
========================= */

function AISection() {
  const [impact, setImpact] = useState(null);

  useEffect(() => {
    const loadImpact = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/impact/summary`
        );

        if (!response.ok) {
          throw new Error("Failed to load impact data");
        }

        const data = await response.json();

        if (data.status === "success") {
          setImpact(data.impact);
        }
      } catch (error) {
        console.error("AI impact error:", error);
      }
    };

    loadImpact();
  }, []);

  return (
    <section
      id="ai-intelligence"
      className="relative scroll-mt-24 overflow-hidden bg-[#F4F8F5] px-6 py-20 md:px-12 md:py-24 lg:px-20"
    >
      {/* Decorative background elements */}

      <div className="pointer-events-none absolute left-0 top-0 h-72 w-72 rounded-full bg-[#A7D7B8]/20 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[#1F7A4D]/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        {/* HEADER */}

        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.3,
          }}
          transition={{
            duration: 0.8,
          }}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div
            animate={{
              y: [0, -4, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#1F7A4D]/10 bg-white px-4 py-2 text-sm font-medium text-[#1F7A4D] shadow-sm"
          >
            <Sparkles size={16} />

            Intelligence behind every connection
          </motion.div>

          <h2 className="text-3xl font-bold leading-tight tracking-tight text-[#0B2F1A] sm:text-4xl md:text-5xl lg:text-6xl">
            Technology that helps
            <br />

            <span className="text-[#1F7A4D]">
              food reach further.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#0B2F1A]/55 sm:mt-6 sm:text-lg sm:leading-8">
            FoodBridge combines intelligent matching, freshness
            assessment, priority scoring, and impact insights to
            make food redistribution smarter and more responsive.
          </p>
        </motion.div>

        {/* FEATURE CARDS */}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.1,
          }}
          className="mt-12 grid gap-5 md:mt-16 md:grid-cols-2"
        >
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                whileHover={{
                  y: -7,
                  transition: {
                    duration: 0.25,
                  },
                }}
                className="group relative overflow-hidden rounded-[2rem] border border-[#0B2F1A]/8 bg-white p-6 shadow-[0_10px_40px_rgba(11,47,26,0.06)] transition-all duration-300 hover:border-[#1F7A4D]/20 hover:shadow-[0_18px_50px_rgba(11,47,26,0.10)] sm:p-7"
              >
                {/* Card top */}

                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#1F7A4D]/10 text-[#1F7A4D] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#1F7A4D] group-hover:text-white">
                    <Icon
                      size={22}
                      strokeWidth={2}
                    />
                  </div>

                  <span className="rounded-full border border-[#1F7A4D]/10 bg-[#F4F8F5] px-3 py-1 text-[9px] font-medium uppercase tracking-[0.18em] text-[#1F7A4D]/60 sm:text-[10px]">
                    Intelligent
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-bold text-[#0B2F1A] sm:text-2xl">
                  {feature.title}
                </h3>

                <p className="mt-3 max-w-xl text-sm leading-7 text-[#0B2F1A]/50">
                  {feature.description}
                </p>

                <AIVisual
                  type={feature.type}
                  impact={impact}
                />

                <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-[#1F7A4D] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span>FoodBridge intelligence</span>

                  <ArrowUpRight size={14} />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* LOCATION CARD */}

        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.8,
          }}
          whileHover={{
            y: -4,
          }}
          className="mt-6 flex flex-col gap-5 rounded-3xl border border-[#0B2F1A]/8 bg-[#0B2F1A] p-6 text-white shadow-[0_15px_45px_rgba(11,47,26,0.10)] sm:p-7 md:flex-row md:items-center md:justify-between"
        >
          <div className="flex items-start gap-4">
            <motion.div
              animate={{
                scale: [1, 1.07, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#A7D7B8]/10 text-[#A7D7B8]"
            >
              <MapPin size={22} />
            </motion.div>

            <div>
              <p className="font-semibold">
                Location-aware redistribution
              </p>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-white/55">
                Location helps FoodBridge identify practical
                connections between available food and nearby
                recipient needs.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 text-sm font-semibold text-[#A7D7B8]">
            <span>Smarter connections</span>

            <ArrowUpRight size={16} />
          </div>
        </motion.div>

        {/* TRUST NOTE */}

        <motion.p
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.8,
            delay: 0.2,
          }}
          className="mx-auto mt-8 max-w-2xl text-center text-xs leading-5 text-[#0B2F1A]/35"
        >
          FoodBridge recommendations are designed to support
          human decisions by considering available food,
          freshness, location, urgency, quantity, and community
          needs.
        </motion.p>
      </div>
    </section>
  );
}

export default AISection;