import { useState } from "react";
import Sidebar from "../components/Sidebar";
import CulturalBackdrop from "../components/CulturalBackdrop";
import "../styles/dashboard.css";
import "../styles/notifications.css";

// FRD section 15 (Notifications). Notification Types table (Onboarding,
// Booking, Payment, Safety, Promotion categories; Low/Medium/High/Critical
// priority). Dashboard shows the 2 most recent inline; this is the full
// inbox, filterable by category, matching that table's structure.
interface NotificationItem {
  id: string;
  category: "Booking" | "Safety" | "Payment" | "Promotion" | "Onboarding";
  title: string;
  detail: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  time: string;
  read: boolean;
}

const INITIAL: NotificationItem[] = [
  { id: "n1", category: "Safety", title: "Weather warning — Everest region", detail: "Wind is expected to rise above Namche tomorrow afternoon.", priority: "Critical", time: "Just now", read: false },
  { id: "n2", category: "Booking", title: "Hotel Barahi reservation confirmed", detail: "Your Pokhara stay (Sep 12–14) is ready in your bookings.", priority: "High", time: "1 day ago", read: false },
  { id: "n3", category: "Payment", title: "Payment received", detail: "NPR 17,000 payment for Hotel Barahi was processed successfully.", priority: "High", time: "1 day ago", read: false },
  { id: "n4", category: "Booking", title: "Trek permit processing", detail: "Your Poon Hill trek permit request is being processed.", priority: "Medium", time: "2 days ago", read: true },
  { id: "n5", category: "Promotion", title: "Price drop — Lakeside stays", detail: "A Pokhara Lakeside hotel you viewed has dropped in price.", priority: "Low", time: "3 days ago", read: true },
  { id: "n6", category: "Onboarding", title: "Your October route is ready", detail: "Review the nine-day Annapurna itinerary in your dashboard.", priority: "Medium", time: "3 days ago", read: true },
];

const FILTERS = ["All", "Booking", "Safety", "Payment", "Promotion", "Onboarding"] as const;

export default function Notifications() {
  const [items, setItems] = useState(INITIAL);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");

  const visible = items.filter((n) => filter === "All" || n.category === filter);
  const unreadCount = items.filter((n) => !n.read).length;

  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dash-main">
        <CulturalBackdrop variant="light" />
        <div className="dash-header">
          <div>
            <h1>Notifications</h1>
            <p>{unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}</p>
          </div>
          <button type="button" className="notif-mark-all-btn" onClick={markAllRead}>
            Mark all as read
          </button>
        </div>
        <div className="horizon-divider" />

        <div className="notif-filter-row">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              className={`notif-filter-pill ${filter === f ? "is-active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <section className="notif-list-card">
          {visible.map((n) => (
            <div className={`notif-row ${n.read ? "is-read" : ""}`} key={n.id}>
              <span className={`notif-dot notif-dot-${n.priority.toLowerCase()}`} />
              <div className="notif-text">
                <p>{n.title}</p>
                <span>{n.detail}</span>
                <span className="notif-meta">{n.category} · {n.priority} priority · {n.time}</span>
              </div>
            </div>
          ))}
          {visible.length === 0 && (
            <p className="notif-empty">No notifications in this category.</p>
          )}
        </section>
      </main>
    </div>
  );
}
