import { Link, useLocation } from "react-router-dom";
import { clearSession } from "../utils/session";

export default function Sidebar() {
  const { pathname } = useLocation();

  const navItems = [
    { to: "/dashboard", label: "Overview" },
    { to: "/trip-planner", label: "AI Trip Planner" },
    { to: "/bookings", label: "Bookings" },
    { to: "/destinations", label: "Destinations" },
    { to: "/budget", label: "Budget" },
    { to: "/trip-summary", label: "Trip Summary" },
    { to: "/notifications", label: "Notifications" },
    { to: "/profile", label: "Profile" },
    { to: "/settings", label: "Settings" },
  ];

  return (
    <aside className="dash-sidebar">
      <Link to="/" className="dash-logo">
        Yatra
      </Link>

      <nav className="dash-nav">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`dash-nav-item ${pathname === item.to ? "active" : ""}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <Link to="/login" className="dash-logout" onClick={clearSession}>
        Log out
      </Link>
    </aside>
  );
}