import { useState } from "react";
import Sidebar from "../components/Sidebar";
import CulturalBackdrop from "../components/CulturalBackdrop";
import "../styles/dashboard.css";

// Reads the name saved in localStorage during login/register.
// Just take the first word, in case they typed a full name.
function readSavedUserName(): string {
  const savedName = localStorage.getItem("userName");
  return savedName ? savedName.split(" ")[0] : "there";
}

export default function Dashboard() {
  // Lazy initializer: localStorage is read synchronously once, on mount,
  // so this doesn't need an Effect. An Effect would render "there" first
  // and then immediately re-render with the real name.
  const [userName] = useState(readSavedUserName);
  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dash-main">
        <CulturalBackdrop variant="light" />
        <div className="dash-header">
          <div>
            <h1 className="dash-greeting">Namaste, {userName} 👋</h1>
            <p className="dash-subgreeting">Here's where your Nepal trip stands.</p>
          </div>
         <div className="dash-avatar">{userName.charAt(0).toUpperCase()}</div>
        </div>
        <div className="horizon-divider" />

        {/* ---- Quick stats ---- */}
        <div className="stat-row">
          <div className="stat-card">
            <p className="stat-label">Upcoming trips</p>
            <p className="stat-value">1</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Saved itineraries</p>
            <p className="stat-value">3</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Estimated budget</p>
            <p className="stat-value accent">$780</p>
          </div>
        </div>

        {/* ---- AI recommendation ---- */}
        <div className="dash-section">
          <h2 className="dash-section-title">AI Recommendation</h2>
          <div className="ai-card">
            <div className="ai-card-text">
              <h3>Your Annapurna itinerary is ready to review</h3>
              <p>
                Based on your budget and October travel dates, we've built a
                9-day plan with 2 teahouse stays already matched to your rating
                preference.
              </p>
            </div>
            <button className="ai-card-button">Review itinerary</button>
          </div>
        </div>

        {/* ---- Saved itineraries + Bookings side by side ---- */}
        <div className="dash-section">
          <h2 className="dash-section-title">Saved Itineraries</h2>
          <div className="list-card">
            <div className="list-row">
              <div>
                <p className="list-row-title">Annapurna Base Camp — 9 days</p>
                <p className="list-row-meta">Created 3 days ago · Budget: $780</p>
              </div>
              <span className="status-pill status-pending">Draft</span>
            </div>
            <div className="list-row">
              <div>
                <p className="list-row-title">Pokhara Weekend — 3 days</p>
                <p className="list-row-meta">Created 2 weeks ago · Budget: $220</p>
              </div>
              <span className="status-pill status-confirmed">Booked</span>
            </div>
          </div>
        </div>

        <div className="dash-section">
          <h2 className="dash-section-title">Recent Bookings</h2>
          <div className="list-card">
            <div className="list-row">
              <div>
                <p className="list-row-title">Hotel Barahi — Pokhara</p>
                <p className="list-row-meta">Check-in: Sep 12 · 2 nights</p>
              </div>
              <span className="status-pill status-confirmed">Confirmed</span>
            </div>
            <div className="list-row">
              <div>
                <p className="list-row-title">Poon Hill Trek Permit</p>
                <p className="list-row-meta">Requested: Sep 10</p>
              </div>
              <span className="status-pill status-pending">Processing</span>
            </div>
          </div>
        </div>

        {/* ---- Notifications ---- */}
        <div className="dash-section">
          <h2 className="dash-section-title">Notifications</h2>
          <div className="list-card">
            <div style={{ padding: "16px 22px" }}>
              <div className="notif-item">
                <span className="notif-dot" />
                <div className="notif-text">
                  <p>Weather alert: light snow expected on your Poon Hill dates.</p>
                  <span>2 hours ago</span>
                </div>
              </div>
              <div className="notif-item">
                <span className="notif-dot" />
                <div className="notif-text">
                  <p>Your Hotel Barahi booking was confirmed.</p>
                  <span>1 day ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}