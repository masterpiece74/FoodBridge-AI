import { Routes, Route } from "react-router-dom";

// Landing page components
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import AISection from "./components/AISection";
import ImpactSection from "./components/ImpactSection";
import EcosystemSection from "./components/EcosystemSection";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";

// Authentication
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Public pages
import About from "./pages/about/About";

// Dashboards
import DonorDashboard from "./pages/dashboard/DonorDashboard";
import RecipientDashboard from "./pages/dashboard/RecipientDashboard";
import VolunteerDashboard from "./pages/dashboard/VolunteerDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";

// Donations
import DonateFood from "./pages/donations/DonateFood";

// Matching
import AIMatch from "./pages/matches/AIMatch";


// =====================================================
// LANDING PAGE
// =====================================================

function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <HowItWorks />
        <AISection />
        <ImpactSection />
        <EcosystemSection />
        <FinalCTA />
      </main>

      <Footer />
    </>
  );
}


// =====================================================
// APP
// =====================================================

function App() {
  return (
    <Routes>

      {/* =========================================
          PUBLIC / LANDING
      ========================================== */}

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/about"
        element={<About />}
      />


      {/* =========================================
          AUTHENTICATION
      ========================================== */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />


      {/* =========================================
          DONOR
      ========================================== */}

      <Route
        path="/donor-dashboard"
        element={<DonorDashboard />}
      />

      <Route
        path="/donate-food"
        element={<DonateFood />}
      />


      {/* =========================================
          AI MATCHING
      ========================================== */}

      <Route
        path="/ai-match/:donationId"
        element={<AIMatch />}
      />


      {/* =========================================
          RECIPIENT
      ========================================== */}

      <Route
        path="/recipient-dashboard"
        element={<RecipientDashboard />}
      />


      {/* =========================================
          VOLUNTEER
      ========================================== */}

      <Route
        path="/volunteer-dashboard"
        element={<VolunteerDashboard />}
      />


      {/* =========================================
          ADMIN
      ========================================== */}

      <Route
        path="/admin-dashboard"
        element={<AdminDashboard />}
      />


      {/* =========================================
          FALLBACK
      ========================================== */}

      <Route
        path="*"
        element={<Home />}
      />

    </Routes>
  );
}

export default App;