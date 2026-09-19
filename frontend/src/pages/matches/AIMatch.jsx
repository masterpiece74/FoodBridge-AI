import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  Heart,
  Leaf,
  Loader2,
  MapPin,
  Navigation,
  Package,
  RefreshCw,
  Sparkles,
  Target,
  Truck,
  Utensils,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000";

function getToken() {
  return localStorage.getItem("access_token");
}

function formatScore(value) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return "—";
  }

  return `${number.toFixed(1)}%`;
}

function formatDistance(value) {
  if (value === null || value === undefined || value === "") {
    return "Distance unavailable";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return "Distance unavailable";
  }

  if (number < 1) {
    return `${Math.round(number * 1000)} m`;
  }

  return `${number.toFixed(1)} km`;
}

function formatStatus(status) {
  if (!status) return "Unknown";

  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function statusClasses(status) {
  switch (status) {
    case "accepted":
      return "bg-[#1F7A4D]/10 text-[#1F7A4D]";

    case "completed":
      return "bg-[#14532D]/10 text-[#14532D]";

    case "rejected":
      return "bg-red-50 text-red-600";

    case "suggested":
      return "bg-amber-50 text-amber-700";

    default:
      return "bg-gray-100 text-gray-600";
  }
}

function ScoreBar({
  icon: Icon,
  title,
  description,
  score,
}) {
  const numericScore =
    score === null || score === undefined
      ? null
      : Number(score);

  const width =
    numericScore !== null && !Number.isNaN(numericScore)
      ? Math.max(0, Math.min(100, numericScore))
      : 0;

  let strength = "Not available";

  if (numericScore !== null && !Number.isNaN(numericScore)) {
    if (numericScore >= 80) {
      strength = "Strong";
    } else if (numericScore >= 60) {
      strength = "Good";
    } else if (numericScore >= 40) {
      strength = "Moderate";
    } else {
      strength = "Low";
    }
  }

  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1F7A4D]/10 text-[#1F7A4D]">
            <Icon size={18} />
          </div>

          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-[#0B2F1A]">
              {title}
            </h4>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              {description}
            </p>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-lg font-bold text-[#0B2F1A]">
            {formatScore(score)}
          </p>

          <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
            {strength}
          </p>
        </div>
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-[#1F7A4D] transition-all duration-700"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

export default function AIMatch() {
  const navigate = useNavigate();
  const { donationId } = useParams();

  const [donation, setDonation] = useState(null);
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [acceptedMatch, setAcceptedMatch] = useState(null);
  const [delivery, setDelivery] = useState(null);

  const [loading, setLoading] = useState(true);
  const [matching, setMatching] = useState(false);
  const [accepting, setAccepting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================================
  // LOAD EVERYTHING FROM THE MATCHING ENDPOINT
  // ==========================================================

  const loadMatches = useCallback(async () => {
    const token = getToken();

    if (!token) {
      navigate("/login");
      return [];
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/matches/donation/${donationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to load AI matches."
        );
      }

      // --------------------------------------------------------
      // DONATION COMES FROM THIS SAME RESPONSE
      // --------------------------------------------------------

      if (data.donation) {
        setDonation(data.donation);
      }

      // --------------------------------------------------------
      // MATCHES
      // --------------------------------------------------------

      const loadedMatches = Array.isArray(data.matches)
        ? data.matches
        : [];

      setMatches(loadedMatches);

      // --------------------------------------------------------
      // FIND ACCEPTED / COMPLETED MATCH
      // --------------------------------------------------------

      const accepted = loadedMatches.find(
        (match) =>
          match.status === "accepted" ||
          match.status === "completed"
      );

      if (accepted) {
        setAcceptedMatch(accepted);
      } else {
        setAcceptedMatch(null);
      }

      // --------------------------------------------------------
      // SELECT HIGHEST SCORE
      // --------------------------------------------------------

      const sortedMatches = [...loadedMatches].sort(
        (a, b) =>
          Number(b.match_score || 0) -
          Number(a.match_score || 0)
      );

      const preferred =
        accepted ||
        sortedMatches[0] ||
        null;

      setSelectedMatch(preferred);

      return loadedMatches;
    } catch (err) {
      console.error("AIMatch load error:", err);

      setError(
        err.message || "Unable to load AI matches."
      );

      return [];
    }
  }, [donationId, navigate]);

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    let active = true;

    async function initialize() {
      setLoading(true);
      setError("");

      await loadMatches();

      if (active) {
        setLoading(false);
      }
    }

    initialize();

    return () => {
      active = false;
    };
  }, [loadMatches]);

  // ==========================================================
  // RUN AI MATCH
  // ==========================================================

  async function runAIMatching() {
    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    setMatching(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/matches/donation/${donationId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.detail || "AI matching failed."
        );
      }

      /*
       * IMPORTANT:
       *
       * We intentionally do NOT use the POST response
       * to populate the UI.
       *
       * We immediately reload the GET endpoint so the UI
       * always receives the complete database representation.
       */

      const refreshedMatches = await loadMatches();

      if (refreshedMatches.length > 0) {
        setSuccess(
          `${refreshedMatches.length} recipient ${
            refreshedMatches.length === 1
              ? "match"
              : "matches"
          } found.`
        );
      } else {
        setSuccess(
          "AI matching completed, but no suitable recipient was found."
        );
      }
    } catch (err) {
      console.error("AI matching error:", err);

      setError(
        err.message || "Unable to run AI matching."
      );
    } finally {
      setMatching(false);
    }
  }

  // ==========================================================
  // ACCEPT MATCH
  // ==========================================================

  async function acceptMatch() {
    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    if (!selectedMatch?.match_id) {
      setError("Please select a recipient first.");
      return;
    }

    setAccepting(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/matches/${selectedMatch.match_id}/accept`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to accept this match."
        );
      }

      if (data.delivery) {
        setDelivery(data.delivery);
      }

      /*
       * Reload the database state after acceptance.
       */

      const refreshedMatches = await loadMatches();

      const accepted =
        refreshedMatches.find(
          (match) =>
            match.match_id ===
            selectedMatch.match_id
        ) || selectedMatch;

      setAcceptedMatch(accepted);
      setSelectedMatch(accepted);

      setSuccess(
        "Match accepted successfully. A delivery has been created."
      );
    } catch (err) {
      console.error("Accept match error:", err);

      setError(
        err.message || "Unable to accept this match."
      );
    } finally {
      setAccepting(false);
    }
  }

  // ==========================================================
  // BEST MATCH
  // ==========================================================

  const bestMatch = useMemo(() => {
    if (acceptedMatch) {
      return (
        matches.find(
          (match) =>
            match.match_id === acceptedMatch.match_id
        ) || acceptedMatch
      );
    }

    if (selectedMatch) {
      return selectedMatch;
    }

    return (
      [...matches].sort(
        (a, b) =>
          Number(b.match_score || 0) -
          Number(a.match_score || 0)
      )[0] || null
    );
  }, [acceptedMatch, matches, selectedMatch]);

  // ==========================================================
  // DERIVED VALUES
  // ==========================================================

  const overallScore =
    bestMatch?.match_score !== undefined &&
    bestMatch?.match_score !== null
      ? Number(bestMatch.match_score)
      : null;

  const distance = formatDistance(
    bestMatch?.distance_km
  );

  const requestedFood =
    bestMatch?.requested_food ||
    bestMatch?.food_type ||
    "—";

  const quantityNeeded =
    bestMatch?.quantity_needed !== undefined &&
    bestMatch?.quantity_needed !== null
      ? bestMatch.quantity_needed
      : null;

  const requestedUnit =
    bestMatch?.requested_quantity_unit ||
    "servings";

  const peopleToFeed =
    bestMatch?.people_to_feed !== undefined &&
    bestMatch?.people_to_feed !== null
      ? bestMatch.people_to_feed
      : null;

  const location =
    [bestMatch?.city, bestMatch?.state]
      .filter(Boolean)
      .join(", ") ||
    bestMatch?.address ||
    "Location unavailable";

  const isAccepted =
    bestMatch?.status === "accepted" ||
    bestMatch?.status === "completed" ||
    Boolean(acceptedMatch);

  // ==========================================================
  // LOADING SCREEN
  // ==========================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAFAF7] px-6">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1F7A4D]/10 text-[#1F7A4D]">
            <Loader2
              size={25}
              className="animate-spin"
            />
          </div>

          <h2 className="mt-5 text-lg font-bold text-[#0B2F1A]">
            Loading AI analysis
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Getting the latest recipient matches...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#0B2F1A]">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="sticky top-0 z-40 border-b border-black/5 bg-[#FAFAF7]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-10">
          <button
            type="button"
            onClick={() =>
              navigate("/donor-dashboard")
            }
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-gray-600 transition hover:bg-white hover:text-[#1F7A4D]"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </button>

          <button
            type="button"
            onClick={runAIMatching}
            disabled={matching}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1F7A4D] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#14532D] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {matching ? (
              <>
                <Loader2
                  size={16}
                  className="animate-spin"
                />
                Analyzing...
              </>
            ) : (
              <>
                <RefreshCw size={16} />
                Run AI Match
              </>
            )}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
        {/* ====================================================
            TITLE
        ==================================================== */}

        <section className="mx-auto max-w-3xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#1F7A4D]/10 bg-[#1F7A4D]/5 px-4 py-2 text-xs font-semibold text-[#1F7A4D]">
            <Sparkles size={14} />
            AI Matching
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Find the right recipient
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
            FoodBridge AI analyzes recipient needs, food compatibility,
            quantity, freshness, urgency, and delivery distance to
            identify suitable matches for this donation.
          </p>
        </section>

        {/* ====================================================
            ALERTS
        ==================================================== */}

        {error && (
          <div className="mx-auto mt-8 flex max-w-4xl items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
            <X
              size={18}
              className="mt-0.5 shrink-0"
            />

            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="mx-auto mt-8 flex max-w-4xl items-start gap-3 rounded-2xl border border-[#1F7A4D]/10 bg-[#1F7A4D]/5 p-4 text-sm text-[#14532D]">
            <CheckCircle2
              size={18}
              className="mt-0.5 shrink-0"
            />

            <p>{success}</p>
          </div>
        )}

        {/* ====================================================
            DONATION
        ==================================================== */}

        {donation && (
          <section className="mt-10 overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-sm">
            <div className="border-b border-black/5 px-6 py-5 sm:px-7">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#1F7A4D]">
                <Package size={17} />
                Donation being matched
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4">
              <div className="border-b border-black/5 p-6 sm:border-r lg:border-b-0">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Food
                </p>

                <p className="mt-2 text-lg font-bold">
                  {donation.food_name || "—"}
                </p>
              </div>

              <div className="border-b border-black/5 p-6 lg:border-b-0 lg:border-r">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Type
                </p>

                <p className="mt-2 text-lg font-bold">
                  {donation.food_type || "—"}
                </p>
              </div>

              <div className="border-b border-black/5 p-6 sm:border-r lg:border-b-0">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Quantity
                </p>

                <p className="mt-2 text-lg font-bold">
                  {donation.quantity ?? "—"}{" "}
                  {donation.quantity_unit || ""}
                </p>
              </div>

              <div className="p-6">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Status
                </p>

                <span className="mt-2 inline-flex rounded-full bg-[#1F7A4D]/10 px-3 py-1 text-xs font-semibold text-[#1F7A4D]">
                  {formatStatus(donation.status)}
                </span>
              </div>
            </div>
          </section>
        )}

        {/* ====================================================
            NO MATCH
        ==================================================== */}

        {!bestMatch && (
          <section className="mt-8 rounded-[2rem] border border-dashed border-black/10 bg-white p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1F7A4D]/10 text-[#1F7A4D]">
              <Target size={24} />
            </div>

            <h2 className="mt-5 text-xl font-bold">
              No recipient matches yet
            </h2>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-gray-500">
              Run AI Match to analyze available recipients and
              identify suitable organizations for this donation.
            </p>

            <button
              type="button"
              onClick={runAIMatching}
              disabled={matching}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#1F7A4D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#14532D] disabled:opacity-60"
            >
              <Sparkles size={16} />
              Run AI Match
            </button>
          </section>
        )}

        {/* ====================================================
            BEST MATCH
        ==================================================== */}

        {bestMatch && (
          <section className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
            <div className="overflow-hidden rounded-[2rem] border border-[#1F7A4D]/10 bg-white shadow-sm">
              <div className="border-b border-black/5 bg-[#1F7A4D]/[0.035] px-6 py-6 sm:px-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#1F7A4D]">
                      <Heart size={17} />
                      AI Recommendation
                    </div>

                    <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                      Best recipient match
                    </h2>
                  </div>

                  <div className="rounded-2xl bg-[#14532D] px-5 py-4 text-white">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/50">
                      Match score
                    </p>

                    <p className="mt-1 text-3xl font-bold">
                      {overallScore !== null
                        ? `${overallScore.toFixed(1)}%`
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#1F7A4D]/10 text-[#1F7A4D]">
                      <Heart size={24} />
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                        Recommended recipient
                      </p>

                      <h3 className="mt-1 text-xl font-bold sm:text-2xl">
                        {bestMatch.organization_name ||
                          "Recipient"}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {bestMatch.organization_type ||
                          "Organization"}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${statusClasses(
                      bestMatch.status
                    )}`}
                  >
                    {formatStatus(bestMatch.status)}
                  </span>
                </div>

                {/* DETAILS */}

                <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-2xl bg-[#FAFAF7] p-4">
                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin size={15} />
                      <span className="text-xs">
                        Location
                      </span>
                    </div>

                    <p className="mt-2 text-sm font-semibold">
                      {location}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#FAFAF7] p-4">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Navigation size={15} />
                      <span className="text-xs">
                        Distance
                      </span>
                    </div>

                    <p className="mt-2 text-sm font-semibold">
                      {distance}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#FAFAF7] p-4">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Utensils size={15} />
                      <span className="text-xs">
                        Requested food
                      </span>
                    </div>

                    <p className="mt-2 text-sm font-semibold capitalize">
                      {requestedFood}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#FAFAF7] p-4">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Package size={15} />
                      <span className="text-xs">
                        Requested quantity
                      </span>
                    </div>

                    <p className="mt-2 text-sm font-semibold">
                      {quantityNeeded !== null
                        ? `${quantityNeeded} ${requestedUnit}`
                        : "—"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#FAFAF7] p-4">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Users size={15} />
                      <span className="text-xs">
                        People to feed
                      </span>
                    </div>

                    <p className="mt-2 text-sm font-semibold">
                      {peopleToFeed !== null
                        ? peopleToFeed
                        : "—"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#FAFAF7] p-4">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock3 size={15} />
                      <span className="text-xs">
                        Match status
                      </span>
                    </div>

                    <p className="mt-2 text-sm font-semibold">
                      {formatStatus(bestMatch.status)}
                    </p>
                  </div>
                </div>

                {/* AI REASON */}

                <div className="mt-6 rounded-2xl border border-[#1F7A4D]/10 bg-[#1F7A4D]/[0.035] p-5">
                  <div className="flex items-center gap-2">
                    <Sparkles
                      size={17}
                      className="text-[#1F7A4D]"
                    />

                    <h4 className="text-sm font-bold">
                      Why AI selected this recipient
                    </h4>
                  </div>

                  <p className="mt-3 text-sm leading-7 text-gray-600">
                    {bestMatch.ai_reason ||
                      "This recipient was selected based on the available matching factors."}
                  </p>
                </div>

                {/* ACCEPT BUTTON */}

                {!isAccepted &&
                  bestMatch.status === "suggested" && (
                    <button
                      type="button"
                      onClick={acceptMatch}
                      disabled={accepting}
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1F7A4D] px-5 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#14532D] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {accepting ? (
                        <>
                          <Loader2
                            size={18}
                            className="animate-spin"
                          />
                          Accepting Match...
                        </>
                      ) : (
                        <>
                          <Check size={18} />
                          Accept This Match
                        </>
                      )}
                    </button>
                  )}

                {isAccepted && (
                  <div className="mt-6 flex items-center gap-3 rounded-2xl bg-[#1F7A4D]/10 px-5 py-4 text-sm font-semibold text-[#14532D]">
                    <CheckCircle2 size={19} />

                    <div>
                      <p>Match accepted successfully</p>

                      <p className="mt-0.5 text-xs font-normal text-[#1F7A4D]/70">
                        This donation is now connected to this recipient.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* DELIVERY */}

            <div className="h-fit rounded-[2rem] bg-[#0B2F1A] p-6 text-white shadow-sm sm:p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-[#A7D7B8]">
                <Truck size={20} />
              </div>

              <h3 className="mt-5 text-xl font-bold">
                Delivery workflow
              </h3>

              <p className="mt-2 text-sm leading-6 text-white/50">
                Once a match is accepted, FoodBridge can create and
                track the delivery from pickup to completion.
              </p>

              {delivery ? (
                <div className="mt-6 rounded-2xl bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-wider text-white/40">
                    Delivery status
                  </p>

                  <p className="mt-2 text-lg font-bold text-[#A7D7B8]">
                    {formatStatus(delivery.status)}
                  </p>

                  {delivery.id && (
                    <p className="mt-1 text-xs text-white/40">
                      Delivery #{delivery.id}
                    </p>
                  )}
                </div>
              ) : (
                <div className="mt-6 space-y-3">
                  {[
                    "Match recipient",
                    "Create delivery",
                    "Assign volunteer",
                    "Track delivery",
                  ].map((step, index) => (
                    <div
                      key={step}
                      className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-3"
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-[#A7D7B8]">
                        {index + 1}
                      </div>

                      <span className="text-xs text-white/65">
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ====================================================
            BREAKDOWN
        ==================================================== */}

        {bestMatch && (
          <section className="mt-8">
            <div className="mb-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#1F7A4D]">
                <Zap size={16} />
                AI Analysis
              </div>

              <h2 className="mt-2 text-2xl font-bold">
                Match breakdown
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Each factor contributes to the overall recommendation.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <ScoreBar
                icon={Utensils}
                title="Food compatibility"
                description="How closely the donated food matches the recipient's request."
                score={bestMatch.food_type_score}
              />

              <ScoreBar
                icon={Package}
                title="Quantity fit"
                description="Whether the donation quantity satisfies the requested amount."
                score={bestMatch.quantity_score}
              />

              <ScoreBar
                icon={Leaf}
                title="Freshness"
                description="Assessment of the donation's freshness."
                score={bestMatch.freshness_score}
              />

              <ScoreBar
                icon={Zap}
                title="Recipient urgency"
                description="Priority based on the recipient's stated need."
                score={bestMatch.urgency_score}
              />

              <ScoreBar
                icon={Navigation}
                title="Delivery proximity"
                description="How practical the delivery distance is."
                score={bestMatch.distance_score}
              />
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-2xl bg-white px-5 py-4 text-xs leading-5 text-gray-500 shadow-sm">
              <MapPin
                size={15}
                className="mt-0.5 shrink-0 text-[#1F7A4D]"
              />

              <p>
                Proximity is calculated from the donor and recipient
                coordinates when both locations are available.
              </p>
            </div>
          </section>
        )}

        {/* ====================================================
            ALTERNATIVE RECIPIENTS
        ==================================================== */}

        {matches.length > 1 && (
          <section className="mt-10">
            <div className="mb-5">
              <p className="text-sm font-semibold text-[#1F7A4D]">
                Other options
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                Alternative recipients
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {matches
                .filter(
                  (match) =>
                    match.match_id !==
                    bestMatch?.match_id
                )
                .map((match) => (
                  <button
                    type="button"
                    key={match.match_id}
                    onClick={() => {
                      setSelectedMatch(match);
                      setAcceptedMatch(null);
                    }}
                    className={`rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
                      selectedMatch?.match_id ===
                      match.match_id
                        ? "border-[#1F7A4D]"
                        : "border-black/5"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold">
                          {match.organization_name}
                        </h3>

                        <p className="mt-1 text-xs text-gray-500">
                          {match.organization_type}
                        </p>
                      </div>

                      <span className="rounded-full bg-[#1F7A4D]/10 px-2.5 py-1 text-xs font-bold text-[#1F7A4D]">
                        {formatScore(match.match_score)}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <MapPin size={13} />
                        {formatDistance(
                          match.distance_km
                        )}
                      </span>

                      <span>
                        {match.people_to_feed ?? "—"} people
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-end text-xs font-semibold text-[#1F7A4D]">
                      Select
                      <ArrowRight
                        size={14}
                        className="ml-1"
                      />
                    </div>
                  </button>
                ))}
            </div>
          </section>
        )}

        {/* ====================================================
            FOOTER
        ==================================================== */}

        <div className="mx-auto mt-12 max-w-3xl border-t border-black/5 pt-7 text-center">
          <p className="text-xs leading-6 text-gray-400">
            FoodBridge AI recommendations support donor decisions by
            evaluating food compatibility, quantity, freshness,
            urgency, and delivery practicality.
          </p>
        </div>
      </main>
    </div>
  );
}