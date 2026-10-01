import { useEffect, useState } from "react";
import { ArrowDownRight, ArrowRight, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://foodbridge-ai-qj9q.onrender.com";

function Hero() {
  const [impact, setImpact] = useState(null);

  useEffect(() => {
    const loadImpact = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/impact/summary`);

        if (!response.ok) {
          throw new Error("Failed to load impact");
        }

        const data = await response.json();

        if (data.status === "success") {
          setImpact(data.impact);
        }
      } catch (error) {
        console.error("Hero impact error:", error);
      }
    };

    loadImpact();
  }, []);

  const mealsRescued = impact?.meals_rescued ?? 0;
  const peopleSupported = impact?.people_supported ?? 0;
  const completedDeliveries = impact?.completed_deliveries ?? 0;

  return (
    <section className="min-h-screen border-b border-line bg-paper">
      {/* =====================================================
          HERO CONTENT
      ===================================================== */}

      <div className="mx-auto grid max-w-[1400px] grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
        {/* =====================================================
            LEFT — TYPOGRAPHY + CONTENT
        ===================================================== */}

        <div className="flex min-h-[680px] flex-col justify-between border-b border-line px-6 py-12 md:px-10 md:py-16 lg:min-h-[calc(100vh-72px)] lg:border-b-0 lg:border-r lg:px-12 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="fb-label mb-10 text-green">
              Intelligent food redistribution
            </p>

            <h1 className="max-w-5xl text-[clamp(4.5rem,10vw,9.5rem)] font-normal leading-[0.82] tracking-[-0.065em]">
              TURNING
              <br />
              SURPLUS
              <br />
              <span className="text-green">INTO HOPE.</span>
            </h1>
          </motion.div>

          {/* =====================================================
              DESCRIPTION + CTA
          ===================================================== */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-16"
          >
            <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
              <p className="max-w-lg text-base leading-7 text-muted md:text-lg">
                FoodBridge AI connects surplus food from businesses and
                individuals with verified communities that need it — reducing
                waste, fighting hunger, and creating measurable impact.
              </p>

              <Link
                to="/login"
                className="fb-arrow w-fit text-sm uppercase tracking-[0.04em]"
              >
                Start a donation
                <ArrowRight size={16} strokeWidth={1.4} />
              </Link>
            </div>
          </motion.div>

          {/* =====================================================
              IMPACT STRIP
          ===================================================== */}

          <div className="mt-16 grid grid-cols-3 border-t border-line pt-6">
            <div>
              <p className="text-2xl font-normal md:text-3xl">
                {mealsRescued.toLocaleString()}+
              </p>

              <p className="mt-2 text-[11px] uppercase tracking-[0.06em] text-muted">
                Meals rescued
              </p>
            </div>

            <div className="border-l border-line pl-4 md:pl-6">
              <p className="text-2xl font-normal md:text-3xl">
                {peopleSupported.toLocaleString()}+
              </p>

              <p className="mt-2 text-[11px] uppercase tracking-[0.06em] text-muted">
                People supported
              </p>
            </div>

            <div className="border-l border-line pl-4 md:pl-6">
              <p className="text-2xl font-normal md:text-3xl">
                {completedDeliveries.toLocaleString()}+
              </p>

              <p className="mt-2 text-[11px] uppercase tracking-[0.06em] text-muted">
                Deliveries
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================
            RIGHT — PHOTOGRAPHY
        ===================================================== */}

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9 }}
          className="relative min-h-[600px] overflow-hidden lg:min-h-[calc(100vh-72px)]"
        >
          <img
            src="/foodbridge-hero.jpg.png"
            alt="Food donation and community food sharing"
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* IMAGE CAPTION */}

          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/60 to-transparent px-6 pb-6 pt-32 text-white md:px-8">
            <div>
              <p className="text-[11px] uppercase tracking-[0.08em]">
                FoodBridge / 001
              </p>

              <p className="mt-2 max-w-xs text-sm leading-6">
                Good food deserves another destination.
              </p>
            </div>

            <ArrowDownRight size={24} strokeWidth={1.2} />
          </div>

          {/* IMPACT MARKER */}

          <div className="absolute left-5 top-5 border border-white/60 bg-black/10 px-3 py-2 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-white">
              <Heart size={13} strokeWidth={1.5} />

              <span className="text-[10px] uppercase tracking-[0.08em]">
                Built for impact
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* =====================================================
          SCROLL INDICATOR
      ===================================================== */}

      <div className="mx-auto flex max-w-[1400px] items-center justify-between border-t border-line px-6 py-4 md:px-10 lg:px-12">
        <span className="text-[11px] uppercase tracking-[0.08em] text-muted">
          01 — Introduction
        </span>

        <span className="flex items-center gap-2 text-[11px] uppercase tracking-[0.08em] text-muted">
          Scroll to explore
          <ArrowDownRight size={13} strokeWidth={1.3} />
        </span>
      </div>
    </section>
  );
}

export default Hero;