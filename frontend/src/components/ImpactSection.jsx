import { useEffect, useState } from "react";
import { ArrowRight, Heart, Leaf, Truck, Users, Utensils } from "lucide-react";
import { motion } from "framer-motion";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://foodbridge-ai-qj9q.onrender.com";

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value || 0);
}

function formatKg(value) {
  return `${Number(value || 0).toLocaleString("en-US", {
    maximumFractionDigits: 1,
  })} kg`;
}

function ImpactSection() {
  const [impact, setImpact] = useState({
    meals_rescued: 0,
    food_saved_kg: 0,
    people_supported: 0,
    completed_deliveries: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchImpact = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await fetch(`${API_BASE_URL}/impact/summary`);

        if (!response.ok) {
          throw new Error("Failed to fetch impact data");
        }

        const data = await response.json();

        if (isMounted && data?.impact) {
          setImpact({
            meals_rescued: Number(data.impact.meals_rescued) || 0,
            food_saved_kg: Number(data.impact.food_saved_kg) || 0,
            people_supported: Number(data.impact.people_supported) || 0,
            completed_deliveries:
              Number(data.impact.completed_deliveries) || 0,
          });
        }
      } catch (err) {
        console.error("Impact statistics error:", err);

        if (isMounted) {
          setError(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchImpact();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = [
    {
      number: "01",
      icon: Utensils,
      value: loading ? "..." : formatNumber(impact.meals_rescued),
      label: "Meals rescued",
      description:
        "Food redirected from potential waste toward people and communities that need it.",
    },
    {
      number: "02",
      icon: Leaf,
      value: loading ? "..." : formatKg(impact.food_saved_kg),
      label: "Food saved",
      description:
        "Food successfully redistributed through completed FoodBridge activity.",
    },
    {
      number: "03",
      icon: Users,
      value: loading ? "..." : formatNumber(impact.people_supported),
      label: "People supported",
      description:
        "People reached through successfully completed food redistribution.",
    },
    {
      number: "04",
      icon: Truck,
      value: loading ? "..." : formatNumber(impact.completed_deliveries),
      label: "Deliveries completed",
      description:
        "Successful movements of donated food through the FoodBridge network.",
    },
  ];

  return (
    <section
      id="impact"
      className="scroll-mt-20 border-b border-line bg-paper"
    >
      <div className="mx-auto max-w-[1400px]">
        {/* Header */}
        <div className="grid border-b border-line lg:grid-cols-[0.8fr_1.2fr]">
          <div className="border-b border-line px-6 py-10 md:px-10 lg:border-b-0 lg:border-r lg:px-12">
            <p className="fb-label text-green">04 — Impact</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="px-6 py-12 md:px-10 md:py-16 lg:px-12 lg:py-20"
          >
            <h2 className="fb-heading max-w-5xl">
              MAKE IT
              <br />
              <span className="text-green">COUNT.</span>
            </h2>

            <p className="mt-10 max-w-2xl text-base leading-7 text-muted md:text-lg md:leading-8">
              Every successful connection leaves a measurable trace. Food
              rescued, people supported, food saved, and deliveries completed
              become part of the story FoodBridge is building.
            </p>
          </motion.div>
        </div>

        {/* Main statistics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.article
                key={stat.number}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.08,
                }}
                className={`group min-h-[330px] px-6 py-10 md:px-10 md:py-12 lg:px-10 lg:py-14 ${
                  index > 0
                    ? "border-t border-line md:border-l lg:border-t-0"
                    : "border-t border-line md:border-t-0"
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-[clamp(3rem,5vw,5rem)] font-normal leading-none tracking-[-0.06em] text-ash transition-colors duration-300 group-hover:text-green">
                    {stat.number}
                  </span>

                  <Icon
                    size={26}
                    strokeWidth={1.2}
                    className="text-ink transition-colors duration-300 group-hover:text-green"
                  />
                </div>

                <div className="mt-14">
                  <p className="text-[clamp(2.4rem,4vw,4rem)] font-normal leading-none tracking-[-0.055em]">
                    {stat.value}
                  </p>

                  <p className="fb-label mt-4 text-green">{stat.label}</p>

                  <p className="mt-4 max-w-xs text-sm leading-6 text-muted">
                    {stat.description}
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-3 text-muted transition-all duration-300 group-hover:gap-5 group-hover:text-green">
                  <span className="text-[10px] uppercase tracking-[0.08em]">
                    Impact / {stat.number}
                  </span>

                  <ArrowRight size={14} strokeWidth={1.2} />
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Impact statement */}
        <div className="grid border-t border-line lg:grid-cols-[0.8fr_1.2fr]">
          <div className="border-b border-line px-6 py-10 md:px-10 lg:border-b-0 lg:border-r lg:px-12">
            <div className="flex items-center gap-3">
              <Heart
                size={18}
                strokeWidth={1.2}
                className="text-green"
              />

              <p className="fb-label text-muted">
                The effect
              </p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="px-6 py-12 md:px-10 lg:px-12 lg:py-16"
          >
            <h3 className="max-w-4xl text-[clamp(2.3rem,5vw,5rem)] font-normal leading-[0.95] tracking-[-0.045em]">
              LESS WASTE.
              <br />
              MORE <span className="text-green">POSSIBILITY.</span>
            </h3>

            <div className="mt-10 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
              <p className="max-w-2xl text-base leading-7 text-muted md:text-lg md:leading-8">
                FoodBridge gives surplus food another route. What might have
                been discarded can become a meal, a completed delivery, and
                meaningful support for someone else.
              </p>

              <div className="flex items-center gap-3 text-sm uppercase tracking-[0.06em] text-green">
                <span>Measure the difference</span>
                <ArrowRight size={16} strokeWidth={1.2} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Live network visual */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="grid border-t border-line lg:grid-cols-[0.8fr_1.2fr]"
        >
          <div className="border-b border-line px-6 py-10 md:px-10 lg:border-b-0 lg:border-r lg:px-12">
            <p className="fb-label text-muted">
              Network activity
            </p>

            <p className="mt-4 max-w-xs text-sm leading-6 text-muted">
              Live figures are drawn from completed FoodBridge platform
              activity.
            </p>
          </div>

          <div className="grid sm:grid-cols-3">
            <div className="border-b border-line px-6 py-8 sm:border-b-0 sm:border-r md:px-8 lg:px-10">
              <p className="text-[10px] uppercase tracking-[0.08em] text-muted">
                Meals
              </p>

              <p className="mt-4 text-3xl font-normal tracking-[-0.04em]">
                {loading ? "..." : formatNumber(impact.meals_rescued)}
              </p>

              <div className="mt-5 h-px bg-line">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "78%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  className="h-px bg-green"
                />
              </div>
            </div>

            <div className="border-b border-line px-6 py-8 sm:border-b-0 sm:border-r md:px-8 lg:px-10">
              <p className="text-[10px] uppercase tracking-[0.08em] text-muted">
                People
              </p>

              <p className="mt-4 text-3xl font-normal tracking-[-0.04em]">
                {loading ? "..." : formatNumber(impact.people_supported)}
              </p>

              <div className="mt-5 h-px bg-line">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "64%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.1 }}
                  className="h-px bg-green"
                />
              </div>
            </div>

            <div className="px-6 py-8 md:px-8 lg:px-10">
              <p className="text-[10px] uppercase tracking-[0.08em] text-muted">
                Deliveries
              </p>

              <p className="mt-4 text-3xl font-normal tracking-[-0.04em]">
                {loading
                  ? "..."
                  : formatNumber(impact.completed_deliveries)}
              </p>

              <div className="mt-5 h-px bg-line">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "52%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="h-px bg-green"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Data note */}
        <div className="flex items-start justify-between gap-8 border-t border-line px-6 py-6 md:px-10 lg:px-12">
          <div className="flex items-start gap-3">
            <Leaf
              size={15}
              strokeWidth={1.2}
              className="mt-0.5 shrink-0 text-green"
            />

            <p className="max-w-2xl text-[11px] leading-5 text-muted">
              {error
                ? "Impact statistics are temporarily unavailable. Please check your connection and try again."
                : "Impact metrics are powered by completed FoodBridge platform activity and update as the network grows."}
            </p>
          </div>

          <span className="hidden text-[10px] uppercase tracking-[0.08em] text-muted sm:block">
            04 — Impact
          </span>
        </div>
      </div>
    </section>
  );
}

export default ImpactSection;

