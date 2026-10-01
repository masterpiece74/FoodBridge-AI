import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Heart,
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
      const response = await fetch(
        `${API_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            "Unable to process your request. Please try again."
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
        err.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper text-ink">

      {/* =====================================================
          TOP BAR
      ====================================================== */}

      <header className="border-b border-line">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 md:px-10 lg:px-12">

          <Link
            to="/"
            className="group flex items-center gap-3"
          >
            <div className="flex h-8 w-8 items-center justify-center border border-line">
              <Heart
                size={15}
                strokeWidth={1.3}
                className="text-green"
              />
            </div>

            <div>
              <p className="text-sm font-medium tracking-[-0.02em]">
                FoodBridge
                <span className="text-green">AI</span>
              </p>

              <p className="hidden text-[9px] uppercase tracking-[0.08em] text-muted sm:block">
                Turning surplus into hope
              </p>
            </div>
          </Link>

          <Link
            to="/login"
            className="fb-arrow text-[10px] uppercase tracking-[0.08em] text-muted transition-colors hover:text-green"
          >
            <ArrowLeft
              size={14}
              strokeWidth={1.2}
            />
            Back to login
          </Link>

        </div>
      </header>


      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="mx-auto grid min-h-[calc(100vh-73px)] max-w-[1400px] lg:grid-cols-[0.9fr_1.1fr]">

        {/* =================================================
            LEFT IMAGE / MESSAGE
        ================================================== */}

        <section className="relative hidden overflow-hidden border-r border-line lg:block">

          <img
            src="/aaa.png"
            alt="FoodBridge community food support"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/50" />

          <div className="absolute left-10 top-10 xl:left-12">
            <p className="text-[10px] uppercase tracking-[0.1em] text-white/50">
              03 — Account recovery
            </p>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-10 xl:p-12">

            <div className="max-w-xl text-white">

              <div className="mb-10 flex items-center justify-between border-b border-white/20 pb-5">

                <span className="text-[10px] uppercase tracking-[0.1em] text-white/55">
                  FoodBridge / Security
                </span>

                <KeyRound
                  size={16}
                  strokeWidth={1.2}
                  className="text-light-green"
                />

              </div>

              <p className="text-[10px] uppercase tracking-[0.1em] text-light-green">
                Access can be restored
              </p>

              <h1 className="mt-5 text-[clamp(3rem,5vw,5.8rem)] font-normal leading-[0.88] tracking-[-0.055em]">
                FIND YOUR
                <br />
                WAY
                <br />
                <span className="text-light-green">
                  BACK.
                </span>
              </h1>

              <p className="mt-8 max-w-md text-sm leading-7 text-white/65">
                Enter the email connected to your FoodBridge account
                and we'll help you recover access securely.
              </p>

              <div className="mt-10 grid gap-4 border-t border-white/20 pt-6">

                <div className="flex items-center gap-3">

                  <ShieldCheck
                    size={15}
                    strokeWidth={1.2}
                    className="text-light-green"
                  />

                  <span className="text-[10px] uppercase tracking-[0.08em] text-white/55">
                    Secure recovery
                  </span>

                </div>

                <div className="flex items-center gap-3">

                  <Mail
                    size={15}
                    strokeWidth={1.2}
                    className="text-light-green"
                  />

                  <span className="text-[10px] uppercase tracking-[0.08em] text-white/55">
                    Email-based reset
                  </span>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            RIGHT FORM
        ================================================== */}

        <section className="flex items-center px-6 py-14 sm:px-10 md:px-16 lg:px-20 xl:px-24">

          <div className="w-full max-w-xl">

            {/* MOBILE LABEL */}

            <div className="mb-14 lg:hidden">

              <p className="fb-label text-green">
                03 — Account recovery
              </p>

            </div>


            {!success ? (
              <>

                {/* INTRO */}

                <div className="border-b border-line pb-10">

                  <p className="fb-label text-green">
                    Password recovery
                  </p>

                  <h2 className="mt-5 text-[clamp(3rem,7vw,5.5rem)] font-normal leading-[0.88] tracking-[-0.055em]">
                    FIND YOUR
                    <br />
                    <span className="text-green">
                      WAY BACK.
                    </span>
                  </h2>

                  <p className="mt-7 max-w-lg text-sm leading-7 text-muted md:text-base">
                    Enter the email address associated with your
                    FoodBridge account and we'll help you reset your
                    password.
                  </p>

                </div>


                {/* ERROR */}

                {error && (
                  <div className="border-b border-red-300 bg-red-50 px-4 py-4 text-sm leading-6 text-red-700">
                    {error}
                  </div>
                )}


                {/* FORM */}

                <form
                  onSubmit={handleSubmit}
                  className="pt-8"
                >

                  <div className="border-b border-line pb-7">

                    <label
                      htmlFor="email"
                      className="fb-label text-muted"
                    >
                      Email address
                    </label>

                    <div className="relative mt-4">

                      <Mail
                        size={17}
                        strokeWidth={1.2}
                        className="absolute left-0 top-1/2 -translate-y-1/2 text-graphite"
                      />

                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) =>
                          setEmail(e.target.value)
                        }
                        placeholder="you@example.com"
                        autoComplete="email"
                        required
                        className="
                          w-full
                          border-0
                          border-b
                          border-line
                          bg-transparent
                          px-8
                          py-3
                          text-base
                          text-ink
                          outline-none
                          placeholder:text-ash
                          focus:border-green
                        "
                      />

                    </div>

                  </div>


                  {/* SECURITY NOTE */}

                  <div className="flex items-start gap-3 border-b border-line py-6">

                    <ShieldCheck
                      size={15}
                      strokeWidth={1.2}
                      className="mt-0.5 shrink-0 text-green"
                    />

                    <p className="text-xs leading-6 text-muted">
                      We'll use your email to generate a secure
                      password reset process for your account.
                    </p>

                  </div>


                  {/* SUBMIT */}

                  <div className="pt-8">

                    <button
                      type="submit"
                      disabled={loading}
                      className="
                        group
                        flex
                        w-full
                        items-center
                        justify-between
                        bg-deep-green
                        px-5
                        py-4
                        text-[11px]
                        uppercase
                        tracking-[0.08em]
                        text-white
                        transition-colors
                        hover:bg-green
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                      "
                    >

                      <span>
                        {loading
                          ? "Sending reset instructions..."
                          : "Send reset instructions"}
                      </span>

                      {!loading && (
                        <ArrowRight
                          size={16}
                          strokeWidth={1.2}
                          className="transition-transform duration-200 group-hover:translate-x-1"
                        />
                      )}

                    </button>

                  </div>

                </form>


                {/* LOGIN */}

                <div className="mt-10 border-t border-line pt-7">

                  <Link
                    to="/login"
                    className="fb-arrow text-sm text-muted transition-colors hover:text-green"
                  >
                    <ArrowLeft
                      size={14}
                      strokeWidth={1.2}
                    />
                    Back to login
                  </Link>

                </div>

              </>
            ) : (

              /* =================================================
                 SUCCESS STATE
              ================================================== */

              <div>

                <div className="border-b border-line pb-10">

                  <div className="flex h-14 w-14 items-center justify-center border border-green bg-light-green">

                    <CheckCircle2
                      size={25}
                      strokeWidth={1.2}
                      className="text-green"
                    />

                  </div>

                  <p className="fb-label mt-10 text-green">
                    Recovery request received
                  </p>

                  <h2 className="mt-5 text-[clamp(3rem,7vw,5.5rem)] font-normal leading-[0.88] tracking-[-0.055em]">
                    CHECK
                    <br />
                    YOUR
                    <br />
                    <span className="text-green">
                      EMAIL.
                    </span>
                  </h2>

                  <p className="mt-7 max-w-lg text-sm leading-7 text-muted md:text-base">
                    If an account exists with{" "}
                    <span className="font-medium text-ink">
                      {email}
                    </span>
                    , password reset instructions have been
                    generated.
                  </p>

                </div>


                {/* DEVELOPMENT RESET LINK */}

                {resetLink && (
                  <div className="border-b border-line py-7">

                    <p className="fb-label text-green">
                      Development reset link
                    </p>

                    <div className="mt-4 border border-line bg-light-green/30 p-4">

                      <a
                        href={resetLink}
                        className="block break-all text-sm leading-6 text-green underline decoration-green/40 underline-offset-4 transition-colors hover:text-deep-green"
                      >
                        {resetLink}
                      </a>

                    </div>

                    <p className="mt-3 text-[10px] uppercase tracking-[0.06em] text-ash">
                      Visible because the current backend returns
                      the reset link directly.
                    </p>

                  </div>
                )}


                {/* RETURN TO LOGIN */}

                <div className="pt-8">

                  <Link
                    to="/login"
                    className="
                      group
                      flex
                      w-full
                      items-center
                      justify-between
                      bg-deep-green
                      px-5
                      py-4
                      text-[11px]
                      uppercase
                      tracking-[0.08em]
                      text-white
                      transition-colors
                      hover:bg-green
                    "
                  >

                    <span>
                      Back to login
                    </span>

                    <ArrowRight
                      size={16}
                      strokeWidth={1.2}
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />

                  </Link>

                </div>


                <div className="mt-10 border-t border-line pt-6">

                  <p className="text-[10px] uppercase tracking-[0.07em] text-ash">
                    FoodBridge AI / Account recovery
                  </p>

                </div>

              </div>

            )}

          </div>

        </section>

      </main>

    </div>
  );
}