import { BrowserRouter, Routes, Route } from "react-router-dom";
import RequireRole from "./components/RequireRole";
import RequireAuth from "./components/RequireAuth";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Destinations from "./pages/Destinations";
import DestinationDetail from "./pages/DestinationDetail";
import Hotels from "./pages/Hotels";
import Treks from "./pages/Treks";
import TripPlanner from "./pages/TripPlanner";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import Bookings from "./pages/Bookings";
import HeritageHub from "./pages/HeritageHub";
import TourismMap from "./pages/TourismMap";
import VerifyEmail from "./pages/VerifyEmail";
import Budget from "./pages/Budget";
import TripSummary from "./pages/TripSummary";
import Settings from "./pages/Settings";
import Payment from "./pages/Payment";
import Notifications from "./pages/Notifications";
import About from "./pages/About";
import Support from "./pages/Support";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ---- Public: unauthenticated entry points only ---- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ---- Home is the one public page ----
            Anyone can open the site and browse the homepage without
            signing in. Every other feature below is still gated. */}
        <Route path="/" element={<Home />} />
        <Route path="/destinations" element={<RequireAuth><Destinations /></RequireAuth>} />
        <Route path="/destinations/:id" element={<RequireAuth><DestinationDetail /></RequireAuth>} />
        <Route path="/hotels" element={<RequireAuth><Hotels /></RequireAuth>} />
        <Route path="/treks" element={<RequireAuth><Treks /></RequireAuth>} />
        <Route path="/heritage" element={<RequireAuth><HeritageHub /></RequireAuth>} />
        <Route path="/map" element={<RequireAuth><TourismMap /></RequireAuth>} />
        <Route path="/about" element={<RequireAuth><About /></RequireAuth>} />
        <Route path="/support" element={<RequireAuth><Support /></RequireAuth>} />
        <Route path="/privacy" element={<RequireAuth><Privacy /></RequireAuth>} />
        <Route path="/terms" element={<RequireAuth><Terms /></RequireAuth>} />

        <Route path="/dashboard" element={<RequireRole role="tourist"><Dashboard /></RequireRole>} />
        <Route path="/trip-planner" element={<RequireRole role="tourist"><TripPlanner /></RequireRole>} />
        <Route path="/profile" element={<RequireRole role="tourist"><Profile /></RequireRole>} />
        <Route path="/bookings" element={<RequireRole role="tourist"><Bookings /></RequireRole>} />
        <Route path="/budget" element={<RequireRole role="tourist"><Budget /></RequireRole>} />
        <Route path="/trip-summary" element={<RequireRole role="tourist"><TripSummary /></RequireRole>} />
        <Route path="/settings" element={<RequireRole role="tourist"><Settings /></RequireRole>} />
        <Route path="/payment" element={<RequireRole role="tourist"><Payment /></RequireRole>} />
        <Route path="/notifications" element={<RequireRole role="tourist"><Notifications /></RequireRole>} />

        <Route path="/admin" element={<RequireRole role="admin"><AdminDashboard /></RequireRole>} />

        {/* 404 stays reachable either way so bad links inside the app
            still show something sensible, not a login bounce. */}
        <Route path="*" element={<RequireAuth><NotFound /></RequireAuth>} />
      </Routes>
    </BrowserRouter>
  );
}
