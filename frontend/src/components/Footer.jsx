import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Heart,
  Mail,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id) => {
    if (location.pathname !== "/") {
      navigate(`/#${id}`);
      return;
    }

    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const platformLinks = [
    {
      label: "How It Works",
      target: "how-it-works",
    },
    {
      label: "AI Intelligence",
      target: "ai-intelligence",
    },
    {
      label: "Our Impact",
      target: "impact-results",
    },
    {
      label: "Our Network",
      target: "ecosystem",
    },
  ];

  const involvementLinks = [
    "Donate Food",
    "Become a Volunteer",
    "Join as an NGO",
  ];

  return (
    <footer className="relative overflow-hidden bg-[#0B2F1A] px-5 pb-7 pt-16 text-white sm:px-6 sm:pt-20 md:px-12 lg:px-20">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-40 top-0 h-96 w-96 rounded-full bg-[#1F7A4D]/20 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-[#A7D7B8]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        {/* Main footer */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:gap-10">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              to="/"
              className="inline-block text-2xl font-bold tracking-tight transition-opacity duration-300 hover:opacity-80 sm:text-[26px]"
            >
              FoodBridge
              <span className="text-[#A7D7B8]">AI</span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-white/45">
              Turning surplus into hope by intelligently connecting
              food donors, communities, and volunteers.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 text-sm text-white/40">
              <Heart
                size={15}
                className="fill-[#A7D7B8]/20 text-[#A7D7B8]"
              />

              <span>Turning Surplus Into Hope.</span>
            </div>
          </motion.div>

          {/* Platform */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            <h3 className="text-sm font-semibold text-white">
              Platform
            </h3>

            <div className="mt-5 space-y-3.5">
              {platformLinks.map((item) => (
                <button
                  key={item.target}
                  type="button"
                  onClick={() => scrollToSection(item.target)}
                  className="block text-left text-sm text-white/45 transition-all duration-300 hover:translate-x-1 hover:text-[#A7D7B8]"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Get involved */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-sm font-semibold text-white">
              Get involved
            </h3>

            <div className="mt-5 space-y-3.5">
              {involvementLinks.map((label) => (
                <Link
                  key={label}
                  to="/register"
                  className="group flex w-fit items-center gap-1 text-sm text-white/45 transition-all duration-300 hover:translate-x-1 hover:text-[#A7D7B8]"
                >
                  {label}

                  <ArrowUpRight
                    size={13}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Connect */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <h3 className="text-sm font-semibold text-white">
              Connect
            </h3>

            <div className="mt-5 space-y-5">
              <a
                href="mailto:hello@foodbridge.ai"
                className="group flex w-fit items-center gap-2 text-sm text-white/45 transition-colors duration-300 hover:text-[#A7D7B8]"
              >
                <Mail
                  size={15}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5"
                />

                Contact us
              </a>

              {/* Social links */}
              <div className="flex gap-2">
                <SocialButton
                  label="X"
                  ariaLabel="X"
                />

                <SocialButton
                  label="in"
                  ariaLabel="LinkedIn"
                />

                <SocialButton
                  label="IG"
                  ariaLabel="Instagram"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-white/10 sm:my-12" />

        {/* Bottom */}
        <div className="flex flex-col gap-4 text-xs text-white/30 md:flex-row md:items-center md:justify-between">
          <p>
            © 2026 FoodBridge AI. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <span>Built for impact.</span>

            <span>Powered by AI.</span>

            <span className="text-[#A7D7B8]/50">
              Turning surplus into hope.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialButton({ label, ariaLabel }) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-[11px] font-bold text-white/40 transition-all duration-300 hover:-translate-y-1 hover:border-[#A7D7B8]/30 hover:bg-[#A7D7B8]/10 hover:text-[#A7D7B8]"
    >
      {label}
    </button>
  );
}

export default Footer;