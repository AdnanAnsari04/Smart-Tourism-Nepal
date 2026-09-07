import { Link } from "react-router-dom";
import { clearSession } from "../utils/session";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TABS = ["Overview", "Users", "Destinations", "Hotels", "Treks", "Bookings", "Reports"];

export default function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  return (
    <aside className="dash-sidebar">
      <Link to="/" className="dash-logo">
        Yatra <span className="admin-badge">Admin</span>
      </Link>

      <nav className="dash-nav">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`dash-nav-item admin-nav-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => onTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      <Link to="/login" className="dash-logout" onClick={clearSession}>
        Log out
      </Link>
    </aside>
  );
}
