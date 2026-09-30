import { useEffect, useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function GoogleCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    const handleGoogleCallback = () => {
      try {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);

        const accessToken = params.get("access_token");
        const userId = params.get("user_id");
        const role = params.get("role");

        if (!accessToken || !userId || !role) {
          setError("Google sign-in could not be completed.");
          return;
        }

        // Save authentication details
        localStorage.setItem("access_token", accessToken);

        localStorage.setItem(
          "user",
          JSON.stringify({
            id: Number(userId),
            role: role,
          })
        );

        // Redirect according to role
        switch (role) {
          case "donor":
            navigate("/donor-dashboard", { replace: true });
            break;

          case "recipient":
            navigate("/recipient-dashboard", { replace: true });
            break;

          case "volunteer":
            navigate("/volunteer-dashboard", { replace: true });
            break;

          case "admin":
            navigate("/admin-dashboard", { replace: true });
            break;

          default:
            setError("Your account role could not be determined.");
        }
      } catch (err) {
        console.error("Google callback error:", err);
        setError("Something went wrong while completing Google sign-in.");
      }
    };

    handleGoogleCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="w-7 h-7 text-red-600" />
          </div>

          <h1 className="text-2xl font-bold text-[#0B2F1A] mb-3">
            Sign-in failed
          </h1>

          <p className="text-gray-600 mb-6">{error}</p>

          <button
            onClick={() => navigate("/login")}
            className="w-full py-3 rounded-xl bg-[#1F7A4D] text-white font-semibold hover:bg-[#14532D] transition"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center px-6">
      <div className="text-center">
        <div className="flex justify-center mb-5">
          <Loader2 className="w-10 h-10 text-[#1F7A4D] animate-spin" />
        </div>

        <h1 className="text-xl font-bold text-[#0B2F1A]">
          Completing Google sign-in...
        </h1>

        <p className="text-gray-500 mt-2">
          Please wait while we take you to your dashboard.
        </p>
      </div>
    </div>
  );
}