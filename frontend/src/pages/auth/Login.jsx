import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  HeartHandshake,
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
  const [error, setError] = useState("");

  // =========================
  // LOGIN
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

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#f3f4f2]">

      {/* =========================
          FADED BACKGROUND IMAGE
      ========================== */}

      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/aaa.png')",
          backgroundPosition: "center",
        }}
      />

      {/* WHITE FADE */}

      <div className="absolute inset-0 bg-white/80" />

      {/* SOFT BLUR */}

      <div className="absolute inset-0 backdrop-blur-sm" />


      {/* =========================
          AUTH HEADER
      ========================== */}

      <header className="absolute top-0 left-0 right-0 z-50">

        <div
          className="
            mx-auto
            flex
            max-w-7xl
            items-center
            justify-between
            px-5
            py-5
            sm:px-8
          "
        >

          {/* BRAND */}

          <Link
            to="/"
            className="flex items-center gap-3 group"
          >

            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-white
                border
                border-gray-200
                shadow-sm
                transition
                group-hover:shadow-md
              "
            >
              <HeartHandshake
                size={20}
                className="text-green-700"
              />
            </div>

            <div className="leading-tight">

              <p
                className="
                  text-base
                  font-bold
                  tracking-tight
                  text-gray-900
                "
              >
                FoodBridge{" "}
                <span className="text-green-600">
                  AI
                </span>
              </p>

              <p
                className="
                  hidden
                  text-[11px]
                  text-gray-500
                  sm:block
                "
              >
                Turning Surplus Into Hope
              </p>

            </div>

          </Link>


          {/* BACK TO HOME */}

          <Link
            to="/"
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              border
              border-gray-200
              bg-white/90
              px-4
              py-2.5
              text-sm
              font-medium
              text-gray-600
              shadow-sm
              backdrop-blur-md
              transition
              hover:border-green-200
              hover:bg-white
              hover:text-green-700
              hover:shadow-md
            "
          >

            <ArrowLeft size={16} />

            <span className="hidden sm:inline">
              Back to Home
            </span>

            <span className="sm:hidden">
              Home
            </span>

          </Link>

        </div>

      </header>


      {/* =========================
          MAIN PAGE
      ========================== */}

      <div
        className="
          relative
          z-10
          min-h-screen
          flex
          items-center
          justify-center
          px-4
          py-24
        "
      >

        {/* LOGIN CARD */}

        <div
          className="
            w-full
            max-w-5xl
            min-h-[600px]
            grid
            lg:grid-cols-2
            overflow-hidden
            rounded-[28px]
            bg-white
            shadow-2xl
            shadow-gray-900/10
            border
            border-white
          "
        >

          {/* =========================
              LEFT IMAGE SECTION
          ========================== */}

          <div
            className="
              relative
              hidden
              lg:block
              bg-cover
              bg-center
              overflow-hidden
            "
            style={{
              backgroundImage:
                "url('/aaa.png')",
              backgroundPosition:
                "22% center",
            }}
          >

            {/* IMAGE OVERLAY */}

            <div
              className="
                absolute
                inset-0
                bg-gradient-to-t
                from-black/85
                via-black/45
                to-black/10
              "
            />

            {/* AI BADGE */}

            <div
              className="
                absolute
                top-9
                left-9
                inline-flex
                items-center
                gap-2
                px-4
                py-2
                rounded-full
                bg-white/20
                backdrop-blur-md
                border
                border-white/20
                text-white
                text-sm
              "
            >

              <HeartHandshake
                size={16}
                className="text-green-300"
              />

              AI-powered food rescue

            </div>


            {/* LEFT CONTENT */}

            <div
              className="
                absolute
                bottom-0
                left-0
                right-0
                p-10
                text-white
              "
            >

              <div
                className="
                  w-12
                  h-12
                  mb-6
                  rounded-xl
                  bg-green-600
                  flex
                  items-center
                  justify-center
                  shadow-lg
                "
              >
                <HeartHandshake size={24} />
              </div>

              <h1
                className="
                  text-4xl
                  font-bold
                  leading-[1.15]
                  tracking-tight
                  max-w-md
                "
              >
                Turning surplus food into
                meaningful impact.
              </h1>

              <p
                className="
                  mt-5
                  max-w-md
                  text-[15px]
                  leading-7
                  text-gray-200
                "
              >
                FoodBridge AI connects food donors with
                organizations that need it most — using
                intelligent matching to reduce waste and
                feed communities.
              </p>

              <div
                className="
                  flex
                  items-center
                  gap-2
                  mt-7
                  text-sm
                  text-gray-200
                "
              >

                <ShieldCheck
                  size={17}
                  className="text-green-400"
                />

                Building a stronger, hunger-free community.

              </div>

            </div>

          </div>


          {/* =========================
              RIGHT LOGIN SECTION
          ========================== */}

          <div
            className="
              flex
              items-center
              justify-center
              bg-white
              px-7
              py-12
              sm:px-12
              lg:px-16
            "
          >

            <div className="w-full max-w-md">

              {/* LOGO */}

              <div className="flex justify-center">

                <div
                  className="
                    w-14
                    h-14
                    rounded-2xl
                    bg-green-50
                    flex
                    items-center
                    justify-center
                    border
                    border-green-100
                  "
                >

                  <HeartHandshake
                    size={27}
                    className="text-green-700"
                  />

                </div>

              </div>


              {/* BRAND */}

              <h1
                className="
                  mt-5
                  text-center
                  text-[25px]
                  font-bold
                  tracking-tight
                  text-gray-900
                "
              >

                FoodBridge{" "}

                <span className="text-green-600">
                  AI
                </span>

              </h1>


              {/* WELCOME */}

              <div className="text-center mt-4">

                <h2
                  className="
                    text-xl
                    font-semibold
                    text-gray-800
                  "
                >
                  Welcome Back 👋
                </h2>

                <p
                  className="
                    mt-2
                    text-sm
                    text-gray-500
                  "
                >
                  Login to continue making an impact.
                </p>

              </div>


              {/* ERROR */}

              {error && (

                <div
                  className="
                    mt-6
                    rounded-lg
                    border
                    border-red-200
                    bg-red-50
                    px-4
                    py-3
                    text-sm
                    text-red-600
                  "
                >
                  {error}
                </div>

              )}


              {/* LOGIN FORM */}

              <form
                onSubmit={handleLogin}
                className="mt-8 space-y-5"
              >

                {/* EMAIL */}

                <div>

                  <label
                    className="
                      block
                      mb-2
                      text-sm
                      font-medium
                      text-gray-700
                    "
                  >
                    Email Address
                  </label>

                  <div className="relative">

                    <Mail
                      size={18}
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                      "
                    />

                    <input
                      type="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      placeholder="Enter your email"
                      required
                      className="
                        w-full
                        rounded-xl
                        border
                        border-gray-200
                        bg-white
                        px-4
                        pl-11
                        py-3.5
                        text-sm
                        text-gray-800
                        outline-none
                        placeholder:text-gray-400
                        transition
                        focus:border-green-500
                        focus:ring-4
                        focus:ring-green-100
                      "
                    />

                  </div>

                </div>


                {/* PASSWORD */}

                <div>

                  <div className="mb-2 flex items-center justify-between">

                    <label
                      className="
                        block
                        text-sm
                        font-medium
                        text-gray-700
                      "
                    >
                      Password
                    </label>

                    {/* FORGOT PASSWORD */}

                    <Link
                      to="/forgot-password"
                      className="
                        text-sm
                        font-semibold
                        text-green-700
                        transition
                        hover:text-green-800
                        hover:underline
                      "
                    >
                      Forgot password?
                    </Link>

                  </div>

                  <div className="relative">

                    <LockKeyhole
                      size={18}
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                      "
                    />

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      placeholder="Enter your password"
                      required
                      className="
                        w-full
                        rounded-xl
                        border
                        border-gray-200
                        bg-white
                        px-4
                        pl-11
                        pr-12
                        py-3.5
                        text-sm
                        text-gray-800
                        outline-none
                        placeholder:text-gray-400
                        transition
                        focus:border-green-500
                        focus:ring-4
                        focus:ring-green-100
                      "
                    />

                    {/* SHOW PASSWORD */}

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      className="
                        absolute
                        right-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                        hover:text-green-600
                        transition
                      "
                    >

                      {showPassword ? (
                        <EyeOff size={19} />
                      ) : (
                        <Eye size={19} />
                      )}

                    </button>

                  </div>

                </div>


                {/* LOGIN BUTTON */}

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    w-full
                    rounded-xl
                    bg-[#10963f]
                    py-3.5
                    text-sm
                    font-semibold
                    text-white
                    shadow-md
                    transition
                    hover:bg-green-700
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >

                  {loading
                    ? "Logging in..."
                    : "Login"}

                </button>

              </form>


              {/* REGISTER */}

              <p
                className="
                  mt-7
                  text-center
                  text-sm
                  text-gray-500
                "
              >

                Don't have an account?{" "}

                <Link
                  to="/register"
                  className="
                    font-semibold
                    text-green-700
                    hover:text-green-800
                  "
                >
                  Create an account
                </Link>

              </p>


              {/* SECURITY NOTE */}

              <div
                className="
                  mt-8
                  flex
                  items-center
                  justify-center
                  gap-2
                  text-xs
                  text-gray-400
                "
              >

                <ShieldCheck size={14} />

                Secure access to your FoodBridge account

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;

