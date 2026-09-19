import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Utensils,
  HeartHandshake,
  Sparkles,
  LogOut,
  Plus,
  ArrowUpRight,
  Clock3,
  MapPin,
  ChevronRight,
  RefreshCw,
  Menu,
  X,
  Bell,
  BellRing,
  CheckCheck,
  Truck,
  Package,
  CheckCircle2,
} from "lucide-react";

const DonorDashboard = () => {
  const navigate = useNavigate();

  const [donations, setDonations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [notificationsLoading, setNotificationsLoading] =
    useState(false);

  const [error, setError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const API_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "https://foodbridge-ai-qj9q.onrender.com";

  // =========================
  // FETCH DONATIONS
  // =========================

  useEffect(() => {
    fetchDonations();
    fetchNotifications();
  }, []);

  const fetchDonations = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/donations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to load donations."
        );
      }

      setDonations(data.donations || []);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FETCH NOTIFICATIONS
  // =========================

  const fetchNotifications = async (showLoader = true) => {
    const token = localStorage.getItem("access_token");

    if (!token) return;

    if (showLoader) {
      setNotificationsLoading(true);
    }

    try {
      const response = await fetch(
        `${API_URL}/notifications/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to load notifications."
        );
      }

      setNotifications(data.notifications || []);
      setUnreadCount(data.unread_count || 0);
    } catch (error) {
      console.error("Notification error:", error);
    } finally {
      if (showLoader) {
        setNotificationsLoading(false);
      }
    }
  };

  // =========================
  // REFRESH DASHBOARD
  // =========================

  const refreshDashboard = async () => {
    await Promise.all([
      fetchDonations(),
      fetchNotifications(false),
    ]);
  };

  // =========================
  // MARK NOTIFICATION READ
  // =========================

  const markNotificationAsRead = async (notificationId) => {
    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(
        `${API_URL}/notifications/${notificationId}/read`,
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
            "Failed to mark notification as read."
        );
      }

      setNotifications((current) =>
        current.map((notification) =>
          notification.id === notificationId
            ? {
                ...notification,
                is_read: true,
              }
            : notification
        )
      );

      setUnreadCount((current) =>
        Math.max(0, current - 1)
      );
    } catch (error) {
      console.error(
        "Mark notification as read error:",
        error
      );
    }
  };

  // =========================
  // MARK ALL READ
  // =========================

  const markAllNotificationsAsRead = async () => {
    const token = localStorage.getItem("access_token");

    if (unreadCount === 0) return;

    try {
      const response = await fetch(
        `${API_URL}/notifications/read-all`,
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
            "Failed to mark notifications as read."
        );
      }

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          is_read: true,
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error(
        "Mark all notifications error:",
        error
      );
    }
  };

  // =========================
  // NOTIFICATION ICON
  // =========================

  const getNotificationIcon = (type) => {
    switch (type) {
      case "delivery_assigned":
        return <Truck size={17} />;

      case "delivery_picked_up":
        return <Package size={17} />;

      case "delivery_in_transit":
        return <Truck size={17} />;

      case "delivery_delivered":
        return <CheckCircle2 size={17} />;

      default:
        return <Bell size={17} />;
    }
  };

  const getNotificationIconClasses = (type) => {
    switch (type) {
      case "delivery_assigned":
        return "bg-blue-50 text-blue-600";

      case "delivery_picked_up":
        return "bg-purple-50 text-purple-600";

      case "delivery_in_transit":
        return "bg-indigo-50 text-indigo-600";

      case "delivery_delivered":
        return "bg-green-50 text-green-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // =========================
  // NOTIFICATION TIME
  // =========================

  const formatNotificationTime = (createdAt) => {
    if (!createdAt) return "";

    const date = new Date(createdAt);
    const now = new Date();

    const difference = Math.floor(
      (now.getTime() - date.getTime()) / 1000
    );

    if (difference < 60) {
      return "Just now";
    }

    const minutes = Math.floor(difference / 60);

    if (minutes < 60) {
      return `${minutes}m ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours}h ago`;
    }

    const days = Math.floor(hours / 24);

    if (days < 7) {
      return `${days}d ago`;
    }

    return date.toLocaleDateString();
  };

  // =========================
  // DASHBOARD STATISTICS
  // =========================

  const totalDonations = donations.length;

  const availableFood = donations.filter(
    (donation) => donation.status === "available"
  ).length;

  const matchedDonations = donations.filter(
    (donation) =>
      donation.status === "matched" ||
      donation.status === "reserved" ||
      donation.status === "picked_up" ||
      donation.status === "delivered"
  ).length;

  const mealsShared = donations.reduce(
    (total, donation) =>
      total + Number(donation.quantity || 0),
    0
  );

  const stats = [
    {
      title: "Total donations",
      value: totalDonations,
      description: "Food contributions",
      icon: Utensils,
    },
    {
      title: "Available food",
      value: availableFood,
      description: "Currently available",
      icon: Clock3,
    },
    {
      title: "Successful matches",
      value: matchedDonations,
      description: "Connected to recipients",
      icon: HeartHandshake,
    },
    {
      title: "Meals shared",
      value: mealsShared,
      description: "Estimated servings",
      icon: Sparkles,
    },
  ];

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // =========================
  // AI MATCH NAVIGATION
  // =========================

  const handleViewMatches = (donationId) => {
    if (!donationId) {
      console.error(
        "Unable to open AI Matches: donation ID is missing."
      );
      return;
    }

    navigate(`/ai-match/${donationId}`);
  };

  // =========================
  // STATUS STYLE
  // =========================

  const getStatusStyle = (status) => {
    switch (status) {
      case "available":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "matched":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "reserved":
        return "bg-violet-50 text-violet-700 border-violet-200";

      case "picked_up":
        return "bg-amber-50 text-amber-700 border-amber-200";

      case "delivered":
        return "bg-green-50 text-green-700 border-green-200";

      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const formatStatus = (status) => {
    if (!status) return "Unknown";

    return status
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  // =========================
  // USER
  // =========================

  const storedUser = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const userName =
    storedUser.full_name ||
    storedUser.name ||
    "Donor";

  const firstName = userName.split(" ")[0];

  return (
    <div className="min-h-screen bg-[#F7F8F6] text-gray-900">

      {/* =========================
          MOBILE HEADER
      ========================= */}

      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white lg:hidden">

        <div className="flex items-center justify-between px-5 py-4">

          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              FoodBridge
              <span className="text-green-600">
                AI
              </span>
            </h1>

            <p className="mt-0.5 text-xs text-gray-500">
              Donor Portal
            </p>
          </div>

          <div className="flex items-center gap-2">

            <div className="relative">

              <button
                type="button"
                onClick={() => {
                  setShowNotifications(
                    (current) => !current
                  );

                  if (!showNotifications) {
                    fetchNotifications();
                  }
                }}
                className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:border-green-300 hover:text-green-700"
                aria-label="Notifications"
              >

                {unreadCount > 0 ? (
                  <BellRing size={18} />
                ) : (
                  <Bell size={18} />
                )}

                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex min-h-[19px] min-w-[19px] items-center justify-center rounded-full bg-green-700 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                    {unreadCount > 99
                      ? "99+"
                      : unreadCount}
                  </span>
                )}

              </button>

              {showNotifications && (
                <NotificationPanel
                  notifications={notifications}
                  unreadCount={unreadCount}
                  notificationsLoading={
                    notificationsLoading
                  }
                  onMarkRead={
                    markNotificationAsRead
                  }
                  onMarkAllRead={
                    markAllNotificationsAsRead
                  }
                  onRefresh={() =>
                    fetchNotifications()
                  }
                  onClose={() =>
                    setShowNotifications(false)
                  }
                  formatTime={
                    formatNotificationTime
                  }
                  getIcon={getNotificationIcon}
                  getIconClasses={
                    getNotificationIconClasses
                  }
                />
              )}

            </div>

            <button
              type="button"
              onClick={() =>
                setMobileMenuOpen(
                  (current) => !current
                )
              }
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? (
                <X size={20} />
              ) : (
                <Menu size={20} />
              )}
            </button>

          </div>

        </div>

        {mobileMenuOpen && (

          <div className="space-y-2 border-t border-gray-100 bg-white px-5 py-4">

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/donor-dashboard");
              }}
              className="flex w-full items-center gap-3 rounded-lg bg-green-50 px-3 py-3 font-medium text-green-700"
            >
              <LayoutDashboard size={18} />
              Dashboard
            </button>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/donate-food");
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-gray-600 hover:bg-gray-50"
            >
              <Plus size={18} />
              Donate Food
            </button>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);

                document
                  .getElementById("donations")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  });
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-gray-600 hover:bg-gray-50"
            >
              <Utensils size={18} />
              My Donations
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-red-600 hover:bg-red-50"
            >
              <LogOut size={18} />
              Sign out
            </button>

          </div>
        )}

      </header>

      <div className="flex min-h-screen">

        {/* =========================
            SIDEBAR
        ========================= */}

        <aside className="fixed bottom-0 left-0 top-0 hidden w-64 flex-col border-r border-gray-200 bg-white lg:flex">

          <div className="border-b border-gray-100 px-7 py-7">

            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              FoodBridge
              <span className="text-green-600">
                AI
              </span>
            </h1>

            <p className="mt-1 text-xs text-gray-500">
              Food redistribution platform
            </p>

          </div>

          <nav className="flex-1 px-4 py-6">

            <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Workspace
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/donor-dashboard")
              }
              className="flex w-full items-center gap-3 rounded-lg bg-green-50 px-3 py-2.5 font-medium text-green-700"
            >
              <LayoutDashboard size={18} />
              Dashboard
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/donate-food")
              }
              className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
            >
              <Plus size={18} />
              Donate Food
            </button>

            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("donations")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
              className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
            >
              <Utensils size={18} />
              My Donations
            </button>

            <div className="mt-8">

              <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                Impact
              </p>

              <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-3">

                <div className="flex items-center gap-2 text-gray-700">

                  <HeartHandshake
                    size={17}
                    className="text-green-600"
                  />

                  <span className="text-sm font-medium">
                    Community Impact
                  </span>

                </div>

                <p className="mt-2 text-xs leading-relaxed text-gray-500">
                  Every donation helps redirect surplus food
                  to people who need it.
                </p>

              </div>

            </div>

          </nav>

          <div className="border-t border-gray-100 p-4">

            <div className="flex items-center gap-3 px-2 py-2">

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-sm font-semibold text-green-700">

                {firstName.charAt(0).toUpperCase()}

              </div>

              <div className="min-w-0 flex-1">

                <p className="truncate text-sm font-semibold text-gray-800">
                  {userName}
                </p>

                <p className="text-xs text-gray-500">
                  Donor
                </p>

              </div>

              <button
                type="button"
                onClick={handleLogout}
                title="Sign out"
                className="text-gray-400 transition hover:text-red-600"
              >
                <LogOut size={18} />
              </button>

            </div>

          </div>

        </aside>

        {/* =========================
            MAIN CONTENT
        ========================= */}

        <main className="flex-1 lg:ml-64">

          {/* TOP BAR */}

          <div className="hidden h-16 items-center justify-between border-b border-gray-200 bg-white px-8 lg:flex">

            <p className="text-sm text-gray-500">
              Donor workspace
            </p>

            <div className="flex items-center gap-4">

              <div className="relative">

                <button
                  type="button"
                  onClick={() => {
                    setShowNotifications(
                      (current) => !current
                    );

                    if (!showNotifications) {
                      fetchNotifications();
                    }
                  }}
                  className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:border-green-300 hover:text-green-700"
                  aria-label="Notifications"
                >

                  {unreadCount > 0 ? (
                    <BellRing size={18} />
                  ) : (
                    <Bell size={18} />
                  )}

                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex min-h-[19px] min-w-[19px] items-center justify-center rounded-full bg-green-700 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                      {unreadCount > 99
                        ? "99+"
                        : unreadCount}
                    </span>
                  )}

                </button>

                {showNotifications && (
                  <NotificationPanel
                    notifications={notifications}
                    unreadCount={unreadCount}
                    notificationsLoading={
                      notificationsLoading
                    }
                    onMarkRead={
                      markNotificationAsRead
                    }
                    onMarkAllRead={
                      markAllNotificationsAsRead
                    }
                    onRefresh={() =>
                      fetchNotifications()
                    }
                    onClose={() =>
                      setShowNotifications(false)
                    }
                    formatTime={
                      formatNotificationTime
                    }
                    getIcon={getNotificationIcon}
                    getIconClasses={
                      getNotificationIconClasses
                    }
                  />
                )}

              </div>

              <button
                type="button"
                onClick={refreshDashboard}
                className="flex items-center gap-2 text-sm text-gray-600 transition hover:text-green-700"
              >
                <RefreshCw size={16} />
                Refresh
              </button>

            </div>

          </div>

          <div className="mx-auto max-w-7xl px-5 py-7 sm:px-7 lg:px-8 lg:py-9">

            {/* PAGE INTRO */}

            <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

              <div>

                <p className="mb-2 text-sm font-medium text-green-700">
                  DONOR DASHBOARD
                </p>

                <h2 className="text-3xl font-semibold tracking-tight text-gray-900 lg:text-4xl">
                  Good to see you, {firstName}.
                </h2>

                <p className="mt-2 max-w-xl text-gray-500">
                  Manage your food donations, track matches
                  and see the impact you're creating.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  navigate("/donate-food")
                }
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800"
              >
                <Plus size={18} />
                New donation
              </button>

            </div>

            {/* ERROR */}

            {error && (

              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>

            )}

            {/* LOADING */}

            {loading ? (

              <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-24">

                <RefreshCw
                  size={25}
                  className="mb-3 animate-spin text-green-600"
                />

                <p className="text-sm text-gray-500">
                  Loading your dashboard...
                </p>

              </div>

            ) : (

              <>

                {/* STATISTICS */}

                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                  {stats.map((stat) => {

                    const Icon = stat.icon;

                    return (

                      <div
                        key={stat.title}
                        className="rounded-xl border border-gray-200 bg-white p-5 transition hover:border-gray-300"
                      >

                        <div className="flex items-start justify-between">

                          <div>

                            <p className="text-sm text-gray-500">
                              {stat.title}
                            </p>

                            <p className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">
                              {stat.value}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                              {stat.description}
                            </p>

                          </div>

                          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-100 bg-gray-50">

                            <Icon
                              size={19}
                              className="text-green-700"
                            />

                          </div>

                        </div>

                      </div>

                    );

                  })}

                </div>

                {/* MAIN GRID */}

                <div className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-3">

                  {/* IMPACT CARD */}

                  <div className="relative overflow-hidden rounded-xl bg-gray-900 p-7 text-white xl:col-span-2">

                    <div className="relative z-10">

                      <div className="mb-4 flex items-center gap-2 text-sm font-medium text-green-300">

                        <Sparkles size={17} />

                        FoodBridge AI

                      </div>

                      <h3 className="text-2xl font-semibold tracking-tight">
                        Your surplus can become someone's next meal.
                      </h3>

                      <p className="mt-3 max-w-xl text-sm leading-relaxed text-gray-300">
                        Add surplus food and our matching system considers
                        food type, quantity, freshness, urgency and location
                        to identify suitable recipients.
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          navigate("/donate-food")
                        }
                        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-100"
                      >
                        Make a donation

                        <ArrowUpRight size={16} />

                      </button>

                    </div>

                    <div className="absolute -bottom-20 -right-16 h-64 w-64 rounded-full border border-white/10" />

                    <div className="absolute -bottom-8 -right-4 h-40 w-40 rounded-full border border-white/10" />

                  </div>

                  {/* QUICK ACTION */}

                  <div className="rounded-xl border border-gray-200 bg-white p-7">

                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-green-50">

                      <Plus
                        size={21}
                        className="text-green-700"
                      />

                    </div>

                    <h3 className="text-lg font-semibold text-gray-900">
                      Donate surplus food
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-gray-500">
                      Have extra food available? Add it to FoodBridge
                      and let the platform find potential matches.
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        navigate("/donate-food")
                      }
                      className="mt-6 flex w-full items-center justify-between rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-green-300 hover:text-green-700"
                    >
                      Start donation

                      <ChevronRight size={17} />

                    </button>

                  </div>

                </div>

                {/* DONATIONS */}

                <section
                  id="donations"
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white"
                >

                  <div className="flex flex-col gap-3 border-b border-gray-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                      <h3 className="text-lg font-semibold text-gray-900">
                        Recent donations
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        A record of the food you've contributed.
                      </p>

                    </div>

                    <span className="text-sm text-gray-500">

                      {donations.length}{" "}

                      {donations.length === 1
                        ? "donation"
                        : "donations"}

                    </span>

                  </div>

                  {donations.length === 0 ? (

                    <div className="px-6 py-16 text-center">

                      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-gray-50">

                        <Utensils
                          size={20}
                          className="text-gray-400"
                        />

                      </div>

                      <h4 className="font-semibold text-gray-800">
                        No donations yet
                      </h4>

                      <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
                        Your first donation can help move surplus food
                        where it is needed most.
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          navigate("/donate-food")
                        }
                        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
                      >
                        <Plus size={17} />
                        Create donation
                      </button>

                    </div>

                  ) : (

                    <div className="overflow-x-auto">

                      <table className="w-full min-w-[760px]">

                        <thead>

                          <tr className="border-b border-gray-100 bg-gray-50 text-left">

                            <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                              Food
                            </th>

                            <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                              Quantity
                            </th>

                            <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                              Freshness
                            </th>

                            <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                              Urgency
                            </th>

                            <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                              Status
                            </th>

                            <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                              Action
                            </th>

                          </tr>

                        </thead>

                        <tbody className="divide-y divide-gray-100">

                          {donations.map((donation) => (

                            <tr
                              key={donation.id}
                              className="transition hover:bg-gray-50"
                            >

                              <td className="px-6 py-4">

                                <div className="flex items-center gap-3">

                                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50">

                                    <Utensils
                                      size={17}
                                      className="text-green-700"
                                    />

                                  </div>

                                  <div>

                                    <p className="text-sm font-semibold text-gray-900">
                                      {donation.food_name}
                                    </p>

                                    <p className="mt-0.5 text-xs capitalize text-gray-500">

                                      {donation.food_type?.replaceAll(
                                        "_",
                                        " "
                                      )}

                                    </p>

                                  </div>

                                </div>

                              </td>

                              <td className="px-6 py-4">

                                <p className="text-sm text-gray-700">

                                  {donation.quantity}{" "}
                                  {donation.quantity_unit}

                                </p>

                              </td>

                              <td className="px-6 py-4">

                                <div className="flex items-center gap-2">

                                  <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-100">

                                    <div
                                      className="h-full rounded-full bg-green-500"
                                      style={{
                                        width: `${Math.min(
                                          donation.freshness_score || 0,
                                          100
                                        )}%`,
                                      }}
                                    />

                                  </div>

                                  <span className="text-xs font-medium text-gray-600">

                                    {donation.freshness_score}%

                                  </span>

                                </div>

                              </td>

                              <td className="px-6 py-4">

                                <span className="text-sm font-medium text-gray-700">

                                  {donation.urgency_score}%

                                </span>

                              </td>

                              <td className="px-6 py-4">

                                <span
                                  className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusStyle(
                                    donation.status
                                  )}`}
                                >

                                  {formatStatus(
                                    donation.status
                                  )}

                                </span>

                              </td>

                              <td className="px-6 py-4">

                                {/* =================================================
                                    FIXED AI MATCH NAVIGATION
                                ================================================= */}

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleViewMatches(
                                      donation.id
                                    )
                                  }
                                  className="inline-flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-100 hover:text-green-800"
                                >

                                  <Sparkles size={15} />

                                  View AI Matches

                                  <ArrowUpRight size={15} />

                                </button>

                              </td>

                            </tr>

                          ))}

                        </tbody>

                      </table>

                    </div>

                  )}

                </section>

                {/* FOOTER */}

                <div className="mt-6 flex items-center gap-2 text-xs text-gray-400">

                  <MapPin size={14} />

                  <span>
                    FoodBridge AI • Connecting surplus food
                    with communities in need
                  </span>

                </div>

              </>

            )}

          </div>

        </main>

      </div>

    </div>
  );
};


/* =========================================================
   NOTIFICATION PANEL
========================================================= */

const NotificationPanel = ({
  notifications,
  unreadCount,
  notificationsLoading,
  onMarkRead,
  onMarkAllRead,
  onRefresh,
  onClose,
  formatTime,
  getIcon,
  getIconClasses,
}) => {
  return (
    <div className="fixed inset-x-3 top-[76px] z-50 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl sm:absolute sm:left-auto sm:right-0 sm:top-12 sm:w-[430px]">

      {/* HEADER */}

      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">

        <div>

          <h3 className="font-bold text-[#0B2F1A]">
            Notifications
          </h3>

          <p className="mt-0.5 text-xs text-gray-500">
            Updates about your food donations
          </p>

        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 lg:hidden"
          aria-label="Close notifications"
        >
          <X size={17} />
        </button>

      </div>

      {/* ACTION BAR */}

      <div className="flex items-center justify-between border-b border-gray-100 bg-[#FAFAF7] px-5 py-3">

        <span className="text-xs font-semibold text-gray-500">
          {unreadCount} unread
        </span>

        <button
          type="button"
          onClick={onMarkAllRead}
          disabled={unreadCount === 0}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#1F7A4D] transition hover:text-[#14532D] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <CheckCheck size={15} />
          Mark all read
        </button>

      </div>

      {/* LIST */}

      <div className="max-h-[440px] overflow-y-auto">

        {notificationsLoading ? (

          <div className="flex items-center justify-center gap-2 px-5 py-10 text-sm text-gray-500">

            <RefreshCw
              size={17}
              className="animate-spin"
            />

            Loading notifications...

          </div>

        ) : notifications.length === 0 ? (

          <div className="px-5 py-12 text-center">

            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-[#1F7A4D]">

              <Bell size={21} />

            </div>

            <h4 className="font-semibold text-[#0B2F1A]">
              You're all caught up
            </h4>

            <p className="mt-1 text-xs text-gray-500">
              Updates about your donations will appear here.
            </p>

          </div>

        ) : (

          notifications.map((notification) => (

            <div
              key={notification.id}
              className={`border-b border-gray-100 px-5 py-4 transition last:border-b-0 ${
                notification.is_read
                  ? "bg-white"
                  : "bg-[#F2FAF5]"
              }`}
            >

              <div className="flex gap-3">

                <div
                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${getIconClasses(
                    notification.notification_type
                  )}`}
                >
                  {getIcon(
                    notification.notification_type
                  )}
                </div>

                <div className="min-w-0 flex-1">

                  <div className="flex items-start justify-between gap-2">

                    <h4
                      className={`text-sm ${
                        notification.is_read
                          ? "font-semibold text-gray-700"
                          : "font-bold text-[#0B2F1A]"
                      }`}
                    >
                      {notification.title}
                    </h4>

                    {!notification.is_read && (
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#1F7A4D]" />
                    )}

                  </div>

                  <p className="mt-1 text-xs leading-5 text-gray-600">
                    {notification.message}
                  </p>

                  <div className="mt-2 flex items-center justify-between gap-2">

                    <span className="text-[11px] text-gray-400">
                      {formatTime(
                        notification.created_at
                      )}
                    </span>

                    {!notification.is_read && (

                      <button
                        type="button"
                        onClick={() =>
                          onMarkRead(
                            notification.id
                          )
                        }
                        className="text-[11px] font-semibold text-[#1F7A4D] hover:text-[#14532D]"
                      >
                        Mark as read
                      </button>

                    )}

                  </div>

                </div>

              </div>

            </div>

          ))

        )}

      </div>

      {/* FOOTER */}

      <div className="border-t border-gray-100 bg-white px-5 py-3">

        <button
          type="button"
          onClick={onRefresh}
          className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-50 hover:text-[#1F7A4D]"
        >

          <RefreshCw
            size={14}
            className={
              notificationsLoading
                ? "animate-spin"
                : ""
            }
          />

          Refresh notifications

        </button>

      </div>

    </div>
  );
};

export default DonorDashboard;