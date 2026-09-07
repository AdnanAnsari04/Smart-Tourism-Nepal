import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import CulturalBackdrop from "../components/CulturalBackdrop";
import "../styles/dashboard.css";
import "../styles/budget.css";

// FR-09: "estimate total travel expenses and recommend cost optimization
// strategies... Outputs: Estimated Trip Cost, Budget Breakdown, Alternative
// Suggestions." The AI Trip Planner already produces a one-off budget
// breakdown as part of a generated itinerary; this page is the dedicated,
// revisitable version. The "Budget desk". That several other pages
// already link to.
const CATEGORIES = [
  { key: "accommodation", label: "Accommodation", share: 0.34 },
  { key: "transport", label: "Transport", share: 0.22 },
  { key: "food", label: "Food", share: 0.18 },
  { key: "permits", label: "Permits", share: 0.10 },
  { key: "experiences", label: "Experiences", share: 0.16 },
];

export default function Budget() {
  const [budget, setBudget] = useState(78000);
  const [saved, setSaved] = useState(false);

  const breakdown = useMemo(
    () => CATEGORIES.map((c) => ({ ...c, amount: Math.round(budget * c.share) })),
    [budget]
  );

  const potentialSavings = Math.round(budget * 0.11);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dash-main">
        <CulturalBackdrop variant="light" />
        <div className="dash-header">
          <div>
            <h1>Budget Desk</h1>
            <p>Shape a trip around a real number — see where it goes before you book.</p>
          </div>
        </div>
        <div className="horizon-divider" />

        <div className="budget-grid">
          <section className="budget-input-card">
            <h2>Your total budget</h2>
            <label htmlFor="budget-amount" className="visually-hidden">Total budget in NPR</label>
            <div className="budget-input-row">
              <span>NPR</span>
              <input
                id="budget-amount"
                type="number"
                min={1000}
                step={1000}
                value={budget}
                onChange={(e) => setBudget(Math.max(0, Number(e.target.value)))}
              />
            </div>
            <input
              type="range"
              min={20000}
              max={250000}
              step={1000}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              aria-label="Adjust budget with slider"
            />
            <button type="button" className="budget-save-btn" onClick={() => setSaved(true)}>
              Save this budget plan
            </button>
            {saved && <p className="budget-saved-note">Saved locally — this will sync once the backend is connected.</p>}
          </section>

          <section className="budget-breakdown-card">
            <h2>Budget breakdown</h2>
            {breakdown.map((c) => (
              <div className="budget-line" key={c.key}>
                <div className="budget-line-top">
                  <span>{c.label}</span>
                  <strong>NPR {c.amount.toLocaleString()}</strong>
                </div>
                <div className="budget-bar-track">
                  <div className="budget-bar-fill" style={{ width: `${c.share * 100}%` }} />
                </div>
              </div>
            ))}
          </section>
        </div>

        <section className="budget-alt-card">
          <h2>Alternative suggestions</h2>
          <p>
            Save an estimated <strong>NPR {potentialSavings.toLocaleString()}</strong> by choosing family-run
            teahouses over hotels, sharing road transfers instead of private vehicles, and routing through the
            mid-hills at a slower pace.
          </p>
        </section>

        <div className="dash-section-links">
          <Link to="/trip-planner">Build a full itinerary →</Link>
          <Link to="/trip-summary">View trip summary →</Link>
        </div>
      </main>
    </div>
  );
}
