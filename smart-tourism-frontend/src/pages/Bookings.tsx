import { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import CulturalBackdrop from "../components/CulturalBackdrop";
import "../styles/dashboard.css";
import "../styles/bookings.css";

// FR-10: view, modify, or cancel bookings. Frontend-only mock. Real
// cancellation needs a backend endpoint and honors BR-11's cancellation
// deadline, which isn't enforceable purely client-side.
interface Booking {
  id: string;
  type: "Hotel" | "Trek";
  name: string;
  location: string;
  date: string;
  status: "Confirmed" | "Processing" | "Cancelled";
}

const INITIAL_BOOKINGS: Booking[] = [
  { id: "b1", type: "Hotel", name: "Hotel Barahi", location: "Pokhara", date: "Sep 12 - Sep 14, 2026", status: "Confirmed" },
  { id: "b2", type: "Trek", name: "Poon Hill Trek Permit", location: "Annapurna, Gandaki", date: "Sep 20, 2026", status: "Processing" },
  { id: "b3", type: "Hotel", name: "Fishtail Lodge", location: "Pokhara", date: "Jun 3 - Jun 5, 2026", status: "Confirmed" },
];

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [filter, setFilter] = useState<"All" | "Hotel" | "Trek">("All");

  const filtered = bookings.filter((b) => filter === "All" || b.type === filter);

  function handleCancel(id: string) {
    // Per BR-11, real cancellation is only allowed before a deadline. That
    // check needs the backend. This just flips local state for the demo.
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "Cancelled" as const } : b))
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dash-main">
        <CulturalBackdrop variant="light" />
        <div className="dash-header">
          <div>
            <h1 className="dash-greeting">Your Bookings</h1>
            <p className="dash-subgreeting">Hotels and treks you've reserved.</p>
          </div>
        </div>
        <div className="horizon-divider" />

        <div className="bookings-filter-row">
          {(["All", "Hotel", "Trek"] as const).map((f) => (
            <button
              key={f}
              className={`bookings-filter-pill ${filter === f ? "is-active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="bookings-empty">
            <p>No bookings yet.</p>
            <Link to="/hotels" className="bookings-empty-link">Browse hotels</Link> or{" "}
            <Link to="/treks" className="bookings-empty-link">browse treks</Link>.
          </div>
        ) : (
          <div className="bookings-list">
            {filtered.map((b) => (
              <div className="booking-card" key={b.id}>
                <div className="booking-card-main">
                  <span className={`booking-type-tag booking-type-${b.type.toLowerCase()}`}>{b.type}</span>
                  <div>
                    <p className="booking-name">{b.name}</p>
                    <p className="booking-meta">{b.location} · {b.date}</p>
                  </div>
                </div>
                <div className="booking-card-actions">
                  <span className={`status-pill status-${b.status.toLowerCase()}`}>{b.status}</span>
                  {b.status === "Processing" && (
                    <Link to="/payment" className="booking-pay-link">Pay now</Link>
                  )}
                  {b.status !== "Cancelled" && (
                    <button
                      className="booking-cancel-btn"
                      onClick={() => handleCancel(b.id)}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
