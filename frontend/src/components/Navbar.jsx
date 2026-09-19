import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const scrollToSection = (id) => {
    closeMobileMenu();

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

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-[#14532D]/5 bg-[#FAFAF7]/90 px-6 py-4 backdrop-blur-xl md:px-12 lg:px-20">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* =====================================================
            LOGO
        ===================================================== */}

        <Link
          to="/"
          onClick={closeMobileMenu}
          aria-label="FoodBridge AI home"
          className="group flex items-center text-2xl font-bold tracking-tight text-[#14532D]"
        >
          FoodBridge
          <span className="text-[#1F7A4D] transition-colors duration-200 group-hover:text-[#14532D]">
            AI
          </span>
        </Link>

        {/* =====================================================
            DESKTOP NAVIGATION
        ===================================================== */}

        <div className="hidden items-center gap-8 md:flex">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors duration-200 ${
              isActive("/")
                ? "text-[#14532D]"
                : "text-gray-600 hover:text-[#14532D]"
            }`}
          >
            Home
          </Link>

          <button
            type="button"
            onClick={() => scrollToSection("how-it-works")}
            className="text-sm font-medium text-gray-600 transition-colors duration-200 hover:text-[#14532D]"
          >
            How It Works
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("impact")}
            className="text-sm font-medium text-gray-600 transition-colors duration-200 hover:text-[#14532D]"
          >
            Impact
          </button>

          <Link
            to="/about"
            className={`text-sm font-medium transition-colors duration-200 ${
              isActive("/about")
                ? "text-[#14532D]"
                : "text-gray-600 hover:text-[#14532D]"
            }`}
          >
            About
          </Link>
        </div>

        {/* =====================================================
            DESKTOP GET STARTED
        ===================================================== */}

        <Link
          to="/login"
          className="hidden items-center gap-2 rounded-full bg-[#14532D] px-5 py-3 text-sm font-semibold text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-[#1F7A4D] hover:shadow-md md:flex"
        >
          Get Started

          <ArrowRight size={16} strokeWidth={2} />
        </Link>

        {/* =====================================================
            MOBILE MENU BUTTON
        ===================================================== */}

        <button
          type="button"
          aria-label={
            mobileMenuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMobileMenuOpen((current) => !current)}
          className="rounded-xl p-2 text-[#14532D] transition hover:bg-[#A7D7B8]/30 focus:outline-none focus:ring-2 focus:ring-[#14532D]/20 md:hidden"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* =====================================================
          MOBILE NAVIGATION
      ===================================================== */}

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden md:hidden"
          >
            <div className="border-t border-[#14532D]/10 pb-4 pt-4">
              <div className="flex flex-col gap-1">
                <Link
                  to="/"
                  onClick={closeMobileMenu}
                  className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive("/")
                      ? "bg-[#A7D7B8]/20 text-[#14532D]"
                      : "text-gray-700 hover:bg-[#A7D7B8]/20 hover:text-[#14532D]"
                  }`}
                >
                  Home
                </Link>

                <button
                  type="button"
                  onClick={() => scrollToSection("how-it-works")}
                  className="rounded-xl px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-[#A7D7B8]/20 hover:text-[#14532D]"
                >
                  How It Works
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection("impact")}
                  className="rounded-xl px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-[#A7D7B8]/20 hover:text-[#14532D]"
                >
                  Impact
                </button>

                <Link
                  to="/about"
                  onClick={closeMobileMenu}
                  className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive("/about")
                      ? "bg-[#A7D7B8]/20 text-[#14532D]"
                      : "text-gray-700 hover:bg-[#A7D7B8]/20 hover:text-[#14532D]"
                  }`}
                >
                  About
                </Link>

                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-[#14532D] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1F7A4D]"
                >
                  Get Started
                  <ArrowRight size={16} strokeWidth={2} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;

