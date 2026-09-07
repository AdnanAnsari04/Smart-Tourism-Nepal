import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import CulturalBackdrop from "../components/CulturalBackdrop";
import "../styles/dashboard.css";
import "../styles/trip-summary.css";

// FRD section 14 (Reports). User Reports table lists "Trip Summary:
// Complete itinerary, cost breakdown, booking confirmations, delivered as
// PDF download." The real PDF generation is backend/reporting-service work;
// this page is the frontend view that report would be built from, with a
// print-to-PDF affordance in the meantime (browsers can already "Print >
// Save as PDF" this view).
const ITINERARY = [
  { day: 1, title: "Arrive in Kathmandu", detail: "Airport pickup, hotel check-in, evening orientation walk in Thamel." },
  { day: 2, title: "Kathmandu Valley heritage circuit", detail: "Pashupatinath, Boudhanath, and Kathmandu Durbar Square." },
  { day: 3, title: "Fly to Pokhara", detail: "Lakeside check-in, sunset boat ride on Phewa Lake." },
  { day: 4, title: "Drive to Nayapul, trek to Ghandruk", detail: "Start of the Annapurna approach trail." },
  { day: 5, title: "Ghandruk to Chhomrong", detail: "Rhododendron forest trail, Gurung village stop." },
  { day: 6, title: "Chhomrong to Dovan", detail: "Steep descent and climb through bamboo forest." },
  { day: 7, title: "Dovan to Annapurna Base Camp", detail: "Final push through the sanctuary, arrival at ABC." },
  { day: 8, title: "Descend to Bamboo", detail: "Long descent day, hot spring stop at Jhinu Danda." },
  { day: 9, title: "Return to Pokhara, fly to Kathmandu", detail: "Trip wrap-up and departure preparations." },
];

const COST_BREAKDOWN = [
  { label: "Accommodation", amount: 26520 },
  { label: "Transport", amount: 17160 },
  { label: "Food", amount: 14040 },
  { label: "Permits", amount: 7800 },
  { label: "Experiences", amount: 12480 },
];

const BOOKINGS = [
  { name: "Hotel Barahi — Pokhara", status: "Confirmed" },
  { name: "Poon Hill Trek Permit", status: "Processing" },
];

export default function TripSummary() {
  const total = COST_BREAKDOWN.reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dash-main trip-summary-print">
        <CulturalBackdrop variant="light" />
        <div className="dash-header">
          <div>
            <h1>Trip Summary</h1>
            <p>Annapurna Base Camp — 9 days, October 2026.</p>
          </div>
          <button type="button" className="ts-print-btn" onClick={() => window.print()}>
            Print / save as PDF
          </button>
        </div>
        <div className="horizon-divider" />

        <div className="ts-metrics">
          <div><strong>9</strong><span>days</span></div>
          <div><strong>NPR {total.toLocaleString()}</strong><span>estimated</span></div>
          <div><strong>{ITINERARY.length}</strong><span>activities</span></div>
        </div>

        <section className="ts-card">
          <h2>Itinerary</h2>
          {ITINERARY.map((day) => (
            <div className="ts-day-row" key={day.day}>
              <span className="ts-day-num">Day {day.day}</span>
              <div>
                <p className="ts-day-title">{day.title}</p>
                <p className="ts-day-detail">{day.detail}</p>
              </div>
            </div>
          ))}
        </section>

        <div className="ts-two-col">
          <section className="ts-card">
            <h2>Cost breakdown</h2>
            {COST_BREAKDOWN.map((c) => (
              <div className="ts-cost-row" key={c.label}>
                <span>{c.label}</span>
                <strong>NPR {c.amount.toLocaleString()}</strong>
              </div>
            ))}
            <div className="ts-cost-row ts-cost-total">
              <span>Total</span>
              <strong>NPR {total.toLocaleString()}</strong>
            </div>
          </section>

          <section className="ts-card">
            <h2>Booking confirmations</h2>
            {BOOKINGS.map((b) => (
              <div className="ts-booking-row" key={b.name}>
                <span>{b.name}</span>
                <span className={`status-pill status-${b.status.toLowerCase()}`}>{b.status}</span>
              </div>
            ))}
          </section>
        </div>

        <div className="dash-section-links no-print">
          <Link to="/budget">View budget desk →</Link>
          <Link to="/bookings">Manage bookings →</Link>
        </div>
      </main>
    </div>
  );
}
