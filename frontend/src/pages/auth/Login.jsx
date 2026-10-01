import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Heart,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

const Login = () => {
  const navigate = useNavigate();

  const API_URL = "https://foodbridge-ai-qj9q.onrender.com";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // NORMAL LOGIN
  // =========================

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Login failed.");
      }

      // =========================
      // SAVE TOKEN
      // =========================

      localStorage.setItem(
        "access_token",
        data.access_token
      );

      // =========================
      // SAVE USER
      // =========================

      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      // =========================
      // GET USER ROLE
      // =========================

      const userRole =
        data.user?.role ||
        data.role;

      // =========================
      // REDIRECT USER
      // =========================

      if (userRole === "donor") {
        navigate("/donor-dashboard");
      } else if (userRole === "recipient") {
        navigate("/recipient-dashboard");
      } else if (userRole === "volunteer") {
        navigate("/volunteer-dashboard");
      } else if (userRole === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/");
      }

    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Something went wrong. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // GOOGLE LOGIN
  // =========================

  const handleGoogleLogin = () => {
    try {
      setGoogleLoading(true);
      setError("");

      window.location.href =
        `${API_URL}/auth/google/login?role=donor`;

    } catch (error) {
      console.error(error);

      setGoogleLoading(false);

      setError(
        "Unable to continue with Google. Please try again."
      );
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
            to="/"
            className="fb-arrow text-[10px] uppercase tracking-[0.08em] text-muted transition-colors hover:text-green"
          >
            <ArrowLeft
              size={14}
              strokeWidth={1.2}
            />

            Back to home
          </Link>

        </div>
      </header>


      {/* =====================================================
          MAIN AUTH LAYOUT
      ====================================================== */}

      <main className="mx-auto grid min-h-[calc(100vh-73px)] max-w-[1400px] lg:grid-cols-[0.95fr_1.05fr]">

        {/* =================================================
            LEFT IMAGE / MESSAGE
        ================================================== */}

        <section className="relative hidden overflow-hidden border-r border-line lg:block">

          <img
            src="/aaa.png"
            alt="FoodBridge community food support"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/45" />

          <div className="absolute inset-x-0 bottom-0 p-10 xl:p-12">

            <div className="max-w-xl text-white">

              <div className="mb-10 flex items-center justify-between border-b border-white/20 pb-5">
                <span className="text-[10px] uppercase tracking-[0.1em] text-white/60">
                  FoodBridge / Access
                </span>

                <Heart
                  size={16}
                  strokeWidth={1.2}
                  className="text-light-green"
                />
              </div>

              <p className="text-[10px] uppercase tracking-[0.1em] text-light-green">
                Welcome back
              </p>

              <h1 className="mt-5 max-w-lg text-[clamp(3rem,5vw,5.8rem)] font-normal leading-[0.88] tracking-[-0.055em]">
                GOOD FOOD
                <br />
                SHOULD
                <br />
                <span className="text-light-green">
                  MOVE.
                </span>
              </h1>

              <p className="mt-8 max-w-md text-sm leading-7 text-white/65">
                Return to the FoodBridge network and continue
                connecting surplus food with people and communities
                that need it.
              </p>

              <div className="mt-10 flex items-center gap-3 text-[10px] uppercase tracking-[0.08em] text-white/45">
                <ShieldCheck
                  size={14}
                  strokeWidth={1.2}
                  className="text-light-green"
                />

                Secure platform access
              </div>

            </div>

          </div>

          <div className="absolute left-10 top-10 xl:left-12">
            <p className="text-[10px] uppercase tracking-[0.1em] text-white/50">
              01 — Sign in
            </p>
          </div>

        </section>


        {/* =================================================
            RIGHT LOGIN FORM
        ================================================== */}

        <section className="flex items-center px-6 py-14 sm:px-10 md:px-16 lg:px-20 xl:px-24">

          <div className="w-full max-w-xl">

            {/* MOBILE LABEL */}

            <div className="mb-14 lg:hidden">
              <p className="fb-label text-green">
                01 — Sign in
              </p>
            </div>


            {/* INTRO */}

            <div className="border-b border-line pb-10">

              <p className="fb-label text-green">
                Your FoodBridge account
              </p>

              <h2 className="mt-5 text-[clamp(3rem,7vw,5.5rem)] font-normal leading-[0.88] tracking-[-0.055em]">
                WELCOME
                <br />
                <span className="text-green">
                  BACK.
                </span>
              </h2>

              <p className="mt-7 max-w-md text-sm leading-7 text-muted md:text-base">
                Sign in to manage donations, connect with
                communities, coordinate deliveries, and continue
                making an impact.
              </p>

            </div>


            {/* ERROR */}

            {error && (
              <div className="border-b border-red-300 bg-red-50 px-4 py-4 text-sm leading-6 text-red-700">
                {error}
              </div>
            )}


            {/* GOOGLE */}

            <div className="border-b border-line py-8">

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={googleLoading || loading}
                className="
                  group
                  flex
                  w-full
                  items-center
                  justify-between
                  border
                  border-line
                  px-5
                  py-4
                  text-left
                  transition-colors
                  hover:border-ink
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >

                <span className="flex items-center gap-4">

                  <span className="flex h-7 w-7 items-center justify-center border border-line">
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fill="#4285F4"
                        d="M21.35 12.27c0-.71-.06-1.39-.18-2.05H12v3.88h5.24a4.48 4.48 0 0 1-1.94 2.94v2.44h3.14c1.84-1.69 2.91-4.18 2.91-7.21Z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 21.75c2.63 0 4.84-.87 6.45-2.36l-3.14-2.44c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.52A9.75 9.75 0 0 0 12 21.75Z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M6.54 13.84a5.86 5.86 0 0 1 0-3.68V7.64H3.3a9.75 9.75 0 0 0 0 8.72l3.24-2.52Z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 6.13c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.84 3.22 14.63 2.25 12 2.25A9.75 9.75 0 0 0 3.3 7.64l3.24 2.52C7.31 7.85 9.46 6.13 12 6.13Z"
                      />
                    </svg>
                  </span>

                  <span className="text-sm">
                    {googleLoading
                      ? "Connecting to Google..."
                      : "Continue with Google"}
                  </span>

                </span>

                <ArrowRight
                  size={15}
                  strokeWidth={1.2}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />

              </button>

            </div>


            {/* FORM */}

            <form
              onSubmit={handleLogin}
              className="pt-8"
            >

              {/* EMAIL */}

              <div className="border-b border-line pb-6">

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
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                    className="
                      w-full
                      border-0
                      border-b
                      border-transparent
                      bg-transparent
                      px-8
                      py-2
                      text-base
                      text-ink
                      outline-none
                      placeholder:text-ash
                      focus:border-green
                    "
                  />

                </div>

              </div>


              {/* PASSWORD */}

              <div className="border-b border-line py-6">

                <div className="flex items-center justify-between">

                  <label
                    htmlFor="password"
                    className="fb-label text-muted"
                  >
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-[10px] uppercase tracking-[0.06em] text-green transition-colors hover:text-deep-green"
                  >
                    Forgot password?
                  </Link>

                </div>

                <div className="relative mt-4">

                  <LockKeyhole
                    size={17}
                    strokeWidth={1.2}
                    className="absolute left-0 top-1/2 -translate-y-1/2 text-graphite"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    className="
                      w-full
                      border-0
                      border-b
                      border-transparent
                      bg-transparent
                      px-8
                      py-2
                      pr-12
                      text-base
                      text-ink
                      outline-none
                      placeholder:text-ash
                      focus:border-green
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="
                      absolute
                      right-0
                      top-1/2
                      -translate-y-1/2
                      text-graphite
                      transition-colors
                      hover:text-green
                    "
                  >
                    {showPassword ? (
                      <EyeOff size={18} strokeWidth={1.2} />
                    ) : (
                      <Eye size={18} strokeWidth={1.2} />
                    )}
                  </button>

                </div>

              </div>


              {/* SUBMIT */}

              <div className="pt-8">

                <button
                  type="submit"
                  disabled={loading || googleLoading}
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
                      ? "Logging in..."
                      : "Login to FoodBridge"}
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


            {/* REGISTER */}

            <div className="mt-10 border-t border-line pt-7">

              <p className="text-sm text-muted">

                Don't have an account?

                <Link
                  to="/register"
                  className="ml-2 text-green transition-colors hover:text-deep-green"
                >
                  Create an account →
                </Link>

              </p>

            </div>


            {/* SECURITY */}

            <div className="mt-10 flex items-center gap-3 border-t border-line pt-5">

              <ShieldCheck
                size={14}
                strokeWidth={1.2}
                className="text-green"
              />

              <p className="text-[10px] uppercase tracking-[0.07em] text-ash">
                Secure access to your FoodBridge account
              </p>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
};

export default Login;
