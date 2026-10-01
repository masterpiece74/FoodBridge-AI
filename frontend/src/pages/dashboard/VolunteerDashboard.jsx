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

const API_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://foodbridge-ai-qj9q.onrender.com";

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
        return <Truck size={16} strokeWidth={1.4} />;

      case "delivery_picked_up":
        return <Package size={16} strokeWidth={1.4} />;

      case "delivery_in_transit":
        return <Navigation size={16} strokeWidth={1.4} />;

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
        return "border-green-200 bg-green-50 text-green";

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
          label: "Accept delivery",
          action: () => acceptDelivery(delivery.id),
        };

      case "assigned":
        return {
          label: "Confirm pickup",
          action: () =>
            updateStatus(delivery.id, "picked_up"),
        };

      case "picked_up":
        return {
          label: "Start transit",
          action: () =>
            updateStatus(delivery.id, "in_transit"),
        };

      case "in_transit":
        return {
          label: "Mark delivered",
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
      picked_up: "Picked up",
      in_transit: "In transit",
      delivered: "Delivered",
    };

    return labels[status] || status;
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

  const getStatusAccent = (status) => {
    const accents = {
      pending: "text-amber-700 border-amber-200 bg-amber-50",
      assigned: "text-blue-700 border-blue-200 bg-blue-50",
      picked_up:
        "text-purple-700 border-purple-200 bg-purple-50",
      in_transit:
        "text-indigo-700 border-indigo-200 bg-indigo-50",
      delivered:
        "text-green border-green-200 bg-green-50",
    };

    return (
      accents[status] ||
      "text-muted border-line bg-paper"
    );
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
  // DELIVERY STEPS
  // ============================================================

  const deliverySteps = [
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

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* ========================================================
          HEADER
      ======================================================== */}

      <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 md:px-8 lg:px-10">
          {/* Brand */}
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center border border-deep-green bg-deep-green text-white">
              <Truck size={19} strokeWidth={1.3} />
            </div>

            <div>
              <p className="fb-label text-green">
                FoodBridge AI
              </p>

              <h1 className="mt-0.5 text-sm font-medium tracking-[-0.01em] text-deep-green md:text-base">
                Volunteer Dashboard
              </h1>
            </div>
          </div>

          {/* Actions */}
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
                className="relative flex h-10 w-10 items-center justify-center border border-line bg-paper text-muted transition-colors hover:border-green hover:text-green"
                aria-label="Notifications"
              >
                {unreadCount > 0 ? (
                  <BellRing
                    size={18}
                    strokeWidth={1.3}
                  />
                ) : (
                  <Bell
                    size={18}
                    strokeWidth={1.3}
                  />
                )}

                {unreadCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex min-h-[18px] min-w-[18px] items-center justify-center bg-green px-1 text-[9px] font-medium text-white">
                    {unreadCount > 99
                      ? "99+"
                      : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Panel */}
              {showNotifications && (
                <div className="fixed inset-x-3 top-[72px] z-50 overflow-hidden border border-line bg-paper shadow-2xl sm:absolute sm:left-auto sm:right-0 sm:top-12 sm:w-[430px]">
                  <div className="flex items-start justify-between border-b border-line px-5 py-5">
                    <div>
                      <p className="fb-label text-green">
                        Activity
                      </p>

                      <h3 className="mt-1 text-lg font-normal tracking-[-0.025em] text-deep-green">
                        Notifications
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-muted">
                        Updates about your delivery tasks.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setShowNotifications(false)
                      }
                      className="flex h-8 w-8 items-center justify-center border border-line text-muted transition-colors hover:border-ink hover:text-ink sm:hidden"
                      aria-label="Close notifications"
                    >
                      <X size={15} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between border-b border-line px-5 py-3">
                    <span className="text-[11px] uppercase tracking-[0.07em] text-muted">
                      {unreadCount} unread
                    </span>

                    <button
                      type="button"
                      onClick={markAllNotificationsAsRead}
                      disabled={unreadCount === 0}
                      className="fb-arrow text-[10px] uppercase tracking-[0.06em] text-green disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <CheckCheck size={13} />
                      Mark all read
                    </button>
                  </div>

                  <div className="max-h-[440px] overflow-y-auto">
                    {notificationsLoading ? (
                      <div className="flex items-center justify-center gap-2 px-5 py-12 text-xs text-muted">
                        <RefreshCw
                          size={15}
                          className="animate-spin"
                        />
                        Loading notifications...
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="px-5 py-14 text-center">
                        <Bell
                          size={22}
                          strokeWidth={1.2}
                          className="mx-auto text-green"
                        />

                        <h4 className="mt-4 text-sm font-medium text-deep-green">
                          You're all caught up
                        </h4>

                        <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-muted">
                          New delivery updates will appear
                          here.
                        </p>
                      </div>
                    ) : (
                      notifications.map(
                        (notification) => (
                          <div
                            key={notification.id}
                            className={`border-b border-line px-5 py-4 last:border-b-0 ${
                              notification.is_read
                                ? "bg-paper"
                                : "bg-light-green/40"
                            }`}
                          >
                            <div className="flex gap-3">
                              <div
                                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center border ${getNotificationIconClasses(
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
                                        ? "font-medium text-muted"
                                        : "font-semibold text-deep-green"
                                    }`}
                                  >
                                    {
                                      notification.title
                                    }
                                  </h4>

                                  {!notification.is_read && (
                                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-green" />
                                  )}
                                </div>

                                <p className="mt-1 text-xs leading-5 text-muted">
                                  {
                                    notification.message
                                  }
                                </p>

                                <div className="mt-2 flex items-center justify-between gap-2">
                                  <span className="text-[10px] uppercase tracking-[0.05em] text-ash">
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
                                      className="text-[10px] uppercase tracking-[0.05em] text-green hover:text-deep-green"
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

                  <div className="border-t border-line px-5 py-3">
                    <button
                      type="button"
                      onClick={() =>
                        fetchNotifications()
                      }
                      className="flex w-full items-center justify-center gap-2 py-2 text-[10px] uppercase tracking-[0.06em] text-muted transition-colors hover:text-green"
                    >
                      <RefreshCw
                        size={13}
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
              type="button"
              onClick={refreshDashboard}
              disabled={loading}
              className="fb-arrow h-10 border border-line px-3 text-[10px] uppercase tracking-[0.07em] text-muted transition-colors hover:border-green hover:text-green disabled:cursor-not-allowed disabled:opacity-40 sm:px-4"
            >
              <RefreshCw
                size={15}
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

      <main className="mx-auto max-w-[1440px] px-5 py-8 md:px-8 md:py-10 lg:px-10 lg:py-12">
        {/* ======================================================
            INTRODUCTION
        ====================================================== */}

        <section className="border-b border-line pb-10 md:pb-12">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.7fr] lg:items-end">
            <div>
              <p className="fb-label text-green">
                Volunteer / 01 — Delivery network
              </p>

              <h2 className="mt-6 max-w-5xl text-[clamp(4rem,9vw,8.5rem)] font-normal leading-[0.82] tracking-[-0.065em] text-ink">
                MOVE FOOD.
                <br />
                <span className="text-green">
                  MOVE HOPE.
                </span>
              </h2>
            </div>

            <div className="lg:pb-2">
              <p className="max-w-md text-sm leading-7 text-muted md:text-base">
                Your deliveries turn surplus food into
                practical support for communities that need
                it. Every pickup moves the network forward.
              </p>

              <div className="mt-8 flex items-center gap-3">
                <CircleDot
                  size={14}
                  strokeWidth={1.3}
                  className="text-green"
                />

                <span className="text-[10px] uppercase tracking-[0.08em] text-muted">
                  Live delivery network
                </span>
              </div>
            </div>
          </div>

          {/* Impact strip */}
          <div className="mt-10 grid border-t border-line sm:grid-cols-2 lg:grid-cols-4">
            <ImpactStat
              value={stats.available}
              label="Available"
              detail="Waiting for pickup"
              icon={<Truck size={17} strokeWidth={1.3} />}
            />

            <ImpactStat
              value={stats.active}
              label="Active"
              detail="Currently moving"
              icon={<Clock size={17} strokeWidth={1.3} />}
            />

            <ImpactStat
              value={stats.completed}
              label="Completed"
              detail="Successfully delivered"
              icon={
                <CheckCircle2
                  size={17}
                  strokeWidth={1.3}
                />
              }
            />

            <ImpactStat
              value={stats.meals}
              label="Meals moved"
              detail="From completed deliveries"
              icon={
                <Utensils size={17} strokeWidth={1.3} />
              }
            />
          </div>
        </section>

        {/* ======================================================
            MESSAGES
        ====================================================== */}

        {success && (
          <div className="mt-8 flex items-start gap-3 border border-green-200 bg-green-50 px-4 py-4 text-sm text-green-800">
            <CheckCircle2
              size={17}
              strokeWidth={1.4}
              className="mt-0.5 shrink-0"
            />

            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="mt-8 flex items-start gap-3 border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-800">
            <AlertCircle
              size={17}
              strokeWidth={1.4}
              className="mt-0.5 shrink-0"
            />

            <span>{error}</span>
          </div>
        )}

        {/* ======================================================
            DELIVERY QUEUE HEADER
        ====================================================== */}

        <section className="mt-14">
          <div className="flex flex-col justify-between gap-5 border-b border-line pb-5 sm:flex-row sm:items-end">
            <div>
              <p className="fb-label text-green">
                02 — Your route
              </p>

              <h2 className="mt-3 text-[clamp(2.2rem,4vw,4rem)] font-normal leading-none tracking-[-0.045em] text-deep-green">
                Delivery requests.
              </h2>
            </div>

            <p className="max-w-sm text-sm leading-6 text-muted sm:text-right">
              Accept a request and keep its journey updated
              from pickup through final delivery.
            </p>
          </div>
        </section>

        {/* ======================================================
            LOADING
        ====================================================== */}

        {loading && (
          <div className="border-b border-line px-4 py-24 text-center md:py-32">
            <RefreshCw
              size={24}
              strokeWidth={1.2}
              className="mx-auto animate-spin text-green"
            />

            <h3 className="mt-5 text-lg font-normal tracking-[-0.02em] text-deep-green">
              Loading your deliveries
            </h3>

            <p className="mt-2 text-xs leading-5 text-muted">
              Getting the latest delivery requests...
            </p>
          </div>
        )}

        {/* ======================================================
            EMPTY
        ====================================================== */}

        {!loading &&
          deliveries.length === 0 &&
          !error && (
            <div className="border-b border-line px-4 py-24 text-center md:py-32">
              <Truck
                size={29}
                strokeWidth={1.1}
                className="mx-auto text-green"
              />

              <h3 className="mt-5 text-2xl font-normal tracking-[-0.03em] text-deep-green">
                No deliveries right now.
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">
                There are currently no delivery requests
                waiting for a volunteer. New opportunities
                will appear here automatically.
              </p>

              <button
                type="button"
                onClick={refreshDashboard}
                className="fb-arrow mx-auto mt-7 border border-green px-5 py-3 text-[10px] uppercase tracking-[0.07em] text-green transition-colors hover:bg-green hover:text-white"
              >
                <RefreshCw
                  size={14}
                  strokeWidth={1.3}
                />
                Check again
              </button>
            </div>
          )}

        {/* ======================================================
            DELIVERY LIST
        ====================================================== */}

        {!loading && deliveries.length > 0 && (
          <div className="grid border-l border-line lg:grid-cols-2">
            {deliveries.map((delivery) => {
              const nextAction = getNextAction(delivery);
              const progress = getProgress(
                delivery.status
              );
              const currentStep = getStatusStep(
                delivery.status
              );

              return (
                <article
                  key={delivery.id}
                  className="group border-b border-r border-line bg-paper transition-colors hover:bg-white"
                >
                  {/* Delivery heading */}
                  <div className="border-b border-line p-6 md:p-8">
                    <div className="flex items-start justify-between gap-5">
                      <div className="flex min-w-0 items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-line bg-light-green text-green">
                          <Package
                            size={19}
                            strokeWidth={1.2}
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="fb-label text-ash">
                            Delivery #{delivery.id}
                          </p>

                          <h3 className="mt-2 truncate text-xl font-normal tracking-[-0.025em] text-deep-green">
                            {delivery.food_name}
                          </h3>

                          <p className="mt-1 text-xs text-muted">
                            {delivery.food_type ||
                              "Food donation"}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 border px-2.5 py-1 text-[9px] uppercase tracking-[0.06em] ${getStatusAccent(
                          delivery.status
                        )}`}
                      >
                        {getStatusLabel(
                          delivery.status
                        )}
                      </span>
                    </div>

                    {/* Quantity */}
                    <div className="mt-7 grid grid-cols-2 border-t border-line pt-5">
                      <div>
                        <p className="fb-label text-ash">
                          Quantity
                        </p>

                        <p className="mt-2 text-lg tracking-[-0.02em] text-deep-green">
                          {delivery.quantity}{" "}
                          {delivery.quantity_unit}
                        </p>
                      </div>

                      <div className="border-l border-line pl-5">
                        <p className="fb-label text-ash">
                          Current status
                        </p>

                        <p className="mt-2 text-sm text-muted">
                          {getStatusLabel(
                            delivery.status
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Progress */}
                    {delivery.status !== "pending" && (
                      <div className="mt-8 border-t border-line pt-6">
                        <div className="flex items-end justify-between">
                          <p className="fb-label text-ash">
                            Journey
                          </p>

                          <span className="text-sm text-green">
                            {progress}%
                          </span>
                        </div>

                        <div className="mt-3 h-px bg-line">
                          <div
                            className="h-px bg-green transition-all duration-500"
                            style={{
                              width: `${progress}%`,
                            }}
                          />
                        </div>

                        <div className="mt-5 grid grid-cols-4">
                          {deliverySteps.map(
                            (step, index) => {
                              const completed =
                                index <= currentStep;

                              return (
                                <div
                                  key={step.key}
                                  className={`relative ${
                                    index !==
                                    deliverySteps.length -
                                      1
                                      ? "pr-2"
                                      : ""
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <div
                                      className={`flex h-5 w-5 shrink-0 items-center justify-center border ${
                                        completed
                                          ? "border-green bg-green text-white"
                                          : "border-line bg-paper text-ash"
                                      }`}
                                    >
                                      {completed ? (
                                        <CheckCircle2
                                          size={11}
                                          strokeWidth={
                                            1.5
                                          }
                                        />
                                      ) : (
                                        <CircleDot
                                          size={10}
                                          strokeWidth={
                                            1.3
                                          }
                                        />
                                      )}
                                    </div>
                                  </div>

                                  <p
                                    className={`mt-2 text-[9px] leading-3 ${
                                      completed
                                        ? "text-green"
                                        : "text-ash"
                                    }`}
                                  >
                                    {step.label}
                                  </p>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Route */}
                  <div className="p-6 md:p-8">
                    <p className="fb-label text-green">
                      Route
                    </p>

                    <div className="mt-6">
                      {/* Pickup */}
                      <div className="relative flex gap-4">
                        <div className="relative flex w-7 shrink-0 justify-center">
                          <div className="flex h-7 w-7 items-center justify-center border border-green bg-light-green text-green">
                            <MapPin
                              size={15}
                              strokeWidth={1.3}
                            />
                          </div>

                          <div className="absolute left-1/2 top-7 h-[calc(100%+24px)] w-px -translate-x-1/2 border-l border-dashed border-line" />
                        </div>

                        <div className="min-w-0 pb-9">
                          <p className="fb-label text-ash">
                            Pickup
                          </p>

                          <p className="mt-2 text-sm leading-6 text-ink">
                            {delivery.pickup_address ||
                              "Pickup address unavailable"}
                          </p>
                        </div>
                      </div>

                      {/* Destination */}
                      <div className="relative flex gap-4">
                        <div className="flex w-7 shrink-0 justify-center">
                          <div className="flex h-7 w-7 items-center justify-center border border-line bg-paper text-muted">
                            <Navigation
                              size={15}
                              strokeWidth={1.3}
                            />
                          </div>
                        </div>

                        <div className="min-w-0">
                          <p className="fb-label text-ash">
                            Deliver to
                          </p>

                          <p className="mt-2 text-sm leading-6 text-ink">
                            {delivery.delivery_address ||
                              "Delivery address unavailable"}
                          </p>

                          {delivery.recipient && (
                            <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
                              <Users
                                size={13}
                                strokeWidth={1.3}
                                className="text-green"
                              />

                              <span>
                                {
                                  delivery.recipient
                                    .organization_name
                                }
                              </span>

                              {delivery.recipient
                                .city && (
                                <>
                                  <span className="text-ash">
                                    /
                                  </span>

                                  <span>
                                    {
                                      delivery
                                        .recipient.city
                                    }
                                  </span>
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
                        type="button"
                        onClick={nextAction.action}
                        disabled={
                          actionLoading ===
                          delivery.id
                        }
                        className="group mt-9 flex w-full items-center justify-between border border-green bg-green px-5 py-4 text-[10px] uppercase tracking-[0.08em] text-white transition-colors hover:bg-deep-green disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <span>
                          {actionLoading ===
                          delivery.id
                            ? "Updating..."
                            : nextAction.label}
                        </span>

                        {actionLoading ===
                        delivery.id ? (
                          <RefreshCw
                            size={15}
                            strokeWidth={1.3}
                            className="animate-spin"
                          />
                        ) : (
                          <ArrowRight
                            size={15}
                            strokeWidth={1.3}
                            className="transition-transform duration-200 group-hover:translate-x-1"
                          />
                        )}
                      </button>
                    )}

                    {/* Completed */}
                    {delivery.status ===
                      "delivered" && (
                      <div className="mt-8 border-t border-green-200 pt-5">
                        <div className="flex items-start gap-3">
                          <CheckCircle2
                            size={17}
                            strokeWidth={1.3}
                            className="mt-0.5 shrink-0 text-green"
                          />

                          <div>
                            <p className="text-sm text-green">
                              Delivery completed.
                            </p>

                            <p className="mt-1 text-xs leading-5 text-muted">
                              Thank you for helping turn
                              surplus into impact.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Pending */}
                    {delivery.status ===
                      "pending" && (
                      <div className="mt-7 flex items-start gap-3 border-t border-line pt-5">
                        <Clock
                          size={15}
                          strokeWidth={1.3}
                          className="mt-0.5 shrink-0 text-amber-600"
                        />

                        <p className="text-xs leading-5 text-muted">
                          This delivery is waiting for a
                          volunteer.
                        </p>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* ======================================================
            MISSION
        ====================================================== */}

        {!loading && (
          <section className="border-b border-line border-l border-r bg-deep-green text-white">
            <div className="grid lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="px-6 py-10 md:px-8 lg:px-10">
                <p className="fb-label text-light-green">
                  03 — Why it matters
                </p>

                <h3 className="mt-4 max-w-3xl text-[clamp(2.3rem,5vw,5rem)] font-normal leading-[0.92] tracking-[-0.045em]">
                  EVERY DELIVERY
                  <br />
                  <span className="text-light-green">
                    CREATES IMPACT.
                  </span>
                </h3>

                <p className="mt-7 max-w-2xl text-sm leading-7 text-white/55 md:text-base">
                  FoodBridge connects surplus food with
                  communities that need it. Your role makes
                  that connection real — one pickup, one
                  route, one delivery at a time.
                </p>
              </div>

              <div className="border-t border-white/10 px-6 py-7 md:px-8 lg:border-l lg:border-t-0 lg:px-10">
                <div className="flex items-center gap-3">
                  <Truck
                    size={18}
                    strokeWidth={1.2}
                    className="text-light-green"
                  />

                  <span className="text-[10px] uppercase tracking-[0.08em] text-white/50">
                    Keep moving
                  </span>
                </div>

                <div className="mt-8 flex items-center gap-3 text-sm text-light-green">
                  Food / Community / Movement
                  <ChevronRight
                    size={16}
                    strokeWidth={1.2}
                  />
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

// ============================================================
// IMPACT STAT
// ============================================================

function ImpactStat({
  value,
  label,
  detail,
  icon,
}) {
  return (
    <div className="border-b border-line py-6 sm:px-5 lg:border-b-0 lg:border-r lg:first:pl-0 lg:last:border-r-0">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-3xl font-normal tracking-[-0.04em] text-deep-green md:text-4xl">
            {value}
          </p>

          <p className="mt-2 text-[10px] uppercase tracking-[0.07em] text-green">
            {label}
          </p>

          <p className="mt-1 text-xs text-muted">
            {detail}
          </p>
        </div>

        <div className="text-green">
          {icon}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// HEART / IMPACT ICON
// ============================================================

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