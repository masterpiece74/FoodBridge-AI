import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  HeartHandshake,
  Utensils,
  Truck,
  Plus,
  LogOut,
  RefreshCw,
  MapPin,
  Users,
  Clock3,
  ShieldCheck,
  Building2,
  X,
  ChevronRight,
  CheckCircle2,
  Bell,
  Check,
  CheckCheck,
  Search,
  Navigation,
  ArrowRight,
  ArrowDownRight,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

const API_URL = "https://foodbridge-ai-qj9q.onrender.com";

export default function RecipientDashboard() {
  const navigate = useNavigate();

  // ============================================================
  // AUTH
  // ============================================================

  const getToken = () =>
    localStorage.getItem("access_token");

  // ============================================================
  // MAIN DATA
  // ============================================================

  const [profile, setProfile] = useState(null);
  const [needs, setNeeds] = useState([]);
  const [deliveries, setDeliveries] = useState([]);

  // ============================================================
  // NOTIFICATIONS
  // ============================================================

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] =
    useState(false);

  // ============================================================
  // LOADING / ERRORS
  // ============================================================

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================================
  // MODALS
  // ============================================================

  const [showNeedForm, setShowNeedForm] =
    useState(false);

  const [showProfileForm, setShowProfileForm] =
    useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [profileSubmitting, setProfileSubmitting] =
    useState(false);

  // ============================================================
  // LOCATION
  // ============================================================

  const [locationLoading, setLocationLoading] =
    useState(false);

  const [locationResult, setLocationResult] =
    useState(null);

  const [locationMessage, setLocationMessage] =
    useState("");

  // ============================================================
  // FOOD NEED FORM
  // ============================================================

  const [form, setForm] = useState({
    food_type: "",
    quantity_needed: "",
    quantity_unit: "items",
    urgency_score: 50,
    people_to_feed: 0,
  });

  // ============================================================
  // PROFILE FORM
  // ============================================================

  const [profileForm, setProfileForm] = useState({
    organization_name: "",
    organization_type: "",
    address: "",
    city: "",
    state: "",
    latitude: "",
    longitude: "",
    people_supported: 0,
  });

  // ============================================================
  // AUTH CHECK
  // ============================================================

  useEffect(() => {
    const token = getToken();

    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // ============================================================
  // LOAD RECIPIENT DATA
  // ============================================================

  const loadRecipientData = async () => {
    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [
        profileResponse,
        needsResponse,
        deliveriesResponse,
      ] = await Promise.all([
        fetch(`${API_URL}/recipient-profile`, {
          headers,
        }),

        fetch(`${API_URL}/recipient-needs`, {
          headers,
        }),

        fetch(`${API_URL}/recipient-deliveries/`, {
          headers,
        }),
      ]);

      if (
        profileResponse.status === 401 ||
        needsResponse.status === 401 ||
        deliveriesResponse.status === 401
      ) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      if (profileResponse.status === 404) {
        setProfile(null);
        setShowProfileForm(true);
      } else if (profileResponse.ok) {
        const profileData =
          await profileResponse.json();

        setProfile(
          profileData.profile || profileData
        );
      }

      if (needsResponse.ok) {
        const needsData =
          await needsResponse.json();

        setNeeds(
          Array.isArray(needsData)
            ? needsData
            : needsData.needs || []
        );
      }

      if (deliveriesResponse.ok) {
        const deliveriesData =
          await deliveriesResponse.json();

        setDeliveries(
          Array.isArray(deliveriesData)
            ? deliveriesData
            : deliveriesData.deliveries || []
        );
      }
    } catch (err) {
      console.error(
        "Recipient dashboard loading error:",
        err
      );

      setError(
        "Unable to load your dashboard. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // NOTIFICATIONS
  // ============================================================

  const loadNotifications = async () => {
    const token = getToken();

    if (!token) return;

    try {
      const response = await fetch(
        `${API_URL}/notifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) return;

      const data = await response.json();

      const notificationList = Array.isArray(data)
        ? data
        : data.notifications || [];

      setNotifications(notificationList);

      setUnreadCount(
        notificationList.filter(
          (notification) =>
            !notification.is_read
        ).length
      );
    } catch (err) {
      console.error(
        "Notification loading error:",
        err
      );
    }
  };

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    loadRecipientData();
    loadNotifications();

    const interval = setInterval(() => {
      loadRecipientData();
      loadNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // ============================================================
  // MARK NOTIFICATION READ
  // ============================================================

  const markNotificationRead = async (
    notificationId
  ) => {
    const token = getToken();

    if (!token) return;

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

      if (response.ok) {
        setNotifications((previous) =>
          previous.map((notification) =>
            notification.id === notificationId
              ? {
                  ...notification,
                  is_read: true,
                }
              : notification
          )
        );

        setUnreadCount((previous) =>
          Math.max(previous - 1, 0)
        );
      }
    } catch (err) {
      console.error(
        "Mark notification read error:",
        err
      );
    }
  };

  // ============================================================
  // MARK ALL READ
  // ============================================================

  const markAllNotificationsRead = async () => {
    const token = getToken();

    if (!token) return;

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

      if (response.ok) {
        setNotifications((previous) =>
          previous.map((notification) => ({
            ...notification,
            is_read: true,
          }))
        );

        setUnreadCount(0);
      }
    } catch (err) {
      console.error(
        "Mark all notifications error:",
        err
      );
    }
  };

  // ============================================================
  // PROFILE FORM
  // ============================================================

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfileForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ============================================================
  // FIND LOCATION
  // ============================================================

  const handleFindLocation = async () => {
    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    const address =
      profileForm.address.trim();

    const city =
      profileForm.city.trim();

    const state =
      profileForm.state.trim();

    if (!address) {
      setLocationMessage(
        "Please enter your full address, street, bus stop, landmark, or organization location first."
      );
      return;
    }

    try {
      setLocationLoading(true);
      setLocationMessage("");
      setLocationResult(null);

      const response = await fetch(
        `${API_URL}/recipient-profile/find-location`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            address,
            city: city || null,
            state: state || null,
          }),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "We could not find this location."
        );
      }

      setLocationResult(data);

      setProfileForm((previous) => ({
        ...previous,

        address:
          previous.address ||
          data.display_name ||
          "",

        city:
          previous.city ||
          data.city ||
          "",

        state:
          previous.state ||
          data.state ||
          "",

        latitude:
          data.latitude !== null &&
          data.latitude !== undefined
            ? String(data.latitude)
            : previous.latitude,

        longitude:
          data.longitude !== null &&
          data.longitude !== undefined
            ? String(data.longitude)
            : previous.longitude,
      }));

      setLocationMessage(
        "Location found successfully. Please review the detected details before saving."
      );
    } catch (err) {
      console.error(
        "Location lookup error:",
        err
      );

      setLocationMessage(
        err.message ||
          "Unable to find this location. Try adding a nearby landmark, bus stop, street, or organization name."
      );
    } finally {
      setLocationLoading(false);
    }
  };

  // ============================================================
  // OPEN PROFILE
  // ============================================================

  const openProfileForm = () => {
    if (profile) {
      setProfileForm({
        organization_name:
          profile.organization_name || "",

        organization_type:
          profile.organization_type || "",

        address:
          profile.address || "",

        city:
          profile.city || "",

        state:
          profile.state || "",

        latitude:
          profile.latitude !== null &&
          profile.latitude !== undefined
            ? String(profile.latitude)
            : "",

        longitude:
          profile.longitude !== null &&
          profile.longitude !== undefined
            ? String(profile.longitude)
            : "",

        people_supported:
          profile.people_supported || 0,
      });
    } else {
      setProfileForm({
        organization_name: "",
        organization_type: "",
        address: "",
        city: "",
        state: "",
        latitude: "",
        longitude: "",
        people_supported: 0,
      });
    }

    setLocationResult(null);
    setLocationMessage("");
    setShowProfileForm(true);
  };

  // ============================================================
  // SAVE PROFILE
  // ============================================================

  const handleCreateProfile = async (event) => {
    event.preventDefault();

    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    if (
      !profile &&
      (!profileForm.latitude ||
        !profileForm.longitude)
    ) {
      setLocationMessage(
        "Please find your location before creating your recipient profile."
      );
      return;
    }

    if (
      profile &&
      (!profileForm.latitude ||
        !profileForm.longitude)
    ) {
      setLocationMessage(
        "Please find a valid location before saving your changes."
      );
      return;
    }

    try {
      setProfileSubmitting(true);
      setError("");

      const isUpdating = Boolean(profile);

      const latitude = Number(
        profileForm.latitude
      );

      const longitude = Number(
        profileForm.longitude
      );

      if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
      ) {
        throw new Error(
          "The detected latitude and longitude are not valid. Please search for your location again."
        );
      }

      const response = await fetch(
        isUpdating
          ? `${API_URL}/recipient-profile/location`
          : `${API_URL}/recipient-profile`,
        {
          method: isUpdating ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(
            isUpdating
              ? {
                  address:
                    profileForm.address.trim(),

                  city:
                    profileForm.city.trim(),

                  state:
                    profileForm.state.trim(),

                  latitude,
                  longitude,
                }
              : {
                  organization_name:
                    profileForm.organization_name.trim(),

                  organization_type:
                    profileForm.organization_type.trim(),

                  address:
                    profileForm.address.trim(),

                  city:
                    profileForm.city.trim(),

                  state:
                    profileForm.state.trim(),

                  latitude,
                  longitude,

                  people_supported: Number(
                    profileForm.people_supported
                  ),
                }
          ),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.detail ||
            `Failed to ${
              isUpdating
                ? "update"
                : "create"
            } recipient profile.`
        );
      }

      setProfile(
        data.profile || data
      );

      setShowProfileForm(false);
      setLocationResult(null);
      setLocationMessage("");

      setProfileForm({
        organization_name: "",
        organization_type: "",
        address: "",
        city: "",
        state: "",
        latitude: "",
        longitude: "",
        people_supported: 0,
      });

      await loadRecipientData();
    } catch (err) {
      console.error(
        "Profile save error:",
        err
      );

      setError(
        err.message ||
          "Unable to save your recipient profile."
      );
    } finally {
      setProfileSubmitting(false);
    }
  };

  // ============================================================
  // FOOD NEED
  // ============================================================

  const handleNeedChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const openNeedForm = () => {
    if (!profile) {
      setShowProfileForm(true);
      return;
    }

    setShowNeedForm(true);
  };

  const handleCreateNeed = async (event) => {
    event.preventDefault();

    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    if (!profile) {
      setError(
        "Please complete your recipient profile first."
      );
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const response = await fetch(
        `${API_URL}/recipient-needs`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            food_type:
              form.food_type.trim(),

            quantity_needed: Number(
              form.quantity_needed
            ),

            quantity_unit:
              form.quantity_unit,

            urgency_score: Number(
              form.urgency_score
            ),

            people_to_feed: Number(
              form.people_to_feed
            ),
          }),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Failed to create food need."
        );
      }

      setShowNeedForm(false);

      setForm({
        food_type: "",
        quantity_needed: "",
        quantity_unit: "items",
        urgency_score: 50,
        people_to_feed: 0,
      });

      await loadRecipientData();
    } catch (err) {
      console.error(
        "Food need creation error:",
        err
      );

      setError(
        err.message ||
          "Unable to create food need."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // ============================================================
  // HELPERS
  // ============================================================

  const formatDate = (date) => {
    if (!date) return "—";

    try {
      return new Date(date).toLocaleDateString(
        "en-NG",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return "—";
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

  const getDeliveryStatusClass = (status) => {
    switch (status) {
      case "delivered":
        return "border-green/20 bg-light-green text-deep-green";

      case "in_transit":
        return "border-blue-200 bg-blue-50 text-blue-700";

      case "picked_up":
        return "border-purple-200 bg-purple-50 text-purple-700";

      case "assigned":
        return "border-amber-200 bg-amber-50 text-amber-700";

      case "pending":
        return "border-line bg-paper text-muted";

      default:
        return "border-line bg-paper text-muted";
    }
  };

  // ============================================================
  // CALCULATED DATA
  // ============================================================

  const activeNeeds = needs.filter(
    (need) =>
      need.status === "active" ||
      need.status === "open" ||
      !need.status
  ).length;

  const completedDeliveries =
    deliveries.filter(
      (delivery) =>
        delivery.status === "delivered"
    ).length;

  const pendingDeliveries =
    deliveries.filter(
      (delivery) =>
        delivery.status !== "delivered"
    ).length;

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <div className="w-full max-w-md px-6">
          <div className="mb-8 flex items-center justify-between border-b border-line pb-5">
            <div>
              <p className="fb-label text-green">
                FoodBridge AI
              </p>

              <p className="mt-2 text-xs text-muted">
                Recipient platform
              </p>
            </div>

            <RefreshCw
              size={18}
              className="animate-spin text-green"
            />
          </div>

          <div className="h-px w-full overflow-hidden bg-line">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{
                duration: 1.8,
                ease: "easeInOut",
              }}
              className="h-full bg-green"
            />
          </div>

          <p className="mt-4 text-xs uppercase tracking-[0.08em] text-muted">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // DASHBOARD
  // ============================================================

  return (
    <div className="min-h-screen bg-paper text-ink">

      {/* ======================================================
          DESKTOP SIDEBAR
      ====================================================== */}

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[250px] border-r border-line bg-paper lg:flex lg:flex-col">

        <div className="border-b border-line px-7 py-7">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-left"
          >
            <p className="text-xl font-medium tracking-[-0.04em]">
              FoodBridge
              <span className="text-green"> AI</span>
            </p>

            <p className="mt-2 text-[9px] uppercase tracking-[0.12em] text-muted">
              Turning surplus into hope
            </p>
          </button>
        </div>

        <div className="px-7 py-8">
          <p className="fb-label mb-4 text-ash">
            Recipient / 01
          </p>

          <nav className="space-y-1">
            <button
              type="button"
              className="flex w-full items-center justify-between border-l-2 border-green bg-light-green/40 px-3 py-3 text-left text-sm text-deep-green"
            >
              <span className="flex items-center gap-3">
                <LayoutDashboard size={16} />
                Dashboard
              </span>

              <ArrowRight size={14} />
            </button>

            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("food-needs")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
              className="flex w-full items-center gap-3 border-l-2 border-transparent px-3 py-3 text-left text-sm text-muted transition hover:border-green hover:text-ink"
            >
              <HeartHandshake size={16} />
              Food needs
            </button>

            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("deliveries")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
              className="flex w-full items-center gap-3 border-l-2 border-transparent px-3 py-3 text-left text-sm text-muted transition hover:border-green hover:text-ink"
            >
              <Truck size={16} />
              Deliveries
            </button>

            <button
              type="button"
              onClick={openProfileForm}
              className="flex w-full items-center gap-3 border-l-2 border-transparent px-3 py-3 text-left text-sm text-muted transition hover:border-green hover:text-ink"
            >
              <Building2 size={16} />
              Organization
            </button>
          </nav>
        </div>

        <div className="mt-auto border-t border-line p-7">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 text-sm text-muted transition hover:text-red-600"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      {/* ======================================================
          MAIN
      ====================================================== */}

      <main className="lg:ml-[250px]">

        {/* ====================================================
            TOP BAR
        ==================================================== */}

        <header className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur-md">

          <div className="flex min-h-[72px] items-center justify-between px-5 sm:px-8 lg:px-10">

            <div>
              <p className="fb-label text-muted">
                Recipient dashboard
              </p>

              <p className="mt-1 text-sm">
                {profile?.organization_name ||
                  "Your community workspace"}
              </p>
            </div>

            <div className="flex items-center gap-3">

              <button
                type="button"
                onClick={loadRecipientData}
                className="hidden items-center gap-2 border border-line px-3 py-2 text-[10px] uppercase tracking-[0.08em] text-muted transition hover:border-green hover:text-green sm:flex"
              >
                <RefreshCw size={14} />
                Refresh
              </button>

              <div className="relative">

                <button
                  type="button"
                  onClick={() =>
                    setShowNotifications(
                      (previous) =>
                        !previous
                    )
                  }
                  className="relative flex h-10 w-10 items-center justify-center border border-line transition hover:border-green hover:text-green"
                >
                  <Bell size={17} />

                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center bg-green px-1 text-[8px] text-white">
                      {unreadCount > 9
                        ? "9+"
                        : unreadCount}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: -8,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: -8,
                      }}
                      className="absolute right-0 top-12 z-50 w-[min(380px,calc(100vw-32px))] border border-line bg-paper shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
                    >
                      <div className="flex items-center justify-between border-b border-line px-4 py-4">
                        <div>
                          <p className="text-sm">
                            Notifications
                          </p>

                          <p className="mt-1 text-[10px] uppercase tracking-[0.08em] text-muted">
                            {unreadCount} unread
                          </p>
                        </div>

                        {unreadCount > 0 && (
                          <button
                            type="button"
                            onClick={
                              markAllNotificationsRead
                            }
                            className="flex items-center gap-1 text-[10px] uppercase tracking-[0.06em] text-green"
                          >
                            <CheckCheck size={13} />
                            Mark all
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length ===
                        0 ? (
                          <div className="px-5 py-10 text-center">
                            <Bell
                              size={22}
                              className="mx-auto text-ash"
                            />

                            <p className="mt-3 text-xs text-muted">
                              No notifications yet.
                            </p>
                          </div>
                        ) : (
                          notifications.map(
                            (notification) => (
                              <button
                                type="button"
                                key={
                                  notification.id
                                }
                                onClick={() =>
                                  !notification.is_read &&
                                  markNotificationRead(
                                    notification.id
                                  )
                                }
                                className={`w-full border-b border-line px-4 py-4 text-left transition hover:bg-light-green/20 ${
                                  notification.is_read
                                    ? "bg-paper"
                                    : "bg-light-green/20"
                                }`}
                              >
                                <div className="flex gap-3">
                                  <div className="mt-1">
                                    {notification.is_read ? (
                                      <Check
                                        size={14}
                                        className="text-ash"
                                      />
                                    ) : (
                                      <span className="block h-2 w-2 bg-green" />
                                    )}
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm">
                                      {notification.title ||
                                        "FoodBridge notification"}
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-muted">
                                      {notification.message ||
                                        notification.body ||
                                        ""}
                                    </p>

                                    <p className="mt-2 text-[9px] uppercase tracking-[0.06em] text-ash">
                                      {formatDate(
                                        notification.created_at
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </button>
                            )
                          )
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="hidden h-10 items-center gap-2 border border-line px-3 text-[10px] uppercase tracking-[0.08em] text-muted transition hover:border-red-300 hover:text-red-600 md:flex"
              >
                <LogOut size={14} />
                Exit
              </button>
            </div>
          </div>
        </header>

        {/* ====================================================
            CONTENT
        ==================================================== */}

        <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8 lg:px-10 lg:py-14">

          {/* ==================================================
              INTRO
          ================================================== */}

          <section className="border-b border-line pb-12">

            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">

              <div>
                <p className="fb-label mb-5 text-green">
                  01 — Your community
                </p>

                <h1 className="max-w-5xl text-[clamp(3.2rem,7vw,7.5rem)] font-normal leading-[0.86] tracking-[-0.06em]">
                  RECEIVE
                  <br />
                  WHAT
                  <br />
                  <span className="text-green">
                    MATTERS.
                  </span>
                </h1>

                <p className="mt-7 max-w-2xl text-sm leading-7 text-muted md:text-base">
                  Create food needs, receive suitable
                  donations, and track incoming
                  deliveries through FoodBridge.
                </p>
              </div>

              <div className="flex flex-col items-start gap-3 lg:items-end">

                <button
                  type="button"
                  onClick={openNeedForm}
                  className="group flex items-center gap-8 bg-deep-green px-5 py-4 text-[10px] uppercase tracking-[0.08em] text-white transition hover:bg-green"
                >
                  Add food need
                  <ArrowRight
                    size={15}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>

                <button
                  type="button"
                  onClick={loadRecipientData}
                  className="flex items-center gap-2 text-[10px] uppercase tracking-[0.08em] text-muted sm:hidden"
                >
                  <RefreshCw size={13} />
                  Refresh data
                </button>
              </div>
            </div>
          </section>

          {/* ==================================================
              ERROR
          ================================================== */}

          {error && (
            <div className="mt-6 flex items-start justify-between gap-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <p>{error}</p>

              <button
                type="button"
                onClick={() => setError("")}
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* ==================================================
              PROFILE
          ================================================== */}

          <section className="border-b border-line py-10">

            <div className="grid gap-8 lg:grid-cols-[1fr_0.7fr]">

              <div>
                <p className="fb-label text-muted">
                  Organization
                </p>

                <div className="mt-4 flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-light-green text-green">
                    <Building2 size={21} />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-xl tracking-[-0.02em]">
                        {profile?.organization_name ||
                          "Recipient profile"}
                      </h2>

                      {profile && (
                        <span className="flex items-center gap-1 text-[9px] uppercase tracking-[0.08em] text-green">
                          <ShieldCheck size={12} />

                          {profile.is_verified
                            ? "Verified"
                            : "Active"}
                        </span>
                      )}
                    </div>

                    {profile ? (
                      <>
                        <p className="mt-2 text-sm text-muted">
                          {profile.organization_type ||
                            "Community organization"}
                        </p>

                        <p className="mt-2 flex items-center gap-2 text-xs text-muted">
                          <MapPin size={13} />

                          {profile.city ||
                            "City not set"}

                          {profile.state
                            ? `, ${profile.state}`
                            : ""}
                        </p>
                      </>
                    ) : (
                      <p className="mt-2 max-w-xl text-sm text-amber-700">
                        Complete your organization
                        profile before creating food
                        needs.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-end justify-between border-t border-line pt-6 lg:border-t-0 lg:border-l lg:pl-8">

                {profile ? (
                  <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:w-full">

                    <div>
                      <p className="fb-label text-muted">
                        People
                      </p>

                      <p className="mt-2 text-2xl">
                        {profile.people_supported ||
                          0}
                      </p>
                    </div>

                    <div>
                      <p className="fb-label text-muted">
                        Location
                      </p>

                      <p className="mt-2 text-xs text-green">
                        {profile.latitude !==
                          null &&
                        profile.latitude !==
                          undefined &&
                        profile.longitude !==
                          null &&
                        profile.longitude !==
                          undefined
                          ? "Coordinates saved"
                          : "Location needed"}
                      </p>
                    </div>

                    <div className="hidden sm:block">
                      <p className="fb-label text-muted">
                        Type
                      </p>

                      <p className="mt-2 truncate text-xs">
                        {profile.organization_type ||
                          "Organization"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div />
                )}

                <button
                  type="button"
                  onClick={openProfileForm}
                  className="flex shrink-0 items-center gap-2 text-[10px] uppercase tracking-[0.08em] text-green"
                >
                  <Building2 size={14} />

                  {profile
                    ? "Edit"
                    : "Create"}
                </button>
              </div>
            </div>
          </section>

          {/* ==================================================
              LOCATION
          ================================================== */}

          <section className="border-b border-line py-10">

            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">

              <div>
                <p className="fb-label text-green">
                  02 — Location intelligence
                </p>

                <h2 className="mt-4 max-w-lg text-3xl font-normal leading-[0.95] tracking-[-0.04em] sm:text-4xl">
                  WHERE SHOULD
                  <br />
                  THE FOOD
                  <br />
                  <span className="text-green">
                    ARRIVE?
                  </span>
                </h2>
              </div>

              <div className="border-t border-line pt-5 lg:border-t-0 lg:pt-0">

                <div className="flex flex-col gap-6 sm:flex-row sm:justify-between">

                  <div className="flex gap-4">

                    <Navigation
                      size={20}
                      className="mt-1 shrink-0 text-green"
                    />

                    <div>
                      <p className="text-sm">
                        Delivery location
                      </p>

                      <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
                        Your location helps FoodBridge
                        calculate distance and identify
                        practical food matches.
                      </p>

                      {profile ? (
                        <div className="mt-5">
                          <p className="text-sm">
                            {profile.address ||
                              "No address saved"}
                          </p>

                          <p className="mt-1 text-xs text-muted">
                            {profile.city ||
                              "City not set"}

                            {profile.state
                              ? `, ${profile.state}`
                              : ""}
                          </p>

                          {profile.latitude !==
                            null &&
                            profile.latitude !==
                              undefined &&
                            profile.longitude !==
                              null &&
                            profile.longitude !==
                              undefined && (
                              <p className="mt-2 text-[10px] uppercase tracking-[0.06em] text-ash">
                                Coordinates{" "}
                                {Number(
                                  profile.latitude
                                ).toFixed(6)}
                                {" / "}
                                {Number(
                                  profile.longitude
                                ).toFixed(6)}
                              </p>
                            )}
                        </div>
                      ) : (
                        <p className="mt-4 text-xs text-amber-700">
                          Complete your profile first.
                        </p>
                      )}
                    </div>
                  </div>

                  {profile && (
                    <button
                      type="button"
                      onClick={openProfileForm}
                      className="flex h-fit shrink-0 items-center gap-2 border border-line px-4 py-3 text-[10px] uppercase tracking-[0.08em] text-muted transition hover:border-green hover:text-green"
                    >
                      <MapPin size={14} />

                      {profile.latitude !==
                        null &&
                      profile.latitude !==
                        undefined &&
                      profile.longitude !==
                        null &&
                      profile.longitude !==
                        undefined
                        ? "Update"
                        : "Add location"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* ==================================================
              STATS
          ================================================== */}

          <section className="border-b border-line py-10">

            <div className="grid grid-cols-2 md:grid-cols-4">

              <div className="border-b border-line py-5 pr-5 md:border-b-0 md:border-r">
                <p className="fb-label text-muted">
                  Active needs
                </p>

                <p className="mt-3 text-4xl tracking-[-0.04em]">
                  {activeNeeds}
                </p>

                <p className="mt-2 text-xs text-muted">
                  Current requests
                </p>
              </div>

              <div className="border-b border-line py-5 pl-5 md:border-b-0 md:border-r md:px-6">
                <p className="fb-label text-muted">
                  Completed
                </p>

                <p className="mt-3 text-4xl tracking-[-0.04em]">
                  {completedDeliveries}
                </p>

                <p className="mt-2 text-xs text-muted">
                  Deliveries received
                </p>
              </div>

              <div className="border-b border-line py-5 pr-5 md:border-b-0 md:border-r md:px-6">
                <p className="fb-label text-muted">
                  In progress
                </p>

                <p className="mt-3 text-4xl tracking-[-0.04em]">
                  {pendingDeliveries}
                </p>

                <p className="mt-2 text-xs text-muted">
                  On the way
                </p>
              </div>

              <div className="py-5 pl-5 md:px-6">
                <p className="fb-label text-muted">
                  Community
                </p>

                <p className="mt-3 text-4xl tracking-[-0.04em]">
                  {profile?.people_supported ||
                    0}
                </p>

                <p className="mt-2 text-xs text-muted">
                  People supported
                </p>
              </div>
            </div>
          </section>

          {/* ==================================================
              IMPACT STRIP
          ================================================== */}

          <section className="border-b border-line py-10">

            <div className="bg-deep-green px-6 py-8 text-white sm:px-8 sm:py-10">

              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">

                <div>
                  <p className="fb-label text-light-green">
                    03 — Community impact
                  </p>

                  <h2 className="mt-5 max-w-3xl text-[clamp(2.5rem,5vw,5rem)] font-normal leading-[0.9] tracking-[-0.05em]">
                    EVERY DELIVERY
                    <br />
                    HELPS SOMEONE
                    <br />
                    <span className="text-light-green">
                      EAT.
                    </span>
                  </h2>

                  <p className="mt-6 max-w-xl text-sm leading-7 text-white/60">
                    FoodBridge connects available
                    surplus food with organizations
                    serving people and communities.
                  </p>
                </div>

                <div className="grid grid-cols-2 border-t border-white/10 lg:border-l lg:border-t-0">

                  <div className="border-r border-white/10 px-5 py-4">
                    <p className="fb-label text-white/40">
                      Completed
                    </p>

                    <p className="mt-3 text-3xl">
                      {completedDeliveries}
                    </p>

                    <p className="mt-1 text-[10px] uppercase tracking-[0.06em] text-light-green">
                      deliveries
                    </p>
                  </div>

                  <div className="px-5 py-4">
                    <p className="fb-label text-white/40">
                      Supported
                    </p>

                    <p className="mt-3 text-3xl">
                      {profile?.people_supported ||
                        0}
                    </p>

                    <p className="mt-1 text-[10px] uppercase tracking-[0.06em] text-light-green">
                      people
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ==================================================
              DELIVERIES
          ================================================== */}

          <section
            id="deliveries"
            className="border-b border-line py-12"
          >

            <div className="mb-7 flex items-end justify-between gap-5">

              <div>
                <p className="fb-label text-green">
                  04 — Movement
                </p>

                <h2 className="mt-3 text-3xl font-normal tracking-[-0.04em] sm:text-4xl">
                  RECENT DELIVERIES
                </h2>

                <p className="mt-2 text-sm text-muted">
                  Track food moving toward your
                  organization.
                </p>
              </div>

              <Truck
                size={20}
                className="hidden text-ash sm:block"
              />
            </div>

            {deliveries.length === 0 ? (
              <div className="border-y border-line py-14 text-center">

                <Truck
                  size={25}
                  className="mx-auto text-ash"
                />

                <p className="mt-4 text-sm">
                  No deliveries yet.
                </p>

                <p className="mt-2 text-xs text-muted">
                  Matched food deliveries will appear
                  here.
                </p>
              </div>
            ) : (
              <div className="border-t border-line">

                {deliveries
                  .slice(0, 5)
                  .map((delivery, index) => (
                    <motion.div
                      key={delivery.id}
                      initial={{
                        opacity: 0,
                        y: 12,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}
                      viewport={{
                        once: true,
                      }}
                      transition={{
                        delay: index * 0.04,
                      }}
                      className="grid gap-4 border-b border-line py-5 sm:grid-cols-[1fr_auto] sm:items-center"
                    >

                      <div className="flex items-start gap-4">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-light-green text-green">
                          <Utensils size={17} />
                        </div>

                        <div>
                          <p className="text-sm">
                            {delivery.food_name ||
                              delivery.food_type ||
                              "Food delivery"}
                          </p>

                          <p className="mt-1 text-xs text-muted">
                            {delivery.quantity
                              ? `${delivery.quantity} ${
                                  delivery.quantity_unit ||
                                  "items"
                                }`
                              : "Food donation"}
                          </p>

                          <p className="mt-2 text-[9px] uppercase tracking-[0.06em] text-ash">
                            {formatDate(
                              delivery.created_at ||
                                delivery.createdAt
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-5 sm:justify-end">

                        <span
                          className={`border px-3 py-1.5 text-[9px] uppercase tracking-[0.06em] ${getDeliveryStatusClass(
                            delivery.status
                          )}`}
                        >
                          {formatStatus(
                            delivery.status
                          )}
                        </span>

                        <ChevronRight
                          size={15}
                          className="text-ash"
                        />
                      </div>
                    </motion.div>
                  ))}
              </div>
            )}
          </section>

          {/* ==================================================
              FOOD NEEDS
          ================================================== */}

          <section
            id="food-needs"
            className="py-12"
          >

            <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

              <div>
                <p className="fb-label text-green">
                  05 — Your requests
                </p>

                <h2 className="mt-3 text-3xl font-normal tracking-[-0.04em] sm:text-4xl">
                  FOOD NEEDS
                </h2>

                <p className="mt-2 max-w-xl text-sm text-muted">
                  Tell FoodBridge what your community
                  needs so suitable surplus can be
                  identified.
                </p>
              </div>

              <button
                type="button"
                onClick={openNeedForm}
                className="group flex w-fit items-center gap-6 bg-deep-green px-5 py-3.5 text-[10px] uppercase tracking-[0.08em] text-white transition hover:bg-green"
              >
                <Plus size={15} />
                Add food need
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </div>

            {needs.length === 0 ? (
              <div className="border-y border-line py-14 text-center">

                <Utensils
                  size={25}
                  className="mx-auto text-ash"
                />

                <p className="mt-4 text-sm">
                  No food needs added yet.
                </p>

                <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-muted">
                  Add the type and quantity of food
                  your organization needs so
                  FoodBridge can identify suitable
                  donations.
                </p>

                <button
                  type="button"
                  onClick={openNeedForm}
                  className="mt-5 text-[10px] uppercase tracking-[0.08em] text-green"
                >
                  Create your first need →
                </button>
              </div>
            ) : (
              <div className="grid border-t border-line sm:grid-cols-2 xl:grid-cols-3">

                {needs.map((need, index) => (
                  <motion.div
                    key={need.id}
                    initial={{
                      opacity: 0,
                      y: 15,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      delay: index * 0.04,
                    }}
                    className="border-b border-line py-6 sm:px-5 sm:nth-[odd]:border-r xl:px-6 xl:nth-[3n+1]:border-r"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div>
                        <p className="fb-label text-muted">
                          Need /{" "}
                          {String(index + 1).padStart(
                            2,
                            "0"
                          )}
                        </p>

                        <h3 className="mt-3 text-xl capitalize tracking-[-0.02em]">
                          {need.food_type ||
                            "Food"}
                        </h3>
                      </div>

                      <span className="text-[9px] uppercase tracking-[0.06em] text-green">
                        {formatStatus(
                          need.status ||
                            "active"
                        )}
                      </span>
                    </div>

                    <p className="mt-5 text-sm text-muted">
                      {need.quantity_needed ||
                        0}{" "}
                      {need.quantity_unit ||
                        "items"}
                    </p>

                    <div className="mt-5 border-t border-line pt-4">

                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-[0.06em] text-ash">
                          People to feed
                        </span>

                        <span className="text-sm">
                          {need.people_to_feed ||
                            0}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-[0.06em] text-ash">
                          Urgency
                        </span>

                        <span className="text-sm text-amber-700">
                          {need.urgency_score ||
                            0}
                          /100
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </section>

          {/* ==================================================
              FOOTER
          ================================================== */}

          <footer className="border-t border-line py-6">

            <div className="flex flex-col gap-3 text-[9px] uppercase tracking-[0.08em] text-muted sm:flex-row sm:items-center sm:justify-between">

              <span>
                FoodBridge AI
              </span>

              <span>
                Recipient platform
              </span>

              <button
                type="button"
                onClick={() =>
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  })
                }
                className="flex items-center gap-2 text-green"
              >
                Back to top
                <ArrowDownRight
                  size={12}
                  className="-rotate-90"
                />
              </button>
            </div>
          </footer>
        </div>
      </main>

      {/* ========================================================
          PROFILE MODAL
      ======================================================== */}

      <AnimatePresence>
        {showProfileForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: 20,
              }}
              className="max-h-[92vh] w-full max-w-2xl overflow-y-auto border border-line bg-paper"
            >

              {/* Header */}

              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-paper px-5 py-5 sm:px-7">

                <div>
                  <p className="fb-label text-green">
                    Recipient profile
                  </p>

                  <h3 className="mt-2 text-xl tracking-[-0.03em]">
                    {profile
                      ? "Update your location"
                      : "Create your organization"}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowProfileForm(false);
                    setLocationResult(null);
                    setLocationMessage("");
                  }}
                  className="flex h-9 w-9 items-center justify-center border border-line text-muted transition hover:border-ink hover:text-ink"
                >
                  <X size={17} />
                </button>
              </div>

              <form
                onSubmit={handleCreateProfile}
                className="space-y-8 p-5 sm:p-7"
              >

                {/* Organization */}

                {!profile && (
                  <div>
                    <p className="fb-label mb-5 text-muted">
                      Organization details
                    </p>

                    <div className="space-y-5">

                      <div>
                        <label className="mb-2 block text-xs uppercase tracking-[0.06em] text-muted">
                          Organization name
                        </label>

                        <input
                          type="text"
                          name="organization_name"
                          value={
                            profileForm.organization_name
                          }
                          onChange={
                            handleProfileChange
                          }
                          required
                          placeholder="e.g. Hope Community Centre"
                          className="w-full border-b border-line bg-transparent px-0 py-3 text-sm outline-none transition placeholder:text-ash focus:border-green"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-xs uppercase tracking-[0.06em] text-muted">
                          Organization type
                        </label>

                        <select
                          name="organization_type"
                          value={
                            profileForm.organization_type
                          }
                          onChange={
                            handleProfileChange
                          }
                          required
                          className="w-full border-b border-line bg-paper px-0 py-3 text-sm outline-none focus:border-green"
                        >
                          <option value="">
                            Select organization type
                          </option>

                          <option value="NGO">
                            NGO
                          </option>

                          <option value="Charity">
                            Charity
                          </option>

                          <option value="Community Centre">
                            Community Centre
                          </option>

                          <option value="Orphanage">
                            Orphanage
                          </option>

                          <option value="Shelter">
                            Shelter
                          </option>

                          <option value="Food Bank">
                            Food Bank
                          </option>

                          <option value="Religious Organization">
                            Religious Organization
                          </option>

                          <option value="Other">
                            Other
                          </option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-xs uppercase tracking-[0.06em] text-muted">
                          People supported
                        </label>

                        <input
                          type="number"
                          min="0"
                          name="people_supported"
                          value={
                            profileForm.people_supported
                          }
                          onChange={
                            handleProfileChange
                          }
                          placeholder="50"
                          className="w-full border-b border-line bg-transparent px-0 py-3 text-sm outline-none placeholder:text-ash focus:border-green"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Location */}

                <div className="border-t border-line pt-8">

                  <div className="flex items-start gap-4">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-light-green text-green">
                      <MapPin size={18} />
                    </div>

                    <div>
                      <p className="text-sm">
                        Find your delivery location
                      </p>

                      <p className="mt-1 text-xs leading-5 text-muted">
                        Enter your address, street,
                        bus stop, landmark, or
                        organization name.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-5">

                    <div>
                      <label className="mb-2 block text-xs uppercase tracking-[0.06em] text-muted">
                        Address or nearby landmark
                      </label>

                      <textarea
                        name="address"
                        value={
                          profileForm.address
                        }
                        onChange={
                          handleProfileChange
                        }
                        rows={3}
                        required
                        placeholder="e.g. Hope Community Centre, Fajuyi Bus Stop, Ado-Ekiti"
                        className="w-full resize-none border border-line bg-transparent px-4 py-3 text-sm outline-none placeholder:text-ash focus:border-green"
                      />

                      <p className="mt-2 text-[10px] text-ash">
                        Bus stops, streets, schools,
                        churches, markets, and
                        organization names are accepted.
                      </p>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">

                      <div>
                        <label className="mb-2 block text-xs uppercase tracking-[0.06em] text-muted">
                          City / Town
                        </label>

                        <input
                          type="text"
                          name="city"
                          value={
                            profileForm.city
                          }
                          onChange={
                            handleProfileChange
                          }
                          placeholder="Ado-Ekiti"
                          className="w-full border-b border-line bg-transparent px-0 py-3 text-sm outline-none placeholder:text-ash focus:border-green"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-xs uppercase tracking-[0.06em] text-muted">
                          State
                        </label>

                        <input
                          type="text"
                          name="state"
                          value={
                            profileForm.state
                          }
                          onChange={
                            handleProfileChange
                          }
                          placeholder="Ekiti"
                          className="w-full border-b border-line bg-transparent px-0 py-3 text-sm outline-none placeholder:text-ash focus:border-green"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleFindLocation}
                      disabled={locationLoading}
                      className="flex w-full items-center justify-center gap-3 bg-deep-green px-5 py-4 text-[10px] uppercase tracking-[0.08em] text-white transition hover:bg-green disabled:opacity-50"
                    >
                      {locationLoading ? (
                        <>
                          <RefreshCw
                            size={15}
                            className="animate-spin"
                          />
                          Finding location...
                        </>
                      ) : (
                        <>
                          <Search size={15} />
                          Find this location
                        </>
                      )}
                    </button>

                    {locationMessage && (
                      <div
                        className={`border px-4 py-3 text-xs leading-5 ${
                          locationMessage.includes(
                            "successfully"
                          )
                            ? "border-green/20 bg-light-green text-deep-green"
                            : "border-amber-200 bg-amber-50 text-amber-700"
                        }`}
                      >
                        {locationMessage}
                      </div>
                    )}

                    {locationResult && (
                      <div className="border border-green/20 bg-light-green/30 p-5">

                        <div className="flex gap-3">

                          <CheckCircle2
                            size={18}
                            className="mt-0.5 shrink-0 text-green"
                          />

                          <div>
                            <p className="text-sm">
                              Location detected
                            </p>

                            <p className="mt-1 text-xs leading-5 text-muted">
                              {locationResult.display_name ||
                                "Location found"}
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 grid grid-cols-2 border-t border-green/10 pt-4">

                          <div>
                            <p className="fb-label text-muted">
                              Latitude
                            </p>

                            <p className="mt-2 text-xs">
                              {locationResult.latitude}
                            </p>
                          </div>

                          <div>
                            <p className="fb-label text-muted">
                              Longitude
                            </p>

                            <p className="mt-2 text-xs">
                              {locationResult.longitude}
                            </p>
                          </div>
                        </div>

                        <p className="mt-4 text-[9px] leading-4 text-ash">
                          Location search powered by
                          OpenStreetMap. Review the
                          detected location before saving.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}

                <div className="flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:justify-end">

                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileForm(false);
                      setLocationResult(null);
                      setLocationMessage("");
                    }}
                    className="border border-line px-5 py-3 text-[10px] uppercase tracking-[0.08em] text-muted transition hover:border-ink hover:text-ink"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      profileSubmitting ||
                      !profileForm.latitude ||
                      !profileForm.longitude
                    }
                    className="flex items-center justify-center gap-3 bg-deep-green px-5 py-3 text-[10px] uppercase tracking-[0.08em] text-white transition hover:bg-green disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {profileSubmitting ? (
                      <>
                        <RefreshCw
                          size={14}
                          className="animate-spin"
                        />

                        {profile
                          ? "Saving changes..."
                          : "Creating profile..."}
                      </>
                    ) : (
                      <>
                        {profile
                          ? "Save changes"
                          : "Create profile"}

                        <ChevronRight size={14} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================
          FOOD NEED MODAL
      ======================================================== */}

      <AnimatePresence>
        {showNeedForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: 20,
              }}
              className="w-full max-w-lg border border-line bg-paper"
            >

              <div className="flex items-center justify-between border-b border-line px-5 py-5 sm:px-7">

                <div>
                  <p className="fb-label text-green">
                    Food request
                  </p>

                  <h3 className="mt-2 text-xl tracking-[-0.03em]">
                    Add a food need
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowNeedForm(false)
                  }
                  className="flex h-9 w-9 items-center justify-center border border-line text-muted hover:text-ink"
                >
                  <X size={17} />
                </button>
              </div>

              <form
                onSubmit={handleCreateNeed}
                className="space-y-6 p-5 sm:p-7"
              >

                <div>
                  <label className="mb-2 block text-xs uppercase tracking-[0.06em] text-muted">
                    Food type
                  </label>

                  <input
                    type="text"
                    name="food_type"
                    value={form.food_type}
                    onChange={handleNeedChange}
                    required
                    placeholder="e.g. bakery, rice, vegetables"
                    className="w-full border-b border-line bg-transparent px-0 py-3 text-sm outline-none placeholder:text-ash focus:border-green"
                  />
                </div>

                <div className="grid grid-cols-2 gap-5">

                  <div>
                    <label className="mb-2 block text-xs uppercase tracking-[0.06em] text-muted">
                      Quantity needed
                    </label>

                    <input
                      type="number"
                      min="1"
                      name="quantity_needed"
                      value={
                        form.quantity_needed
                      }
                      onChange={handleNeedChange}
                      required
                      placeholder="20"
                      className="w-full border-b border-line bg-transparent px-0 py-3 text-sm outline-none placeholder:text-ash focus:border-green"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs uppercase tracking-[0.06em] text-muted">
                      Unit
                    </label>

                    <select
                      name="quantity_unit"
                      value={
                        form.quantity_unit
                      }
                      onChange={handleNeedChange}
                      className="w-full border-b border-line bg-paper px-0 py-3 text-sm outline-none focus:border-green"
                    >
                      <option value="items">
                        Items
                      </option>

                      <option value="servings">
                        Servings
                      </option>

                      <option value="kg">
                        Kilograms
                      </option>

                      <option value="packs">
                        Packs
                      </option>

                      <option value="boxes">
                        Boxes
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs uppercase tracking-[0.06em] text-muted">
                    People to feed
                  </label>

                  <input
                    type="number"
                    min="0"
                    name="people_to_feed"
                    value={
                      form.people_to_feed
                    }
                    onChange={handleNeedChange}
                    placeholder="20"
                    className="w-full border-b border-line bg-transparent px-0 py-3 text-sm outline-none placeholder:text-ash focus:border-green"
                  />
                </div>

                <div>

                  <div className="mb-3 flex items-center justify-between">

                    <label className="text-xs uppercase tracking-[0.06em] text-muted">
                      Urgency
                    </label>

                    <span className="text-sm text-amber-700">
                      {form.urgency_score}/100
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    name="urgency_score"
                    value={
                      form.urgency_score
                    }
                    onChange={handleNeedChange}
                    className="w-full accent-[#1F7A4D]"
                  />

                  <div className="mt-2 flex justify-between text-[9px] uppercase tracking-[0.06em] text-ash">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:justify-end">

                  <button
                    type="button"
                    onClick={() =>
                      setShowNeedForm(false)
                    }
                    className="border border-line px-5 py-3 text-[10px] uppercase tracking-[0.08em] text-muted hover:text-ink"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center justify-center gap-3 bg-deep-green px-5 py-3 text-[10px] uppercase tracking-[0.08em] text-white hover:bg-green disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw
                          size={14}
                          className="animate-spin"
                        />
                        Creating...
                      </>
                    ) : (
                      <>
                        Create food need
                        <ChevronRight size={14} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}