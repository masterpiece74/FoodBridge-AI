import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Mail,
  ShieldCheck,
} from "lucide-react";

const API_URL = "https://foodbridge-ai-qj9q.onrender.com";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resetLink, setResetLink] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess(false);
    setResetLink("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail || "Unable to process your request. Please try again."
        );
      }

      setSuccess(true);

      // Development mode:
      // The backend currently returns the reset link directly.
      if (data.reset_link) {
        setResetLink(data.reset_link);
      }
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
                Secure access to your FoodBridge account.
              </h1>

              <p className="mt-6 text-white/70 text-lg leading-relaxed">
                Forgot your password? No problem. We'll help you get back
                into your account securely.
              </p>

              <div className="mt-10 space-y-4">
                <div className="flex items-center gap-3 text-white/80">
                  <ShieldCheck size={20} className="text-[#A7D7B8]" />
                  <span>Secure password recovery</span>
                </div>

                <div className="flex items-center gap-3 text-white/80">
                  <Mail size={20} className="text-[#A7D7B8]" />
                  <span>Reset instructions linked to your email</span>
                </div>

                <div className="flex items-center gap-3 text-white/80">
                  <CheckCircle2 size={20} className="text-[#A7D7B8]" />
                  <span>Get back to connecting surplus with communities</span>
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
                    PASSWORD RECOVERY
                  </p>

                  <h2 className="text-3xl font-bold text-[#0B2F1A]">
                    Forgot your password?
                  </h2>

                  <p className="mt-3 text-gray-500 leading-relaxed">
                    Enter the email address associated with your account and
                    we'll help you reset your password.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-[#0B2F1A] mb-2">
                      Email address
                    </label>

                    <div className="relative">
                      <Mail
                        size={19}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        autoComplete="email"
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white outline-none transition focus:border-[#1F7A4D] focus:ring-4 focus:ring-[#1F7A4D]/10"
                      />
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
                      "Sending..."
                    ) : (
                      <>
                        Send Reset Instructions
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

                <h2 className="text-3xl font-bold text-[#0B2F1A]">
                  Check your email
                </h2>

                <p className="mt-4 text-gray-500 leading-relaxed">
                  If an account exists with{" "}
                  <span className="font-semibold text-[#0B2F1A]">
                    {email}
                  </span>
                  , password reset instructions have been generated.
                </p>

                {/* Development-only reset link */}
                {resetLink && (
                  <div className="mt-7 rounded-xl border border-[#A7D7B8] bg-[#F0F9F3] p-4 text-left">
                    <p className="text-xs font-semibold text-[#14532D] mb-2">
                      DEVELOPMENT RESET LINK
                    </p>

                    <a
                      href={resetLink}
                      className="text-sm text-[#1F7A4D] underline break-all"
                    >
                      {resetLink}
                    </a>
                  </div>
                )}

                <Link
                  to="/login"
                  className="mt-8 inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#1F7A4D] hover:bg-[#14532D] text-white font-semibold transition"
                >
                  Back to Login
                  <ArrowRight size={18} />
                </Link>
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

