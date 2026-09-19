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
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000";

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

  const [submitting, setSubmitting] =
    useState(false);

  const [profileSubmitting, setProfileSubmitting] =
    useState(false);

  // ============================================================
  // LOCATION INTELLIGENCE
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

      // ========================================================
      // AUTH ERROR
      // ========================================================

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

      // ========================================================
      // PROFILE
      // ========================================================

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

      // ========================================================
      // NEEDS
      // ========================================================

      if (needsResponse.ok) {
        const needsData =
          await needsResponse.json();

        setNeeds(
          Array.isArray(needsData)
            ? needsData
            : needsData.needs || []
        );
      }

      // ========================================================
      // DELIVERIES
      // ========================================================

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
  // LOAD NOTIFICATIONS
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

      const unread = notificationList.filter(
        (notification) =>
          !notification.is_read
      ).length;

      setUnreadCount(unread);
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
  // MARK ONE NOTIFICATION AS READ
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
  // MARK ALL NOTIFICATIONS AS READ
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
  // PROFILE FORM CHANGE
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
        localStorage.removeItem(
          "access_token"
        );

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

      // Keep the user's full address/landmark.
      // Only fill missing fields from the lookup.
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
  // OPEN PROFILE FORM
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
  // CREATE / UPDATE PROFILE
  // ============================================================

  const handleCreateProfile = async (
    event
  ) => {
    event.preventDefault();

    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    // A new profile needs coordinates before creation.
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

    // Existing profile location update also requires coordinates.
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

      const isUpdating =
        Boolean(profile);

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
          method: isUpdating
            ? "PATCH"
            : "POST",

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

                  people_supported:
                    Number(
                      profileForm.people_supported
                    ),
                }
          ),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem(
          "access_token"
        );

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
  // FOOD NEED FORM CHANGE
  // ============================================================

  const handleNeedChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ============================================================
  // OPEN NEED FORM
  // ============================================================

  const openNeedForm = () => {
    if (!profile) {
      setShowProfileForm(true);
      return;
    }

    setShowNeedForm(true);
  };

  // ============================================================
  // CREATE FOOD NEED
  // ============================================================

  const handleCreateNeed = async (
    event
  ) => {
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

            quantity_needed:
              Number(
                form.quantity_needed
              ),

            quantity_unit:
              form.quantity_unit,

            urgency_score:
              Number(
                form.urgency_score
              ),

            people_to_feed:
              Number(
                form.people_to_feed
              ),
          }),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem(
          "access_token"
        );

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
    localStorage.removeItem(
      "access_token"
    );

    localStorage.removeItem("user");

    navigate("/login");
  };

  // ============================================================
  // HELPERS
  // ============================================================

  const formatDate = (date) => {
    if (!date) return "—";

    try {
      return new Date(
        date
      ).toLocaleDateString(
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

  const getDeliveryStatusClass = (
    status
  ) => {
    switch (status) {
      case "delivered":
        return "bg-emerald-50 text-emerald-700";

      case "in_transit":
        return "bg-blue-50 text-blue-700";

      case "picked_up":
        return "bg-purple-50 text-purple-700";

      case "assigned":
        return "bg-amber-50 text-amber-700";

      case "pending":
        return "bg-gray-100 text-gray-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // ============================================================
  // CALCULATED DASHBOARD DATA
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
  // LOADING SCREEN
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-green-100 border-t-green-700 animate-spin" />

          <p className="text-sm text-gray-500">
            Loading your FoodBridge dashboard...
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // DASHBOARD
  // ============================================================

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">

      {/* ========================================================
          SIDEBAR
      ======================================================== */}

      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-gray-200 bg-white lg:flex lg:flex-col">

        {/* Logo */}

        <div className="flex h-20 items-center border-b border-gray-100 px-6">
          <div>
            <h1 className="text-xl font-bold text-green-800">
              FoodBridge
            </h1>

            <p className="text-[11px] font-medium tracking-wide text-gray-400">
              TURNING SURPLUS INTO HOPE
            </p>
          </div>
        </div>

        {/* Navigation */}

        <nav className="flex-1 space-y-1 px-4 py-6">

          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700"
          >
            <LayoutDashboard size={18} />
            Dashboard
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
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-500 transition hover:bg-gray-50 hover:text-green-700"
          >
            <HeartHandshake size={18} />
            Food Needs
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
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-500 transition hover:bg-gray-50 hover:text-green-700"
          >
            <Truck size={18} />
            Deliveries
          </button>

          <button
            type="button"
            onClick={openProfileForm}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-500 transition hover:bg-gray-50 hover:text-green-700"
          >
            <Building2 size={18} />
            Organization Profile
          </button>

        </nav>

        {/* Sidebar bottom */}

        <div className="border-t border-gray-100 p-4">

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-500 transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={18} />
            Sign out
          </button>

        </div>
      </aside>

      {/* ========================================================
          MAIN CONTENT
      ======================================================== */}

      <main className="lg:ml-64">

        {/* ======================================================
            TOP BAR
        ====================================================== */}

        <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">

          <div className="flex h-20 items-center justify-between px-5 sm:px-8">

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                Recipient Dashboard
              </p>

              <h2 className="mt-1 text-lg font-bold text-gray-900">
                Welcome back
                {profile?.organization_name
                  ? `, ${profile.organization_name}`
                  : ""}
              </h2>
            </div>

            {/* Notification */}

            <div className="relative">

              <button
                type="button"
                onClick={() =>
                  setShowNotifications(
                    (previous) =>
                      !previous
                  )
                }
                className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700"
              >
                <Bell size={19} />

                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-green-700 px-1 text-[10px] font-bold text-white">
                    {unreadCount > 9
                      ? "9+"
                      : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification dropdown */}

              {showNotifications && (
                <div className="absolute right-0 top-14 z-50 w-[min(360px,calc(100vw-32px))] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">

                  <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">

                    <div>
                      <p className="text-sm font-bold">
                        Notifications
                      </p>

                      <p className="text-xs text-gray-400">
                        {unreadCount} unread
                      </p>
                    </div>

                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={
                          markAllNotificationsRead
                        }
                        className="flex items-center gap-1 text-xs font-semibold text-green-700 hover:text-green-800"
                      >
                        <CheckCheck
                          size={14}
                        />
                        Mark all read
                      </button>
                    )}

                  </div>

                  <div className="max-h-80 overflow-y-auto">

                    {notifications.length ===
                    0 ? (
                      <div className="px-4 py-8 text-center">
                        <Bell
                          size={24}
                          className="mx-auto text-gray-300"
                        />

                        <p className="mt-2 text-sm text-gray-400">
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
                            className={`w-full border-b border-gray-50 px-4 py-3 text-left transition hover:bg-gray-50 ${
                              notification.is_read
                                ? "bg-white"
                                : "bg-green-50/50"
                            }`}
                          >
                            <div className="flex items-start gap-3">

                              <div className="mt-1">
                                {notification.is_read ? (
                                  <Check
                                    size={15}
                                    className="text-gray-300"
                                  />
                                ) : (
                                  <span className="block h-2.5 w-2.5 rounded-full bg-green-600" />
                                )}
                              </div>

                              <div className="min-w-0 flex-1">

                                <p className="text-sm font-semibold text-gray-800">
                                  {notification.title ||
                                    "FoodBridge notification"}
                                </p>

                                <p className="mt-1 text-xs leading-5 text-gray-500">
                                  {notification.message ||
                                    notification.body ||
                                    ""}
                                </p>

                                <p className="mt-2 text-[10px] text-gray-400">
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

                </div>
              )}

            </div>

          </div>

        </header>

        {/* ======================================================
            PAGE CONTENT
        ====================================================== */}

        <div className="px-5 py-8 sm:px-8 lg:px-10">

          {/* ====================================================
              INTRO
          ==================================================== */}

          <section className="mb-8">

            <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">

              <div>

                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                  <HeartHandshake size={14} />
                  Food redistribution
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Help your community
                  <br className="hidden sm:block" />
                  receive the food it needs.
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                  Create food needs, receive suitable
                  donations, and track deliveries through
                  FoodBridge AI.
                </p>

              </div>

              <div className="flex flex-wrap gap-3">

                <button
                  type="button"
                  onClick={loadRecipientData}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700"
                >
                  <RefreshCw size={16} />
                  Refresh
                </button>

                <button
                  type="button"
                  onClick={openNeedForm}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800"
                >
                  <Plus size={17} />
                  Add food need
                </button>

              </div>

            </div>

          </section>

          {/* ====================================================
              ERROR
          ==================================================== */}

          {error && (
            <div className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">

              <p>{error}</p>

              <button
                type="button"
                onClick={() =>
                  setError("")
                }
                className="shrink-0"
              >
                <X size={17} />
              </button>

            </div>
          )}

          {/* ====================================================
              PROFILE CARD
          ==================================================== */}

          <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

              <div className="flex items-start gap-4">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-50 text-green-700">
                  <Building2 size={24} />
                </div>

                <div>

                  <div className="flex flex-wrap items-center gap-2">

                    <h3 className="text-lg font-bold">
                      {profile?.organization_name ||
                        "Recipient profile"}
                    </h3>

                    {profile && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-semibold text-green-700">
                        <ShieldCheck
                          size={12}
                        />
                        {profile.is_verified
                          ? "Verified"
                          : "Profile active"}
                      </span>
                    )}

                  </div>

                  {profile ? (
                    <>
                      <p className="mt-1 text-sm text-gray-500">
                        {profile.organization_type ||
                          "Community organization"}
                      </p>

                      <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
                        <MapPin size={13} />

                        {profile.city ||
                          "City not set"}

                        {profile.state
                          ? `, ${profile.state}`
                          : ""}
                      </p>
                    </>
                  ) : (
                    <p className="mt-2 text-sm text-amber-600">
                      Complete your organization profile
                      to start receiving matched food.
                    </p>
                  )}

                </div>

              </div>

              <button
                type="button"
                onClick={openProfileForm}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-2.5 text-sm font-semibold text-green-700 transition hover:bg-green-100"
              >
                <Building2 size={16} />
                {profile
                  ? "Edit profile"
                  : "Create profile"}
              </button>

            </div>

            {profile && (
              <div className="mt-5 grid gap-3 border-t border-gray-100 pt-5 sm:grid-cols-3">

                <div className="rounded-xl bg-gray-50 p-4">

                  <p className="text-xs text-gray-400">
                    People supported
                  </p>

                  <p className="mt-1 text-xl font-bold">
                    {profile.people_supported ||
                      0}
                  </p>

                </div>

                <div className="rounded-xl bg-gray-50 p-4">

                  <p className="text-xs text-gray-400">
                    Location status
                  </p>

                  <p className="mt-1 text-sm font-semibold text-green-700">
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

                <div className="rounded-xl bg-gray-50 p-4">

                  <p className="text-xs text-gray-400">
                    Organization
                  </p>

                  <p className="mt-1 truncate text-sm font-semibold">
                    {profile.organization_type ||
                      "Community organization"}
                  </p>

                </div>

              </div>
            )}

          </section>

          {/* ====================================================
              LOCATION INTELLIGENCE
          ==================================================== */}

          <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
                  <Navigation size={22} />
                </div>

                <div className="min-w-0">

                  <div className="flex flex-wrap items-center gap-2">

                    <h3 className="text-lg font-semibold">
                      Delivery location
                    </h3>

                    {profile?.latitude !==
                      null &&
                      profile?.latitude !==
                        undefined &&
                      profile?.longitude !==
                        null &&
                      profile?.longitude !==
                        undefined && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                          <CheckCircle2
                            size={12}
                          />
                          Coordinates saved
                        </span>
                      )}

                  </div>

                  <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                    Add your organization location so
                    FoodBridge AI can calculate delivery
                    distance and identify practical food
                    matches.
                  </p>

                  {profile ? (
                    <div className="mt-3">

                      <p className="text-sm font-medium text-gray-700">
                        {profile.address ||
                          "No address saved"}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
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
                          <p className="mt-1 text-[11px] text-gray-400">
                            Coordinates:{" "}
                            {Number(
                              profile.latitude
                            ).toFixed(6)}
                            ,{" "}
                            {Number(
                              profile.longitude
                            ).toFixed(6)}
                          </p>
                        )}

                    </div>
                  ) : (
                    <p className="mt-3 text-xs text-amber-600">
                      Complete your recipient profile
                      first.
                    </p>
                  )}

                </div>

              </div>

              {profile && (
                <button
                  type="button"
                  onClick={openProfileForm}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-2.5 text-sm font-semibold text-green-700 transition hover:bg-green-100"
                >
                  <MapPin size={16} />

                  {profile.latitude !==
                    null &&
                  profile.latitude !==
                    undefined &&
                  profile.longitude !==
                    null &&
                  profile.longitude !==
                    undefined
                    ? "Update location"
                    : "Add location"}
                </button>
              )}

            </div>

          </section>

          {/* ====================================================
              STATS
          ==================================================== */}

          <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-700">
                  <HeartHandshake
                    size={19}
                  />
                </div>

                <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  Needs
                </span>

              </div>

              <p className="mt-4 text-3xl font-bold">
                {activeNeeds}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Active food needs
              </p>

            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <Truck size={19} />
                </div>

                <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  Deliveries
                </span>

              </div>

              <p className="mt-4 text-3xl font-bold">
                {completedDeliveries}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Completed deliveries
              </p>

            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                  <Clock3 size={19} />
                </div>

                <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  In progress
                </span>

              </div>

              <p className="mt-4 text-3xl font-bold">
                {pendingDeliveries}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Deliveries in progress
              </p>

            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                  <Users size={19} />
                </div>

                <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  Community
                </span>

              </div>

              <p className="mt-4 text-3xl font-bold">
                {profile?.people_supported ||
                  0}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                People supported
              </p>

            </div>

          </section>

          {/* ====================================================
              IMPACT OVERVIEW
          ==================================================== */}

          <section className="mb-6 rounded-2xl bg-[#14532D] p-6 text-white shadow-sm sm:p-7">

            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

              <div>

                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/80">
                  <HeartHandshake
                    size={14}
                  />
                  Community impact
                </div>

                <h3 className="mt-4 text-2xl font-bold">
                  Every delivery helps
                  someone eat.
                </h3>

                <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">
                  FoodBridge connects available surplus
                  food with organizations that need it,
                  helping communities receive food more
                  efficiently.
                </p>

              </div>

              <div className="grid grid-cols-2 gap-3 sm:min-w-[280px]">

                <div className="rounded-xl border border-white/10 bg-white/5 p-4">

                  <p className="text-xs text-white/40">
                    Completed
                  </p>

                  <p className="mt-1 text-2xl font-bold">
                    {completedDeliveries}
                  </p>

                  <p className="mt-1 text-[10px] text-[#A7D7B8]">
                    deliveries
                  </p>

                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-4">

                  <p className="text-xs text-white/40">
                    Supported
                  </p>

                  <p className="mt-1 text-2xl font-bold">
                    {profile?.people_supported ||
                      0}
                  </p>

                  <p className="mt-1 text-[10px] text-[#A7D7B8]">
                    people
                  </p>

                </div>

              </div>

            </div>

          </section>

          {/* ====================================================
              RECENT DELIVERIES
          ==================================================== */}

          <section
            id="deliveries"
            className="mb-6 rounded-2xl border border-gray-200 bg-white shadow-sm"
          >

            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5 sm:px-6">

              <div>

                <h3 className="font-bold">
                  Recent deliveries
                </h3>

                <p className="mt-1 text-xs text-gray-400">
                  Track your incoming food
                </p>

              </div>

              <Truck
                size={19}
                className="text-gray-300"
              />

            </div>

            {deliveries.length === 0 ? (
              <div className="px-5 py-12 text-center sm:px-6">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 text-gray-300">
                  <Truck size={22} />
                </div>

                <p className="mt-3 text-sm font-medium text-gray-600">
                  No deliveries yet
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Your matched food deliveries will
                  appear here.
                </p>

              </div>
            ) : (
              <div className="divide-y divide-gray-100">

                {deliveries
                  .slice(0, 5)
                  .map((delivery) => (
                    <div
                      key={delivery.id}
                      className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                    >

                      <div className="flex items-start gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
                          <Utensils
                            size={17}
                          />
                        </div>

                        <div>

                          <p className="text-sm font-semibold">
                            {delivery.food_name ||
                              delivery.food_type ||
                              "Food delivery"}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            {delivery.quantity
                              ? `${delivery.quantity} ${
                                  delivery.quantity_unit ||
                                  "items"
                                }`
                              : "Food donation"}
                          </p>

                          <p className="mt-1 text-[11px] text-gray-400">
                            {formatDate(
                              delivery.created_at ||
                                delivery.createdAt
                            )}
                          </p>

                        </div>

                      </div>

                      <div className="flex items-center justify-between gap-4 sm:justify-end">

                        <span
                          className={`rounded-full px-3 py-1.5 text-[10px] font-semibold ${getDeliveryStatusClass(
                            delivery.status
                          )}`}
                        >
                          {formatStatus(
                            delivery.status
                          )}
                        </span>

                        <ChevronRight
                          size={17}
                          className="text-gray-300"
                        />

                      </div>

                    </div>
                  ))}

              </div>
            )}

          </section>

          {/* ====================================================
              FOOD NEEDS
          ==================================================== */}

          <section
            id="food-needs"
            className="rounded-2xl border border-gray-200 bg-white shadow-sm"
          >

            <div className="flex flex-col gap-4 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">

              <div>

                <h3 className="font-bold">
                  Your food needs
                </h3>

                <p className="mt-1 text-xs text-gray-400">
                  Tell FoodBridge what your community
                  needs.
                </p>

              </div>

              <button
                type="button"
                onClick={openNeedForm}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
              >
                <Plus size={16} />
                Add food need
              </button>

            </div>

            {needs.length === 0 ? (
              <div className="px-5 py-12 text-center sm:px-6">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-700">
                  <Utensils size={21} />
                </div>

                <p className="mt-3 text-sm font-medium text-gray-600">
                  No food needs added yet
                </p>

                <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-gray-400">
                  Add the type and quantity of food your
                  organization needs so FoodBridge can
                  identify suitable donations.
                </p>

                <button
                  type="button"
                  onClick={openNeedForm}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-2.5 text-xs font-semibold text-green-700 hover:bg-green-100"
                >
                  <Plus size={15} />
                  Create your first need
                </button>

              </div>
            ) : (
              <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-3">

                {needs.map((need) => (
                  <div
                    key={need.id}
                    className="rounded-xl border border-gray-100 bg-gray-50 p-4"
                  >

                    <div className="flex items-start justify-between gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-green-700 shadow-sm">
                        <Utensils
                          size={17}
                        />
                      </div>

                      <span className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-semibold text-green-700">
                        {formatStatus(
                          need.status ||
                            "active"
                        )}
                      </span>

                    </div>

                    <h4 className="mt-4 font-semibold capitalize">
                      {need.food_type ||
                        "Food"}
                    </h4>

                    <p className="mt-1 text-sm text-gray-500">
                      {need.quantity_needed ||
                        0}{" "}
                      {need.quantity_unit ||
                        "items"}
                    </p>

                    <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3">

                      <span className="text-[11px] text-gray-400">
                        People to feed
                      </span>

                      <span className="text-xs font-semibold text-gray-700">
                        {need.people_to_feed ||
                          0}
                      </span>

                    </div>

                    <div className="mt-2 flex items-center justify-between">

                      <span className="text-[11px] text-gray-400">
                        Urgency
                      </span>

                      <span className="text-xs font-semibold text-amber-600">
                        {need.urgency_score ||
                          0}
                        /100
                      </span>

                    </div>

                  </div>
                ))}

              </div>
            )}

          </section>

          {/* ====================================================
              FOOTER
          ==================================================== */}

          <footer className="mt-8 pb-4 text-center">

            <p className="text-xs text-gray-400">
              FoodBridge AI · Turning Surplus Into Hope
            </p>

          </footer>

        </div>

      </main>

      {/* ========================================================
          PROFILE MODAL
      ======================================================== */}

      {showProfileForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">

          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* Modal header */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4 sm:px-6">

              <div>

                <p className="text-xs font-medium uppercase tracking-wider text-green-700">
                  Recipient profile
                </p>

                <h3 className="mt-1 text-lg font-bold">
                  {profile
                    ? "Update your location"
                    : "Create your organization profile"}
                </h3>

              </div>

              <button
                type="button"
                onClick={() => {
                  setShowProfileForm(false);
                  setLocationResult(null);
                  setLocationMessage("");
                }}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={19} />
              </button>

            </div>

            {/* Form */}

            <form
              onSubmit={handleCreateProfile}
              className="space-y-6 p-5 sm:p-6"
            >

              {/* Organization details */}

              {!profile && (
                <div className="space-y-4">

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
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
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-300 focus:border-green-500 focus:ring-4 focus:ring-green-50"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
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
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-50"
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
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
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
                      placeholder="e.g. 50"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-300 focus:border-green-500 focus:ring-4 focus:ring-green-50"
                    />
                  </div>

                </div>
              )}

              {/* ==================================================
                  LOCATION SEARCH
              ================================================== */}

              <div className="rounded-2xl border border-green-100 bg-green-50/50 p-4 sm:p-5">

                <div className="flex items-start gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
                    <MapPin size={19} />
                  </div>

                  <div>

                    <h4 className="font-semibold text-gray-800">
                      Find your delivery location
                    </h4>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      Enter your address, street, bus stop,
                      landmark, or organization name. FoodBridge
                      will find the coordinates automatically.
                    </p>

                  </div>

                </div>

                <div className="mt-5 space-y-4">

                  {/* Address */}

                  <div>

                    <label className="mb-2 block text-sm font-semibold text-gray-700">
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
                      className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-300 focus:border-green-500 focus:ring-4 focus:ring-green-50"
                    />

                    <p className="mt-1.5 text-[11px] text-gray-400">
                      You can use a bus stop, street,
                      landmark, school, church, market, or
                      organization name.
                    </p>

                  </div>

                  {/* City / State */}

                  <div className="grid gap-4 sm:grid-cols-2">

                    <div>

                      <label className="mb-2 block text-sm font-semibold text-gray-700">
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
                        placeholder="e.g. Ado-Ekiti"
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-300 focus:border-green-500 focus:ring-4 focus:ring-green-50"
                      />

                    </div>

                    <div>

                      <label className="mb-2 block text-sm font-semibold text-gray-700">
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
                        placeholder="e.g. Ekiti"
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-300 focus:border-green-500 focus:ring-4 focus:ring-green-50"
                      />

                    </div>

                  </div>

                  {/* Find button */}

                  <button
                    type="button"
                    onClick={
                      handleFindLocation
                    }
                    disabled={
                      locationLoading
                    }
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >

                    {locationLoading ? (
                      <>
                        <RefreshCw
                          size={17}
                          className="animate-spin"
                        />
                        Finding location...
                      </>
                    ) : (
                      <>
                        <Search size={17} />
                        Find this location
                      </>
                    )}

                  </button>

                  {/* Location message */}

                  {locationMessage && (
                    <div
                      className={`rounded-xl border px-4 py-3 text-xs leading-5 ${
                        locationMessage.includes(
                          "successfully"
                        )
                          ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                          : "border-amber-100 bg-amber-50 text-amber-700"
                      }`}
                    >
                      {locationMessage}
                    </div>
                  )}

                  {/* Detected location */}

                  {locationResult && (
                    <div className="rounded-xl border border-green-200 bg-white p-4 shadow-sm">

                      <div className="flex items-start gap-3">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-700">
                          <CheckCircle2
                            size={18}
                          />
                        </div>

                        <div className="min-w-0">

                          <p className="text-sm font-semibold text-gray-800">
                            Location detected
                          </p>

                          <p className="mt-1 text-xs leading-5 text-gray-500">
                            {locationResult.display_name ||
                              "Location found"}
                          </p>

                        </div>

                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3">

                        <div className="rounded-lg bg-gray-50 p-3">

                          <p className="text-[10px] uppercase tracking-wider text-gray-400">
                            Latitude
                          </p>

                          <p className="mt-1 text-xs font-semibold text-gray-700">
                            {locationResult.latitude}
                          </p>

                        </div>

                        <div className="rounded-lg bg-gray-50 p-3">

                          <p className="text-[10px] uppercase tracking-wider text-gray-400">
                            Longitude
                          </p>

                          <p className="mt-1 text-xs font-semibold text-gray-700">
                            {locationResult.longitude}
                          </p>

                        </div>

                      </div>

                      <p className="mt-4 text-[10px] leading-4 text-gray-400">
                        Location search powered by
                        OpenStreetMap. Please review the
                        detected location before saving.
                      </p>

                    </div>
                  )}

                </div>

              </div>

              {/* ==================================================
                  ACTIONS
              ================================================== */}

              <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={() => {
                    setShowProfileForm(false);
                    setLocationResult(null);
                    setLocationMessage("");
                  }}
                  className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
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
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  {profileSubmitting ? (
                    <>
                      <RefreshCw
                        size={16}
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

                      <ChevronRight
                        size={16}
                      />
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* ========================================================
          FOOD NEED MODAL
      ======================================================== */}

      {showNeedForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">

          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

            {/* Header */}

            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">

              <div>

                <p className="text-xs font-medium uppercase tracking-wider text-green-700">
                  Food request
                </p>

                <h3 className="mt-1 text-lg font-bold">
                  Add a food need
                </h3>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowNeedForm(false)
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={19} />
              </button>

            </div>

            {/* Form */}

            <form
              onSubmit={handleCreateNeed}
              className="space-y-5 p-5 sm:p-6"
            >

              {/* Food type */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Food type
                </label>

                <input
                  type="text"
                  name="food_type"
                  value={
                    form.food_type
                  }
                  onChange={
                    handleNeedChange
                  }
                  required
                  placeholder="e.g. bakery, rice, vegetables"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition placeholder:text-gray-300 focus:border-green-500 focus:ring-4 focus:ring-green-50"
                />

              </div>

              {/* Quantity */}

              <div className="grid grid-cols-2 gap-3">

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Quantity needed
                  </label>

                  <input
                    type="number"
                    min="1"
                    name="quantity_needed"
                    value={
                      form.quantity_needed
                    }
                    onChange={
                      handleNeedChange
                    }
                    required
                    placeholder="20"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition placeholder:text-gray-300 focus:border-green-500 focus:ring-4 focus:ring-green-50"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Unit
                  </label>

                  <select
                    name="quantity_unit"
                    value={
                      form.quantity_unit
                    }
                    onChange={
                      handleNeedChange
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-4 focus:ring-green-50"
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

              {/* People */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  People to feed
                </label>

                <input
                  type="number"
                  min="0"
                  name="people_to_feed"
                  value={
                    form.people_to_feed
                  }
                  onChange={
                    handleNeedChange
                  }
                  placeholder="e.g. 20"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition placeholder:text-gray-300 focus:border-green-500 focus:ring-4 focus:ring-green-50"
                />

              </div>

              {/* Urgency */}

              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label className="text-sm font-semibold text-gray-700">
                    Urgency
                  </label>

                  <span className="text-sm font-bold text-amber-600">
                    {form.urgency_score}
                    /100
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
                  onChange={
                    handleNeedChange
                  }
                  className="w-full accent-green-700"
                />

                <div className="mt-1 flex justify-between text-[10px] text-gray-400">
                  <span>Low</span>
                  <span>High</span>
                </div>

              </div>

              {/* Actions */}

              <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={() =>
                    setShowNeedForm(false)
                  }
                  className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {submitting ? (
                    <>
                      <RefreshCw
                        size={16}
                        className="animate-spin"
                      />
                      Creating...
                    </>
                  ) : (
                    <>
                      Create food need
                      <ChevronRight
                        size={16}
                      />
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}