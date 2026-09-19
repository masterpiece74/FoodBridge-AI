import { useEffect, useMemo, useState } from "react";
import {
  Truck,
  MapPin,
  Package,
  Clock,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Bell,
  BellRing,
  CheckCheck,
  X,
  Navigation,
  Utensils,
  Users,
  ChevronRight,
  CircleDot,
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000";

function VolunteerDashboard() {
  const [deliveries, setDeliveries] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [notificationsLoading, setNotificationsLoading] =
    useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token =
    localStorage.getItem("access_token") ||
    localStorage.getItem("foodbridge_token");

  // ============================================================
  // FETCH DELIVERIES
  // ============================================================

  const fetchDeliveries = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/deliveries/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to load deliveries."
        );
      }

      setDeliveries(data.deliveries || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // FETCH NOTIFICATIONS
  // ============================================================

  const fetchNotifications = async (showLoader = true) => {
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to load notifications."
        );
      }

      setNotifications(data.notifications || []);
      setUnreadCount(data.unread_count || 0);
    } catch (err) {
      console.error("Notification error:", err);
    } finally {
      if (showLoader) {
        setNotificationsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchDeliveries();
    fetchNotifications();
  }, []);

  // ============================================================
  // REFRESH
  // ============================================================

  const refreshDashboard = async () => {
    setSuccess("");

    await Promise.all([
      fetchDeliveries(),
      fetchNotifications(false),
    ]);
  };

  // ============================================================
  // ACCEPT DELIVERY
  // ============================================================

  const acceptDelivery = async (deliveryId) => {
    setActionLoading(deliveryId);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${API_URL}/deliveries/${deliveryId}/accept`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to accept delivery."
        );
      }

      setSuccess(
        "Delivery accepted. You can now begin the pickup."
      );

      await fetchDeliveries();
      await fetchNotifications(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  // ============================================================
  // UPDATE DELIVERY STATUS
  // ============================================================

  const updateStatus = async (deliveryId, newStatus) => {
    setActionLoading(deliveryId);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${API_URL}/deliveries/${deliveryId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to update delivery."
        );
      }

      const messages = {
        picked_up:
          "Pickup confirmed. The food is now in your care.",
        in_transit:
          "Delivery marked as in transit.",
        delivered:
          "Delivery completed. Impact has been recorded.",
      };

      setSuccess(
        messages[newStatus] ||
          "Delivery status updated successfully."
      );

      await fetchDeliveries();
      await fetchNotifications(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  // ============================================================
  // NOTIFICATIONS
  // ============================================================

  const markNotificationAsRead = async (notificationId) => {
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
    } catch (err) {
      console.error(
        "Mark notification as read error:",
        err
      );
    }
  };

  const markAllNotificationsAsRead = async () => {
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
    } catch (err) {
      console.error(
        "Mark all notifications error:",
        err
      );
    }
  };

  // ============================================================
  // NOTIFICATION HELPERS
  // ============================================================

  const getNotificationIcon = (type) => {
    switch (type) {
      case "delivery_assigned":
        return <Truck size={17} />;

      case "delivery_picked_up":
        return <Package size={17} />;

      case "delivery_in_transit":
        return <Navigation size={17} />;

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
        return "bg-green-50 text-[#1F7A4D]";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

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

  // ============================================================
  // DELIVERY HELPERS
  // ============================================================

  const getNextAction = (delivery) => {
    switch (delivery.status) {
      case "pending":
        return {
          label: "Accept Delivery",
          action: () => acceptDelivery(delivery.id),
        };

      case "assigned":
        return {
          label: "Confirm Pickup",
          action: () =>
            updateStatus(delivery.id, "picked_up"),
        };

      case "picked_up":
        return {
          label: "Start Transit",
          action: () =>
            updateStatus(delivery.id, "in_transit"),
        };

      case "in_transit":
        return {
          label: "Mark Delivered",
          action: () =>
            updateStatus(delivery.id, "delivered"),
        };

      default:
        return null;
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: "Available",
      assigned: "Assigned",
      picked_up: "Picked Up",
      in_transit: "In Transit",
      delivered: "Delivered",
    };

    return labels[status] || status;
  };

  const getStatusClasses = (status) => {
    const classes = {
      pending:
        "bg-amber-50 text-amber-700 border-amber-200",

      assigned:
        "bg-blue-50 text-blue-700 border-blue-200",

      picked_up:
        "bg-purple-50 text-purple-700 border-purple-200",

      in_transit:
        "bg-indigo-50 text-indigo-700 border-indigo-200",

      delivered:
        "bg-green-50 text-green-700 border-green-200",
    };

    return (
      classes[status] ||
      "bg-gray-50 text-gray-700 border-gray-200"
    );
  };

  const getProgress = (status) => {
    const progress = {
      pending: 0,
      assigned: 25,
      picked_up: 50,
      in_transit: 75,
      delivered: 100,
    };

    return progress[status] || 0;
  };

  const getStatusStep = (status) => {
    const steps = [
      "assigned",
      "picked_up",
      "in_transit",
      "delivered",
    ];

    return steps.indexOf(status);
  };

  // ============================================================
  // DASHBOARD STATS
  // ============================================================

  const stats = useMemo(() => {
    const available = deliveries.filter(
      (delivery) => delivery.status === "pending"
    ).length;

    const active = deliveries.filter((delivery) =>
      [
        "assigned",
        "picked_up",
        "in_transit",
      ].includes(delivery.status)
    ).length;

    const completed = deliveries.filter(
      (delivery) => delivery.status === "delivered"
    ).length;

    const meals = deliveries
      .filter(
        (delivery) => delivery.status === "delivered"
      )
      .reduce((total, delivery) => {
        const unit = (
          delivery.quantity_unit || ""
        ).toLowerCase();

        if (
          [
            "meal",
            "meals",
            "serving",
            "servings",
            "plate",
            "plates",
            "portion",
            "portions",
          ].includes(unit)
        ) {
          return (
            total +
            Number(delivery.quantity || 0)
          );
        }

        return total;
      }, 0);

    return {
      available,
      active,
      completed,
      meals: Math.round(meals),
    };
  }, [deliveries]);

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      {/* ========================================================
          HEADER
      ======================================================== */}

      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F5ED] text-[#1F7A4D]">
              <Truck size={22} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#1F7A4D]">
                FoodBridge AI
              </p>

              <h1 className="text-lg font-bold tracking-tight text-[#0B2F1A] sm:text-xl">
                Volunteer Dashboard
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Notifications */}
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
                className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:border-[#A7D7B8] hover:bg-[#F2FAF5] hover:text-[#1F7A4D]"
                aria-label="Notifications"
              >
                {unreadCount > 0 ? (
                  <BellRing size={19} />
                ) : (
                  <Bell size={19} />
                )}

                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex min-h-[20px] min-w-[20px] items-center justify-center rounded-full bg-[#1F7A4D] px-1 text-[10px] font-bold text-white ring-2 ring-white">
                    {unreadCount > 99
                      ? "99+"
                      : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="fixed inset-x-3 top-[78px] z-50 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl sm:absolute sm:left-auto sm:right-0 sm:top-14 sm:w-[430px]">
                  <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                    <div>
                      <h3 className="font-bold text-[#0B2F1A]">
                        Notifications
                      </h3>

                      <p className="mt-0.5 text-xs text-gray-500">
                        Updates about your delivery tasks
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setShowNotifications(false)
                      }
                      className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 sm:hidden"
                      aria-label="Close notifications"
                    >
                      <X size={17} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between border-b border-gray-100 bg-[#FAFAF7] px-5 py-3">
                    <span className="text-xs font-semibold text-gray-500">
                      {unreadCount} unread
                    </span>

                    <button
                      type="button"
                      onClick={markAllNotificationsAsRead}
                      disabled={unreadCount === 0}
                      className="flex items-center gap-1.5 text-xs font-semibold text-[#1F7A4D] transition hover:text-[#14532D] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <CheckCheck size={15} />
                      Mark all read
                    </button>
                  </div>

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
                          New delivery updates will
                          appear here.
                        </p>
                      </div>
                    ) : (
                      notifications.map(
                        (notification) => (
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
                                className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${getNotificationIconClasses(
                                  notification.notification_type
                                )}`}
                              >
                                {getNotificationIcon(
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
                                    {
                                      notification.title
                                    }
                                  </h4>

                                  {!notification.is_read && (
                                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#1F7A4D]" />
                                  )}
                                </div>

                                <p className="mt-1 text-xs leading-5 text-gray-600">
                                  {
                                    notification.message
                                  }
                                </p>

                                <div className="mt-2 flex items-center justify-between gap-2">
                                  <span className="text-[11px] text-gray-400">
                                    {formatNotificationTime(
                                      notification.created_at
                                    )}
                                  </span>

                                  {!notification.is_read && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        markNotificationAsRead(
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
                        )
                      )
                    )}
                  </div>

                  <div className="border-t border-gray-100 bg-white px-5 py-3">
                    <button
                      type="button"
                      onClick={() =>
                        fetchNotifications()
                      }
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
              )}
            </div>

            {/* Refresh */}
            <button
              onClick={refreshDashboard}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:border-[#A7D7B8] hover:bg-[#F2FAF5] hover:text-[#1F7A4D] disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
            >
              <RefreshCw
                size={17}
                className={
                  loading ? "animate-spin" : ""
                }
              />

              <span className="hidden sm:inline">
                Refresh
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================
          MAIN
      ======================================================== */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ======================================================
            HERO
        ====================================================== */}

        <section className="relative mb-8 overflow-hidden rounded-3xl bg-[#0B2F1A] px-6 py-8 text-white shadow-xl sm:px-8 lg:px-10">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#1F7A4D]/30 blur-3xl" />

          <div className="absolute -bottom-20 left-1/3 h-52 w-52 rounded-full bg-[#A7D7B8]/10 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-green-100 backdrop-blur">
                <CircleDot
                  size={13}
                  className="text-[#A7D7B8]"
                />
                Making every delivery count
              </div>

              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Move food.
                <br />
                <span className="text-[#A7D7B8]">
                  Move hope.
                </span>
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-6 text-green-100/80 sm:text-base">
                Your deliveries help turn surplus food into
                meals for communities that need them most.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:flex sm:gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur">
                <Utensils
                  size={19}
                  className="mb-3 text-[#A7D7B8]"
                />

                <p className="text-2xl font-bold">
                  {stats.meals}
                </p>

                <p className="mt-1 text-xs text-green-100/70">
                  Meals delivered
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur">
                <CheckCircle2
                  size={19}
                  className="mb-3 text-[#A7D7B8]"
                />

                <p className="text-2xl font-bold">
                  {stats.completed}
                </p>

                <p className="mt-1 text-xs text-green-100/70">
                  Completed
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================
            MESSAGES
        ====================================================== */}

        {success && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 px-4 py-4 text-sm text-green-700">
            <CheckCircle2
              size={19}
              className="mt-0.5 shrink-0"
            />

            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
            <AlertCircle
              size={19}
              className="mt-0.5 shrink-0"
            />

            <span>{error}</span>
          </div>
        )}

        {/* ======================================================
            STATS
        ====================================================== */}

        <section className="mb-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Available
                </p>

                <p className="mt-2 text-3xl font-bold text-[#0B2F1A]">
                  {stats.available}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Waiting for pickup
                </p>
              </div>

              <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                <Truck size={21} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Active
                </p>

                <p className="mt-2 text-3xl font-bold text-[#0B2F1A]">
                  {stats.active}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Currently in progress
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <Clock size={21} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Completed
                </p>

                <p className="mt-2 text-3xl font-bold text-[#0B2F1A]">
                  {stats.completed}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Successfully delivered
                </p>
              </div>

              <div className="rounded-xl bg-green-50 p-3 text-[#1F7A4D]">
                <CheckCircle2 size={21} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Meals moved
                </p>

                <p className="mt-2 text-3xl font-bold text-[#0B2F1A]">
                  {stats.meals}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  From completed deliveries
                </p>
              </div>

              <div className="rounded-xl bg-[#E8F5ED] p-3 text-[#1F7A4D]">
                <Users size={21} />
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================
            DELIVERY SECTION
        ====================================================== */}

        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#1F7A4D]">
              Your delivery queue
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#0B2F1A]">
              Delivery Requests
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Accept a request and keep its progress updated
              from pickup to delivery.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <CircleDot
              size={13}
              className="text-[#1F7A4D]"
            />
            Live delivery status
          </div>
        </div>

        {/* ======================================================
            LOADING
        ====================================================== */}

        {loading && (
          <div className="rounded-3xl border border-gray-200 bg-white px-6 py-20 shadow-sm">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-[#1F7A4D]">
                <RefreshCw
                  size={24}
                  className="animate-spin"
                />
              </div>

              <h3 className="font-semibold text-[#0B2F1A]">
                Loading your deliveries
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Getting the latest delivery requests...
              </p>
            </div>
          </div>
        )}

        {/* ======================================================
            EMPTY
        ====================================================== */}

        {!loading &&
          deliveries.length === 0 &&
          !error && (
            <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-20 text-center shadow-sm">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-[#1F7A4D]">
                <Truck size={29} />
              </div>

              <h3 className="text-xl font-bold text-[#0B2F1A]">
                No deliveries right now
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                There are currently no delivery requests
                waiting for a volunteer. New opportunities
                will appear here automatically.
              </p>

              <button
                type="button"
                onClick={refreshDashboard}
                className="mx-auto mt-6 inline-flex items-center gap-2 rounded-xl bg-[#1F7A4D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#14532D]"
              >
                <RefreshCw size={16} />
                Check again
              </button>
            </div>
          )}

        {/* ======================================================
            DELIVERY CARDS
        ====================================================== */}

        {!loading && deliveries.length > 0 && (
          <div className="grid gap-5 lg:grid-cols-2">
            {deliveries.map((delivery) => {
              const nextAction = getNextAction(delivery);
              const progress = getProgress(
                delivery.status
              );
              const currentStep = getStatusStep(
                delivery.status
              );

              const steps = [
                {
                  key: "assigned",
                  label: "Assigned",
                },
                {
                  key: "picked_up",
                  label: "Picked up",
                },
                {
                  key: "in_transit",
                  label: "In transit",
                },
                {
                  key: "delivered",
                  label: "Delivered",
                },
              ];

              return (
                <article
                  key={delivery.id}
                  className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  {/* Card Header */}
                  <div className="border-b border-gray-100 p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E8F5ED] text-[#1F7A4D]">
                          <Package size={23} />
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-lg font-bold text-[#0B2F1A]">
                            {delivery.food_name}
                          </h3>

                          <p className="mt-1 text-sm text-gray-500">
                            {delivery.food_type ||
                              "Food donation"}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                          delivery.status
                        )}`}
                      >
                        {getStatusLabel(
                          delivery.status
                        )}
                      </span>
                    </div>

                    {/* Quantity */}
                    <div className="mt-5 flex items-center justify-between rounded-2xl bg-[#FAFAF7] px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-white p-2 text-[#1F7A4D] shadow-sm">
                          <Utensils size={17} />
                        </div>

                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                            Food quantity
                          </p>

                          <p className="mt-0.5 text-sm font-bold text-[#0B2F1A]">
                            {delivery.quantity}{" "}
                            {delivery.quantity_unit}
                          </p>
                        </div>
                      </div>

                      <span className="text-xs text-gray-400">
                        #{delivery.id}
                      </span>
                    </div>

                    {/* Progress */}
                    {delivery.status !== "pending" && (
                      <div className="mt-6">
                        <div className="mb-2 flex items-center justify-between">
                          <p className="text-xs font-semibold text-gray-500">
                            Delivery progress
                          </p>

                          <p className="text-xs font-bold text-[#1F7A4D]">
                            {progress}%
                          </p>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full bg-[#1F7A4D] transition-all duration-500"
                            style={{
                              width: `${progress}%`,
                            }}
                          />
                        </div>

                        <div className="mt-4 grid grid-cols-4 gap-1">
                          {steps.map(
                            (step, index) => {
                              const completed =
                                index <= currentStep;

                              return (
                                <div
                                  key={step.key}
                                  className="flex flex-col items-center text-center"
                                >
                                  <div
                                    className={`flex h-7 w-7 items-center justify-center rounded-full ${
                                      completed
                                        ? "bg-[#1F7A4D] text-white"
                                        : "bg-gray-100 text-gray-400"
                                    }`}
                                  >
                                    {completed ? (
                                      <CheckCircle2
                                        size={14}
                                      />
                                    ) : (
                                      <CircleDot
                                        size={13}
                                      />
                                    )}
                                  </div>

                                  <span
                                    className={`mt-1.5 text-[10px] ${
                                      completed
                                        ? "font-semibold text-[#1F7A4D]"
                                        : "text-gray-400"
                                    }`}
                                  >
                                    {step.label}
                                  </span>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    {/* Route */}
                    <div className="relative">
                      <div className="absolute left-[15px] top-9 h-[calc(100%-68px)] border-l border-dashed border-gray-300" />

                      <div className="relative flex gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-50 text-[#1F7A4D]">
                          <MapPin size={17} />
                        </div>

                        <div className="min-w-0 pb-6">
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                            Pickup
                          </p>

                          <p className="mt-1 text-sm font-medium leading-5 text-gray-700">
                            {delivery.pickup_address ||
                              "Pickup address unavailable"}
                          </p>
                        </div>
                      </div>

                      <div className="relative flex gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                          <Navigation size={17} />
                        </div>

                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                            Deliver to
                          </p>

                          <p className="mt-1 text-sm font-medium leading-5 text-gray-700">
                            {delivery.delivery_address ||
                              "Delivery address unavailable"}
                          </p>

                          {delivery.recipient && (
                            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-500">
                              <Users size={12} />

                              {
                                delivery.recipient
                                  .organization_name
                              }

                              {delivery.recipient
                                .city && (
                                <>
                                  <span>•</span>

                                  {
                                    delivery
                                      .recipient.city
                                  }
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action */}
                    {nextAction && (
                      <button
                        onClick={nextAction.action}
                        disabled={
                          actionLoading ===
                          delivery.id
                        }
                        className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1F7A4D] px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#14532D] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {actionLoading ===
                        delivery.id ? (
                          <>
                            <RefreshCw
                              size={17}
                              className="animate-spin"
                            />
                            Updating...
                          </>
                        ) : (
                          <>
                            {nextAction.label}
                            <ArrowRight size={17} />
                          </>
                        )}
                      </button>
                    )}

                    {/* Completed */}
                    {delivery.status ===
                      "delivered" && (
                      <div className="mt-7 overflow-hidden rounded-2xl border border-green-200 bg-green-50">
                        <div className="flex items-center gap-3 px-4 py-4">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#1F7A4D] shadow-sm">
                            <CheckCircle2
                              size={18}
                            />
                          </div>

                          <div>
                            <p className="text-sm font-bold text-green-800">
                              Delivery completed
                            </p>

                            <p className="mt-0.5 text-xs text-green-700/80">
                              Thank you for helping turn
                              surplus into impact.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Pending helper */}
                    {delivery.status ===
                      "pending" && (
                      <div className="mt-5 flex items-center gap-2 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs text-amber-700">
                        <Clock size={15} />

                        This delivery is waiting for a
                        volunteer.
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* ======================================================
            BOTTOM MISSION CARD
        ====================================================== */}

        {!loading && (
          <section className="mt-10 overflow-hidden rounded-3xl border border-[#DDEBE2] bg-[#F2FAF5]">
            <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#1F7A4D] shadow-sm">
                  <HeartHandshakeIcon />
                </div>

                <div>
                  <h3 className="font-bold text-[#0B2F1A]">
                    Every delivery creates impact
                  </h3>

                  <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
                    FoodBridge AI connects surplus food with
                    communities that need it. Your role helps
                    make that connection real.
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2 text-sm font-semibold text-[#1F7A4D]">
                Keep moving
                <ChevronRight size={17} />
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

// Small reusable icon wrapper.
// Kept outside the component so it doesn't recreate
// on every render.
function HeartHandshakeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
      <path d="M8.5 12.5h2l1.2-1.5 1.6 2 1.2-1.5h1.5" />
    </svg>
  );
}

export default VolunteerDashboard;

