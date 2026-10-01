import {
  ArrowRight,
  Brain,
  Check,
  Clock3,
  Heart,
  Leaf,
  MapPin,
  TrendingUp,
  Utensils,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://foodbridge-ai-qj9q.onrender.com";

const features = [
  {
    number: "01",
    icon: Brain,
    label: "MATCHING",
    title: "Smart matching.",
    description:
      "FoodBridge considers food type, quantity, location, freshness, and recipient needs to identify suitable redistribution opportunities.",
    type: "matching",
  },
  {
    number: "02",
    icon: Clock3,
    label: "FRESHNESS",
    title: "Freshness intelligence.",
    description:
      "Preparation and expiry information help the platform understand freshness and highlight food that may need faster redistribution.",
    type: "freshness",
  },
  {
    number: "03",
    icon: Zap,
    label: "PRIORITY",
    title: "Priority scoring.",
    description:
      "Urgency, freshness, quantity, and community need help determine which available donations deserve attention first.",
    type: "priority",
  },
  {
    number: "04",
    icon: TrendingUp,
    label: "IMPACT",
    title: "Impact intelligence.",
    description:
      "Completed redistribution activities become measurable impact, including meals rescued, people supported, and successful deliveries.",
    type: "impact",
  },
];

/* =========================================================
   INTELLIGENCE VISUALS
========================================================= */

function SmartMatchingVisual() {
  return (
    <div className="mt-8 border-t border-line pt-5">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div>
          <div className="mb-3 flex h-9 w-9 items-center justify-center border border-line">
            <Utensils size={16} strokeWidth={1.2} />
          </div>

          <p className="text-[10px] uppercase tracking-[0.08em] text-muted">
            Available
          </p>

          <p className="mt-1 text-sm">Surplus food</p>
        </div>

        <ArrowRight
          size={18}
          strokeWidth={1.2}
          className="text-green"
        />

        <div>
          <div className="mb-3 flex h-9 w-9 items-center justify-center border border-line">
            <Heart size={16} strokeWidth={1.2} />
          </div>

          <p className="text-[10px] uppercase tracking-[0.08em] text-muted">
            Recommended
          </p>

          <p className="mt-1 text-sm">Suitable recipient</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-4">
        {["Location", "Food type", "Community need"].map((item) => (
          <span
            key={item}
            className="flex items-center gap-2 text-[11px] text-muted"
          >
            <Check size={12} className="text-green" strokeWidth={1.5} />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function FreshnessVisual() {
  return (
    <div className="mt-8 border-t border-line pt-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.08em] text-muted">
            Freshness assessment
          </p>

          <p className="mt-2 text-2xl font-normal tracking-[-0.03em]">
            Good condition
          </p>
        </div>

        <Leaf
          size={24}
          strokeWidth={1.2}
          className="text-green"
        />
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.06em] text-muted">
          <span>Freshness signal</span>
          <span>82%</span>
        </div>

        <div className="mt-3 h-px bg-line">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "82%" }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="h-px bg-green"
          />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
        <span className="text-[11px] text-muted">
          Suggested action
        </span>

        <span className="text-[11px] uppercase tracking-[0.06em] text-green">
          Donate soon
        </span>
      </div>
    </div>
  );
}

function PriorityVisual() {
  return (
    <div className="mt-8 border-t border-line pt-5">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.08em] text-muted">
            Example assessment
          </p>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-2 text-3xl font-normal tracking-[-0.04em]"
          >
            High
          </motion.p>
        </div>

        <Zap
          size={24}
          strokeWidth={1.2}
          className="text-green"
        />
      </div>

      <div className="mt-6 grid grid-cols-3 border-t border-line pt-4">
        {[
          ["Urgency", "High"],
          ["Freshness", "Good"],
          ["Quantity", "Large"],
        ].map(([label, value]) => (
          <div key={label}>
            <p className="text-[10px] uppercase tracking-[0.06em] text-muted">
              {label}
            </p>

            <p className="mt-2 text-sm">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ImpactVisual({ impact }) {
  const mealsRescued = impact?.meals_rescued ?? 0;
  const peopleSupported = impact?.people_supported ?? 0;
  const completedDeliveries = impact?.completed_deliveries ?? 0;

  return (
    <div className="mt-8 border-t border-line pt-5">
      <div className="grid grid-cols-3 divide-x divide-line">
        <div className="pr-3">
          <p className="text-2xl font-normal">
            {mealsRescued.toLocaleString()}
          </p>

          <p className="mt-2 text-[10px] uppercase tracking-[0.06em] text-muted">
            Meals rescued
          </p>
        </div>

        <div className="px-3">
          <p className="text-2xl font-normal">
            {peopleSupported.toLocaleString()}
          </p>

          <p className="mt-2 text-[10px] uppercase tracking-[0.06em] text-muted">
            People supported
          </p>
        </div>

        <div className="pl-3">
          <p className="text-2xl font-normal">
            {completedDeliveries.toLocaleString()}
          </p>

          <p className="mt-2 text-[10px] uppercase tracking-[0.06em] text-muted">
            Deliveries
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   VISUAL SELECTOR
========================================================= */

function IntelligenceVisual({ type, impact }) {
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

/* =========================================================
   MAIN SECTION
========================================================= */

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
      className="scroll-mt-20 border-b border-line bg-paper"
    >
      <div className="mx-auto max-w-[1400px]">
        {/* =====================================================
            INTRO
        ===================================================== */}

        <div className="grid border-b border-line lg:grid-cols-[0.8fr_1.2fr]">
          <div className="border-b border-line px-6 py-10 md:px-10 lg:border-b-0 lg:border-r lg:px-12">
            <p className="fb-label text-green">
              03 — Intelligence
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="px-6 py-12 md:px-10 md:py-16 lg:px-12 lg:py-20"
          >
            <h2 className="fb-heading max-w-5xl">
              THE NETWORK
              <br />
              <span className="text-green">THINKS.</span>
            </h2>

            <p className="mt-10 max-w-2xl text-base leading-7 text-muted md:text-lg md:leading-8">
              Intelligence works quietly behind every connection — helping
              FoodBridge understand available food, recipient needs,
              freshness, urgency, and measurable impact.
            </p>
          </motion.div>
        </div>

        {/* =====================================================
            FEATURE GRID
        ===================================================== */}

        <div className="grid md:grid-cols-2">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.article
                key={feature.number}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.08,
                }}
                className={`group min-h-[430px] px-6 py-10 md:px-10 md:py-12 lg:px-12 lg:py-14 ${
                  index % 2 === 1
                    ? "border-t border-line md:border-l"
                    : "border-t border-line"
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-[clamp(3rem,5vw,5rem)] font-normal leading-none tracking-[-0.06em] text-ash transition-colors duration-300 group-hover:text-green">
                    {feature.number}
                  </span>

                  <Icon
                    size={27}
                    strokeWidth={1.2}
                    className="text-ink transition-colors duration-300 group-hover:text-green"
                  />
                </div>

                <p className="fb-label mt-16 text-green">
                  {feature.label}
                </p>

                <h3 className="mt-4 max-w-md text-2xl font-normal leading-tight tracking-[-0.03em] md:text-3xl">
                  {feature.title}
                </h3>

                <p className="mt-5 max-w-lg text-sm leading-6 text-muted md:text-base md:leading-7">
                  {feature.description}
                </p>

                <IntelligenceVisual
                  type={feature.type}
                  impact={impact}
                />

                <div className="mt-8 flex items-center gap-3 text-[11px] uppercase tracking-[0.08em] text-muted transition-all duration-300 group-hover:gap-5 group-hover:text-green">
                  <span>Explore intelligence</span>
                  <ArrowRight size={14} strokeWidth={1.2} />
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* =====================================================
            LOCATION INTELLIGENCE
        ===================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="grid border-t border-line lg:grid-cols-[0.8fr_1.2fr]"
        >
          <div className="border-b border-line px-6 py-10 md:px-10 lg:border-b-0 lg:border-r lg:px-12">
            <div className="flex items-center gap-3">
              <MapPin
                size={18}
                strokeWidth={1.2}
                className="text-green"
              />

              <p className="fb-label text-muted">
                Location intelligence
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-8 px-6 py-10 md:flex-row md:items-center md:px-10 lg:px-12 lg:py-14">
            <div>
              <h3 className="text-2xl font-normal tracking-[-0.03em] md:text-3xl">
                Proximity matters.
              </h3>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted md:text-base">
                Location helps FoodBridge identify practical connections
                between available food and nearby recipient needs.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3 text-xs uppercase tracking-[0.08em] text-green">
              Smarter connections
              <ArrowRight size={15} strokeWidth={1.2} />
            </div>
          </div>
        </motion.div>

        {/* =====================================================
            TRUST NOTE
        ===================================================== */}

        <div className="border-t border-line px-6 py-8 md:px-10 lg:px-12">
          <p className="max-w-3xl text-xs leading-5 text-muted">
            FoodBridge recommendations support human decisions by considering
            available food, freshness, location, urgency, quantity, and
            community needs.
          </p>
        </div>
      </div>
    </section>
  );
}

export default AISection;