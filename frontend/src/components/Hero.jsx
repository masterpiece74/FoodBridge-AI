import { useEffect, useState } from "react";
import {
  ArrowRight,
  Heart,
  Sparkles,
  Users,
  Utensils,
  Truck,
} from "lucide-react";
import { Link } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://foodbridge-ai-qj9q.onrender.com";

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
    <section className="relative overflow-hidden px-6 pb-20 pt-12 md:px-12 md:pb-28 md:pt-20 lg:px-20">
      {/* =====================================================
          BACKGROUND DECORATION
      ===================================================== */}

      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#E8F3EC] blur-3xl" />

      <div className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-[#FEF3C7] blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2 lg:gap-20">
        {/* ===================================================
            LEFT SIDE
        =================================================== */}

        <div>
          {/* AI BADGE */}

          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#D7E8DC] bg-white px-4 py-2 text-sm font-medium text-[#14532D] shadow-sm">
            <Sparkles size={16} />

            Intelligent food redistribution
          </div>

          {/* HEADING */}

          <h1 className="max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight text-[#14532D] md:text-6xl lg:text-7xl">
            Turn surplus food into{" "}
            <span className="text-[#1F7A4D]">meaningful impact.</span>
          </h1>

          {/* DESCRIPTION */}

          <p className="mt-7 max-w-xl text-lg leading-8 text-gray-600 md:text-xl">
            FoodBridge AI connects surplus food from businesses and individuals
            with verified communities that need it — reducing food waste,
            fighting hunger, and creating measurable impact.
          </p>

          {/* =================================================
              ACTION BUTTONS
          ================================================= */}

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            {/* DONATE FOOD */}

            <Link
              to="/login"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#14532D] px-7 py-4 font-semibold text-white shadow-lg shadow-[#14532D]/15 transition duration-300 hover:-translate-y-1 hover:bg-[#1F7A4D]"
            >
              Donate Food

              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            {/* FIND FOOD */}

            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-7 py-4 font-semibold text-[#14532D] transition duration-300 hover:-translate-y-1 hover:border-[#14532D] hover:shadow-md"
            >
              <Heart size={18} fill="currentColor" />

              Find Food
            </Link>
          </div>

          {/* =================================================
              REAL IMPACT STATS
          ================================================= */}

          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-5 border-t border-gray-200 pt-7">
            <div>
              <p className="text-2xl font-bold text-[#14532D]">
                {mealsRescued.toLocaleString()}+
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Meals rescued
              </p>
            </div>

            <div>
              <p className="text-2xl font-bold text-[#14532D]">
                {peopleSupported.toLocaleString()}+
              </p>

              <p className="mt-1 text-sm text-gray-500">
                People supported
              </p>
            </div>

            <div>
              <p className="text-2xl font-bold text-[#14532D]">
                {completedDeliveries.toLocaleString()}+
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Deliveries completed
              </p>
            </div>
          </div>
        </div>

        {/* ===================================================
            RIGHT SIDE — FOODBRIDGE IMAGE
        =================================================== */}

        <div className="relative">
          <div className="relative mx-auto aspect-[4/5] max-w-lg overflow-hidden rounded-[2rem] bg-[#14532D] shadow-2xl">
            {/* HERO IMAGE */}

            <img
              src="/foodbridge-hero.jpg.png"
              alt="Food donation and community food sharing"
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* IMAGE OVERLAY */}

            <div className="absolute inset-0 bg-gradient-to-t from-[#0B2F1A]/90 via-[#0B2F1A]/20 to-transparent" />

            {/* =================================================
                TOP STATUS CARD
            ================================================= */}

            <div className="absolute left-5 right-5 top-5 rounded-2xl border border-white/30 bg-white/90 p-4 shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E8F3EC] text-[#14532D]">
                  <Sparkles size={20} />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-[#14532D]">
                      Smart Match
                    </p>

                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                      AI
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-gray-500">
                    Connecting surplus food with verified recipients
                  </p>
                </div>
              </div>
            </div>

            {/* =================================================
                MATCH INFORMATION
            ================================================= */}

            <div className="absolute bottom-28 left-5 right-5 rounded-2xl border border-white/20 bg-white/95 p-4 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E8F3EC] text-[#14532D]">
                    <Utensils size={20} />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-400">
                      FoodBridge network
                    </p>

                    <p className="mt-0.5 text-sm font-bold text-[#14532D]">
                      Surplus food → communities
                    </p>
                  </div>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F3EC] text-[#1F7A4D]">
                  <Truck size={18} />
                </div>
              </div>
            </div>

            {/* =================================================
                REAL IMPACT CARD
            ================================================= */}

            <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white p-5 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    FoodBridge impact
                  </p>

                  <p className="mt-1 text-2xl font-bold text-[#14532D]">
                    {mealsRescued.toLocaleString()} meals
                  </p>

                  <div className="mt-2 flex items-center gap-1.5 text-xs text-green-600">
                    <Users size={13} />

                    {peopleSupported.toLocaleString()} people supported
                  </div>
                </div>

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FEF3C7] text-[#14532D]">
                  <Heart size={21} fill="currentColor" />
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              DECORATIVE CIRCLE
          ================================================= */}

          <div className="absolute -bottom-7 -right-7 -z-10 h-32 w-32 rounded-full border-[18px] border-[#F59E0B]/20" />
        </div>
      </div>
    </section>
  );
}

export default Hero;