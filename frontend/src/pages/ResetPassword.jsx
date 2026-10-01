import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";

const API_URL = "https://foodbridge-ai-qj9q.onrender.com";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!token) {
      setError(
        "This password reset link is missing or invalid. Please request a new reset link."
      );
      return;
    }

    if (newPassword.length < 8) {
      setError("Your new password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail || "Unable to reset your password. Please try again."
        );
      }

      setSuccess(true);
    } catch (err) {
      setError(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* =========================================================
            LEFT — EDITORIAL PANEL
        ========================================================= */}
        <div className="hidden min-h-screen border-r border-line bg-deep-green text-white lg:flex">
          <div className="flex w-full flex-col justify-between px-12 py-10 xl:px-16 xl:py-12">

            {/* Brand */}
            <Link
              to="/"
              className="group flex w-fit items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center border border-light-green/40">
                <span className="text-sm font-medium tracking-[-0.03em]">
                  F
                </span>
              </div>

              <div>
                <p className="text-[15px] font-medium tracking-[-0.02em]">
                  FoodBridge
                </p>
                <p className="mt-0.5 text-[9px] uppercase tracking-[0.14em] text-white/40">
                  AI
                </p>
              </div>
            </Link>

            {/* Main editorial message */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-xl"
            >
              <div className="mb-10 flex items-center gap-3">
                <KeyRound
                  size={18}
                  strokeWidth={1.2}
                  className="text-light-green"
                />

                <p className="fb-label text-light-green">
                  Account security
                </p>
              </div>

              <h1 className="text-[clamp(4rem,7vw,7.5rem)] font-normal leading-[0.86] tracking-[-0.06em]">
                FIND
                <br />
                YOUR WAY
                <br />
                <span className="text-light-green">BACK.</span>
              </h1>

              <p className="mt-10 max-w-md text-base leading-7 text-white/55 md:text-lg md:leading-8">
                Create a new password and get back to moving good food
                toward people and communities that need it.
              </p>

              <div className="mt-12 border-t border-white/10 pt-6">
                <p className="fb-label mb-5 text-white/35">
                  Reset protocol
                </p>

                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <ShieldCheck
                      size={17}
                      strokeWidth={1.2}
                      className="mt-0.5 shrink-0 text-light-green"
                    />

                    <div>
                      <p className="text-sm text-white/80">
                        Secure password protection
                      </p>
                      <p className="mt-1 text-xs leading-5 text-white/35">
                        Your new password protects access to your account.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Check
                      size={17}
                      strokeWidth={1.5}
                      className="mt-0.5 shrink-0 text-light-green"
                    />

                    <div>
                      <p className="text-sm text-white/80">
                        Time-limited reset link
                      </p>
                      <p className="mt-1 text-xs leading-5 text-white/35">
                        Reset links are designed for one secure password
                        change.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <KeyRound
                      size={17}
                      strokeWidth={1.2}
                      className="mt-0.5 shrink-0 text-light-green"
                    />

                    <div>
                      <p className="text-sm text-white/80">
                        Minimum 8 characters
                      </p>
                      <p className="mt-1 text-xs leading-5 text-white/35">
                        Choose a password you can keep secure.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Footer */}
            <div className="flex items-end justify-between gap-6 border-t border-white/10 pt-5">
              <span className="text-[10px] uppercase tracking-[0.08em] text-white/30">
                FoodBridge / 004
              </span>

              <span className="text-[10px] uppercase tracking-[0.08em] text-white/30">
                Turning surplus into hope.
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================
            RIGHT — FORM
        ========================================================= */}
        <div className="flex min-h-screen items-center justify-center px-6 py-10 md:px-10 lg:px-12 xl:px-20">

          <div className="w-full max-w-xl">

            {/* Mobile brand */}
            <Link
              to="/"
              className="mb-16 flex w-fit items-center gap-3 lg:hidden"
            >
              <div className="flex h-10 w-10 items-center justify-center border border-green bg-green">
                <span className="text-sm font-medium text-white">
                  F
                </span>
              </div>

              <div>
                <p className="text-[15px] font-medium tracking-[-0.02em]">
                  FoodBridge
                </p>

                <p className="mt-0.5 text-[9px] uppercase tracking-[0.14em] text-muted">
                  AI
                </p>
              </div>
            </Link>

            {!success ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Header */}
                <div className="border-b border-line pb-8">
                  <div className="flex items-center gap-3">
                    <span className="fb-label text-green">
                      04 — Reset password
                    </span>

                    {!token && (
                      <span className="text-[10px] uppercase tracking-[0.08em] text-red-500">
                        Invalid link
                      </span>
                    )}
                  </div>

                  <h2 className="mt-6 text-[clamp(3rem,6vw,5.5rem)] font-normal leading-[0.88] tracking-[-0.055em]">
                    SET A NEW
                    <br />
                    PASSWORD.
                  </h2>

                  <p className="mt-7 max-w-md text-base leading-7 text-muted">
                    Create a new password for your FoodBridge account.
                  </p>
                </div>

                {/* Form */}
                <form
                  onSubmit={handleSubmit}
                  className="mt-10"
                >
                  {/* New password */}
                  <div className="border-b border-line pb-7">
                    <label
                      htmlFor="new-password"
                      className="fb-label block text-muted"
                    >
                      New password
                    </label>

                    <div className="relative mt-3">
                      <KeyRound
                        size={17}
                        strokeWidth={1.3}
                        className="absolute left-0 top-1/2 -translate-y-1/2 text-graphite"
                      />

                      <input
                        id="new-password"
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) =>
                          setNewPassword(e.target.value)
                        }
                        placeholder="Enter your new password"
                        autoComplete="new-password"
                        className="w-full border-0 border-b border-line bg-transparent py-4 pl-8 pr-12 text-base text-ink outline-none transition placeholder:text-ash focus:border-green"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(!showPassword)
                        }
                        className="absolute right-0 top-1/2 -translate-y-1/2 text-graphite transition-colors hover:text-green"
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={18} strokeWidth={1.3} />
                        ) : (
                          <Eye size={18} strokeWidth={1.3} />
                        )}
                      </button>
                    </div>

                    <p className="mt-3 text-[11px] uppercase tracking-[0.06em] text-ash">
                      Minimum 8 characters
                    </p>
                  </div>

                  {/* Confirm password */}
                  <div className="mt-7 border-b border-line pb-7">
                    <label
                      htmlFor="confirm-password"
                      className="fb-label block text-muted"
                    >
                      Confirm password
                    </label>

                    <div className="relative mt-3">
                      <KeyRound
                        size={17}
                        strokeWidth={1.3}
                        className="absolute left-0 top-1/2 -translate-y-1/2 text-graphite"
                      />

                      <input
                        id="confirm-password"
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        value={confirmPassword}
                        onChange={(e) =>
                          setConfirmPassword(e.target.value)
                        }
                        placeholder="Confirm your new password"
                        autoComplete="new-password"
                        className="w-full border-0 border-b border-line bg-transparent py-4 pl-8 pr-12 text-base text-ink outline-none transition placeholder:text-ash focus:border-green"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            !showConfirmPassword
                          )
                        }
                        className="absolute right-0 top-1/2 -translate-y-1/2 text-graphite transition-colors hover:text-green"
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} strokeWidth={1.3} />
                        ) : (
                          <Eye size={18} strokeWidth={1.3} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Error */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-7 border-l-2 border-red-500 bg-red-50 px-4 py-4 text-sm leading-6 text-red-600"
                    >
                      {error}
                    </motion.div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="group mt-8 flex w-full items-center justify-between border border-deep-green bg-deep-green px-5 py-4 text-[11px] uppercase tracking-[0.08em] text-white transition-colors hover:bg-green disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span>
                      {loading
                        ? "Updating password..."
                        : "Reset password"}
                    </span>

                    <ArrowRight
                      size={17}
                      strokeWidth={1.2}
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </button>
                </form>

                {/* Back */}
                <Link
                  to="/login"
                  className="fb-arrow mt-8 w-fit text-[11px] uppercase tracking-[0.08em] text-muted transition-colors hover:text-green"
                >
                  <ArrowLeft
                    size={15}
                    strokeWidth={1.2}
                  />
                  Back to login
                </Link>
              </motion.div>
            ) : (
              /* =====================================================
                 SUCCESS STATE
              ===================================================== */
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65 }}
              >
                <div className="border-b border-line pb-8">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center bg-green text-white">
                      <Check
                        size={16}
                        strokeWidth={1.5}
                      />
                    </div>

                    <span className="fb-label text-green">
                      Password updated
                    </span>
                  </div>

                  <h2 className="mt-8 text-[clamp(3.5rem,7vw,6.5rem)] font-normal leading-[0.86] tracking-[-0.06em]">
                    YOU'RE
                    <br />
                    <span className="text-green">ALL SET.</span>
                  </h2>

                  <p className="mt-8 max-w-md text-base leading-7 text-muted md:text-lg md:leading-8">
                    Your FoodBridge password has been successfully
                    updated. You can now sign in with your new password.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="group mt-10 flex w-full items-center justify-between border border-deep-green bg-deep-green px-5 py-4 text-[11px] uppercase tracking-[0.08em] text-white transition-colors hover:bg-green"
                >
                  <span>Continue to login</span>

                  <ArrowRight
                    size={17}
                    strokeWidth={1.2}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </button>

                <Link
                  to="/"
                  className="fb-arrow mt-8 w-fit text-[11px] uppercase tracking-[0.08em] text-muted transition-colors hover:text-green"
                >
                  <ArrowLeft
                    size={15}
                    strokeWidth={1.2}
                  />
                  Return home
                </Link>
              </motion.div>
            )}

            {/* Bottom metadata */}
            <div className="mt-14 flex items-center justify-between border-t border-line pt-5">
              <span className="text-[10px] uppercase tracking-[0.08em] text-ash">
                FoodBridge AI
              </span>

              <span className="text-[10px] uppercase tracking-[0.08em] text-ash">
                2026
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}