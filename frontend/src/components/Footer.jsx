import { motion } from "framer-motion";
import {
  ArrowRight,
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

  const scrollToTop = () => {
    if (location.pathname !== "/") {
      navigate("/");
      
      window.setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }, 100);

      return;
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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
      target: "impact",
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
    <footer className="bg-deep-green text-white">
      <div className="mx-auto max-w-[1400px]">
        {/* Main footer */}
        <div className="grid lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="border-b border-white/10 px-6 py-12 md:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14"
          >
            <Link
              to="/"
              className="inline-block text-2xl font-normal tracking-[-0.04em] transition-colors hover:text-light-green"
            >
              FoodBridge
              <span className="text-light-green">AI</span>
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-7 text-white/50">
              Connecting surplus food with verified communities through
              intelligent matching, coordinated delivery, and measurable
              impact.
            </p>

            <div className="mt-8 flex items-center gap-3">
              <Heart
                size={15}
                strokeWidth={1.2}
                className="text-light-green"
              />

              <span className="text-[10px] uppercase tracking-[0.08em] text-white/40">
                Turning surplus into hope.
              </span>
            </div>
          </motion.div>

          {/* Platform */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="border-b border-white/10 px-6 py-10 md:px-10 lg:border-b-0 lg:border-r lg:px-10 lg:py-14"
          >
            <p className="fb-label text-white/40">
              Platform
            </p>

            <div className="mt-7 flex flex-col items-start gap-5">
              {platformLinks.map((item) => (
                <button
                  key={item.target}
                  type="button"
                  onClick={() => scrollToSection(item.target)}
                  className="group flex items-center gap-3 text-left text-sm text-white/60 transition-colors hover:text-light-green"
                >
                  <span>{item.label}</span>

                  <ArrowRight
                    size={13}
                    strokeWidth={1.2}
                    className="opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Get involved */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="border-b border-white/10 px-6 py-10 md:px-10 lg:border-b-0 lg:border-r lg:px-10 lg:py-14"
          >
            <p className="fb-label text-white/40">
              Get involved
            </p>

            <div className="mt-7 flex flex-col items-start gap-5">
              {involvementLinks.map((label) => (
                <Link
                  key={label}
                  to="/register"
                  className="group flex items-center gap-3 text-sm text-white/60 transition-colors hover:text-light-green"
                >
                  <span>{label}</span>

                  <ArrowRight
                    size={13}
                    strokeWidth={1.2}
                    className="opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100"
                  />
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Connect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="px-6 py-10 md:px-10 lg:px-10 lg:py-14"
          >
            <p className="fb-label text-white/40">
              Connect
            </p>

            <div className="mt-7">
              <a
                href="mailto:hello@foodbridge.ai"
                className="group flex w-fit items-center gap-3 text-sm text-white/60 transition-colors hover:text-light-green"
              >
                <Mail
                  size={15}
                  strokeWidth={1.2}
                />

                <span>hello@foodbridge.ai</span>
              </a>

              <div className="mt-8">
                <p className="text-[10px] uppercase tracking-[0.08em] text-white/30">
                  Follow
                </p>

                <div className="mt-4 flex items-center gap-5">
                  <SocialLink label="X" />
                  <SocialLink label="LinkedIn" />
                  <SocialLink label="Instagram" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Closing statement */}
        <div className="grid border-t border-white/10 md:grid-cols-[0.8fr_1.2fr]">
          <div className="border-b border-white/10 px-6 py-8 md:border-b-0 md:border-r md:px-10 lg:px-12">
            <p className="text-[10px] uppercase tracking-[0.08em] text-white/30">
              FoodBridge AI / 2026
            </p>
          </div>

          <div className="flex flex-col justify-between gap-6 px-6 py-8 md:flex-row md:items-center md:px-10 lg:px-12">
            <p className="text-sm text-white/50">
              Good food deserves another destination.
            </p>

            <button
              type="button"
              onClick={scrollToTop}
              className="fb-arrow w-fit text-[10px] uppercase tracking-[0.08em] text-light-green"
            >
              Back to top

              <ArrowRight
                size={14}
                strokeWidth={1.2}
                className="-rotate-90"
              />
            </button>
          </div>
        </div>

        {/* Legal / copyright */}
        <div className="flex flex-col gap-3 border-t border-white/10 px-6 py-5 text-[10px] uppercase tracking-[0.06em] text-white/25 sm:flex-row sm:items-center sm:justify-between md:px-10 lg:px-12">
          <span>
            © 2026 FoodBridge AI. All rights reserved.
          </span>

          <span>
            Built for impact.
          </span>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ label }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="text-[10px] uppercase tracking-[0.08em] text-white/40 transition-colors hover:text-light-green"
    >
      {label}
    </button>
  );
}

export default Footer;
