import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  Clock3,
  HeartHandshake,
  LayoutDashboard,
  LogOut,
  Menu,
  PackageCheck,
  RefreshCw,
  Search,
  ShieldCheck,
  Truck,
  UserCheck,
  Users,
  Utensils,
  X,
  XCircle,
  TrendingUp,
  Scale,
  HandHeart,
  Building2,
  Sparkles,
} from "lucide-react";

const API_URL = "https://foodbridge-ai-qj9q.onrender.com";

/* =========================================================
   HELPERS
========================================================= */

const getStatusClasses = (status) => {
  const normalized = String(status || "").toLowerCase();

  if (
    [
      "delivered",
      "verified",
      "accepted",
      "completed",
      "available",
    ].includes(normalized)
  ) {
    return "border-green/20 bg-green/5 text-green";
  }

  if (
    [
      "pending",
      "suggested",
      "reserved",
      "assigned",
      "in_transit",
      "matched",
    ].includes(normalized)
  ) {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  if (
    ["rejected", "cancelled", "expired"].includes(normalized)
  ) {
    return "border-red-200 bg-red-50 text-red-600";
  }

  if (normalized === "picked_up") {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  return "border-line bg-white text-muted";
};

const formatStatus = (status) => {
  if (!status) return "Unknown";

  return String(status)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const formatDate = (date) => {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "—";

  return parsed.toLocaleDateString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatNumber = (value) => {
  const number = Number(value || 0);

  return number.toLocaleString("en-NG");
};

/* =========================================================
   SMALL UI COMPONENTS
========================================================= */

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex items-center border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${getStatusClasses(
      status
    )}`}
  >
    {formatStatus(status)}
  </span>
);

const SectionEyebrow = ({ children }) => (
  <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-green">
    <span className="h-px w-6 bg-green" />
    {children}
  </div>
);

const StatCard = ({
  label,
  value,
  detail,
  icon: Icon,
  trend,
}) => (
  <div className="group border border-line bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-green/30 hover:shadow-[0_12px_40px_rgba(11,47,26,0.06)]">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
          {label}
        </p>

        <p className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-ink">
          {value}
        </p>

        {detail && (
          <p className="mt-2 text-xs leading-5 text-muted">
            {detail}
          </p>
        )}
      </div>

      {Icon && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-line bg-paper text-green">
          <Icon size={17} strokeWidth={1.7} />
        </div>
      )}
    </div>

    {trend && (
      <div className="mt-5 flex items-center gap-2 border-t border-line pt-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-green">
        <TrendingUp size={13} />
        {trend}
      </div>
    )}
  </div>
);

const ImpactCard = ({ label, value, description }) => (
  <div className="border-l border-green/30 pl-4">
    <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-muted">
      {label}
    </p>

    <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-ink">
      {value}
    </p>

    {description && (
      <p className="mt-1 text-xs leading-5 text-muted">
        {description}
      </p>
    )}
  </div>
);

const EmptyState = ({
  icon: Icon = PackageCheck,
  title,
  description,
}) => (
  <div className="flex min-h-[220px] flex-col items-center justify-center border border-dashed border-line bg-paper px-6 text-center">
    <div className="flex h-12 w-12 items-center justify-center border border-line bg-white text-green">
      <Icon size={20} strokeWidth={1.5} />
    </div>

    <h3 className="mt-4 text-sm font-semibold text-ink">
      {title}
    </h3>

    {description && (
      <p className="mt-1 max-w-sm text-xs leading-5 text-muted">
        {description}
      </p>
    )}
  </div>
);

/* =========================================================
   ORGANISATION ROW
========================================================= */

const OrganisationRow = ({ organisation, onUpdated }) => {
  const [processing, setProcessing] = useState(false);
  const [actionError, setActionError] = useState("");

  const performAction = async (action) => {
    try {
      setProcessing(true);
      setActionError("");

      const token = localStorage.getItem("access_token");

      const response = await fetch(
        `${API_URL}/admin/organisations/${organisation.id}/${action}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            data?.message ||
            `Unable to ${action} organisation.`
        );
      }

      onUpdated?.();
    } catch (error) {
      setActionError(error.message);
    } finally {
      setProcessing(false);
    }
  };

  const status =
    organisation.verification_status ||
    organisation.status ||
    (organisation.is_verified ? "verified" : "pending");

  return (
    <div className="border-b border-line px-5 py-5 last:border-b-0">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-line bg-paper text-green">
            <Building2 size={17} strokeWidth={1.6} />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-ink">
              {organisation.name ||
                organisation.organisation_name ||
                "Unnamed organisation"}
            </h3>

            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted">
              <span>
                {organisation.email || "No email"}
              </span>

              {organisation.city && (
                <span>{organisation.city}</span>
              )}
            </div>

            {actionError && (
              <p className="mt-2 text-xs text-red-600">
                {actionError}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={status} />

          {String(status).toLowerCase() !== "verified" && (
            <button
              type="button"
              disabled={processing}
              onClick={() => performAction("verify")}
              className="inline-flex items-center gap-2 border border-green bg-green px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-deep-green disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CheckCircle2 size={13} />
              Verify
            </button>
          )}

          {String(status).toLowerCase() !== "rejected" && (
            <button
              type="button"
              disabled={processing}
              onClick={() => performAction("reject")}
              className="inline-flex items-center gap-2 border border-line bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-muted transition hover:border-red-200 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <XCircle size={13} />
              Reject
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   USER MODAL
========================================================= */

const UserDetailsModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-deep-green/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-line bg-paper shadow-2xl">
        <div className="flex items-center justify-between border-b border-line bg-white px-5 py-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-green">
              User profile
            </p>
            <h2 className="mt-1 text-lg font-semibold text-ink">
              Account details
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center border border-line text-muted transition hover:border-ink hover:text-ink"
          >
            <X size={17} />
          </button>
        </div>

        <div className="grid gap-px bg-line sm:grid-cols-2">
          <div className="bg-paper p-5">
            <p className="text-[10px] uppercase tracking-[0.16em] text-muted">
              Name
            </p>
            <p className="mt-2 text-sm font-semibold text-ink">
              {user.full_name ||
                user.name ||
                `${user.first_name || ""} ${
                  user.last_name || ""
                }`.trim() ||
                "—"}
            </p>
          </div>

          <div className="bg-paper p-5">
            <p className="text-[10px] uppercase tracking-[0.16em] text-muted">
              Email
            </p>
            <p className="mt-2 break-all text-sm font-semibold text-ink">
              {user.email || "—"}
            </p>
          </div>

          <div className="bg-paper p-5">
            <p className="text-[10px] uppercase tracking-[0.16em] text-muted">
              Role
            </p>
            <p className="mt-2 text-sm font-semibold capitalize text-ink">
              {user.role || "—"}
            </p>
          </div>

          <div className="bg-paper p-5">
            <p className="text-[10px] uppercase tracking-[0.16em] text-muted">
              Verification
            </p>
            <div className="mt-2">
              <StatusBadge
                status={
                  user.is_verified ? "verified" : "pending"
                }
              />
            </div>
          </div>

          <div className="bg-paper p-5">
            <p className="text-[10px] uppercase tracking-[0.16em] text-muted">
              Joined
            </p>
            <p className="mt-2 text-sm font-semibold text-ink">
              {formatDate(user.created_at)}
            </p>
          </div>

          <div className="bg-paper p-5">
            <p className="text-[10px] uppercase tracking-[0.16em] text-muted">
              User ID
            </p>
            <p className="mt-2 text-sm font-semibold text-ink">
              #{user.id ?? "—"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   DONATION MODAL
========================================================= */

const DonationDetailsModal = ({ donation, onClose }) => {
  if (!donation) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-deep-green/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto border border-line bg-paper shadow-2xl">
        <div className="flex items-center justify-between border-b border-line bg-white px-5 py-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-green">
              Donation record
            </p>

            <h2 className="mt-1 text-lg font-semibold text-ink">
              {donation.food_name ||
                donation.name ||
                "Food donation"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center border border-line text-muted transition hover:border-ink hover:text-ink"
          >
            <X size={17} />
          </button>
        </div>

        <div className="grid gap-px bg-line sm:grid-cols-2">
          <div className="bg-paper p-5">
            <p className="text-[10px] uppercase tracking-[0.16em] text-muted">
              Food type
            </p>
            <p className="mt-2 text-sm font-semibold text-ink">
              {donation.food_type || "—"}
            </p>
          </div>

          <div className="bg-paper p-5">
            <p className="text-[10px] uppercase tracking-[0.16em] text-muted">
              Status
            </p>
            <div className="mt-2">
              <StatusBadge status={donation.status} />
            </div>
          </div>

          <div className="bg-paper p-5">
            <p className="text-[10px] uppercase tracking-[0.16em] text-muted">
              Quantity
            </p>
            <p className="mt-2 text-sm font-semibold text-ink">
              {donation.quantity ?? "—"}{" "}
              {donation.unit || ""}
            </p>
          </div>

          <div className="bg-paper p-5">
            <p className="text-[10px] uppercase tracking-[0.16em] text-muted">
              Expiry
            </p>
            <p className="mt-2 text-sm font-semibold text-ink">
              {formatDate(donation.expiry_at || donation.expiry)}
            </p>
          </div>

          <div className="bg-paper p-5 sm:col-span-2">
            <p className="text-[10px] uppercase tracking-[0.16em] text-muted">
              Description
            </p>

            <p className="mt-2 text-sm leading-6 text-ink">
              {donation.description ||
                "No description provided."}
            </p>
          </div>

          <div className="bg-paper p-5">
            <p className="text-[10px] uppercase tracking-[0.16em] text-muted">
              Location
            </p>

            <p className="mt-2 text-sm leading-6 text-ink">
              {[
                donation.address,
                donation.city,
                donation.state,
              ]
                .filter(Boolean)
                .join(", ") || "—"}
            </p>
          </div>

          <div className="bg-paper p-5">
            <p className="text-[10px] uppercase tracking-[0.16em] text-muted">
              Created
            </p>

            <p className="mt-2 text-sm font-semibold text-ink">
              {formatDate(donation.created_at)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   MAIN DASHBOARD
========================================================= */

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [organisations, setOrganisations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");

  const [userSearch, setUserSearch] = useState("");
  const [userFilter, setUserFilter] = useState("all");

  const [donationSearch, setDonationSearch] = useState("");
  const [donationStatus, setDonationStatus] = useState("all");

  const [deliverySearch, setDeliverySearch] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState("all");

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedDonation, setSelectedDonation] =
    useState(null);

  /* =======================================================
     AUTH
  ======================================================= */

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);

      if (parsedUser?.role !== "admin") {
        navigate("/");
      }
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
      navigate("/login");
    }
  }, [navigate]);

  /* =======================================================
     FETCH DATA
  ======================================================= */

  const fetchAdminData = async (showSpinner = false) => {
    try {
      if (showSpinner) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const token = localStorage.getItem("access_token");

      if (!token) {
        navigate("/login");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const responses = await Promise.all([
        fetch(`${API_URL}/admin/overview`, {
          headers,
        }),
        fetch(`${API_URL}/admin/users`, {
          headers,
        }),
        fetch(`${API_URL}/admin/donations`, {
          headers,
        }),
        fetch(`${API_URL}/admin/deliveries`, {
          headers,
        }),
        fetch(`${API_URL}/admin/organisations`, {
          headers,
        }),
      ]);

      const overviewResponse = responses[0];

      if (
        overviewResponse.status === 401 ||
        overviewResponse.status === 403
      ) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      const [
        overviewData,
        usersData,
        donationsData,
        deliveriesData,
        organisationsData,
      ] = await Promise.all(
        responses.map(async (response) => {
          const data = await response.json().catch(() => ({}));

          if (!response.ok) {
            throw new Error(
              data?.detail ||
                data?.message ||
                "Unable to load admin data."
            );
          }

          return data;
        })
      );

      setOverview(overviewData);

      setUsers(
        Array.isArray(usersData)
          ? usersData
          : usersData?.users || []
      );

      setDonations(
        Array.isArray(donationsData)
          ? donationsData
          : donationsData?.donations || []
      );

      setDeliveries(
        Array.isArray(deliveriesData)
          ? deliveriesData
          : deliveriesData?.deliveries || []
      );

      setOrganisations(
        Array.isArray(organisationsData)
          ? organisationsData
          : organisationsData?.organisations || []
      );
    } catch (err) {
      console.error("Admin dashboard error:", err);

      setError(
        err?.message ||
          "Something went wrong while loading the dashboard."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  /* =======================================================
     FILTERS
  ======================================================= */

  const filteredUsers = useMemo(() => {
    const query = userSearch.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        [
          user.full_name,
          user.name,
          user.first_name,
          user.last_name,
          user.email,
          user.role,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(query)
          );

      const matchesFilter =
        userFilter === "all" ||
        String(user.role || "").toLowerCase() ===
          userFilter.toLowerCase();

      return matchesSearch && matchesFilter;
    });
  }, [users, userSearch, userFilter]);

  const filteredDonations = useMemo(() => {
    const query = donationSearch.trim().toLowerCase();

    return donations.filter((donation) => {
      const matchesSearch =
        !query ||
        [
          donation.food_name,
          donation.food_type,
          donation.description,
          donation.city,
          donation.state,
          donation.status,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(query)
          );

      const matchesStatus =
        donationStatus === "all" ||
        String(donation.status || "").toLowerCase() ===
          donationStatus.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [donations, donationSearch, donationStatus]);

  const filteredDeliveries = useMemo(() => {
    const query = deliverySearch.trim().toLowerCase();

    return deliveries.filter((delivery) => {
      const matchesSearch =
        !query ||
        [
          delivery.status,
          delivery.pickup_address,
          delivery.delivery_address,
          delivery.volunteer_name,
          delivery.recipient_name,
          delivery.donor_name,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(query)
          );

      const matchesStatus =
        deliveryStatus === "all" ||
        String(delivery.status || "").toLowerCase() ===
          deliveryStatus.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [deliveries, deliverySearch, deliveryStatus]);

  /* =======================================================
     IMPACT
  ======================================================= */

  const impact = overview?.impact || {};

  const totalDonations =
    impact.total_donations ??
    overview?.total_donations ??
    donations.length;

  const deliveredDonations =
    impact.delivered_donations ??
    overview?.delivered_donations ??
    donations.filter(
      (item) =>
        String(item.status).toLowerCase() === "delivered"
    ).length;

  const totalDeliveries =
    impact.total_deliveries ??
    overview?.total_deliveries ??
    deliveries.length;

  const deliveredDeliveries =
    impact.completed_deliveries ??
    impact.delivered_deliveries ??
    overview?.completed_deliveries ??
    deliveries.filter((item) =>
      ["delivered", "completed"].includes(
        String(item.status).toLowerCase()
      )
    ).length;

  const deliveryRate =
    totalDeliveries > 0
      ? Math.round(
          (deliveredDeliveries / totalDeliveries) * 100
        )
      : 0;

  const donationDeliveryRate =
    totalDonations > 0
      ? Math.round(
          (deliveredDonations / totalDonations) * 100
        )
      : 0;

  const activeDonors =
    overview?.active_donors ??
    users.filter(
      (user) =>
        String(user.role).toLowerCase() === "donor"
    ).length;

  const activeRecipients =
    overview?.active_recipients ??
    users.filter(
      (user) =>
        String(user.role).toLowerCase() === "recipient"
    ).length;

  const activeVolunteers =
    overview?.active_volunteers ??
    users.filter(
      (user) =>
        String(user.role).toLowerCase() === "volunteer"
    ).length;

  const verifiedOrganisations =
    overview?.verified_organisations ??
    organisations.filter(
      (organisation) =>
        organisation.is_verified === true ||
        String(
          organisation.verification_status ||
            organisation.status ||
            ""
        ).toLowerCase() === "verified"
    ).length;

  /* =======================================================
     LOGOUT
  ======================================================= */

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  /* =======================================================
     NAVIGATION
  ======================================================= */

  const navigation = [
    {
      id: "overview",
      label: "Overview",
      icon: LayoutDashboard,
    },
    {
      id: "users",
      label: "Users",
      icon: Users,
      count: users.length,
    },
    {
      id: "donations",
      label: "Donations",
      icon: Utensils,
      count: donations.length,
    },
    {
      id: "deliveries",
      label: "Deliveries",
      icon: Truck,
      count: deliveries.length,
    },
    {
      id: "verification",
      label: "Verification",
      icon: ShieldCheck,
      count: organisations.filter(
        (organisation) =>
          String(
            organisation.verification_status ||
              organisation.status ||
              ""
          ).toLowerCase() === "pending"
      ).length,
    },
  ];

  const changeSection = (section) => {
    setActiveSection(section);
    setSidebarOpen(false);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center border border-green/20 bg-white">
            <RefreshCw
              size={19}
              className="animate-spin text-green"
            />
          </div>

          <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.22em] text-green">
            FoodBridge AI
          </p>

          <p className="mt-2 text-xs text-muted">
            Preparing admin console...
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     SIDEBAR
  ======================================================= */

  const Sidebar = () => (
    <>
      <div
        className={`fixed inset-0 z-40 bg-deep-green/60 transition-opacity lg:hidden ${
          sidebarOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col bg-deep-green text-white transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div className="border-b border-white/10 px-6 py-6">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="group"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-light-green">
                FoodBridge
              </p>

              <h1 className="mt-1 text-xl font-semibold tracking-[-0.03em]">
                AI
              </h1>
            </Link>

            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="flex h-8 w-8 items-center justify-center border border-white/10 text-white/60 lg:hidden"
            >
              <X size={16} />
            </button>
          </div>

          <div className="mt-7 border-l border-light-green/40 pl-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-white/50">
              Admin console
            </p>

            <p className="mt-1 text-xs leading-5 text-white/70">
              Monitor the network. Protect the mission.
            </p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-6">
          <p className="px-3 pb-3 text-[9px] font-bold uppercase tracking-[0.2em] text-white/35">
            Workspace
          </p>

          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => changeSection(item.id)}
                  className={`group flex w-full items-center justify-between border-l-2 px-3 py-3 text-left transition ${
                    active
                      ? "border-light-green bg-white/[0.07] text-white"
                      : "border-transparent text-white/55 hover:border-white/20 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon
                      size={16}
                      strokeWidth={1.6}
                    />

                    <span className="text-xs font-medium">
                      {item.label}
                    </span>
                  </span>

                  {item.count !== undefined && (
                    <span
                      className={`text-[10px] ${
                        active
                          ? "text-light-green"
                          : "text-white/30"
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-white/10 p-4">
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 border border-white/10 px-3 py-3 text-left text-white/55 transition hover:border-white/20 hover:bg-white/[0.04] hover:text-white"
          >
            <LogOut
              size={16}
              strokeWidth={1.6}
            />

            <span className="text-xs font-medium">
              Sign out
            </span>
          </button>
        </div>
      </aside>
    </>
  );

  /* =======================================================
     HEADER
  ======================================================= */

  const Header = () => {
    const currentNav = navigation.find(
      (item) => item.id === activeSection
    );

    return (
      <header className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur">
        <div className="flex h-[76px] items-center justify-between px-5 lg:px-8">
          <div className="flex min-w-0 items-center gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex h-9 w-9 shrink-0 items-center justify-center border border-line bg-white text-ink lg:hidden"
            >
              <Menu size={18} />
            </button>

            <div className="min-w-0">
              <div className="hidden items-center gap-2 text-[9px] font-bold uppercase tracking-[0.16em] text-muted sm:flex">
                <span>FoodBridge</span>
                <span>/</span>
                <span>Admin</span>
              </div>

              <h2 className="truncate text-base font-semibold text-ink sm:mt-1 sm:text-lg">
                {currentNav?.label || "Overview"}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fetchAdminData(true)}
              disabled={refreshing}
              className="flex h-9 items-center gap-2 border border-line bg-white px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-muted transition hover:border-green hover:text-green disabled:opacity-50"
            >
              <RefreshCw
                size={13}
                className={
                  refreshing ? "animate-spin" : ""
                }
              />

              <span className="hidden sm:inline">
                Refresh
              </span>
            </button>

            <Link
              to="/"
              className="hidden h-9 items-center gap-2 border border-line bg-white px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-muted transition hover:border-green hover:text-green sm:flex"
            >
              Home
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </header>
    );
  };

  /* =======================================================
     ERROR
  ======================================================= */

  const ErrorBanner = () => {
    if (!error) return null;

    return (
      <div className="mb-8 flex items-start gap-3 border border-red-200 bg-red-50 p-4 text-red-700">
        <CircleAlert
          size={17}
          className="mt-0.5 shrink-0"
        />

        <div className="min-w-0">
          <p className="text-xs font-semibold">
            Dashboard data could not be fully loaded.
          </p>

          <p className="mt-1 text-xs leading-5 text-red-600">
            {error}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setError("")}
          className="ml-auto shrink-0 text-red-500 hover:text-red-700"
        >
          <X size={15} />
        </button>
      </div>
    );
  };

  /* =======================================================
     OVERVIEW
  ======================================================= */

  const renderOverview = () => (
    <div className="space-y-12">
      <section className="relative overflow-hidden border border-line bg-deep-green px-6 py-8 text-white sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <div className="absolute -right-24 -top-24 h-64 w-64 border border-white/10 rounded-full" />
        <div className="absolute -bottom-40 right-20 h-72 w-72 border border-white/5 rounded-full" />

        <div className="relative max-w-3xl">
          <SectionEyebrow>
            Network overview
          </SectionEyebrow>

          <h1 className="max-w-2xl text-4xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-5xl lg:text-6xl">
            THE NETWORK
            <br />
            IN MOTION.
          </h1>

          <p className="mt-6 max-w-xl text-sm leading-7 text-white/65">
            FoodBridge connects surplus food with people and
            communities that need it. This console gives you a
            clear view of what is happening across the network.
          </p>

          <div className="mt-8 flex flex-wrap gap-6 border-t border-white/10 pt-5 text-[10px] font-bold uppercase tracking-[0.15em] text-white/45">
            <span>
              {formatNumber(activeDonors)} active donors
            </span>

            <span>
              {formatNumber(activeRecipients)} recipients
            </span>

            <span>
              {formatNumber(activeVolunteers)} volunteers
            </span>
          </div>
        </div>
      </section>

      <section>
        <div className="grid gap-px border border-line bg-line sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total users"
            value={formatNumber(
              overview?.total_users ?? users.length
            )}
            detail="Registered members across the platform"
            icon={Users}
          />

          <StatCard
            label="Food donations"
            value={formatNumber(totalDonations)}
            detail="Food contributions entering the network"
            icon={Utensils}
          />

          <StatCard
            label="Deliveries"
            value={formatNumber(totalDeliveries)}
            detail="Redistribution journeys recorded"
            icon={Truck}
          />

          <StatCard
            label="Pending verification"
            value={formatNumber(
              overview?.pending_verification ??
                organisations.filter(
                  (organisation) =>
                    String(
                      organisation.verification_status ||
                        organisation.status ||
                        ""
                    ).toLowerCase() === "pending"
                ).length
            )}
            detail="Organisations waiting for review"
            icon={ShieldCheck}
          />
        </div>
      </section>

      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <SectionEyebrow>
            Impact intelligence
          </SectionEyebrow>

          <h2 className="max-w-xl text-3xl font-semibold leading-tight tracking-[-0.04em] text-ink sm:text-4xl">
            SURPLUS BECOMES
            <br />
            POSSIBILITY.
          </h2>

          <p className="mt-5 max-w-lg text-sm leading-7 text-muted">
            Every successful delivery represents food that
            moved somewhere it could make a difference.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-7 border-t border-line pt-6">
            <ImpactCard
              label="Meals rescued"
              value={formatNumber(
                impact.meals_rescued ??
                  impact.total_meals ??
                  overview?.meals_rescued ??
                  0
              )}
              description="Estimated meals redirected"
            />

            <ImpactCard
              label="Food saved"
              value={formatNumber(
                impact.food_saved ??
                  impact.food_saved_kg ??
                  overview?.food_saved ??
                  0
              )}
              description="Recorded food quantity"
            />

            <ImpactCard
              label="People supported"
              value={formatNumber(
                impact.people_supported ??
                  overview?.people_supported ??
                  0
              )}
              description="People reached through the network"
            />

            <ImpactCard
              label="Successful deliveries"
              value={formatNumber(deliveredDeliveries)}
              description="Completed redistribution journeys"
            />
          </div>
        </div>

        <div className="border border-line bg-white p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-green">
                Delivery completion
              </p>

              <p className="mt-3 text-5xl font-semibold tracking-[-0.06em] text-ink">
                {deliveryRate}%
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center border border-line bg-paper text-green">
              <PackageCheck
                size={18}
                strokeWidth={1.5}
              />
            </div>
          </div>

          <div className="mt-8">
            <div className="h-2 bg-paper">
              <div
                className="h-full bg-green transition-all duration-700"
                style={{
                  width: `${Math.min(
                    Math.max(deliveryRate, 0),
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

          <div className="mt-4 flex justify-between text-[10px] uppercase tracking-[0.12em] text-muted">
            <span>
              {formatNumber(deliveredDeliveries)} completed
            </span>

            <span>
              {formatNumber(totalDeliveries)} total
            </span>
          </div>

          <div className="mt-8 border-t border-line pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle2
                size={16}
                className="text-green"
              />

              <p className="text-xs font-medium text-ink">
                {donationDeliveryRate}% of recorded donations
                have reached a delivery outcome.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <SectionEyebrow>
              Network composition
            </SectionEyebrow>

            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-ink">
              WHO KEEPS IT MOVING?
            </h2>
          </div>

          <p className="max-w-sm text-xs leading-5 text-muted">
            The platform depends on several connected roles,
            each responsible for moving food closer to impact.
          </p>
        </div>

        <div className="grid gap-px border border-line bg-line md:grid-cols-3">
          <div className="bg-white p-6">
            <HeartHandshake
              size={19}
              className="text-green"
              strokeWidth={1.5}
            />

            <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
              Donors
            </p>

            <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-ink">
              {formatNumber(activeDonors)}
            </p>

            <p className="mt-2 text-xs leading-5 text-muted">
              Businesses and individuals supplying surplus.
            </p>
          </div>

          <div className="bg-white p-6">
            <HandHeart
              size={19}
              className="text-green"
              strokeWidth={1.5}
            />

            <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
              Recipients
            </p>

            <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-ink">
              {formatNumber(activeRecipients)}
            </p>

            <p className="mt-2 text-xs leading-5 text-muted">
              People and organisations receiving food support.
            </p>
          </div>

          <div className="bg-white p-6">
            <Truck
              size={19}
              className="text-green"
              strokeWidth={1.5}
            />

            <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
              Volunteers
            </p>

            <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-ink">
              {formatNumber(activeVolunteers)}
            </p>

            <p className="mt-2 text-xs leading-5 text-muted">
              People helping move food through the network.
            </p>
          </div>
        </div>
      </section>

      <section className="border border-line bg-white">
        <div className="border-b border-line px-5 py-5 sm:px-6">
          <SectionEyebrow>
            Rescue pipeline
          </SectionEyebrow>

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-ink">
              FROM SURPLUS TO SUPPORT.
            </h2>

            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
              Live operational view
            </span>
          </div>
        </div>

        <div className="grid gap-px bg-line md:grid-cols-4">
          {[
            {
              number: "01",
              title: "Donate",
              text: "Surplus food enters the platform.",
              icon: Utensils,
            },
            {
              number: "02",
              title: "Match",
              text: "Food is connected to relevant needs.",
              icon: Scale,
            },
            {
              number: "03",
              title: "Move",
              text: "A volunteer coordinates delivery.",
              icon: Truck,
            },
            {
              number: "04",
              title: "Impact",
              text: "Food reaches people who need it.",
              icon: HeartHandshake,
            },
          ].map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="bg-paper p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-[0.16em] text-green">
                    {step.number}
                  </span>

                  <Icon
                    size={16}
                    className="text-muted"
                    strokeWidth={1.5}
                  />
                </div>

                <h3 className="mt-10 text-sm font-semibold text-ink">
                  {step.title}
                </h3>

                <p className="mt-2 text-xs leading-5 text-muted">
                  {step.text}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="border border-line bg-white">
          <div className="border-b border-line px-5 py-5">
            <SectionEyebrow>
              Donation state
            </SectionEyebrow>

            <h2 className="text-lg font-semibold text-ink">
              Current donations
            </h2>
          </div>

          <div className="divide-y divide-line">
            {donations.length === 0 ? (
              <div className="p-5 text-xs text-muted">
                No donation records available.
              </div>
            ) : (
              donations.slice(0, 6).map((donation) => (
                <button
                  type="button"
                  key={donation.id}
                  onClick={() =>
                    setSelectedDonation(donation)
                  }
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-paper"
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-ink">
                      {donation.food_name ||
                        donation.name ||
                        "Food donation"}
                    </p>

                    <p className="mt-1 truncate text-[11px] text-muted">
                      {donation.city ||
                        donation.food_type ||
                        "No location"}
                    </p>
                  </div>

                  <StatusBadge status={donation.status} />
                </button>
              ))
            )}
          </div>
        </div>

        <div className="border border-line bg-white">
          <div className="border-b border-line px-5 py-5">
            <SectionEyebrow>
              Delivery state
            </SectionEyebrow>

            <h2 className="text-lg font-semibold text-ink">
              Current movement
            </h2>
          </div>

          <div className="divide-y divide-line">
            {deliveries.length === 0 ? (
              <div className="p-5 text-xs text-muted">
                No delivery records available.
              </div>
            ) : (
              deliveries.slice(0, 6).map((delivery) => (
                <div
                  key={delivery.id}
                  className="flex items-center justify-between gap-4 px-5 py-4"
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-ink">
                      {delivery.volunteer_name ||
                        delivery.recipient_name ||
                        `Delivery #${delivery.id}`}
                    </p>

                    <p className="mt-1 truncate text-[11px] text-muted">
                      {delivery.pickup_address ||
                        "Pickup location pending"}
                    </p>
                  </div>

                  <StatusBadge status={delivery.status} />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="border border-green/20 bg-green p-6 text-white sm:p-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-light-green">
              <Sparkles size={13} />
              Mission
            </div>

            <h2 className="mt-4 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
              Every meal redirected is a problem prevented.
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/65">
              Keep the network healthy, transparent and moving.
            </p>
          </div>

          <div className="shrink-0">
            <HeartHandshake
              size={42}
              strokeWidth={1}
              className="text-light-green"
            />
          </div>
        </div>
      </section>
    </div>
  );

  /* =======================================================
     USERS
  ======================================================= */

  const renderUsers = () => (
    <div className="space-y-8">
      <section>
        <SectionEyebrow>
          Platform members
        </SectionEyebrow>

        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <h1 className="text-4xl font-semibold tracking-[-0.05em] text-ink">
              USERS.
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
              Review the people responsible for keeping
              FoodBridge moving.
            </p>
          </div>

          <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted">
            {formatNumber(filteredUsers.length)} records
          </div>
        </div>
      </section>

      <section className="border border-line bg-white">
        <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />

            <input
              value={userSearch}
              onChange={(event) =>
                setUserSearch(event.target.value)
              }
              placeholder="Search users..."
              className="h-10 w-full border border-line bg-paper pl-9 pr-3 text-xs text-ink outline-none transition placeholder:text-muted focus:border-green"
            />
          </div>

          <select
            value={userFilter}
            onChange={(event) =>
              setUserFilter(event.target.value)
            }
            className="h-10 border border-line bg-paper px-3 text-xs text-ink outline-none focus:border-green"
          >
            <option value="all">All roles</option>
            <option value="admin">Admin</option>
            <option value="donor">Donor</option>
            <option value="recipient">Recipient</option>
            <option value="volunteer">Volunteer</option>
          </select>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon={Users}
              title="No users found"
              description="Try changing your search or role filter."
            />
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[760px] border-collapse">
                <thead>
                  <tr className="border-b border-line bg-paper text-left">
                    <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-[0.16em] text-muted">
                      User
                    </th>
                    <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-[0.16em] text-muted">
                      Role
                    </th>
                    <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-[0.16em] text-muted">
                      Verification
                    </th>
                    <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-[0.16em] text-muted">
                      Joined
                    </th>
                    <th className="px-5 py-3 text-right text-[9px] font-bold uppercase tracking-[0.16em] text-muted">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-line last:border-0 hover:bg-paper"
                    >
                      <td className="px-5 py-4">
                        <div>
                          <p className="text-xs font-semibold text-ink">
                            {user.full_name ||
                              user.name ||
                              `${user.first_name || ""} ${
                                user.last_name || ""
                              }`.trim() ||
                              "Unnamed user"}
                          </p>

                          <p className="mt-1 text-[11px] text-muted">
                            {user.email || "No email"}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-xs capitalize text-ink">
                          {user.role || "—"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge
                          status={
                            user.is_verified
                              ? "verified"
                              : "pending"
                          }
                        />
                      </td>

                      <td className="px-5 py-4 text-xs text-muted">
                        {formatDate(user.created_at)}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedUser(user)
                          }
                          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-green hover:text-deep-green"
                        >
                          View
                          <ArrowRight size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-line md:hidden">
              {filteredUsers.map((user) => (
                <button
                  type="button"
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className="flex w-full items-start justify-between gap-4 p-4 text-left"
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-ink">
                      {user.full_name ||
                        user.name ||
                        `${user.first_name || ""} ${
                          user.last_name || ""
                        }`.trim() ||
                        "Unnamed user"}
                    </p>

                    <p className="mt-1 truncate text-[11px] text-muted">
                      {user.email || "No email"}
                    </p>

                    <p className="mt-3 text-[10px] uppercase tracking-[0.12em] text-muted">
                      {user.role || "Unknown"} ·{" "}
                      {formatDate(user.created_at)}
                    </p>
                  </div>

                  <ArrowRight
                    size={15}
                    className="mt-1 shrink-0 text-green"
                  />
                </button>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );

  /* =======================================================
     DONATIONS
  ======================================================= */

  const renderDonations = () => (
    <div className="space-y-8">
      <section>
        <SectionEyebrow>
          Food network
        </SectionEyebrow>

        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <h1 className="text-4xl font-semibold tracking-[-0.05em] text-ink">
              DONATIONS.
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
              Track food entering the FoodBridge redistribution
              pipeline.
            </p>
          </div>

          <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted">
            {formatNumber(filteredDonations.length)} records
          </div>
        </div>
      </section>

      <section className="border border-line bg-white">
        <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />

            <input
              value={donationSearch}
              onChange={(event) =>
                setDonationSearch(event.target.value)
              }
              placeholder="Search donations..."
              className="h-10 w-full border border-line bg-paper pl-9 pr-3 text-xs text-ink outline-none transition placeholder:text-muted focus:border-green"
            />
          </div>

          <select
            value={donationStatus}
            onChange={(event) =>
              setDonationStatus(event.target.value)
            }
            className="h-10 border border-line bg-paper px-3 text-xs text-ink outline-none focus:border-green"
          >
            <option value="all">All statuses</option>
            <option value="available">Available</option>
            <option value="matched">Matched</option>
            <option value="reserved">Reserved</option>
            <option value="picked_up">Picked up</option>
            <option value="delivered">Delivered</option>
            <option value="expired">Expired</option>
          </select>
        </div>

        {filteredDonations.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon={Utensils}
              title="No donations found"
              description="There are no donation records matching your filters."
            />
          </div>
        ) : (
          <div className="divide-y divide-line">
            {filteredDonations.map((donation) => {
              const expiry =
                donation.expiry_at ||
                donation.expiry ||
                donation.expires_at;

              const isExpired =
                expiry &&
                new Date(expiry).getTime() <
                  Date.now();

              return (
                <div
                  key={donation.id}
                  className="p-5 transition hover:bg-paper sm:p-6"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-line bg-paper text-green">
                        <Utensils
                          size={17}
                          strokeWidth={1.5}
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-sm font-semibold text-ink">
                            {donation.food_name ||
                              donation.name ||
                              "Food donation"}
                          </h3>

                          <StatusBadge
                            status={donation.status}
                          />
                        </div>

                        <p className="mt-1 text-xs text-muted">
                          {donation.food_type ||
                            "Food item"}{" "}
                          ·{" "}
                          {donation.quantity ?? "—"}{" "}
                          {donation.unit || ""}
                        </p>

                        <p className="mt-2 line-clamp-1 text-xs text-muted">
                          {[
                            donation.address,
                            donation.city,
                            donation.state,
                          ]
                            .filter(Boolean)
                            .join(", ") ||
                            "Location not provided"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-5 lg:justify-end">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted">
                          Expiry
                        </p>

                        <p
                          className={`mt-1 text-xs font-semibold ${
                            isExpired
                              ? "text-red-600"
                              : "text-ink"
                          }`}
                        >
                          {formatDate(expiry)}
                        </p>
                      </div>

                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted">
                          Added
                        </p>

                        <p className="mt-1 text-xs font-semibold text-ink">
                          {formatDate(
                            donation.created_at
                          )}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedDonation(donation)
                        }
                        className="flex h-9 items-center gap-2 border border-line bg-white px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-green transition hover:border-green"
                      >
                        Details
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );

  /* =======================================================
     DELIVERIES
  ======================================================= */

  const renderDeliveries = () => (
    <div className="space-y-8">
      <section>
        <SectionEyebrow>
          Movement network
        </SectionEyebrow>

        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <h1 className="text-4xl font-semibold tracking-[-0.05em] text-ink">
              DELIVERIES.
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
              Monitor the movement of donated food from pickup
              to recipient.
            </p>
          </div>

          <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted">
            {formatNumber(filteredDeliveries.length)} records
          </div>
        </div>
      </section>

      <section className="border border-line bg-white">
        <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />

            <input
              value={deliverySearch}
              onChange={(event) =>
                setDeliverySearch(event.target.value)
              }
              placeholder="Search deliveries..."
              className="h-10 w-full border border-line bg-paper pl-9 pr-3 text-xs text-ink outline-none transition placeholder:text-muted focus:border-green"
            />
          </div>

          <select
            value={deliveryStatus}
            onChange={(event) =>
              setDeliveryStatus(event.target.value)
            }
            className="h-10 border border-line bg-paper px-3 text-xs text-ink outline-none focus:border-green"
          >
            <option value="all">All statuses</option>
            <option value="assigned">Assigned</option>
            <option value="in_transit">In transit</option>
            <option value="picked_up">Picked up</option>
            <option value="delivered">Delivered</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {filteredDeliveries.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon={Truck}
              title="No deliveries found"
              description="There are no delivery records matching your filters."
            />
          </div>
        ) : (
          <div className="divide-y divide-line">
            {filteredDeliveries.map((delivery) => (
              <div
                key={delivery.id}
                className="p-5 sm:p-6"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
                  <div className="flex min-w-0 flex-1 items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-line bg-paper text-green">
                      <Truck
                        size={17}
                        strokeWidth={1.5}
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-ink">
                          Delivery #{delivery.id}
                        </p>

                        <StatusBadge
                          status={delivery.status}
                        />
                      </div>

                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted">
                            Pickup
                          </p>

                          <p className="mt-1 text-xs leading-5 text-ink">
                            {delivery.pickup_address ||
                              "Pickup location pending"}
                          </p>
                        </div>

                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted">
                            Destination
                          </p>

                          <p className="mt-1 text-xs leading-5 text-ink">
                            {delivery.delivery_address ||
                              delivery.recipient_name ||
                              "Destination pending"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-6 border-t border-line pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted">
                        Volunteer
                      </p>

                      <p className="mt-1 text-xs font-semibold text-ink">
                        {delivery.volunteer_name ||
                          "Unassigned"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted">
                        Recipient
                      </p>

                      <p className="mt-1 text-xs font-semibold text-ink">
                        {delivery.recipient_name ||
                          "Not specified"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted">
                        Updated
                      </p>

                      <p className="mt-1 text-xs font-semibold text-ink">
                        {formatDate(
                          delivery.updated_at ||
                            delivery.created_at
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );

  /* =======================================================
     VERIFICATION
  ======================================================= */

  const pendingOrganisations = organisations.filter(
    (organisation) =>
      String(
        organisation.verification_status ||
          organisation.status ||
          ""
      ).toLowerCase() === "pending"
  ).length;

  const renderVerification = () => (
    <div className="space-y-8">
      <section>
        <SectionEyebrow>
          Trust & verification
        </SectionEyebrow>

        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <h1 className="text-4xl font-semibold tracking-[-0.05em] text-ink">
              VERIFICATION.
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
              Review organisations before they participate
              fully in the FoodBridge network.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-px border border-line bg-line sm:grid-cols-3">
        <StatCard
          label="Total organisations"
          value={formatNumber(organisations.length)}
          icon={Building2}
        />

        <StatCard
          label="Pending review"
          value={formatNumber(pendingOrganisations)}
          icon={Clock3}
        />

        <StatCard
          label="Verified"
          value={formatNumber(verifiedOrganisations)}
          icon={UserCheck}
        />
      </section>

      <section className="border border-line bg-white">
        <div className="border-b border-line px-5 py-5">
          <SectionEyebrow>
            Organisation queue
          </SectionEyebrow>

          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-ink">
              Review organisations
            </h2>

            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
              {formatNumber(organisations.length)} total
            </span>
          </div>
        </div>

        {organisations.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon={Building2}
              title="No organisations"
              description="There are currently no organisation records to review."
            />
          </div>
        ) : (
          <div>
            {organisations.map((organisation) => (
              <OrganisationRow
                key={organisation.id}
                organisation={organisation}
                onUpdated={() => fetchAdminData(true)}
              />
            ))}
          </div>
        )}
      </section>

      <section className="border border-line bg-paper p-6 sm:p-8">
        <div className="flex gap-4">
          <ShieldCheck
            size={22}
            className="mt-1 shrink-0 text-green"
            strokeWidth={1.5}
          />

          <div>
            <h2 className="text-lg font-semibold text-ink">
              Why verification matters
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              Verification helps establish trust between donors,
              recipients and the organisations working within
              the FoodBridge ecosystem.
            </p>
          </div>
        </div>
      </section>
    </div>
  );

  /* =======================================================
     MAIN RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Sidebar />

      <div className="min-h-screen lg:pl-[280px]">
        <Header />

        <main className="px-5 py-8 lg:px-8 lg:py-10">
          <div className="mx-auto max-w-[1500px]">
            <ErrorBanner />

            {activeSection === "overview" &&
              renderOverview()}

            {activeSection === "users" && renderUsers()}

            {activeSection === "donations" &&
              renderDonations()}

            {activeSection === "deliveries" &&
              renderDeliveries()}

            {activeSection === "verification" &&
              renderVerification()}
          </div>
        </main>
      </div>

      <UserDetailsModal
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />

      <DonationDetailsModal
        donation={selectedDonation}
        onClose={() => setSelectedDonation(null)}
      />
    </div>
  );
};

export default AdminDashboard;