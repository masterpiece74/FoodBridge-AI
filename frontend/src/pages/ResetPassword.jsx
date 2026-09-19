import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
} from "lucide-react";

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
    <div className="min-h-screen bg-[#FAFAF7] text-[#0B2F1A]">
      <div className="min-h-screen flex">

        {/* Left Side */}
        <div className="hidden lg:flex lg:w-1/2 bg-[#0B2F1A] relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#1F7A4D]/30 blur-3xl" />
            <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#A7D7B8]/10 blur-3xl" />
          </div>

          <div className="relative z-10 flex flex-col justify-between w-full p-12 xl:p-16">

            <Link
              to="/"
              className="inline-flex items-center gap-2 text-white text-xl font-bold w-fit"
            >
              <div className="w-10 h-10 rounded-xl bg-[#1F7A4D] flex items-center justify-center">
                <span className="text-white font-bold">F</span>
              </div>

              FoodBridge
            </Link>

            <div className="max-w-lg">

              <div className="w-16 h-16 rounded-2xl bg-[#1F7A4D] flex items-center justify-center mb-7">
                <KeyRound size={30} className="text-white" />
              </div>

              <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
                Create a new password.
              </h1>

              <p className="mt-6 text-white/70 text-lg leading-relaxed">
                Choose a strong password to keep your FoodBridge account
                secure.
              </p>

              <div className="mt-10 space-y-4">

                <div className="flex items-center gap-3 text-white/80">
                  <ShieldCheck
                    size={20}
                    className="text-[#A7D7B8]"
                  />
                  <span>Secure password protection</span>
                </div>

                <div className="flex items-center gap-3 text-white/80">
                  <CheckCircle2
                    size={20}
                    className="text-[#A7D7B8]"
                  />
                  <span>Your reset link is time-limited</span>
                </div>

                <div className="flex items-center gap-3 text-white/80">
                  <KeyRound
                    size={20}
                    className="text-[#A7D7B8]"
                  />
                  <span>Use at least 8 characters</span>
                </div>

              </div>
            </div>

            <p className="text-white/40 text-sm">
              Turning Surplus Into Hope.
            </p>

          </div>
        </div>

        {/* Right Side */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">

            {/* Mobile Logo */}
            <Link
              to="/"
              className="lg:hidden flex items-center gap-2 text-[#0B2F1A] text-xl font-bold mb-12"
            >
              <div className="w-10 h-10 rounded-xl bg-[#1F7A4D] flex items-center justify-center">
                <span className="text-white font-bold">F</span>
              </div>

              FoodBridge
            </Link>

            {!success ? (
              <>
                <div className="mb-8">

                  <p className="text-[#1F7A4D] font-semibold text-sm mb-3">
                    RESET PASSWORD
                  </p>

                  <h2 className="text-3xl font-bold text-[#0B2F1A]">
                    Set a new password
                  </h2>

                  <p className="mt-3 text-gray-500 leading-relaxed">
                    Create a new password for your FoodBridge account.
                  </p>

                </div>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-semibold text-[#0B2F1A] mb-2">
                      New password
                    </label>

                    <div className="relative">

                      <KeyRound
                        size={19}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) =>
                          setNewPassword(e.target.value)
                        }
                        placeholder="Enter your new password"
                        autoComplete="new-password"
                        className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-gray-200 bg-white outline-none transition focus:border-[#1F7A4D] focus:ring-4 focus:ring-[#1F7A4D]/10"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(!showPassword)
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1F7A4D]"
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={19} />
                        ) : (
                          <Eye size={19} />
                        )}
                      </button>

                    </div>

                    <p className="mt-2 text-xs text-gray-400">
                      Use at least 8 characters.
                    </p>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-semibold text-[#0B2F1A] mb-2">
                      Confirm new password
                    </label>

                    <div className="relative">

                      <KeyRound
                        size={19}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
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
                        className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-gray-200 bg-white outline-none transition focus:border-[#1F7A4D] focus:ring-4 focus:ring-[#1F7A4D]/10"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            !showConfirmPassword
                          )
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1F7A4D]"
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={19} />
                        ) : (
                          <Eye size={19} />
                        )}
                      </button>

                    </div>
                  </div>

                  {error && (
                    <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#1F7A4D] hover:bg-[#14532D] text-white font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      "Updating Password..."
                    ) : (
                      <>
                        Reset Password
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>

                </form>

                <Link
                  to="/login"
                  className="mt-8 flex items-center justify-center gap-2 text-sm font-semibold text-[#1F7A4D] hover:text-[#14532D]"
                >
                  <ArrowLeft size={16} />
                  Back to Login
                </Link>
              </>
            ) : (
              <div className="text-center">

                <div className="w-16 h-16 rounded-full bg-[#E8F5ED] flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2
                    size={32}
                    className="text-[#1F7A4D]"
                  />
                </div>

                <p className="text-[#1F7A4D] font-semibold text-sm mb-3">
                  PASSWORD UPDATED
                </p>

                <h2 className="text-3xl font-bold text-[#0B2F1A]">
                  You're all set!
                </h2>

                <p className="mt-4 text-gray-500 leading-relaxed">
                  Your FoodBridge password has been successfully updated.
                  You can now sign in with your new password.
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="mt-8 inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#1F7A4D] hover:bg-[#14532D] text-white font-semibold transition"
                >
                  Continue to Login
                  <ArrowRight size={18} />
                </button>

              </div>
            )}

            <p className="text-center text-xs text-gray-400 mt-10">
              © 2026 FoodBridge AI · Turning Surplus Into Hope
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}
