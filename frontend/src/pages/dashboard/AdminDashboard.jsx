import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowLeft,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Eye,
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
    return "bg-green-50 text-green-700 border-green-200";
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
    return "bg-amber-50 text-amber-700 border-amber-200";
  }

  if (
    ["rejected", "cancelled", "expired"].includes(normalized)
  ) {
    return "bg-red-50 text-red-700 border-red-200";
  }

  if (normalized === "picked_up") {
    return "bg-blue-50 text-blue-700 border-blue-200";
  }

  return "bg-gray-50 text-gray-600 border-gray-200";
};

const formatStatus = (status) => {
  if (!status) return "Unknown";

  return String(status)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const formatDate = (value) => {
  if (!value) return "—";

  try {
    return new Date(value).toLocaleString();
  } catch {
    return "—";
  }
};

const formatNumber = (value) => {
  return Number(value || 0).toLocaleString();
};

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
      status
    )}`}
  >
    {formatStatus(status)}
  </span>
);

/* =========================================================
   STAT CARD
========================================================= */

const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className="
      group
      w-full
      rounded-2xl
      border
      border-gray-200
      bg-white
      p-5
      text-left
      shadow-sm
      transition
      hover:-translate-y-0.5
      hover:border-green-200
      hover:shadow-md
    "
  >
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-gray-500">
          {title}
        </p>

        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
          {formatNumber(value)}
        </p>

        {description && (
          <p className="mt-1 text-xs text-gray-400">
            {description}
          </p>
        )}
      </div>

      <div
        className="
          flex
          h-11
          w-11
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-green-50
          text-green-700
          transition
          group-hover:bg-green-100
        "
      >
        <Icon size={21} />
      </div>
    </div>
  </button>
);

/* =========================================================
   IMPACT CARD
========================================================= */

const ImpactCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
}) => (
  <div
    className="
      relative
      overflow-hidden
      rounded-2xl
      border
      border-green-100
      bg-white
      p-5
      shadow-sm
      transition
      hover:-translate-y-0.5
      hover:shadow-md
    "
  >
    <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-green-50" />

    <div className="relative">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            {formatNumber(value)}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            {subtitle}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-700">
          <Icon size={21} />
        </div>
      </div>
    </div>
  </div>
);

/* =========================================================
   ORGANISATION ROW
========================================================= */

const OrganisationRow = ({
  organisation,
  onRefresh,
}) => {
  const [processing, setProcessing] = useState(false);
  const [actionError, setActionError] = useState("");

  const handleAction = async (action) => {
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            `Unable to ${action} organisation.`
        );
      }

      await onRefresh();
    } catch (error) {
      console.error(error);
      setActionError(error.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div
      className="
        rounded-2xl
        border
        border-gray-200
        bg-white
        p-5
        shadow-sm
      "
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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
              bg-green-50
              text-green-700
            "
          >
            <ShieldCheck size={21} />
          </div>

          <div>
            <h3 className="font-semibold text-gray-900">
              {organisation.organization_name ||
                "Unnamed Organisation"}
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              {organisation.full_name || "Unknown user"}
            </p>

            <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-400">
              <span>
                {organisation.organization_type ||
                  "Organisation"}
              </span>

              <span>•</span>

              <span>
                {organisation.city || "Unknown city"}
              </span>

              <span>•</span>

              <span>
                {organisation.state || "Unknown state"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge
            status={organisation.verification_status}
          />

          {organisation.verification_status ===
            "pending" && (
            <>
              <button
                type="button"
                disabled={processing}
                onClick={() => handleAction("verify")}
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-green-600
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-green-700
                  disabled:opacity-50
                "
              >
                <CheckCircle2 size={16} />
                Verify
              </button>

              <button
                type="button"
                disabled={processing}
                onClick={() => handleAction("reject")}
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-red-200
                  bg-red-50
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-red-600
                  transition
                  hover:bg-red-100
                  disabled:opacity-50
                "
              >
                <XCircle size={16} />
                Reject
              </button>
            </>
          )}
        </div>
      </div>

      {actionError && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {actionError}
        </div>
      )}
    </div>
  );
};

/* =========================================================
   USER MODAL
========================================================= */

const UserDetailsModal = ({
  user,
  onClose,
}) => {
  if (!user) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-black/40
        p-4
        backdrop-blur-sm
      "
      onClick={onClose}
    >
      <div
        className="
          w-full
          max-w-lg
          rounded-3xl
          bg-white
          p-6
          shadow-2xl
        "
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-green-600">
              User Details
            </p>

            <h2 className="mt-1 text-2xl font-bold text-gray-900">
              {user.full_name || "Unnamed User"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              rounded-xl
              p-2
              text-gray-400
              transition
              hover:bg-gray-100
              hover:text-gray-700
            "
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div className="rounded-2xl bg-gray-50 p-4">
            <p className="text-xs text-gray-400">
              Email
            </p>

            <p className="mt-1 break-all font-medium text-gray-800">
              {user.email || "—"}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-xs text-gray-400">
                Phone
              </p>

              <p className="mt-1 font-medium text-gray-800">
                {user.phone || "—"}
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-xs text-gray-400">
                Role
              </p>

              <p className="mt-1 font-medium capitalize text-gray-800">
                {user.role || "—"}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-xs text-gray-400">
                Verification
              </p>

              <div className="mt-2">
                <StatusBadge
                  status={
                    user.is_verified
                      ? "verified"
                      : "pending"
                  }
                />
              </div>
            </div>

            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-xs text-gray-400">
                Joined
              </p>

              <p className="mt-1 font-medium text-gray-800">
                {formatDate(user.created_at)}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="
            mt-6
            w-full
            rounded-xl
            bg-green-600
            py-3
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-green-700
          "
        >
          Close
        </button>
      </div>
    </div>
  );
};

/* =========================================================
   DONATION MODAL
========================================================= */

const DonationDetailsModal = ({
  donation,
  onClose,
}) => {
  if (!donation) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-black/40
        p-4
        backdrop-blur-sm
      "
      onClick={onClose}
    >
      <div
        className="
          max-h-[90vh]
          w-full
          max-w-2xl
          overflow-y-auto
          rounded-3xl
          bg-white
          p-6
          shadow-2xl
        "
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-green-600">
              Donation #{donation.id}
            </p>

            <h2 className="mt-1 text-2xl font-bold text-gray-900">
              {donation.food_name || "Food Donation"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-gray-400 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-gray-50 p-4">
            <p className="text-xs text-gray-400">
              Food Type
            </p>

            <p className="mt-1 font-medium text-gray-800">
              {donation.food_type || "—"}
            </p>
          </div>

          <div className="rounded-2xl bg-gray-50 p-4">
            <p className="text-xs text-gray-400">
              Quantity
            </p>

            <p className="mt-1 font-medium text-gray-800">
              {donation.quantity || "—"}{" "}
              {donation.quantity_unit || ""}
            </p>
          </div>

          <div className="rounded-2xl bg-gray-50 p-4">
            <p className="text-xs text-gray-400">
              Status
            </p>

            <div className="mt-2">
              <StatusBadge status={donation.status} />
            </div>
          </div>

          <div className="rounded-2xl bg-gray-50 p-4">
            <p className="text-xs text-gray-400">
              Donor
            </p>

            <p className="mt-1 font-medium text-gray-800">
              {donation.donor_name ||
                donation.full_name ||
                donation.donor_id ||
                "—"}
            </p>
          </div>

          <div className="rounded-2xl bg-gray-50 p-4">
            <p className="text-xs text-gray-400">
              Freshness Score
            </p>

            <p className="mt-1 font-bold text-green-700">
              {donation.freshness_score ?? "—"}/100
            </p>
          </div>

          <div className="rounded-2xl bg-gray-50 p-4">
            <p className="text-xs text-gray-400">
              Urgency Score
            </p>

            <p className="mt-1 font-bold text-amber-600">
              {donation.urgency_score ?? "—"}/100
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-gray-50 p-4">
          <p className="text-xs text-gray-400">
            Description
          </p>

          <p className="mt-1 text-sm leading-6 text-gray-700">
            {donation.description ||
              "No description provided."}
          </p>
        </div>

        <div className="mt-4 rounded-2xl bg-gray-50 p-4">
          <p className="text-xs text-gray-400">
            Location
          </p>

          <p className="mt-1 text-sm leading-6 text-gray-700">
            {donation.address || "—"}
            <br />
            {donation.city || ""}
            {donation.city && donation.state
              ? ", "
              : ""}
            {donation.state || ""}
          </p>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-gray-50 p-4">
            <p className="text-xs text-gray-400">
              Prepared At
            </p>

            <p className="mt-1 text-sm font-medium text-gray-800">
              {formatDate(donation.prepared_at)}
            </p>
          </div>

          <div className="rounded-2xl bg-gray-50 p-4">
            <p className="text-xs text-gray-400">
              Expiry Time
            </p>

            <p className="mt-1 text-sm font-medium text-gray-800">
              {formatDate(donation.expiry_time)}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="
            mt-6
            w-full
            rounded-xl
            bg-green-600
            py-3
            text-sm
            font-semibold
            text-white
            hover:bg-green-700
          "
        >
          Close
        </button>
      </div>
    </div>
  );
};

/* =========================================================
   MAIN ADMIN DASHBOARD
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

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [activeSection, setActiveSection] =
    useState("overview");

  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] =
    useState("all");

  const [donationSearch, setDonationSearch] =
    useState("");

  const [donationStatusFilter, setDonationStatusFilter] =
    useState("all");

  const [deliverySearch, setDeliverySearch] =
    useState("");

  const [deliveryStatusFilter, setDeliveryStatusFilter] =
    useState("all");

  const [selectedUser, setSelectedUser] =
    useState(null);

  const [selectedDonation, setSelectedDonation] =
    useState(null);

  /* =====================================================
     AUTH
  ===================================================== */

  useEffect(() => {
    const storedUser =
      localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    try {
      const parsedUser =
        JSON.parse(storedUser);

      if (parsedUser?.role !== "admin") {
        navigate("/");
      }
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  /* =====================================================
     FETCH DATA
  ===================================================== */

  const fetchAdminData = async (
    showSpinner = false
  ) => {
    try {
      if (showSpinner) {
        setRefreshing(true);
      }

      setError("");

      const token =
        localStorage.getItem("access_token");

      if (!token) {
        navigate("/login");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [
        overviewResponse,
        usersResponse,
        donationsResponse,
        deliveriesResponse,
        organisationsResponse,
      ] = await Promise.all([
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

      if (
        overviewResponse.status === 401 ||
        overviewResponse.status === 403
      ) {
        localStorage.removeItem(
          "access_token"
        );

        localStorage.removeItem("user");

        navigate("/login");

        return;
      }

      const overviewData =
        await overviewResponse.json();

      const usersData =
        await usersResponse.json();

      const donationsData =
        await donationsResponse.json();

      const deliveriesData =
        await deliveriesResponse.json();

      const organisationsData =
        await organisationsResponse.json();

      if (!overviewResponse.ok) {
        throw new Error(
          overviewData.detail ||
            "Unable to load admin overview."
        );
      }

      if (!usersResponse.ok) {
        throw new Error(
          usersData.detail ||
            "Unable to load users."
        );
      }

      if (!donationsResponse.ok) {
        throw new Error(
          donationsData.detail ||
            "Unable to load donations."
        );
      }

      if (!deliveriesResponse.ok) {
        throw new Error(
          deliveriesData.detail ||
            "Unable to load deliveries."
        );
      }

      if (!organisationsResponse.ok) {
        throw new Error(
          organisationsData.detail ||
            "Unable to load organisations."
        );
      }

      setOverview(overviewData);

      setUsers(
        Array.isArray(usersData)
          ? usersData
          : usersData.users || []
      );

      setDonations(
        Array.isArray(donationsData)
          ? donationsData
          : donationsData.donations || []
      );

      setDeliveries(
        Array.isArray(deliveriesData)
          ? deliveriesData
          : deliveriesData.deliveries || []
      );

      setOrganisations(
        Array.isArray(organisationsData)
          ? organisationsData
          : organisationsData.organisations ||
            []
      );
    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Unable to load admin dashboard."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  /* =====================================================
     FILTER USERS
  ===================================================== */

  const filteredUsers = useMemo(() => {
    const query =
      userSearch.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        String(user.full_name || "")
          .toLowerCase()
          .includes(query) ||
        String(user.email || "")
          .toLowerCase()
          .includes(query) ||
        String(user.phone || "")
          .toLowerCase()
          .includes(query);

      const matchesRole =
        userRoleFilter === "all" ||
        String(user.role || "").toLowerCase() ===
          userRoleFilter;

      return matchesSearch && matchesRole;
    });
  }, [
    users,
    userSearch,
    userRoleFilter,
  ]);

  /* =====================================================
     FILTER DONATIONS
  ===================================================== */

  const filteredDonations = useMemo(() => {
    const query =
      donationSearch.trim().toLowerCase();

    return donations.filter((donation) => {
      const matchesSearch =
        !query ||
        String(donation.food_name || "")
          .toLowerCase()
          .includes(query) ||
        String(donation.food_type || "")
          .toLowerCase()
          .includes(query) ||
        String(
          donation.donor_name ||
            donation.full_name ||
            donation.donor_id ||
            ""
        )
          .toLowerCase()
          .includes(query) ||
        String(donation.city || "")
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        donationStatusFilter === "all" ||
        String(donation.status || "").toLowerCase() ===
          donationStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [
    donations,
    donationSearch,
    donationStatusFilter,
  ]);

  /* =====================================================
     FILTER DELIVERIES
  ===================================================== */

  const filteredDeliveries = useMemo(() => {
    const query =
      deliverySearch.trim().toLowerCase();

    return deliveries.filter((delivery) => {
      const matchesSearch =
        !query ||
        String(delivery.food_name || "")
          .toLowerCase()
          .includes(query) ||
        String(delivery.volunteer_name || "")
          .toLowerCase()
          .includes(query) ||
        String(delivery.recipient_name || "")
          .toLowerCase()
          .includes(query) ||
        String(delivery.pickup_address || "")
          .toLowerCase()
          .includes(query) ||
        String(delivery.delivery_address || "")
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        deliveryStatusFilter === "all" ||
        String(delivery.status || "").toLowerCase() ===
          deliveryStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [
    deliveries,
    deliverySearch,
    deliveryStatusFilter,
  ]);

  /* =====================================================
     IMPACT VALUES
  ===================================================== */

  const impact = overview?.impact || {};

  const donationTotal =
    overview?.donations?.total || 0;

  const deliveredDonations =
    overview?.donations?.delivered || 0;

  const deliveryTotal =
    overview?.deliveries?.total || 0;

  const deliveredDeliveries =
    overview?.deliveries?.delivered || 0;

  const deliveryRate =
    deliveryTotal > 0
      ? Math.round(
          (deliveredDeliveries /
            deliveryTotal) *
            100
        )
      : 0;

  const donationDeliveryRate =
    donationTotal > 0
      ? Math.round(
          (deliveredDonations /
            donationTotal) *
            100
        )
      : 0;

  const activeDonors =
    overview?.users?.donors || 0;

  const recipients =
    overview?.users?.recipients || 0;

  const volunteers =
    overview?.users?.volunteers || 0;

  const verifiedOrganisations =
    overview?.verification?.verified || 0;

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  /* =====================================================
     SECTION CHANGE
  ===================================================== */

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setSidebarOpen(false);
  };

  const navigationItems = [
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
      icon: UserCheck,
      count:
        overview?.verification?.pending || 0,
    },
  ];

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f8f5]">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-700">
              <RefreshCw
                size={24}
                className="animate-spin"
              />
            </div>

            <p className="mt-4 font-medium text-gray-700">
              Loading admin dashboard...
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Please wait a moment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* =====================================================
     MAIN
  ===================================================== */

  return (
    <div className="min-h-screen bg-[#f7f8f5] text-gray-900">
      {/* MOBILE OVERLAY */}

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        />
      )}

      {/* SIDEBAR */}

      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          flex
          w-72
          flex-col
          border-r
          border-gray-200
          bg-[#0B2F1A]
          text-white
          transition-transform
          duration-300
          lg:translate-x-0
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        <div className="border-b border-white/10 px-6 py-6">
          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500 text-white shadow-lg">
              <HeartHandshake size={22} />
            </div>

            <div>
              <p className="font-bold tracking-tight">
                FoodBridge{" "}
                <span className="text-green-400">
                  AI
                </span>
              </p>

              <p className="text-xs text-green-100/60">
                Admin Console
              </p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-6">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            const active =
              activeSection === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  handleSectionChange(item.id)
                }
                className={`
                  flex
                  w-full
                  items-center
                  justify-between
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  font-medium
                  transition
                  ${
                    active
                      ? "bg-white text-green-900 shadow-sm"
                      : "text-green-50/75 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                <span className="flex items-center gap-3">
                  <Icon size={18} />
                  {item.label}
                </span>

                {item.count !== undefined && (
                  <span
                    className={`
                      rounded-full
                      px-2
                      py-0.5
                      text-[10px]
                      font-bold
                      ${
                        active
                          ? "bg-green-100 text-green-700"
                          : "bg-white/10 text-green-100"
                      }
                    `}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-4
              py-3
              text-sm
              font-medium
              text-green-50/75
              transition
              hover:bg-red-500/10
              hover:text-red-300
            "
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>

      {/* MAIN */}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-gray-200 bg-[#f7f8f5]/95 backdrop-blur">
          <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setSidebarOpen(true)
                }
                className="rounded-xl border border-gray-200 bg-white p-2.5 text-gray-600 lg:hidden"
              >
                <Menu size={20} />
              </button>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-green-600">
                  FoodBridge AI
                </p>

                <h1 className="text-xl font-bold tracking-tight text-gray-900">
                  Admin Dashboard
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  fetchAdminData(true)
                }
                disabled={refreshing}
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  px-3
                  py-2.5
                  text-sm
                  font-medium
                  text-gray-600
                  shadow-sm
                  transition
                  hover:border-green-200
                  hover:text-green-700
                  disabled:opacity-60
                "
              >
                <RefreshCw
                  size={16}
                  className={
                    refreshing
                      ? "animate-spin"
                      : ""
                  }
                />

                <span className="hidden sm:inline">
                  Refresh
                </span>
              </button>

              <Link
                to="/"
                className="
                  hidden
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  px-3
                  py-2.5
                  text-sm
                  font-medium
                  text-gray-600
                  shadow-sm
                  transition
                  hover:text-green-700
                  sm:inline-flex
                "
              >
                <ArrowLeft size={16} />
                Home
              </Link>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
              <CircleAlert
                size={19}
                className="mt-0.5 shrink-0"
              />

              <div>
                <p className="font-semibold">
                  Something went wrong
                </p>

                <p className="mt-1 text-sm">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* =================================================
              OVERVIEW + IMPACT ANALYTICS
          ================================================= */}

          {activeSection === "overview" && (
            <section>
              <div className="mb-7">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      Monitor the FoodBridge ecosystem from one place.
                    </p>

                    <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
                      Platform Overview
                    </h2>
                  </div>

                  <div className="inline-flex w-fit items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-2 text-xs font-semibold text-green-700">
                    <Activity size={14} />
                    Live platform data
                  </div>
                </div>
              </div>

              {/* TOP STATS */}

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  title="Total Users"
                  value={
                    overview?.users?.total || 0
                  }
                  icon={Users}
                  description="Registered platform users"
                  onClick={() =>
                    handleSectionChange("users")
                  }
                />

                <StatCard
                  title="Food Donations"
                  value={
                    overview?.donations?.total || 0
                  }
                  icon={Utensils}
                  description="Total donations created"
                  onClick={() =>
                    handleSectionChange(
                      "donations"
                    )
                  }
                />

                <StatCard
                  title="Deliveries"
                  value={
                    overview?.deliveries?.total || 0
                  }
                  icon={Truck}
                  description="Delivery records"
                  onClick={() =>
                    handleSectionChange(
                      "deliveries"
                    )
                  }
                />

                <StatCard
                  title="Pending Verification"
                  value={
                    overview?.verification?.pending ||
                    0
                  }
                  icon={ShieldCheck}
                  description="Organisations awaiting review"
                  onClick={() =>
                    handleSectionChange(
                      "verification"
                    )
                  }
                />
              </div>

              {/* =================================================
                  IMPACT HERO
              ================================================= */}

              <div className="relative mt-6 overflow-hidden rounded-3xl bg-[#0B2F1A] p-6 text-white shadow-xl sm:p-8">
                <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-green-500/10" />

                <div className="absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-green-400/10" />

                <div className="relative">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                      <div className="inline-flex items-center gap-2 rounded-full border border-green-400/20 bg-green-400/10 px-3 py-1.5 text-xs font-semibold text-green-300">
                        <Sparkles size={14} />
                        FoodBridge Impact
                      </div>

                      <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                        Turning surplus into measurable impact.
                      </h2>

                      <p className="mt-3 max-w-xl text-sm leading-6 text-green-50/70 sm:text-base">
                        Every donation, match and delivery contributes
                        to reducing food waste and supporting communities
                        that need food assistance.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                      <p className="text-xs uppercase tracking-wider text-green-200/60">
                        Delivery completion
                      </p>

                      <p className="mt-2 text-4xl font-bold">
                        {deliveryRate}%
                      </p>

                      <p className="mt-1 text-xs text-green-100/50">
                        Delivered deliveries
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* =================================================
                  IMPACT CARDS
              ================================================= */}

              <div className="mt-6">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    Impact at a Glance
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    The measurable difference created through FoodBridge.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <ImpactCard
                    title="Meals Rescued"
                    value={
                      impact.meals_rescued || 0
                    }
                    subtitle="Meals recovered from surplus food"
                    icon={Utensils}
                  />

                  <ImpactCard
                    title="Food Saved"
                    value={
                      impact.food_saved_kg || 0
                    }
                    subtitle="Kilograms of food rescued"
                    icon={Scale}
                  />

                  <ImpactCard
                    title="People Supported"
                    value={
                      impact.people_supported || 0
                    }
                    subtitle="People reached through donations"
                    icon={HandHeart}
                  />

                  <ImpactCard
                    title="Successful Deliveries"
                    value={
                      deliveredDeliveries
                    }
                    subtitle="Food deliveries completed"
                    icon={CheckCircle2}
                  />
                </div>
              </div>

              {/* =================================================
                  COMMUNITY NETWORK
              ================================================= */}

              <div className="mt-6 grid gap-6 xl:grid-cols-2">
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-700">
                      <HeartHandshake size={21} />
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-900">
                        Community Network
                      </h3>

                      <p className="text-sm text-gray-500">
                        People and organisations powering FoodBridge.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-gray-50 p-4">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Users size={16} />
                        <span className="text-xs">
                          Donors
                        </span>
                      </div>

                      <p className="mt-2 text-2xl font-bold text-gray-900">
                        {formatNumber(
                          activeDonors
                        )}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-gray-50 p-4">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Building2 size={16} />
                        <span className="text-xs">
                          Recipients
                        </span>
                      </div>

                      <p className="mt-2 text-2xl font-bold text-gray-900">
                        {formatNumber(
                          recipients
                        )}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-gray-50 p-4">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Truck size={16} />
                        <span className="text-xs">
                          Volunteers
                        </span>
                      </div>

                      <p className="mt-2 text-2xl font-bold text-gray-900">
                        {formatNumber(
                          volunteers
                        )}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-gray-50 p-4">
                      <div className="flex items-center gap-2 text-gray-500">
                        <ShieldCheck size={16} />
                        <span className="text-xs">
                          Verified Organisations
                        </span>
                      </div>

                      <p className="mt-2 text-2xl font-bold text-gray-900">
                        {formatNumber(
                          verifiedOrganisations
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* PIPELINE */}

                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900">
                        Rescue Pipeline
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        From donation to successful delivery.
                      </p>
                    </div>

                    <TrendingUp
                      size={21}
                      className="text-green-600"
                    />
                  </div>

                  <div className="mt-7 space-y-5">
                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-600">
                          Donations Created
                        </span>

                        <span className="font-bold text-gray-900">
                          {formatNumber(
                            donationTotal
                          )}
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-green-200"
                          style={{
                            width: "100%",
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-600">
                          Delivered Donations
                        </span>

                        <span className="font-bold text-gray-900">
                          {formatNumber(
                            deliveredDonations
                          )}
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-green-500"
                          style={{
                            width: `${donationDeliveryRate}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-600">
                          Completed Deliveries
                        </span>

                        <span className="font-bold text-gray-900">
                          {formatNumber(
                            deliveredDeliveries
                          )}
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-green-700"
                          style={{
                            width: `${deliveryRate}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 rounded-xl bg-green-50 p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2
                        size={18}
                        className="mt-0.5 shrink-0 text-green-700"
                      />

                      <div>
                        <p className="text-sm font-semibold text-green-900">
                          Food rescue progress
                        </p>

                        <p className="mt-1 text-xs leading-5 text-green-700">
                          {deliveryRate}% of recorded deliveries
                          have reached completed delivery status.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* =================================================
                  DONATION + DELIVERY STATUS
              ================================================= */}

              <div className="mt-6 grid gap-6 xl:grid-cols-2">
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900">
                        Donation Status
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Current food rescue pipeline
                      </p>
                    </div>

                    <Utensils
                      size={20}
                      className="text-green-600"
                    />
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                      ["Available", "available"],
                      ["Reserved", "reserved"],
                      ["Delivered", "delivered"],
                      ["Expired", "expired"],
                    ].map(([label, key]) => (
                      <div
                        key={key}
                        className="rounded-xl bg-gray-50 p-4"
                      >
                        <p className="text-xs text-gray-400">
                          {label}
                        </p>

                        <p className="mt-1 text-xl font-bold text-gray-900">
                          {formatNumber(
                            overview?.donations?.[
                              key
                            ]
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900">
                        Delivery Status
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Current delivery pipeline
                      </p>
                    </div>

                    <Truck
                      size={20}
                      className="text-green-600"
                    />
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                      ["Pending", "pending"],
                      ["Assigned", "assigned"],
                      ["In Transit", "in_transit"],
                      ["Delivered", "delivered"],
                    ].map(([label, key]) => (
                      <div
                        key={key}
                        className="rounded-xl bg-gray-50 p-4"
                      >
                        <p className="text-xs text-gray-400">
                          {label}
                        </p>

                        <p className="mt-1 text-xl font-bold text-gray-900">
                          {formatNumber(
                            overview?.deliveries?.[
                              key
                            ]
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* =================================================
                  IMPACT NOTE
              ================================================= */}

              <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-5">
                <div className="flex items-start gap-3">
                  <HeartHandshake
                    size={20}
                    className="mt-0.5 shrink-0 text-green-700"
                  />

                  <div>
                    <h3 className="font-bold text-green-900">
                      FoodBridge Mission
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-green-800/80">
                      FoodBridge AI connects surplus food with
                      communities that need it through intelligent
                      matching, coordinated volunteers and transparent
                      delivery tracking.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* =================================================
              USERS
          ================================================= */}

          {activeSection === "users" && (
            <section>
              <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Manage and review registered FoodBridge users.
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-gray-900">
                    User Management
                  </h2>
                </div>

                <div className="rounded-xl bg-white px-4 py-3 text-sm text-gray-500 shadow-sm ring-1 ring-gray-200">
                  Showing{" "}
                  <span className="font-bold text-gray-900">
                    {filteredUsers.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-gray-900">
                    {users.length}
                  </span>{" "}
                  users
                </div>
              </div>

              <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
                  <div className="relative">
                    <Search
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="text"
                      value={userSearch}
                      onChange={(event) =>
                        setUserSearch(
                          event.target.value
                        )
                      }
                      placeholder="Search name, email or phone..."
                      className="
                        w-full
                        rounded-xl
                        border
                        border-gray-200
                        bg-gray-50
                        py-3
                        pl-11
                        pr-4
                        text-sm
                        outline-none
                        focus:border-green-400
                        focus:bg-white
                        focus:ring-4
                        focus:ring-green-50
                      "
                    />
                  </div>

                  <select
                    value={userRoleFilter}
                    onChange={(event) =>
                      setUserRoleFilter(
                        event.target.value
                      )
                    }
                    className="
                      rounded-xl
                      border
                      border-gray-200
                      bg-gray-50
                      px-4
                      py-3
                      text-sm
                      outline-none
                      focus:border-green-400
                      focus:bg-white
                    "
                  >
                    <option value="all">
                      All Roles
                    </option>

                    <option value="donor">
                      Donors
                    </option>

                    <option value="recipient">
                      Recipients
                    </option>

                    <option value="volunteer">
                      Volunteers
                    </option>

                    <option value="admin">
                      Admins
                    </option>
                  </select>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="min-w-[850px] w-full">
                    <thead className="border-b border-gray-200 bg-gray-50">
                      <tr>
                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                          User
                        </th>

                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Role
                        </th>

                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Verification
                        </th>

                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Joined
                        </th>

                        <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td
                            colSpan="5"
                            className="px-5 py-12 text-center"
                          >
                            <Users
                              size={28}
                              className="mx-auto text-gray-300"
                            />

                            <p className="mt-3 font-medium text-gray-600">
                              No users found
                            </p>

                            <p className="mt-1 text-sm text-gray-400">
                              Try another search or filter.
                            </p>
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user) => (
                          <tr
                            key={user.id}
                            className="transition hover:bg-gray-50"
                          >
                            <td className="px-5 py-4">
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {user.full_name ||
                                    "Unnamed User"}
                                </p>

                                <p className="mt-1 text-sm text-gray-500">
                                  {user.email || "—"}
                                </p>
                              </div>
                            </td>

                            <td className="px-5 py-4">
                              <span className="capitalize text-sm font-medium text-gray-700">
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

                            <td className="px-5 py-4 text-sm text-gray-500">
                              {formatDate(
                                user.created_at
                              )}
                            </td>

                            <td className="px-5 py-4 text-right">
                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedUser(
                                    user
                                  )
                                }
                                className="
                                  inline-flex
                                  items-center
                                  gap-2
                                  rounded-xl
                                  border
                                  border-gray-200
                                  bg-white
                                  px-3
                                  py-2
                                  text-sm
                                  font-medium
                                  text-gray-600
                                  hover:border-green-200
                                  hover:text-green-700
                                "
                              >
                                <Eye size={15} />
                                View
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* =================================================
              DONATIONS
          ================================================= */}

          {activeSection === "donations" && (
            <section>
              <div className="mb-6 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Monitor every food donation across the platform.
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-gray-900">
                    Donation Monitoring
                  </h2>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm shadow-sm ring-1 ring-gray-200">
                  <Utensils
                    size={16}
                    className="text-green-600"
                  />

                  <span>
                    {filteredDonations.length} donations
                  </span>
                </div>
              </div>

              <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
                  <div className="relative">
                    <Search
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="text"
                      value={donationSearch}
                      onChange={(event) =>
                        setDonationSearch(
                          event.target.value
                        )
                      }
                      placeholder="Search food, donor or location..."
                      className="
                        w-full
                        rounded-xl
                        border
                        border-gray-200
                        bg-gray-50
                        py-3
                        pl-11
                        pr-4
                        text-sm
                        outline-none
                        focus:border-green-400
                        focus:bg-white
                        focus:ring-4
                        focus:ring-green-50
                      "
                    />
                  </div>

                  <select
                    value={donationStatusFilter}
                    onChange={(event) =>
                      setDonationStatusFilter(
                        event.target.value
                      )
                    }
                    className="
                      rounded-xl
                      border
                      border-gray-200
                      bg-gray-50
                      px-4
                      py-3
                      text-sm
                      outline-none
                      focus:border-green-400
                      focus:bg-white
                    "
                  >
                    <option value="all">
                      All Statuses
                    </option>

                    <option value="available">
                      Available
                    </option>

                    <option value="matched">
                      Matched
                    </option>

                    <option value="reserved">
                      Reserved
                    </option>

                    <option value="picked_up">
                      Picked Up
                    </option>

                    <option value="delivered">
                      Delivered
                    </option>

                    <option value="expired">
                      Expired
                    </option>

                    <option value="cancelled">
                      Cancelled
                    </option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4">
                {filteredDonations.length === 0 ? (
                  <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
                    <Utensils
                      size={30}
                      className="mx-auto text-gray-300"
                    />

                    <p className="mt-3 font-semibold text-gray-700">
                      No donations found
                    </p>
                  </div>
                ) : (
                  filteredDonations.map(
                    (donation) => (
                      <div
                        key={donation.id}
                        className="
                          rounded-2xl
                          border
                          border-gray-200
                          bg-white
                          p-5
                          shadow-sm
                          transition
                          hover:border-green-200
                          hover:shadow-md
                        "
                      >
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                          <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
                              <PackageCheck
                                size={21}
                              />
                            </div>

                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-bold text-gray-900">
                                  {donation.food_name ||
                                    "Food Donation"}
                                </h3>

                                <StatusBadge
                                  status={
                                    donation.status
                                  }
                                />
                              </div>

                              <p className="mt-1 text-sm text-gray-500">
                                {donation.quantity ||
                                  "—"}{" "}
                                {donation.quantity_unit ||
                                  ""}{" "}
                                •{" "}
                                {donation.food_type ||
                                  "Food"}
                              </p>

                              <p className="mt-2 text-xs text-gray-400">
                                Donor:{" "}
                                {donation.donor_name ||
                                  donation.full_name ||
                                  donation.donor_id ||
                                  "—"}
                              </p>

                              <p className="mt-1 text-xs text-gray-400">
                                {donation.city ||
                                  "Unknown city"}
                                {donation.state
                                  ? `, ${donation.state}`
                                  : ""}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="hidden text-right sm:block">
                              <p className="text-xs text-gray-400">
                                Created
                              </p>

                              <p className="mt-1 text-sm font-medium text-gray-700">
                                {formatDate(
                                  donation.created_at
                                )}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                setSelectedDonation(
                                  donation
                                )
                              }
                              className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-xl
                                border
                                border-gray-200
                                bg-white
                                px-4
                                py-2.5
                                text-sm
                                font-semibold
                                text-gray-600
                                transition
                                hover:border-green-200
                                hover:text-green-700
                              "
                            >
                              <Eye size={16} />
                              View Details
                            </button>
                          </div>
                        </div>

                        <div className="mt-5 grid gap-3 border-t border-gray-100 pt-5 sm:grid-cols-3">
                          <div className="rounded-xl bg-gray-50 p-3">
                            <p className="text-xs text-gray-400">
                              Freshness
                            </p>

                            <p className="mt-1 font-bold text-green-700">
                              {donation.freshness_score ??
                                "—"}
                              /100
                            </p>
                          </div>

                          <div className="rounded-xl bg-gray-50 p-3">
                            <p className="text-xs text-gray-400">
                              Urgency
                            </p>

                            <p className="mt-1 font-bold text-amber-600">
                              {donation.urgency_score ??
                                "—"}
                              /100
                            </p>
                          </div>

                          <div className="rounded-xl bg-gray-50 p-3">
                            <p className="text-xs text-gray-400">
                              Expiry
                            </p>

                            <p className="mt-1 text-sm font-semibold text-gray-700">
                              {formatDate(
                                donation.expiry_time
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  )
                )}
              </div>
            </section>
          )}

          {/* =================================================
              DELIVERIES
          ================================================= */}

          {activeSection === "deliveries" && (
            <section>
              <div className="mb-6">
                <p className="text-sm text-gray-500">
                  Track food movement from pickup to recipient.
                </p>

                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                  Delivery Monitoring
                </h2>
              </div>

              <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
                  <div className="relative">
                    <Search
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="text"
                      value={deliverySearch}
                      onChange={(event) =>
                        setDeliverySearch(
                          event.target.value
                        )
                      }
                      placeholder="Search food, volunteer, recipient or address..."
                      className="
                        w-full
                        rounded-xl
                        border
                        border-gray-200
                        bg-gray-50
                        py-3
                        pl-11
                        pr-4
                        text-sm
                        outline-none
                        focus:border-green-400
                        focus:bg-white
                        focus:ring-4
                        focus:ring-green-50
                      "
                    />
                  </div>

                  <select
                    value={deliveryStatusFilter}
                    onChange={(event) =>
                      setDeliveryStatusFilter(
                        event.target.value
                      )
                    }
                    className="
                      rounded-xl
                      border
                      border-gray-200
                      bg-gray-50
                      px-4
                      py-3
                      text-sm
                      outline-none
                      focus:border-green-400
                      focus:bg-white
                    "
                  >
                    <option value="all">
                      All Statuses
                    </option>

                    <option value="pending">
                      Pending
                    </option>

                    <option value="assigned">
                      Assigned
                    </option>

                    <option value="picked_up">
                      Picked Up
                    </option>

                    <option value="in_transit">
                      In Transit
                    </option>

                    <option value="delivered">
                      Delivered
                    </option>

                    <option value="cancelled">
                      Cancelled
                    </option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4">
                {filteredDeliveries.length === 0 ? (
                  <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
                    <Truck
                      size={30}
                      className="mx-auto text-gray-300"
                    />

                    <p className="mt-3 font-semibold text-gray-700">
                      No deliveries found
                    </p>
                  </div>
                ) : (
                  filteredDeliveries.map(
                    (delivery) => (
                      <div
                        key={delivery.id}
                        className="
                          rounded-2xl
                          border
                          border-gray-200
                          bg-white
                          p-5
                          shadow-sm
                        "
                      >
                        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                          <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                              <Truck size={21} />
                            </div>

                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-bold text-gray-900">
                                  {delivery.food_name ||
                                    `Delivery #${delivery.id}`}
                                </h3>

                                <StatusBadge
                                  status={
                                    delivery.status
                                  }
                                />
                              </div>

                              <p className="mt-1 text-sm text-gray-500">
                                Delivery #{delivery.id}
                              </p>

                              <div className="mt-3 space-y-1 text-sm">
                                <p className="text-gray-600">
                                  <span className="font-semibold">
                                    Volunteer:
                                  </span>{" "}
                                  {delivery.volunteer_name ||
                                    "Not assigned"}
                                </p>

                                <p className="text-gray-600">
                                  <span className="font-semibold">
                                    Recipient:
                                  </span>{" "}
                                  {delivery.recipient_name ||
                                    "—"}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="grid gap-3 text-sm sm:grid-cols-2 xl:min-w-[430px]">
                            <div className="rounded-xl bg-gray-50 p-4">
                              <div className="flex items-center gap-2 text-gray-400">
                                <Clock3 size={15} />
                                <span className="text-xs font-medium">
                                  Pickup
                                </span>
                              </div>

                              <p className="mt-2 leading-5 text-gray-700">
                                {delivery.pickup_address ||
                                  "—"}
                              </p>

                              {delivery.pickup_time && (
                                <p className="mt-2 text-xs text-gray-400">
                                  {formatDate(
                                    delivery.pickup_time
                                  )}
                                </p>
                              )}
                            </div>

                            <div className="rounded-xl bg-gray-50 p-4">
                              <div className="flex items-center gap-2 text-gray-400">
                                <CheckCircle2
                                  size={15}
                                />
                                <span className="text-xs font-medium">
                                  Delivery
                                </span>
                              </div>

                              <p className="mt-2 leading-5 text-gray-700">
                                {delivery.delivery_address ||
                                  "—"}
                              </p>

                              {delivery.delivery_time && (
                                <p className="mt-2 text-xs text-gray-400">
                                  {formatDate(
                                    delivery.delivery_time
                                  )}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )
                )}
              </div>
            </section>
          )}

          {/* =================================================
              VERIFICATION
          ================================================= */}

          {activeSection === "verification" && (
            <section>
              <div className="mb-6">
                <p className="text-sm text-gray-500">
                  Review recipient organisations before they participate in the platform.
                </p>

                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                  Organisation Verification
                </h2>
              </div>

              <div className="mb-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-gray-500">
                    Total
                  </p>

                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {formatNumber(
                      overview?.verification?.total
                    )}
                  </p>
                </div>

                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                  <p className="text-sm text-amber-700">
                    Pending
                  </p>

                  <p className="mt-2 text-3xl font-bold text-amber-900">
                    {formatNumber(
                      overview?.verification?.pending
                    )}
                  </p>
                </div>

                <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
                  <p className="text-sm text-green-700">
                    Verified
                  </p>

                  <p className="mt-2 text-3xl font-bold text-green-900">
                    {formatNumber(
                      overview?.verification?.verified
                    )}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {organisations.length === 0 ? (
                  <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
                    <ShieldCheck
                      size={30}
                      className="mx-auto text-gray-300"
                    />

                    <p className="mt-3 font-semibold text-gray-700">
                      No organisations found
                    </p>
                  </div>
                ) : (
                  organisations.map(
                    (organisation) => (
                      <OrganisationRow
                        key={organisation.id}
                        organisation={organisation}
                        onRefresh={() =>
                          fetchAdminData(true)
                        }
                      />
                    )
                  )
                )}
              </div>
            </section>
          )}
        </main>
      </div>

      {/* USER MODAL */}

      <UserDetailsModal
        user={selectedUser}
        onClose={() =>
          setSelectedUser(null)
        }
      />

      {/* DONATION MODAL */}

      <DonationDetailsModal
        donation={selectedDonation}
        onClose={() =>
          setSelectedDonation(null)
        }
      />
    </div>
  );
};

export default AdminDashboard;

