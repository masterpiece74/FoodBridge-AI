import { motion } from "framer-motion";
import { ArrowRight, Heart, Utensils } from "lucide-react";
import { Link } from "react-router-dom";

function FinalCTA() {
  return (
    <section className="border-b border-line bg-[#0B2F1A] text-white">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
          {/* Section label */}
          <div className="border-b border-white/10 px-6 py-10 md:px-10 lg:border-b-0 lg:border-r lg:px-12">
            <div className="flex items-center gap-3">
              <Heart
                size={17}
                strokeWidth={1.2}
                className="text-[#DCEFE3]"
              />

              <p className="fb-label text-white/50">
                06 — Take part
              </p>
            </div>
          </div>

          {/* Main CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.75 }}
            className="px-6 py-14 md:px-10 md:py-16 lg:px-12 lg:py-20"
          >
            <p className="fb-label text-[#DCEFE3]">
              There is another destination
            </p>

            <h2 className="mt-6 max-w-5xl text-[clamp(3.5rem,8vw,8rem)] font-normal leading-[0.86] tracking-[-0.06em] text-white">
              HAVE
              <br />
              SURPLUS?
              <br />
              <span className="text-[#DCEFE3]">MOVE IT.</span>
            </h2>

            <div className="mt-12 grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
              <p className="max-w-2xl text-base leading-7 text-white/60 md:text-lg md:leading-8">
                A meal that might be wasted can become meaningful support.
                Join FoodBridge and help move good food toward people and
                communities that need it.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row md:flex-col">
                {/* DONATE FOOD */}
                <Link
                  to="/register"
                  className="group inline-flex items-center justify-between gap-8 border border-white bg-white px-5 py-4 text-[11px] font-medium uppercase tracking-[0.08em] !text-[#0B2F1A] transition-colors duration-200 hover:bg-[#DCEFE3]"
                >
                  <span className="!text-[#0B2F1A]">
                    Donate food
                  </span>

                  <ArrowRight
                    size={16}
                    strokeWidth={1.2}
                    className="!text-[#0B2F1A] transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Link>

                {/* JOIN THE NETWORK */}
                <Link
                  to="/register"
                  className="group inline-flex items-center justify-between gap-8 border border-white/20 px-5 py-4 text-[11px] font-medium uppercase tracking-[0.08em] !text-white transition-colors duration-200 hover:border-[#DCEFE3] hover:!text-[#DCEFE3]"
                >
                  <span>Join the network</span>

                  <ArrowRight
                    size={16}
                    strokeWidth={1.2}
                    className="text-current transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom statement */}
        <div className="grid border-t border-white/10 md:grid-cols-2">
          <div className="border-b border-white/10 px-6 py-6 md:border-b-0 md:border-r md:px-10 lg:px-12">
            <div className="flex items-center gap-3">
              <Utensils
                size={15}
                strokeWidth={1.2}
                className="text-[#DCEFE3]"
              />

              <span className="text-[10px] uppercase tracking-[0.08em] text-white/45">
                Food / Community / Movement
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-6 px-6 py-6 md:px-10 lg:px-12">
            <span className="text-[11px] uppercase tracking-[0.08em] text-white/45">
              Turning surplus into hope.
            </span>

            <ArrowRight
              size={15}
              strokeWidth={1.2}
              className="text-[#DCEFE3]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default FinalCTA;