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
  ArrowRight,
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
  const [aiMatchingId, setAiMatchingId] = useState(null);

  const API_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "https://foodbridge-ai-qj9q.onrender.com";

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

      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to load donations."
        );
      }

      setDonations(data.donations || []);
    } catch (error) {
      console.error("Donation fetch error:", error);
      setError(error.message || "Failed to load donations.");
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async (showLoader = true) => {
    const token = localStorage.getItem("access_token");

    if (!token) return;

    if (showLoader) {
      setNotificationsLoading(true);
    }

    try {
      const response = await fetch(`${API_URL}/notifications/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

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

  const refreshDashboard = async () => {
    await Promise.all([
      fetchDonations(),
      fetchNotifications(false),
    ]);
  };

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

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to mark notification as read."
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

      const data = await response.json().catch(() => ({}));

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

  const getNotificationIcon = (type) => {
    switch (type) {
      case "delivery_assigned":
        return <Truck size={16} strokeWidth={1.4} />;
      case "delivery_picked_up":
        return <Package size={16} strokeWidth={1.4} />;
      case "delivery_in_transit":
        return <Truck size={16} strokeWidth={1.4} />;
      case "delivery_delivered":
        return <CheckCircle2 size={16} strokeWidth={1.4} />;
      default:
        return <Bell size={16} strokeWidth={1.4} />;
    }
  };

  const getNotificationIconClasses = (type) => {
    switch (type) {
      case "delivery_assigned":
        return "border-blue-200 bg-blue-50 text-blue-700";
      case "delivery_picked_up":
        return "border-purple-200 bg-purple-50 text-purple-700";
      case "delivery_in_transit":
        return "border-indigo-200 bg-indigo-50 text-indigo-700";
      case "delivery_delivered":
        return "border-green-200 bg-green-50 text-green-700";
      default:
        return "border-line bg-paper text-muted";
    }
  };

  const formatNotificationTime = (createdAt) => {
    if (!createdAt) return "";

    const date = new Date(createdAt);
    const now = new Date();

    const difference = Math.floor(
      (now.getTime() - date.getTime()) / 1000
    );

    if (difference < 60) return "Just now";

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
      label: "Total donations",
      value: totalDonations,
      detail: "Food contributions",
      icon: Utensils,
    },
    {
      label: "Available food",
      value: availableFood,
      detail: "Currently available",
      icon: Clock3,
    },
    {
      label: "Successful matches",
      value: matchedDonations,
      detail: "Connected to recipients",
      icon: HeartHandshake,
    },
    {
      label: "Meals shared",
      value: mealsShared,
      detail: "Estimated servings",
      icon: Sparkles,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleViewMatches = async (donationId) => {
    if (!donationId) {
      setError(
        "Unable to run AI matching because the donation ID is missing."
      );
      return;
    }

    const token = localStorage.getItem("access_token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setError("");
      setAiMatchingId(donationId);

      const response = await fetch(
        `${API_URL}/matches/donation/${donationId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.detail ||
            data.message ||
            "Unable to run AI matching."
        );
      }

      navigate(`/ai-match/${donationId}`);
    } catch (error) {
      console.error("AI matching error:", error);

      setError(
        error.message ||
          "Unable to run AI matching. Please try again."
      );
    } finally {
      setAiMatchingId(null);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "available":
        return "border-green-200 bg-green-50 text-green-700";
      case "matched":
        return "border-blue-200 bg-blue-50 text-blue-700";
      case "reserved":
        return "border-violet-200 bg-violet-50 text-violet-700";
      case "picked_up":
        return "border-amber-200 bg-amber-50 text-amber-700";
      case "delivered":
        return "border-green-200 bg-green-50 text-green-800";
      default:
        return "border-line bg-paper text-muted";
    }
  };

  const formatStatus = (status) => {
    if (!status) return "Unknown";

    return status
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const storedUser = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const userName =
    storedUser.full_name ||
    storedUser.name ||
    "Donor";

  const firstName = userName.split(" ")[0];

  return (
    <div className="min-h-screen bg-paper text-ink">

      {/* MOBILE HEADER */}
      <header className="sticky top-0 z-50 border-b border-line bg-paper lg:hidden">
        <div className="flex items-center justify-between px-5 py-4">

          <button
            type="button"
            onClick={() => navigate("/donor-dashboard")}
            className="text-left"
          >
            <p className="text-lg font-medium tracking-[-0.03em]">
              FoodBridge<span className="text-green"> AI</span>
            </p>

            <p className="fb-label mt-1 text-muted">
              Donor workspace
            </p>
          </button>

          <div className="flex items-center gap-2">

            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowNotifications((current) => !current);

                  if (!showNotifications) {
                    fetchNotifications();
                  }
                }}
                className="relative flex h-10 w-10 items-center justify-center border border-line text-muted transition hover:border-green hover:text-green"
                aria-label="Notifications"
              >
                {unreadCount > 0 ? (
                  <BellRing size={18} strokeWidth={1.3} />
                ) : (
                  <Bell size={18} strokeWidth={1.3} />
                )}

                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex min-h-[17px] min-w-[17px] items-center justify-center bg-green px-1 text-[9px] text-white">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <NotificationPanel
                  notifications={notifications}
                  unreadCount={unreadCount}
                  notificationsLoading={notificationsLoading}
                  onMarkRead={markNotificationAsRead}
                  onMarkAllRead={markAllNotificationsAsRead}
                  onRefresh={() => fetchNotifications()}
                  onClose={() => setShowNotifications(false)}
                  formatTime={formatNotificationTime}
                  getIcon={getNotificationIcon}
                  getIconClasses={getNotificationIconClasses}
                />
              )}
            </div>

            <button
              type="button"
              onClick={() =>
                setMobileMenuOpen((current) => !current)
              }
              className="flex h-10 w-10 items-center justify-center border border-line text-muted"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? (
                <X size={19} strokeWidth={1.3} />
              ) : (
                <Menu size={19} strokeWidth={1.3} />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-line bg-paper px-5 py-4">

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/donor-dashboard");
              }}
              className="flex w-full items-center gap-3 border-b border-line py-3 text-green"
            >
              <LayoutDashboard size={17} strokeWidth={1.3} />
              Dashboard
            </button>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/donate-food");
              }}
              className="flex w-full items-center gap-3 border-b border-line py-3 text-muted"
            >
              <Plus size={17} strokeWidth={1.3} />
              Donate Food
            </button>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                document
                  .getElementById("donations")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex w-full items-center gap-3 border-b border-line py-3 text-muted"
            >
              <Utensils size={17} strokeWidth={1.3} />
              My Donations
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 py-3 text-red-600"
            >
              <LogOut size={17} strokeWidth={1.3} />
              Sign out
            </button>
          </div>
        )}
      </header>

      <div className="flex min-h-screen">

        {/* SIDEBAR */}
        <aside className="fixed bottom-0 left-0 top-0 hidden w-[250px] flex-col border-r border-line bg-paper lg:flex">

          <div className="border-b border-line px-7 py-7">
            <button
              type="button"
              onClick={() => navigate("/donor-dashboard")}
              className="text-left"
            >
              <p className="text-xl font-medium tracking-[-0.04em]">
                FoodBridge<span className="text-green"> AI</span>
              </p>

              <p className="fb-label mt-2 text-muted">
                Donor workspace
              </p>
            </button>
          </div>

          <nav className="flex-1 px-5 py-7">

            <p className="fb-label mb-4 px-2 text-ash">
              Workspace
            </p>

            <button
              type="button"
              onClick={() => navigate("/donor-dashboard")}
              className="flex w-full items-center gap-3 border-l-2 border-green bg-light-green px-3 py-3 text-sm text-deep-green"
            >
              <LayoutDashboard size={17} strokeWidth={1.3} />
              Dashboard
            </button>

            <button
              type="button"
              onClick={() => navigate("/donate-food")}
              className="flex w-full items-center gap-3 border-l-2 border-transparent px-3 py-3 text-sm text-muted transition hover:border-line hover:text-ink"
            >
              <Plus size={17} strokeWidth={1.3} />
              Donate Food
            </button>

            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("donations")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="flex w-full items-center gap-3 border-l-2 border-transparent px-3 py-3 text-sm text-muted transition hover:border-line hover:text-ink"
            >
              <Utensils size={17} strokeWidth={1.3} />
              My Donations
            </button>

            <div className="mt-12 border-t border-line pt-6">
              <p className="fb-label mb-4 px-2 text-ash">
                Impact
              </p>

              <div className="px-2">
                <div className="flex items-center gap-2 text-deep-green">
                  <HeartHandshake
                    size={17}
                    strokeWidth={1.3}
                  />
                  <span className="text-sm">
                    Community Impact
                  </span>
                </div>

                <p className="mt-3 text-xs leading-5 text-muted">
                  Every donation helps redirect surplus food
                  to people who need it.
                </p>
              </div>
            </div>
          </nav>

          <div className="border-t border-line p-5">
            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-green bg-light-green text-sm text-deep-green">
                {firstName.charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">
                  {userName}
                </p>

                <p className="fb-label mt-1 text-ash">
                  Donor
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                title="Sign out"
                className="text-ash transition hover:text-red-600"
              >
                <LogOut size={17} strokeWidth={1.3} />
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="flex-1 lg:ml-[250px]">

          {/* DESKTOP TOP BAR */}
          <div className="hidden h-[68px] items-center justify-between border-b border-line px-8 lg:flex">

            <p className="fb-label text-muted">
              Donor / Dashboard
            </p>

            <div className="flex items-center gap-7">

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
                  className="relative flex items-center gap-2 text-muted transition hover:text-green"
                >
                  {unreadCount > 0 ? (
                    <BellRing size={18} strokeWidth={1.3} />
                  ) : (
                    <Bell size={18} strokeWidth={1.3} />
                  )}

                  <span className="fb-label">
                    Notifications
                  </span>

                  {unreadCount > 0 && (
                    <span className="flex min-h-[17px] min-w-[17px] items-center justify-center bg-green px-1 text-[9px] text-white">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <NotificationPanel
                    notifications={notifications}
                    unreadCount={unreadCount}
                    notificationsLoading={notificationsLoading}
                    onMarkRead={markNotificationAsRead}
                    onMarkAllRead={markAllNotificationsAsRead}
                    onRefresh={() => fetchNotifications()}
                    onClose={() => setShowNotifications(false)}
                    formatTime={formatNotificationTime}
                    getIcon={getNotificationIcon}
                    getIconClasses={getNotificationIconClasses}
                  />
                )}
              </div>

              <button
                type="button"
                onClick={refreshDashboard}
                className="fb-arrow text-xs uppercase tracking-[0.08em] text-muted hover:text-green"
              >
                <RefreshCw size={14} strokeWidth={1.3} />
                Refresh
              </button>
            </div>
          </div>

          <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 lg:px-12 lg:py-12">

            {/* INTRO */}
            <section className="border-b border-line pb-10">

              <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">

                <div>
                  <p className="fb-label mb-5 text-green">
                    Donor dashboard / 01
                  </p>

                  <h1 className="text-[clamp(3rem,7vw,6.5rem)] font-normal leading-[0.88] tracking-[-0.06em]">
                    GOOD TO SEE
                    <br />
                    YOU, <span className="text-green">{firstName}.</span>
                  </h1>

                  <p className="mt-7 max-w-xl text-base leading-7 text-muted md:text-lg">
                    Manage your food donations, track matches
                    and see the impact you're creating.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/donate-food")}
                  className="group flex w-fit items-center gap-8 border border-deep-green bg-deep-green px-5 py-4 text-xs uppercase tracking-[0.08em] text-white transition hover:bg-green"
                >
                  New donation
                  <ArrowRight
                    size={16}
                    strokeWidth={1.2}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>
              </div>
            </section>

            {/* ERROR */}
            {error && (
              <div className="border-b border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center border-b border-line">
                <RefreshCw
                  size={23}
                  strokeWidth={1.2}
                  className="mb-4 animate-spin text-green"
                />

                <p className="text-sm text-muted">
                  Loading your dashboard...
                </p>
              </div>
            ) : (
              <>
                {/* STATISTICS */}
                <section className="border-b border-line py-8 lg:py-10">

                  <div className="grid grid-cols-2 lg:grid-cols-4">

                    {stats.map((stat, index) => {
                      const Icon = stat.icon;

                      return (
                        <div
                          key={stat.label}
                          className={`py-5 ${
                            index !== 0
                              ? "border-l border-line pl-5 sm:pl-7"
                              : ""
                          } ${
                            index >= 2
                              ? "border-t border-line lg:border-t-0"
                              : ""
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="fb-label text-muted">
                                {stat.label}
                              </p>

                              <p className="mt-4 text-4xl font-normal tracking-[-0.05em] md:text-5xl">
                                {stat.value}
                              </p>

                              <p className="mt-2 text-xs text-ash">
                                {stat.detail}
                              </p>
                            </div>

                            <Icon
                              size={18}
                              strokeWidth={1.2}
                              className="hidden text-green sm:block"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* FEATURE AREA */}
                <section className="grid border-b border-line lg:grid-cols-[1.4fr_0.6fr]">

                  <div className="relative overflow-hidden border-b border-line bg-deep-green px-6 py-10 text-white sm:px-8 lg:border-b-0 lg:border-r lg:px-10 lg:py-12">

                    <div className="relative z-10 max-w-2xl">

                      <div className="flex items-center gap-3">
                        <Sparkles
                          size={16}
                          strokeWidth={1.2}
                          className="text-light-green"
                        />

                        <p className="fb-label text-light-green">
                          FoodBridge intelligence
                        </p>
                      </div>

                      <h2 className="mt-7 text-[clamp(2.5rem,5vw,5rem)] font-normal leading-[0.9] tracking-[-0.055em]">
                        YOUR SURPLUS
                        <br />
                        CAN BECOME
                        <br />
                        SOMEONE'S{" "}
                        <span className="text-light-green">
                          MEAL.
                        </span>
                      </h2>

                      <p className="mt-7 max-w-xl text-sm leading-7 text-white/60 md:text-base">
                        Add surplus food and our matching system
                        considers food type, quantity, freshness,
                        urgency and location to identify suitable
                        recipients.
                      </p>

                      <button
                        type="button"
                        onClick={() => navigate("/donate-food")}
                        className="group mt-8 flex items-center gap-7 border border-white/30 px-5 py-4 text-xs uppercase tracking-[0.08em] transition hover:border-light-green hover:text-light-green"
                      >
                        Make a donation
                        <ArrowRight
                          size={16}
                          strokeWidth={1.2}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </button>
                    </div>

                    <div className="absolute bottom-[-100px] right-[-80px] h-[300px] w-[300px] rounded-full border border-white/10" />
                    <div className="absolute bottom-[-20px] right-[50px] h-[180px] w-[180px] rounded-full border border-white/10" />
                  </div>

                  <div className="px-6 py-10 sm:px-8 lg:px-9 lg:py-12">

                    <p className="fb-label text-green">
                      Quick action
                    </p>

                    <div className="mt-10">
                      <Plus
                        size={25}
                        strokeWidth={1.1}
                        className="text-green"
                      />

                      <h3 className="mt-7 text-2xl font-normal tracking-[-0.03em]">
                        Donate surplus food
                      </h3>

                      <p className="mt-4 text-sm leading-6 text-muted">
                        Have extra food available? Add it to
                        FoodBridge and let the platform find
                        potential matches.
                      </p>

                      <button
                        type="button"
                        onClick={() => navigate("/donate-food")}
                        className="fb-arrow mt-8 border-b border-ink pb-2 text-xs uppercase tracking-[0.08em]"
                      >
                        Start donation
                        <ArrowRight
                          size={15}
                          strokeWidth={1.2}
                        />
                      </button>
                    </div>
                  </div>
                </section>

                {/* DONATIONS */}
                <section id="donations" className="border-b border-line">

                  <div className="flex flex-col gap-4 border-b border-line py-7 sm:flex-row sm:items-end sm:justify-between">

                    <div>
                      <p className="fb-label text-green">
                        02 / Your contributions
                      </p>

                      <h2 className="mt-3 text-3xl font-normal tracking-[-0.04em] md:text-4xl">
                        Recent donations
                      </h2>

                      <p className="mt-2 text-sm text-muted">
                        A record of the food you've contributed.
                      </p>
                    </div>

                    <span className="fb-label text-muted">
                      {donations.length}{" "}
                      {donations.length === 1
                        ? "donation"
                        : "donations"}
                    </span>
                  </div>

                  {donations.length === 0 ? (
                    <div className="py-20 text-center">

                      <Utensils
                        size={24}
                        strokeWidth={1.1}
                        className="mx-auto text-ash"
                      />

                      <h3 className="mt-5 text-xl">
                        No donations yet
                      </h3>

                      <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted">
                        Your first donation can help move surplus
                        food where it is needed most.
                      </p>

                      <button
                        type="button"
                        onClick={() => navigate("/donate-food")}
                        className="fb-arrow mx-auto mt-7 border-b border-ink pb-2 text-xs uppercase tracking-[0.08em]"
                      >
                        Create donation
                        <ArrowRight
                          size={15}
                          strokeWidth={1.2}
                        />
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[800px]">

                        <thead>
                          <tr className="border-b border-line text-left">
                            <th className="px-3 py-4 text-[10px] uppercase tracking-[0.08em] text-muted">
                              Food
                            </th>

                            <th className="px-3 py-4 text-[10px] uppercase tracking-[0.08em] text-muted">
                              Quantity
                            </th>

                            <th className="px-3 py-4 text-[10px] uppercase tracking-[0.08em] text-muted">
                              Freshness
                            </th>

                            <th className="px-3 py-4 text-[10px] uppercase tracking-[0.08em] text-muted">
                              Urgency
                            </th>

                            <th className="px-3 py-4 text-[10px] uppercase tracking-[0.08em] text-muted">
                              Status
                            </th>

                            <th className="px-3 py-4 text-[10px] uppercase tracking-[0.08em] text-muted">
                              Action
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {donations.map((donation) => {
                            const isMatching =
                              aiMatchingId === donation.id;

                            return (
                              <tr
                                key={donation.id}
                                className="border-b border-line transition last:border-b-0 hover:bg-[#f4f5f1]"
                              >
                                <td className="px-3 py-5">
                                  <div className="flex items-center gap-3">

                                    <div className="flex h-9 w-9 items-center justify-center border border-line bg-paper text-green">
                                      <Utensils
                                        size={16}
                                        strokeWidth={1.2}
                                      />
                                    </div>

                                    <div>
                                      <p className="text-sm">
                                        {donation.food_name}
                                      </p>

                                      <p className="mt-1 text-[10px] uppercase tracking-[0.06em] text-muted">
                                        {donation.food_type?.replaceAll(
                                          "_",
                                          " "
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                </td>

                                <td className="px-3 py-5 text-sm text-muted">
                                  {donation.quantity}{" "}
                                  {donation.quantity_unit}
                                </td>

                                <td className="px-3 py-5">
                                  <div className="flex items-center gap-3">
                                    <div className="h-px w-16 bg-line">
                                      <div
                                        className="h-px bg-green"
                                        style={{
                                          width: `${Math.min(
                                            donation.freshness_score || 0,
                                            100
                                          )}%`,
                                        }}
                                      />
                                    </div>

                                    <span className="text-xs text-muted">
                                      {donation.freshness_score}%
                                    </span>
                                  </div>
                                </td>

                                <td className="px-3 py-5 text-sm text-muted">
                                  {donation.urgency_score}%
                                </td>

                                <td className="px-3 py-5">
                                  <span
                                    className={`inline-flex border px-2.5 py-1 text-[10px] uppercase tracking-[0.06em] ${getStatusStyle(
                                      donation.status
                                    )}`}
                                  >
                                    {formatStatus(
                                      donation.status
                                    )}
                                  </span>
                                </td>

                                <td className="px-3 py-5">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleViewMatches(
                                        donation.id
                                      )
                                    }
                                    disabled={
                                      aiMatchingId !== null
                                    }
                                    className="group inline-flex items-center gap-2 border-b border-transparent pb-1 text-xs uppercase tracking-[0.05em] text-green transition hover:border-green disabled:cursor-not-allowed disabled:opacity-50"
                                  >
                                    {isMatching ? (
                                      <>
                                        <RefreshCw
                                          size={14}
                                          strokeWidth={1.2}
                                          className="animate-spin"
                                        />
                                        Matching...
                                      </>
                                    ) : (
                                      <>
                                        <Sparkles
                                          size={14}
                                          strokeWidth={1.2}
                                        />
                                        AI Matches
                                        <ArrowUpRight
                                          size={14}
                                          strokeWidth={1.2}
                                          className="transition-transform group-hover:translate-x-1"
                                        />
                                      </>
                                    )}
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>

                {/* FOOTER NOTE */}
                <div className="flex items-center gap-2 py-6 text-[10px] uppercase tracking-[0.06em] text-ash">
                  <MapPin
                    size={13}
                    strokeWidth={1.2}
                  />
                  FoodBridge AI / Connecting surplus with communities
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
    <div className="fixed inset-x-3 top-[72px] z-[100] overflow-hidden border border-line bg-paper shadow-[0_20px_60px_rgba(0,0,0,0.12)] sm:absolute sm:left-auto sm:right-0 sm:top-9 sm:w-[420px]">

      <div className="flex items-center justify-between border-b border-line px-5 py-4">

        <div>
          <p className="fb-label text-green">
            Notifications
          </p>

          <p className="mt-2 text-sm text-muted">
            Updates about your food donations
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center text-muted transition hover:text-ink lg:hidden"
          aria-label="Close notifications"
        >
          <X size={17} strokeWidth={1.2} />
        </button>
      </div>

      <div className="flex items-center justify-between border-b border-line px-5 py-3">

        <span className="text-xs text-muted">
          {unreadCount} unread
        </span>

        <button
          type="button"
          onClick={onMarkAllRead}
          disabled={unreadCount === 0}
          className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.06em] text-green disabled:opacity-40"
        >
          <CheckCheck
            size={14}
            strokeWidth={1.2}
          />
          Mark all read
        </button>
      </div>

      <div className="max-h-[430px] overflow-y-auto">

        {notificationsLoading ? (
          <div className="flex items-center justify-center gap-2 px-5 py-12 text-sm text-muted">
            <RefreshCw
              size={16}
              strokeWidth={1.2}
              className="animate-spin"
            />
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="px-5 py-12 text-center">

            <Bell
              size={23}
              strokeWidth={1.1}
              className="mx-auto text-green"
            />

            <p className="mt-4 text-sm">
              You're all caught up
            </p>

            <p className="mt-2 text-xs leading-5 text-muted">
              Updates about your donations will appear here.
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`border-b border-line px-5 py-4 last:border-b-0 ${
                notification.is_read
                  ? "bg-paper"
                  : "bg-light-green/30"
              }`}
            >
              <div className="flex gap-3">

                <div
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center border ${getIconClasses(
                    notification.notification_type
                  )}`}
                >
                  {getIcon(
                    notification.notification_type
                  )}
                </div>

                <div className="min-w-0 flex-1">

                  <div className="flex items-start justify-between gap-3">

                    <h4
                      className={`text-sm ${
                        notification.is_read
                          ? "text-muted"
                          : "text-deep-green"
                      }`}
                    >
                      {notification.title}
                    </h4>

                    {!notification.is_read && (
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 bg-green" />
                    )}
                  </div>

                  <p className="mt-1 text-xs leading-5 text-muted">
                    {notification.message}
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-2">

                    <span className="text-[10px] uppercase tracking-[0.04em] text-ash">
                      {formatTime(notification.created_at)}
                    </span>

                    {!notification.is_read && (
                      <button
                        type="button"
                        onClick={() =>
                          onMarkRead(notification.id)
                        }
                        className="text-[10px] uppercase tracking-[0.05em] text-green"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-line px-5 py-3">

        <button
          type="button"
          onClick={onRefresh}
          className="flex w-full items-center justify-center gap-2 py-2 text-[10px] uppercase tracking-[0.06em] text-muted transition hover:text-green"
        >
          <RefreshCw
            size={14}
            strokeWidth={1.2}
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