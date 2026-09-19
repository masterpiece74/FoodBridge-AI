
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Heart,
  Leaf,
  Users,
  Utensils,
  Truck,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://foodbridge-ai-qj9q.onrender.com";

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 35,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

const statsContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value || 0);
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

  const impactStats = [
    {
      value: loading ? "..." : formatNumber(impact.meals_rescued),
      label: "Meals rescued",
      description:
        "Nutritious meals redirected to people and communities that need them.",
      icon: Utensils,
    },
    {
      value: loading
        ? "..."
        : `${impact.food_saved_kg.toLocaleString("en-US", {
            maximumFractionDigits: 1,
          })} kg`,
      label: "Food saved",
      description:
        "Food successfully redistributed through completed FoodBridge deliveries.",
      icon: Leaf,
    },
    {
      value: loading ? "..." : formatNumber(impact.people_supported),
      label: "People supported",
      description:
        "People supported through successfully completed food deliveries.",
      icon: Users,
    },
    {
      value: loading ? "..." : formatNumber(impact.completed_deliveries),
      label: "Completed deliveries",
      description:
        "Food deliveries successfully completed across the FoodBridge network.",
      icon: Truck,
    },
  ];

  return (
    <section
      id="impact"
      className="relative scroll-mt-24 overflow-hidden bg-[#FAFAF7] px-6 py-20 md:px-12 md:py-24 lg:px-20"
    >
      {/* =====================================================
          DECORATIVE BACKGROUND
      ===================================================== */}

      <motion.div
        animate={{
          x: [0, 25, 0],
          y: [0, -15, 0],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute -right-32 top-20 h-72 w-72 rounded-full bg-[#A7D7B8]/30 blur-3xl"
      />

      <motion.div
        animate={{
          x: [0, -20, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute -bottom-32 left-10 h-72 w-72 rounded-full bg-[#F59E0B]/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl">
        {/* =====================================================
            SECTION HEADER
        ===================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-[#14532D]/10 bg-[#14532D]/5 px-4 py-2 text-sm font-medium text-[#14532D]">
            <Heart size={16} />
            Impact that matters
          </div>

          <h2 className="text-3xl font-bold leading-tight tracking-tight text-[#1C1C1C] sm:text-4xl md:text-5xl lg:text-6xl">
            Every donation becomes
            <br />
            <span className="text-[#14532D]">measurable impact.</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-500 sm:mt-6 sm:text-lg sm:leading-8">
            FoodBridge AI helps turn surplus food into meaningful support
            while giving donors, volunteers, recipients, and communities
            visibility into the difference they are creating.
          </p>
        </motion.div>

        {/* =====================================================
            IMPACT STATISTICS
        ===================================================== */}

        <motion.div
          variants={statsContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.15,
          }}
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4"
        >
          {impactStats.map((stat) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.label}
                variants={cardVariants}
                whileHover={{
                  y: -8,
                  transition: {
                    duration: 0.25,
                  },
                }}
                className="group relative overflow-hidden rounded-[2rem] border border-gray-200/80 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-xl sm:p-7"
              >
                {/* Icon */}

                <div className="flex items-center justify-between">
                  <motion.div
                    whileHover={{
                      scale: 1.08,
                      rotate: 4,
                    }}
                    className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#14532D]/5 text-[#14532D]"
                  >
                    <Icon size={21} strokeWidth={2} />
                  </motion.div>

                  <ArrowUpRight
                    size={18}
                    className="text-gray-300 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#14532D]"
                  />
                </div>

                {/* Number */}

                <p className="mt-7 text-3xl font-bold tracking-tight text-[#1C1C1C] sm:text-4xl">
                  {stat.value}
                </p>

                {/* Label */}

                <h3 className="mt-2 text-base font-semibold text-[#14532D]">
                  {stat.label}
                </h3>

                {/* Description */}

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  {stat.description}
                </p>

                {/* Bottom accent */}

                <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#14532D] transition-all duration-500 group-hover:w-full" />
              </motion.div>
            );
          })}
        </motion.div>

        {/* =====================================================
            MAIN IMPACT STORY
        ===================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 50,
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
            delay: 0.1,
          }}
          className="mt-6 overflow-hidden rounded-[2rem] bg-[#14532D] text-white"
        >
          <div className="grid lg:grid-cols-2">
            {/* =================================================
                LEFT CONTENT
            ================================================= */}

            <div className="relative p-7 sm:p-8 md:p-12 lg:p-14">
              <motion.div
                animate={{
                  rotate: [0, 4, -4, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-[#A7D7B8]"
              >
                <Heart size={25} strokeWidth={2} />
              </motion.div>

              <p className="mt-8 text-sm font-medium uppercase tracking-[0.2em] text-[#A7D7B8]">
                The FoodBridge effect
              </p>

              <h3 className="mt-4 max-w-xl text-3xl font-bold leading-tight sm:text-4xl">
                Less food wasted.
                <br />
                More people supported.
              </h3>

              <p className="mt-5 max-w-xl text-base leading-7 text-white/60">
                FoodBridge AI helps identify where surplus food can create
                meaningful value, connecting available food with suitable
                recipients and coordinating the journey toward delivery.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {["Food rescue", "AI matching", "Community impact"].map(
                  (item) => (
                    <div
                      key={item}
                      className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/70"
                    >
                      {item}
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* =================================================
                RIGHT VISUAL
            ================================================= */}

            <div className="relative min-h-[340px] overflow-hidden bg-[#1F7A4D] p-7 sm:p-8 md:min-h-[360px] md:p-12">
              {/* Decorative circles */}

              <motion.div
                animate={{
                  scale: [1, 1.08, 1],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-white/10"
              />

              <motion.div
                animate={{
                  scale: [1, 1.12, 1],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full border border-white/10"
              />

              <div className="relative flex h-full items-center justify-center">
                {/* Central impact circle */}

                <motion.div
                  animate={{
                    y: [0, -8, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="flex h-44 w-44 flex-col items-center justify-center rounded-full border border-white/15 bg-white/10 text-center shadow-2xl backdrop-blur-md sm:h-48 sm:w-48"
                >
                  <Heart size={26} className="text-[#A7D7B8]" />

                  <p className="mt-3 text-4xl font-bold">
                    {loading ? "..." : formatNumber(impact.meals_rescued)}
                  </p>

                  <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/50 sm:text-xs">
                    meals rescued
                  </p>
                </motion.div>

                {/* Food saved */}

                <motion.div
                  animate={{
                    y: [0, -7, 0],
                  }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute left-0 top-6 rounded-2xl border border-white/10 bg-white/10 px-3 py-3 backdrop-blur-md sm:left-2 sm:top-10 sm:px-4"
                >
                  <p className="text-[10px] text-white/40 sm:text-xs">
                    Food saved
                  </p>

                  <p className="mt-1 text-base font-bold sm:text-lg">
                    {loading
                      ? "..."
                      : `${impact.food_saved_kg.toLocaleString("en-US", {
                          maximumFractionDigits: 1,
                        })} kg`}
                  </p>
                </motion.div>

                {/* People supported */}

                <motion.div
                  animate={{
                    y: [0, 7, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute bottom-6 right-0 rounded-2xl border border-white/10 bg-white/10 px-3 py-3 backdrop-blur-md sm:bottom-8 sm:right-2 sm:px-4"
                >
                  <p className="text-[10px] text-white/40 sm:text-xs">
                    People supported
                  </p>

                  <p className="mt-1 text-base font-bold sm:text-lg">
                    {loading
                      ? "..."
                      : formatNumber(impact.people_supported)}
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* =====================================================
            DATA NOTE
        ===================================================== */}

        <motion.div
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
            delay: 0.25,
          }}
          className="mt-6 flex items-start justify-center gap-2 text-center text-xs leading-5 text-gray-400"
        >
          <Leaf
            size={14}
            className="mt-0.5 shrink-0 text-[#14532D]"
          />

          <span>
            {error
              ? "Impact statistics are temporarily unavailable. Please check your connection and try again."
              : "Impact metrics are powered by completed FoodBridge platform activity and update as the network grows."}
          </span>
        </motion.div>
      </div>
    </section>
  );
}

export default ImpactSection;
