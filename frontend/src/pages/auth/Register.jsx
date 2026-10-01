import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  HandHeart,
  Heart,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  Truck,
  User,
} from "lucide-react";

const Register = () => {
  const navigate = useNavigate();

  const API_URL = "https://foodbridge-ai-qj9q.onrender.com";

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
  const [googleLoading, setGoogleLoading] = useState(false);
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
  // GOOGLE REGISTRATION
  // =========================

  const handleGoogleRegister = () => {
    try {
      setGoogleLoading(true);
      setError("");

      const selectedRole = formData.role;

      window.location.href =
        `${API_URL}/auth/google/login?role=${encodeURIComponent(
          selectedRole
        )}`;

    } catch (error) {
      console.error(error);

      setGoogleLoading(false);

      setError(
        "Unable to continue with Google. Please try again."
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
  // NORMAL REGISTRATION
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
            Already a member?
            <ArrowRight
              size={14}
              strokeWidth={1.2}
            />
          </Link>

        </div>
      </header>


      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="mx-auto grid max-w-[1400px] lg:grid-cols-[0.9fr_1.1fr]">

        {/* =================================================
            LEFT SIDE
        ================================================== */}

        <section className="relative hidden overflow-hidden border-r border-line lg:block">

          <div className="sticky top-0 h-screen max-h-[1000px]">

            <img
              src="/aaa.png"
              alt="FoodBridge community food support"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-black/50" />

            <div className="absolute left-10 top-10 xl:left-12">
              <p className="text-[10px] uppercase tracking-[0.1em] text-white/50">
                02 — Join the network
              </p>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-10 xl:p-12">

              <div className="max-w-xl text-white">

                <div className="mb-10 flex items-center justify-between border-b border-white/20 pb-5">
                  <span className="text-[10px] uppercase tracking-[0.1em] text-white/55">
                    FoodBridge / Community
                  </span>

                  <Heart
                    size={16}
                    strokeWidth={1.2}
                    className="text-light-green"
                  />
                </div>

                <p className="text-[10px] uppercase tracking-[0.1em] text-light-green">
                  There is room for you
                </p>

                <h1 className="mt-5 text-[clamp(3rem,5vw,5.8rem)] font-normal leading-[0.88] tracking-[-0.055em]">
                  ONE NETWORK.
                  <br />
                  <span className="text-light-green">
                    MANY HANDS.
                  </span>
                </h1>

                <p className="mt-8 max-w-md text-sm leading-7 text-white/65">
                  Whether you have surplus food, need food support,
                  or can help move it, FoodBridge gives you a place
                  to make that contribution count.
                </p>

                <div className="mt-10 border-t border-white/20 pt-5">
                  <p className="text-[10px] uppercase tracking-[0.08em] text-white/40">
                    Surplus → Connection → Community
                  </p>
                </div>

              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            RIGHT SIDE
        ================================================== */}

        <section className="px-6 py-12 sm:px-10 md:px-14 lg:px-16 xl:px-20">

          <div className="mx-auto max-w-2xl">

            {/* MOBILE LABEL */}

            <div className="mb-12 lg:hidden">
              <p className="fb-label text-green">
                02 — Join the network
              </p>
            </div>


            {/* INTRO */}

            <div className="border-b border-line pb-10">

              <p className="fb-label text-green">
                Create your FoodBridge account
              </p>

              <h2 className="mt-5 text-[clamp(3rem,7vw,5.5rem)] font-normal leading-[0.88] tracking-[-0.055em]">
                JOIN THE
                <br />
                <span className="text-green">
                  NETWORK.
                </span>
              </h2>

              <p className="mt-7 max-w-lg text-sm leading-7 text-muted md:text-base">
                Choose how you want to participate, then create
                your account. You can start contributing as soon
                as you're registered.
              </p>

            </div>


            {/* ERROR */}

            {error && (
              <div className="border-b border-red-300 bg-red-50 px-4 py-4 text-sm leading-6 text-red-700">
                {error}
              </div>
            )}


            {/* =================================================
                ROLE SELECTION
            ================================================== */}

            <div className="border-b border-line py-8">

              <div className="flex items-end justify-between gap-6">

                <div>
                  <p className="fb-label text-muted">
                    Choose your role
                  </p>

                  <p className="mt-2 text-sm text-muted">
                    How would you like to contribute?
                  </p>
                </div>

                <span className="hidden text-[10px] uppercase tracking-[0.08em] text-ash sm:block">
                  Select one
                </span>

              </div>


              <div className="mt-6 grid border-l border-t border-line sm:grid-cols-3">

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
                        border-b
                        border-r
                        border-line
                        p-5
                        text-left
                        transition-colors
                        ${
                          selected
                            ? "bg-light-green"
                            : "bg-paper hover:bg-white"
                        }
                      `}
                    >

                      {selected && (
                        <CheckCircle2
                          size={15}
                          strokeWidth={1.3}
                          className="absolute right-4 top-4 text-green"
                        />
                      )}

                      <Icon
                        size={22}
                        strokeWidth={1.2}
                        className={
                          selected
                            ? "text-green"
                            : "text-graphite"
                        }
                      />

                      <p className="mt-10 text-sm font-medium">
                        {role.title}
                      </p>

                      <p className="mt-2 text-[11px] leading-5 text-muted">
                        {role.description}
                      </p>

                    </button>
                  );
                })}

              </div>


              {/* ASSISTANT MESSAGE */}

              <div className="mt-6 border-l-2 border-green bg-light-green/40 px-4 py-4">

                <div className="flex items-start gap-3">

                  <Heart
                    size={15}
                    strokeWidth={1.3}
                    className="mt-0.5 shrink-0 text-green"
                  />

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.08em] text-green">
                      FoodBridge guide
                    </p>

                    <p className="mt-2 text-xs leading-5 text-muted">
                      {assistantMessage}
                    </p>
                  </div>

                </div>

              </div>

            </div>


            {/* =================================================
                GOOGLE
            ================================================== */}

            <div className="border-b border-line py-8">

              <button
                type="button"
                onClick={handleGoogleRegister}
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
                      : `Continue with Google as ${
                          formData.role.charAt(0).toUpperCase() +
                          formData.role.slice(1)
                        }`}
                  </span>

                </span>

                <ArrowRight
                  size={15}
                  strokeWidth={1.2}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />

              </button>

            </div>


            {/* =================================================
                FORM
            ================================================== */}

            <form
              onSubmit={handleSubmit}
              className="pt-8"
            >

              {/* PERSONAL INFORMATION */}

              <div className="border-b border-line pb-8">

                <p className="fb-label text-muted">
                  Personal information
                </p>


                {/* FULL NAME */}

                <div className="mt-7">

                  <label
                    htmlFor="full_name"
                    className="fb-label text-muted"
                  >
                    Full name
                  </label>

                  <div className="relative mt-4">

                    <User
                      size={17}
                      strokeWidth={1.2}
                      className="absolute left-0 top-1/2 -translate-y-1/2 text-graphite"
                    />

                    <input
                      id="full_name"
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      required
                      autoComplete="name"
                      placeholder="Your full name"
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


                {/* EMAIL + PHONE */}

                <div className="mt-7 grid gap-7 sm:grid-cols-2">

                  <div>

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
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        autoComplete="email"
                        placeholder="you@example.com"
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


                  <div>

                    <label
                      htmlFor="phone"
                      className="fb-label text-muted"
                    >
                      Phone number
                    </label>

                    <div className="relative mt-4">

                      <Phone
                        size={17}
                        strokeWidth={1.2}
                        className="absolute left-0 top-1/2 -translate-y-1/2 text-graphite"
                      />

                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        autoComplete="tel"
                        placeholder="0800 000 0000"
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

                </div>

              </div>


              {/* PASSWORD */}

              <div className="border-b border-line py-8">

                <p className="fb-label text-muted">
                  Account security
                </p>


                {/* PASSWORD */}

                <div className="mt-7">

                  <label
                    htmlFor="password"
                    className="fb-label text-muted"
                  >
                    Password
                  </label>

                  <div className="relative mt-4">

                    <LockKeyhole
                      size={17}
                      strokeWidth={1.2}
                      className="absolute left-0 top-1/2 -translate-y-1/2 text-graphite"
                    />

                    <input
                      id="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      autoComplete="new-password"
                      placeholder="Create a secure password"
                      className="
                        w-full
                        border-0
                        border-b
                        border-line
                        bg-transparent
                        px-8
                        py-3
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
                        setShowPassword(
                          (previous) => !previous
                        )
                      }
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-graphite transition-colors hover:text-green"
                    >
                      {showPassword ? (
                        <EyeOff
                          size={18}
                          strokeWidth={1.2}
                        />
                      ) : (
                        <Eye
                          size={18}
                          strokeWidth={1.2}
                        />
                      )}
                    </button>

                  </div>


                  {/* PASSWORD STRENGTH */}

                  {formData.password && (
                    <div className="mt-4">

                      <div className="flex items-center justify-between">

                        <span className="text-[10px] uppercase tracking-[0.07em] text-ash">
                          Password strength
                        </span>

                        <span className="text-[10px] uppercase tracking-[0.07em] text-green">
                          {passwordStrength.label}
                        </span>

                      </div>

                      <div className="mt-2 h-px w-full bg-line">

                        <div
                          className="h-px bg-green transition-all duration-300"
                          style={{
                            width: passwordStrength.width,
                          }}
                        />

                      </div>

                    </div>
                  )}

                </div>


                {/* CONFIRM PASSWORD */}

                <div className="mt-7">

                  <label
                    htmlFor="confirm_password"
                    className="fb-label text-muted"
                  >
                    Confirm password
                  </label>

                  <div className="relative mt-4">

                    <LockKeyhole
                      size={17}
                      strokeWidth={1.2}
                      className="absolute left-0 top-1/2 -translate-y-1/2 text-graphite"
                    />

                    <input
                      id="confirm_password"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      name="confirm_password"
                      value={formData.confirm_password}
                      onChange={handleChange}
                      required
                      autoComplete="new-password"
                      placeholder="Confirm your password"
                      className={`
                        w-full
                        border-0
                        border-b
                        bg-transparent
                        px-8
                        py-3
                        pr-12
                        text-base
                        text-ink
                        outline-none
                        placeholder:text-ash
                        ${
                          formData.confirm_password &&
                          formData.password !==
                            formData.confirm_password
                            ? "border-red-400 focus:border-red-400"
                            : formData.confirm_password &&
                              formData.password ===
                                formData.confirm_password
                            ? "border-green"
                            : "border-line focus:border-green"
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
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-graphite transition-colors hover:text-green"
                    >
                      {showConfirmPassword ? (
                        <EyeOff
                          size={18}
                          strokeWidth={1.2}
                        />
                      ) : (
                        <Eye
                          size={18}
                          strokeWidth={1.2}
                        />
                      )}
                    </button>

                  </div>


                  {/* MATCH STATUS */}

                  {formData.confirm_password && (
                    <div className="mt-3">

                      {formData.password ===
                      formData.confirm_password ? (
                        <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.07em] text-green">
                          <CheckCircle2
                            size={13}
                            strokeWidth={1.3}
                          />
                          Passwords match
                        </p>
                      ) : (
                        <p className="text-[10px] uppercase tracking-[0.07em] text-red-500">
                          Passwords do not match
                        </p>
                      )}

                    </div>
                  )}

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
                  Your account information is securely handled.
                  Your selected role determines the experience
                  available after registration.
                </p>

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
                      ? "Creating account..."
                      : "Create FoodBridge account"}
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

              <p className="text-sm text-muted">

                Already have an account?

                <Link
                  to="/login"
                  className="ml-2 text-green transition-colors hover:text-deep-green"
                >
                  Login →
                </Link>

              </p>

            </div>


            {/* BACK */}

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mt-8 fb-arrow text-[10px] uppercase tracking-[0.08em] text-ash transition-colors hover:text-green"
            >
              <ArrowLeft
                size={13}
                strokeWidth={1.2}
              />

              Go back
            </button>

          </div>

        </section>

      </main>

    </div>
  );
};

export default Register;
