import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  LockKeyhole,
  HeartHandshake,
  ShieldCheck,
  CheckCircle2,
  Building2,
  HandHeart,
  Truck,
  Sparkles,
} from "lucide-react";

const Register = () => {
  const navigate = useNavigate();

  const API_URL = "http://127.0.0.1:8000";

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
    role: "donor",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [assistantMessage, setAssistantMessage] = useState(
    "Choose how you want to contribute, then we'll guide you through the rest."
  );

  // =========================
  // FORM CHANGE
  // =========================

  const handleChange = (e) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));

    setError("");
  };

  // =========================
  // ROLE SELECTION
  // =========================

  const handleRoleChange = (role) => {
    setFormData((previous) => ({
      ...previous,
      role,
    }));

    setError("");

    if (role === "donor") {
      setAssistantMessage(
        "As a donor, you'll be able to share surplus food with organizations that need it."
      );
    }

    if (role === "recipient") {
      setAssistantMessage(
        "As a recipient, you'll be able to connect your organization with available food donations."
      );
    }

    if (role === "volunteer") {
      setAssistantMessage(
        "As a volunteer, you'll help move donated food from where it is available to where it is needed."
      );
    }
  };

  // =========================
  // PASSWORD STRENGTH
  // =========================

  const getPasswordStrength = () => {
    const password = formData.password;

    if (!password) {
      return {
        label: "",
        width: "0%",
      };
    }

    let score = 0;

    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) {
      return {
        label: "Weak",
        width: "33%",
      };
    }

    if (score <= 4) {
      return {
        label: "Good",
        width: "66%",
      };
    }

    return {
      label: "Strong",
      width: "100%",
    };
  };

  const passwordStrength = getPasswordStrength();

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (formData.password !== formData.confirm_password) {
      setError(
        "Passwords do not match. Please check and try again."
      );
      return;
    }

    if (formData.password.length < 6) {
      setError(
        "Password must be at least 6 characters long."
      );
      return;
    }

    setLoading(true);

    try {
      const registrationData = {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
      };

      const response = await fetch(
        `${API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(registrationData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Registration failed."
        );
      }

      alert(
        "Registration successful! Please log in."
      );

      navigate("/login");
    } catch (error) {
      setError(
        error.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    {
      value: "donor",
      title: "Donor",
      description: "Share surplus food",
      icon: Building2,
    },
    {
      value: "recipient",
      title: "Recipient",
      description: "Receive food support",
      icon: HandHeart,
    },
    {
      value: "volunteer",
      title: "Volunteer",
      description: "Help deliver food",
      icon: Truck,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7F4]">

      {/* =========================================
          TOP NAV
      ========================================== */}

      <header className="border-b border-gray-200 bg-white">

        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">

          {/* Brand */}

          <Link
            to="/"
            className="flex items-center gap-3"
          >

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF6EE] text-[#1F7A4D]">
              <HeartHandshake size={22} />
            </div>

            <div>
              <p className="text-base font-bold tracking-tight text-[#0B2F1A]">
                FoodBridge
                <span className="text-[#1F7A4D]">
                  {" "}AI
                </span>
              </p>

              <p className="hidden text-[11px] text-gray-400 sm:block">
                Turning surplus into hope.
              </p>
            </div>

          </Link>


          {/* Login */}

          <div className="flex items-center gap-3">

            <span className="hidden text-sm text-gray-500 sm:block">
              Already a member?
            </span>

            <Link
              to="/login"
              className="
                rounded-xl
                border
                border-gray-200
                bg-white
                px-4
                py-2.5
                text-sm
                font-semibold
                text-[#1F7A4D]
                transition
                hover:border-[#1F7A4D]
                hover:bg-[#F4FAF6]
              "
            >
              Login
            </Link>

          </div>

        </div>

      </header>


      {/* =========================================
          MAIN
      ========================================== */}

      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-14">

        {/* Back */}

        <button
          onClick={() => navigate(-1)}
          className="
            mb-8
            flex
            items-center
            gap-2
            text-sm
            font-medium
            text-gray-500
            transition
            hover:text-[#1F7A4D]
          "
        >
          <ArrowLeft size={17} />
          Back
        </button>


        {/* =========================================
            CONTENT CARD
        ========================================== */}

        <div
          className="
            grid
            overflow-hidden
            rounded-[30px]
            border
            border-gray-200
            bg-white
            shadow-xl
            shadow-gray-900/[0.06]
            lg:grid-cols-[0.85fr_1.15fr]
          "
        >

          {/* =========================================
              LEFT SIDE
          ========================================== */}

          <section
            className="
              relative
              overflow-hidden
              bg-[#0B2F1A]
              px-7
              py-10
              text-white
              sm:px-10
              lg:px-12
              lg:py-12
            "
          >

            {/* Decorative background */}

            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#1F7A4D]/40" />

            <div className="absolute -bottom-32 -left-28 h-80 w-80 rounded-full bg-[#14532D]/80" />


            {/* Image */}

            <div
              className="
                absolute
                inset-0
                bg-cover
                bg-center
                opacity-[0.12]
              "
              style={{
                backgroundImage: "url('/aaa.png')",
              }}
            />


            <div className="relative z-10 flex h-full flex-col justify-between">

              {/* Top */}

              <div>

                <div
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-white/10
                    bg-white/10
                    px-3
                    py-1.5
                    text-xs
                    font-medium
                    text-green-100
                    backdrop-blur-md
                  "
                >
                  <Sparkles size={14} />

                  Join the FoodBridge community
                </div>


                <h1
                  className="
                    mt-8
                    max-w-md
                    text-4xl
                    font-bold
                    leading-[1.1]
                    tracking-tight
                    sm:text-5xl
                  "
                >
                  Good food
                  <br />
                  should never
                  <br />
                  go to waste.
                </h1>


                <p className="mt-6 max-w-md text-sm leading-7 text-green-50/75">
                  FoodBridge AI brings donors, recipients and
                  volunteers together so surplus food can reach
                  communities that need it.
                </p>

              </div>


              {/* Assistant */}

              <div className="mt-12">

                <div
                  className="
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/[0.08]
                    p-5
                    backdrop-blur-md
                  "
                >

                  <div className="flex items-start gap-4">

                    <div
                      className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-white
                        text-[#1F7A4D]
                        shadow-lg
                      "
                    >
                      <Sparkles size={20} />
                    </div>


                    <div>

                      <div className="flex items-center gap-2">

                        <p className="text-sm font-semibold">
                          FoodBridge Assistant
                        </p>

                        <span className="h-1.5 w-1.5 rounded-full bg-green-300" />

                      </div>

                      <p className="mt-2 text-xs leading-5 text-green-50/70">
                        {assistantMessage}
                      </p>

                    </div>

                  </div>

                </div>


                {/* Impact points */}

                <div className="mt-6 grid grid-cols-2 gap-3">

                  <div className="rounded-xl border border-white/10 bg-white/[0.06] p-4">

                    <HeartHandshake
                      size={19}
                      className="text-green-300"
                    />

                    <p className="mt-3 text-xs font-semibold">
                      Connect
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-green-50/60">
                      Bring people and food together.
                    </p>

                  </div>


                  <div className="rounded-xl border border-white/10 bg-white/[0.06] p-4">

                    <ShieldCheck
                      size={19}
                      className="text-green-300"
                    />

                    <p className="mt-3 text-xs font-semibold">
                      Make impact
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-green-50/60">
                      Help reduce waste and hunger.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </section>


          {/* =========================================
              RIGHT SIDE FORM
          ========================================== */}

          <section className="px-6 py-10 sm:px-10 lg:px-14 lg:py-12">

            <div className="mx-auto max-w-xl">


              {/* Header */}

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#1F7A4D]">
                  Get started
                </p>

                <h2
                  className="
                    mt-2
                    text-3xl
                    font-bold
                    tracking-tight
                    text-[#0B2F1A]
                    sm:text-4xl
                  "
                >
                  Create your account
                </h2>

                <p className="mt-3 max-w-lg text-sm leading-6 text-gray-500">
                  A few details are all you need to join FoodBridge AI.
                </p>

              </div>


              {/* Error */}

              {error && (

                <div
                  className="
                    mt-6
                    rounded-xl
                    border
                    border-red-200
                    bg-red-50
                    px-4
                    py-3
                    text-sm
                    leading-5
                    text-red-700
                  "
                >
                  {error}
                </div>

              )}


              {/* Form */}

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-6"
              >


                {/* =========================================
                    ROLE
                ========================================== */}

                <div>

                  <div className="mb-3 flex items-center justify-between">

                    <label className="text-sm font-semibold text-gray-800">
                      I want to participate as a
                    </label>

                    <span className="text-xs text-gray-400">
                      Choose one
                    </span>

                  </div>


                  <div className="grid gap-3 sm:grid-cols-3">

                    {roles.map((role) => {

                      const Icon = role.icon;

                      const selected =
                        formData.role === role.value;

                      return (

                        <button
                          key={role.value}
                          type="button"
                          onClick={() =>
                            handleRoleChange(role.value)
                          }
                          className={`
                            relative
                            rounded-2xl
                            border
                            p-4
                            text-left
                            transition-all
                            duration-200
                            ${
                              selected
                                ? "border-[#1F7A4D] bg-[#F0F8F3] shadow-sm ring-2 ring-[#A7D7B8]/50"
                                : "border-gray-200 bg-white hover:border-[#A7D7B8] hover:bg-[#FAFCFA]"
                            }
                          `}
                        >

                          {selected && (

                            <CheckCircle2
                              size={17}
                              className="
                                absolute
                                right-3
                                top-3
                                text-[#1F7A4D]
                              "
                            />

                          )}


                          <div
                            className={`
                              flex
                              h-10
                              w-10
                              items-center
                              justify-center
                              rounded-xl
                              transition
                              ${
                                selected
                                  ? "bg-[#1F7A4D] text-white"
                                  : "bg-gray-100 text-gray-500"
                              }
                            `}
                          >
                            <Icon size={19} />
                          </div>


                          <p className="mt-3 text-sm font-semibold text-gray-800">
                            {role.title}
                          </p>

                          <p className="mt-1 text-[11px] leading-5 text-gray-500">
                            {role.description}
                          </p>

                        </button>

                      );

                    })}

                  </div>

                </div>


                {/* =========================================
                    PERSONAL INFORMATION
                ========================================== */}

                <div className="grid gap-5 sm:grid-cols-2">

                  {/* Full Name */}

                  <div className="sm:col-span-2">

                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Full Name
                    </label>

                    <div className="relative">

                      <User
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
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        required
                        placeholder="Enter your full name"
                        className="
                          w-full
                          rounded-xl
                          border
                          border-gray-200
                          bg-white
                          py-3.5
                          pl-11
                          pr-4
                          text-sm
                          text-gray-800
                          outline-none
                          transition
                          placeholder:text-gray-400
                          focus:border-[#1F7A4D]
                          focus:ring-4
                          focus:ring-[#A7D7B8]/30
                        "
                      />

                    </div>

                  </div>


                  {/* Email */}

                  <div>

                    <label className="mb-2 block text-sm font-medium text-gray-700">
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
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="you@example.com"
                        className="
                          w-full
                          rounded-xl
                          border
                          border-gray-200
                          bg-white
                          py-3.5
                          pl-11
                          pr-4
                          text-sm
                          text-gray-800
                          outline-none
                          transition
                          placeholder:text-gray-400
                          focus:border-[#1F7A4D]
                          focus:ring-4
                          focus:ring-[#A7D7B8]/30
                        "
                      />

                    </div>

                  </div>


                  {/* Phone */}

                  <div>

                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>

                    <div className="relative">

                      <Phone
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
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="0800 000 0000"
                        className="
                          w-full
                          rounded-xl
                          border
                          border-gray-200
                          bg-white
                          py-3.5
                          pl-11
                          pr-4
                          text-sm
                          text-gray-800
                          outline-none
                          transition
                          placeholder:text-gray-400
                          focus:border-[#1F7A4D]
                          focus:ring-4
                          focus:ring-[#A7D7B8]/30
                        "
                      />

                    </div>

                  </div>

                </div>


                {/* =========================================
                    PASSWORD
                ========================================== */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Password
                  </label>

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
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Create a secure password"
                      className="
                        w-full
                        rounded-xl
                        border
                        border-gray-200
                        bg-white
                        py-3.5
                        pl-11
                        pr-12
                        text-sm
                        text-gray-800
                        outline-none
                        transition
                        placeholder:text-gray-400
                        focus:border-[#1F7A4D]
                        focus:ring-4
                        focus:ring-[#A7D7B8]/30
                      "
                    />


                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (previous) => !previous
                        )
                      }
                      className="
                        absolute
                        right-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                        transition
                        hover:text-[#1F7A4D]
                      "
                    >
                      {showPassword ? (
                        <EyeOff size={19} />
                      ) : (
                        <Eye size={19} />
                      )}
                    </button>

                  </div>


                  {/* Strength */}

                  {formData.password && (

                    <div className="mt-3">

                      <div className="mb-1.5 flex items-center justify-between">

                        <span className="text-xs text-gray-400">
                          Password strength
                        </span>

                        <span className="text-xs font-semibold text-[#1F7A4D]">
                          {passwordStrength.label}
                        </span>

                      </div>

                      <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">

                        <div
                          className="h-full rounded-full bg-[#1F7A4D] transition-all duration-300"
                          style={{
                            width: passwordStrength.width,
                          }}
                        />

                      </div>

                    </div>

                  )}

                </div>


                {/* =========================================
                    CONFIRM PASSWORD
                ========================================== */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>

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
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      name="confirm_password"
                      value={formData.confirm_password}
                      onChange={handleChange}
                      required
                      placeholder="Confirm your password"
                      className={`
                        w-full
                        rounded-xl
                        border
                        bg-white
                        py-3.5
                        pl-11
                        pr-12
                        text-sm
                        text-gray-800
                        outline-none
                        transition
                        placeholder:text-gray-400
                        focus:ring-4
                        ${
                          formData.confirm_password &&
                          formData.password !==
                            formData.confirm_password
                            ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                            : formData.confirm_password &&
                              formData.password ===
                                formData.confirm_password
                            ? "border-green-400 focus:border-[#1F7A4D] focus:ring-[#A7D7B8]/30"
                            : "border-gray-200 focus:border-[#1F7A4D] focus:ring-[#A7D7B8]/30"
                        }
                      `}
                    />


                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          (previous) => !previous
                        )
                      }
                      className="
                        absolute
                        right-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                        transition
                        hover:text-[#1F7A4D]
                      "
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={19} />
                      ) : (
                        <Eye size={19} />
                      )}
                    </button>

                  </div>


                  {/* Match indicator */}

                  {formData.confirm_password && (

                    <div className="mt-2">

                      {formData.password ===
                      formData.confirm_password ? (

                        <p className="flex items-center gap-1.5 text-xs font-medium text-[#1F7A4D]">

                          <CheckCircle2 size={14} />

                          Passwords match

                        </p>

                      ) : (

                        <p className="text-xs font-medium text-red-500">
                          Passwords do not match
                        </p>

                      )}

                    </div>

                  )}

                </div>


                {/* =========================================
                    TRUST NOTE
                ========================================== */}

                <div
                  className="
                    flex
                    items-start
                    gap-3
                    rounded-xl
                    border
                    border-gray-100
                    bg-[#FAFAF7]
                    px-4
                    py-3
                  "
                >

                  <ShieldCheck
                    size={18}
                    className="mt-0.5 shrink-0 text-[#1F7A4D]"
                  />

                  <p className="text-xs leading-5 text-gray-500">
                    Your account information is securely handled.
                    You can change your role-specific details later.
                  </p>

                </div>


                {/* =========================================
                    SUBMIT
                ========================================== */}

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    group
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-[#1F7A4D]
                    py-4
                    text-sm
                    font-semibold
                    text-white
                    shadow-lg
                    shadow-green-900/10
                    transition
                    hover:bg-[#14532D]
                    hover:shadow-xl
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >

                  {loading ? (

                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />

                      Creating Account...
                    </>

                  ) : (

                    <>
                      Create Account

                      <ArrowRight
                        size={18}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </>

                  )}

                </button>

              </form>


              {/* Login */}

              <p className="mt-7 text-center text-sm text-gray-500">

                Already have an account?{" "}

                <Link
                  to="/login"
                  className="
                    font-semibold
                    text-[#1F7A4D]
                    transition
                    hover:text-[#14532D]
                    hover:underline
                  "
                >
                  Login
                </Link>

              </p>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
};

export default Register;

