import { motion } from "framer-motion";
import {
  ArrowRight,
  Heart,
  Sparkles,
  Utensils,
} from "lucide-react";
import { Link } from "react-router-dom";

function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-[#F4F8F5] px-5 py-20 sm:px-6 md:px-12 md:py-24 lg:px-20">
      {/* Decorative glow */}

      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          x: [0, 20, 0],
          y: [0, 10, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-[#A7D7B8]/30 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{
            opacity: 0,
            y: 45,
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
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative overflow-hidden rounded-[2rem] bg-[#0B2F1A] px-6 py-14 text-center text-white shadow-[0_25px_70px_rgba(11,47,26,0.16)] sm:rounded-[2.5rem] sm:px-8 sm:py-16 md:px-12 md:py-20 lg:px-20"
        >
          {/* Background circles */}

          <motion.div
            animate={{
              rotate: [0, 8, 0],
              scale: [1, 1.03, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/10"
          />

          <motion.div
            animate={{
              rotate: [0, -8, 0],
              scale: [1, 1.04, 1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full border border-white/10"
          />

          <div className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#A7D7B8]/5 blur-3xl" />

          {/* Small decorative dots */}

          <div className="pointer-events-none absolute left-8 top-10 h-2 w-2 rounded-full bg-[#A7D7B8]/40" />

          <div className="pointer-events-none absolute right-10 top-1/3 h-1.5 w-1.5 rounded-full bg-[#F59E0B]/50" />

          <div className="pointer-events-none absolute bottom-12 left-1/4 h-1.5 w-1.5 rounded-full bg-[#A7D7B8]/30" />

          {/* Icon */}

          <motion.div
            animate={{
              y: [0, -5, 0],
              rotate: [0, 3, -3, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-[#A7D7B8] sm:h-16 sm:w-16"
          >
            <Heart size={27} />
          </motion.div>

          <div className="relative mx-auto mt-6 max-w-3xl sm:mt-7">
            {/* Eyebrow */}

            <motion.div
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
                duration: 0.5,
                delay: 0.15,
              }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-semibold text-white/75 backdrop-blur sm:text-xs"
            >
              <Sparkles size={13} />

              Be part of the solution
            </motion.div>

            {/* Heading */}

            <h2 className="text-3xl font-bold leading-[1.08] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              Have surplus?
              <br />

              <span className="text-[#A7D7B8]">
                Someone could need it.
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/60 sm:mt-6 sm:text-base sm:leading-8 md:text-lg">
              Join a growing network turning surplus food into
              meaningful support. Every donation can become a meal,
              and every meal can make a difference.
            </p>

            {/* CTA buttons */}

            <div className="mt-8 flex flex-col justify-center gap-3 sm:mt-9 sm:flex-row">
              <Link
                to="/register"
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-[#0B2F1A] shadow-lg shadow-black/5 transition-all duration-300 hover:-translate-y-1 hover:bg-[#A7D7B8] hover:shadow-xl"
              >
                Donate Food

                <ArrowRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/register"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-white/15"
              >
                <Utensils size={17} />

                Join the Network
              </Link>
            </div>

            {/* Trust statement */}

            <div className="mt-7 flex items-center justify-center gap-2 text-xs text-white/35">
              <Heart
                size={13}
                className="fill-current"
              />

              <span>Turning surplus into hope.</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default FinalCTA;