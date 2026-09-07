import { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import OverviewTab from "./admin/OverviewTab";
import UsersTab from "./admin/UsersTab";
import DestinationsTab from "./admin/DestinationsTab";
import HotelsTab from "./admin/HotelsTab";
import TreksTab from "./admin/TreksTab";
import "../styles/dashboard.css";
import "../styles/admin.css";

// Bookings and Reports aren't part of the backend yet (no booking or
// reporting endpoints exist — see backend/TASK3_ADMIN_TOURISM_NOTES.md).
// Kept here as a placeholder so the tabs still exist in the nav rather
// than disappearing, but honestly labeled instead of faking real data.
const PLACEHOLDER_REPORTS = [
  "User Analytics",
  "Financial Reports",
  "Booking Analytics",
  "AI Performance",
  "Map Analytics",
  "Heritage Engagement",
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="dashboard-layout">
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="dash-main">
        <div className="dash-header">
          <div>
            <h1 className="dash-greeting">Admin Dashboard</h1>
            <p className="dash-subgreeting">Platform-wide management and analytics.</p>
          </div>
        </div>
        <div className="horizon-divider" />

        {activeTab === "Overview" && <OverviewTab />}
        {activeTab === "Users" && <UsersTab />}
        {activeTab === "Destinations" && <DestinationsTab />}
        {activeTab === "Hotels" && <HotelsTab />}
        {activeTab === "Treks" && <TreksTab />}

        {activeTab === "Bookings" && (
          <section className="dash-section">
            <h2 className="dash-section-title">Booking Management</h2>
            <p className="admin-empty-state">
              Booking management isn't part of the backend yet — this platform doesn't have a booking system
              built. This tab is a placeholder for a future task.
            </p>
          </section>
        )}

        {activeTab === "Reports" && (
          <section className="dash-section">
            <h2 className="dash-section-title">Reports</h2>
            <p className="admin-empty-state" style={{ marginBottom: 16 }}>
              Report generation isn't part of the backend yet. The categories below are placeholders for a
              future task — see the live numbers in the Overview tab for real, current statistics instead.
            </p>
            <div className="admin-report-grid">
              {PLACEHOLDER_REPORTS.map((r) => (
                <div className="admin-report-card" key={r}>
                  <p>{r}</p>
                  <p className="admin-report-freq">Not yet available</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
