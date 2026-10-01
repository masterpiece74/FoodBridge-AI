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
    <nav className="sticky top-0 z-50 border-b border-line bg-paper">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-12">
        <div className="flex h-[72px] items-center justify-between">
          {/* LOGO */}
          <Link
            to="/"
            onClick={closeMobileMenu}
            aria-label="FoodBridge AI home"
            className="group flex items-baseline text-xl font-normal tracking-[-0.04em] md:text-2xl"
          >
            FoodBridge
            <span className="ml-1 text-green">AI</span>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden items-center md:flex">
            <Link
              to="/"
              className={`border-l border-line px-6 py-2 text-[11px] uppercase tracking-[0.08em] transition-colors ${
                isActive("/")
                  ? "text-green"
                  : "text-muted hover:text-ink"
              }`}
            >
              Home
            </Link>

            <button
              type="button"
              onClick={() => scrollToSection("how-it-works")}
              className="border-l border-line px-6 py-2 text-[11px] uppercase tracking-[0.08em] text-muted transition-colors hover:text-ink"
            >
              How It Works
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("impact")}
              className="border-l border-line px-6 py-2 text-[11px] uppercase tracking-[0.08em] text-muted transition-colors hover:text-ink"
            >
              Impact
            </button>

            <Link
              to="/about"
              className={`border-l border-line px-6 py-2 text-[11px] uppercase tracking-[0.08em] transition-colors ${
                isActive("/about")
                  ? "text-green"
                  : "text-muted hover:text-ink"
              }`}
            >
              About
            </Link>

            <Link
              to="/login"
              className="ml-4 inline-flex items-center gap-2 border border-ink bg-ink px-5 py-3 text-[11px] uppercase tracking-[0.08em] text-white transition-colors hover:bg-green hover:border-green"
            >
              Enter platform
              <ArrowRight size={14} strokeWidth={1.4} />
            </Link>
          </div>

          {/* MOBILE MENU BUTTON */}
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
            className="flex h-10 w-10 items-center justify-center border border-line text-ink transition-colors hover:border-ink hover:text-green md:hidden"
          >
            {mobileMenuOpen ? (
              <X size={20} strokeWidth={1.4} />
            ) : (
              <Menu size={20} strokeWidth={1.4} />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE NAVIGATION */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="border-t border-line md:hidden"
          >
            <div className="mx-auto max-w-[1400px] px-6 md:px-10">
              <div className="flex flex-col">
                <Link
                  to="/"
                  onClick={closeMobileMenu}
                  className={`border-b border-line py-5 text-xs uppercase tracking-[0.08em] transition-colors ${
                    isActive("/")
                      ? "text-green"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  Home
                </Link>

                <button
                  type="button"
                  onClick={() => scrollToSection("how-it-works")}
                  className="border-b border-line py-5 text-left text-xs uppercase tracking-[0.08em] text-muted transition-colors hover:text-ink"
                >
                  How It Works
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection("impact")}
                  className="border-b border-line py-5 text-left text-xs uppercase tracking-[0.08em] text-muted transition-colors hover:text-ink"
                >
                  Impact
                </button>

                <Link
                  to="/about"
                  onClick={closeMobileMenu}
                  className={`border-b border-line py-5 text-xs uppercase tracking-[0.08em] transition-colors ${
                    isActive("/about")
                      ? "text-green"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  About
                </Link>

                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="my-5 flex items-center justify-between border border-ink bg-ink px-5 py-4 text-xs uppercase tracking-[0.08em] text-white transition-colors hover:border-green hover:bg-green"
                >
                  Enter platform
                  <ArrowRight size={15} strokeWidth={1.4} />
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