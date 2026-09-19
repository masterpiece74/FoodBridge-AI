import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  MapPin,
  CalendarDays,
  Clock,
  Users,
  FileText,
  CheckCircle2,
  Sparkles,
  X,
  ArrowRight,
  LayoutDashboard,
  HeartHandshake,
} from "lucide-react";

const DonateFood = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    food_name: "",
    food_type: "",
    quantity: "",
    quantity_unit: "servings",
    prepared_at: "",
    expiry_time: "",
    address: "",
    city: "",
    state: "Ekiti",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [aiInsight, setAiInsight] = useState(null);

  // Controls the success popup
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Stores the newly created donation ID
  const [createdDonationId, setCreatedDonationId] = useState(null);

  const submitInFlight = useRef(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading || submitInFlight.current) {
      return;
    }

    submitInFlight.current = true;
    setLoading(true);
    setError("");
    setSuccess("");
    setAiInsight(null);

    const token = localStorage.getItem("access_token");

    if (!token) {
      submitInFlight.current = false;
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        "https://foodbridge-ai-qj9q.onrender.com/donations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            food_name: formData.food_name,
            food_type: formData.food_type,
            description: formData.description || null,
            quantity: Number(formData.quantity),
            quantity_unit: formData.quantity_unit,

            prepared_at: formData.prepared_at
              ? new Date(formData.prepared_at).toISOString()
              : null,

            expiry_time: formData.expiry_time
              ? new Date(formData.expiry_time).toISOString()
              : null,

            address: formData.address,
            city: formData.city,
            state: formData.state,
            latitude: null,
            longitude: null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to submit donation."
        );
      }

      // Save success information
      setSuccess(
        data.message || "Food donation created successfully!"
      );

      setAiInsight(data.ai_insight || null);

      // Get the newly created donation ID
      const newDonationId =
        data.id ||
        data.donation_id ||
        data.donation?.id ||
        null;

      setCreatedDonationId(newDonationId);

      // Show the professional success popup
      setShowSuccessModal(true);

      // Reset form
      setFormData({
        food_name: "",
        food_type: "",
        quantity: "",
        quantity_unit: "servings",
        prepared_at: "",
        expiry_time: "",
        address: "",
        city: "",
        state: "Ekiti",
        description: "",
      });
    } catch (err) {
      console.error("Donation submission error:", err);

      setError(
        err.message ||
          "Something went wrong while submitting your donation."
      );
    } finally {
      submitInFlight.current = false;
      setLoading(false);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const goToDashboard = () => {
    setShowSuccessModal(false);
    navigate("/donor-dashboard");
  };

  const goToAIMatch = () => {
    if (createdDonationId) {
      setShowSuccessModal(false);
      navigate(`/matches/${createdDonationId}`);
    } else {
      // Fallback if backend didn't return the ID
      setShowSuccessModal(false);
      navigate("/donor-dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* =========================
          SUCCESS MODAL
      ========================== */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">

          {/* Modal */}
          <div className="relative w-full max-w-md overflow-hidden rounded-[28px] bg-white shadow-2xl">

            {/* Close button */}
            <button
              onClick={closeSuccessModal}
              className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Top success area */}
            <div className="bg-gradient-to-b from-green-50 to-white px-6 pb-4 pt-9 text-center">

              {/* Friendly smiling face */}
              <div className="relative mx-auto mb-5 flex h-24 w-24 items-center justify-center">

                {/* Glow */}
                <div className="absolute inset-0 animate-pulse rounded-full bg-green-100" />

                {/* Face */}
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-4 border-green-200 bg-green-100 text-4xl shadow-sm">
                  😊
                </div>

                {/* Small check */}
                <div className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-green-600 text-white">
                  <CheckCircle2 size={16} />
                </div>
              </div>

              <div className="mx-auto mb-3 flex w-fit items-center gap-2 rounded-full bg-green-100 px-3 py-1.5 text-xs font-bold text-green-700">
                <Sparkles size={13} />
                FOODBRIDGE AI
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Donation Submitted! 🎉
              </h2>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                Your food donation has been successfully recorded.
                You're helping turn surplus food into meaningful support.
              </p>
            </div>

            {/* Donation information */}
            <div className="px-6 pb-6">

              <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                    <Package
                      size={21}
                      className="text-green-700"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Your donation
                    </p>

                    <p className="truncate font-bold text-slate-900">
                      {success || "Food donation successfully submitted"}
                    </p>
                  </div>

                </div>

                {aiInsight && (
                  <div className="mt-4 border-t border-slate-200 pt-4">

                    <div className="flex items-center gap-2">
                      <Sparkles
                        size={16}
                        className="text-green-600"
                      />

                      <p className="text-sm font-semibold text-slate-800">
                        AI has analyzed your donation
                      </p>
                    </div>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {aiInsight.recommendation ||
                        "Your donation is ready for recipient matching."}
                    </p>

                  </div>
                )}

              </div>

              {/* Next step */}
              <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
                What would you like to do next?
              </p>

              <div className="space-y-3">

                {/* AI Match */}
                <button
                  onClick={goToAIMatch}
                  className="group flex w-full items-center justify-between rounded-2xl bg-slate-900 px-5 py-4 text-left text-white shadow-sm transition hover:bg-slate-800 hover:shadow-md"
                >
                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                      <Sparkles size={19} />
                    </div>

                    <div>
                      <p className="text-sm font-bold">
                        Find AI Match
                      </p>

                      <p className="mt-0.5 text-xs text-slate-300">
                        Find the best recipient for your food
                      </p>
                    </div>

                  </div>

                  <ArrowRight
                    size={19}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>

                {/* Dashboard */}
                <button
                  onClick={goToDashboard}
                  className="group flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                      <LayoutDashboard size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-bold">
                        View Dashboard
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500">
                        See all your food donations
                      </p>
                    </div>

                  </div>

                  <ArrowRight
                    size={19}
                    className="text-slate-400 transition-transform group-hover:translate-x-1"
                  />
                </button>

              </div>

              <button
                onClick={closeSuccessModal}
                className="mt-4 w-full py-2 text-sm font-medium text-slate-400 transition hover:text-slate-700"
              >
                Stay on this page
              </button>

            </div>
          </div>
        </div>
      )}

      {/* =========================
          HEADER
      ========================== */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-5">

          <button
            onClick={() => navigate("/donor-dashboard")}
            className="flex items-center gap-2 text-sm text-gray-600 transition hover:text-green-700"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>

        </div>
      </header>

      {/* =========================
          MAIN
      ========================== */}
      <main className="mx-auto max-w-4xl px-6 py-10">

        {/* Title */}
        <div className="mb-8">

          <div className="mb-4 flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
              <Package
                className="text-green-700"
                size={25}
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Donate Food
              </h1>

              <p className="mt-1 text-gray-500">
                Turn surplus food into meaningful support for your community.
              </p>
            </div>

          </div>

        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

            <span className="font-medium">
              {error}
            </span>

          </div>
        )}

        {/* Form Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

          <form
            onSubmit={handleSubmit}
            className="space-y-7"
          >

            {/* =========================
                FOOD INFORMATION
            ========================== */}
            <div>

              <h2 className="text-lg font-semibold text-gray-900">
                Food Information
              </h2>

              <p className="mb-5 mt-1 text-sm text-gray-500">
                Tell us about the food you would like to donate.
              </p>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                {/* Food Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Food name
                  </label>

                  <input
                    type="text"
                    name="food_name"
                    value={formData.food_name}
                    onChange={handleChange}
                    placeholder="e.g. Jollof rice"
                    required
                    className="h-12 w-full rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  />
                </div>

                {/* Food Type */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Food type
                  </label>

                  <select
                    name="food_type"
                    value={formData.food_type}
                    onChange={handleChange}
                    required
                    className="h-12 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  >
                    <option value="">
                      Select food type
                    </option>

                    <option value="prepared_meal">
                      Prepared Meal
                    </option>

                    <option value="grains">
                      Grains
                    </option>

                    <option value="vegetables">
                      Vegetables
                    </option>

                    <option value="fruits">
                      Fruits
                    </option>

                    <option value="bakery">
                      Bakery
                    </option>

                    <option value="packaged_food">
                      Packaged Food
                    </option>

                    <option value="other">
                      Other
                    </option>
                  </select>
                </div>

                {/* Quantity */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Quantity
                  </label>

                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    min="0.1"
                    step="0.1"
                    placeholder="e.g. 50"
                    required
                    className="h-12 w-full rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  />
                </div>

                {/* Unit */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Quantity unit
                  </label>

                  <select
                    name="quantity_unit"
                    value={formData.quantity_unit}
                    onChange={handleChange}
                    required
                    className="h-12 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  >
                    <option value="servings">
                      Servings
                    </option>

                    <option value="kg">
                      Kilograms
                    </option>

                    <option value="boxes">
                      Boxes
                    </option>

                    <option value="packs">
                      Packs
                    </option>

                    <option value="items">
                      Items
                    </option>
                  </select>
                </div>

              </div>
            </div>

            {/* =========================
                FOOD FRESHNESS
            ========================== */}
            <div className="border-t border-gray-100 pt-6">

              <h2 className="text-lg font-semibold text-gray-900">
                Food Freshness
              </h2>

              <p className="mb-5 mt-1 text-sm text-gray-500">
                These details help our AI calculate freshness and urgency.
              </p>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                {/* Prepared */}
                <div>

                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Clock size={16} />
                    Date & time prepared
                  </label>

                  <input
                    type="datetime-local"
                    name="prepared_at"
                    value={formData.prepared_at}
                    onChange={handleChange}
                    className="h-12 w-full rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  />

                </div>

                {/* Expiry */}
                <div>

                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                    <CalendarDays size={16} />
                    Expiry date & time
                  </label>

                  <input
                    type="datetime-local"
                    name="expiry_time"
                    value={formData.expiry_time}
                    onChange={handleChange}
                    required
                    className="h-12 w-full rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  />

                </div>

              </div>
            </div>

            {/* =========================
                PICKUP DETAILS
            ========================== */}
            <div className="border-t border-gray-100 pt-6">

              <h2 className="text-lg font-semibold text-gray-900">
                Pickup Details
              </h2>

              <p className="mb-5 mt-1 text-sm text-gray-500">
                Tell us where the food can be collected.
              </p>

              <div className="space-y-5">

                {/* Address */}
                <div>

                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                    <MapPin size={16} />
                    Pickup address
                  </label>

                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter pickup address"
                    required
                    className="h-12 w-full rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  />

                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                  {/* City */}
                  <div>

                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      City
                    </label>

                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g. Ado-Ekiti"
                      required
                      className="h-12 w-full rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                    />

                  </div>

                  {/* State */}
                  <div>

                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      State
                    </label>

                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="e.g. Ekiti"
                      required
                      className="h-12 w-full rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                    />

                  </div>

                </div>

              </div>
            </div>

            {/* =========================
                DESCRIPTION
            ========================== */}
            <div className="border-t border-gray-100 pt-6">

              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                <FileText size={16} />
                Additional information
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Packaging, dietary information, special instructions, etc."
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />

            </div>

            {/* =========================
                AI INFORMATION
            ========================== */}
            <div className="rounded-xl border border-green-100 bg-green-50 p-4">

              <div className="flex gap-3">

                <Users
                  size={20}
                  className="mt-0.5 text-green-700"
                />

                <div>

                  <p className="font-medium text-green-900">
                    What happens next?
                  </p>

                  <p className="mt-1 text-sm leading-relaxed text-green-800">
                    FoodBridge AI will analyze your donation's
                    freshness, urgency, location, food type and
                    quantity to help identify suitable recipients.
                  </p>

                </div>

              </div>

            </div>

            {/* =========================
                SUBMIT
            ========================== */}
            <div className="flex flex-col justify-end gap-3 pt-2 sm:flex-row">

              <button
                type="button"
                onClick={() => navigate("/donor-dashboard")}
                className="h-12 rounded-lg border border-gray-300 px-6 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex h-12 items-center justify-center gap-2 rounded-lg bg-green-700 px-7 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Submitting donation...
                  </>
                ) : (
                  <>
                    <HeartHandshake size={17} />
                    Submit Donation
                  </>
                )}
              </button>

            </div>

          </form>
        </div>
      </main>
    </div>
  );
};

export default DonateFood;