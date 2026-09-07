import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CulturalBackdrop from "../components/CulturalBackdrop";
import { destinations } from "../data/destinations";
import "../styles/trip-planner.css";

const INTERESTS = ["Trekking", "Culture & Heritage", "Nature", "Adventure", "Food", "Pilgrimage", "Relaxation"];

interface MockItineraryDay {
  day: number;
  title: string;
  activities: string[];
}

interface BudgetBreakdown {
  accommodation: number;
  transport: number;
  food: number;
  permitsAndFees: number;
  miscellaneous: number;
}

// FR-09: Estimated Trip Cost, Budget Breakdown, Alternative Suggestions.
// Frontend-only mock. Real percentages come from ML models trained on
// historical tourism pricing (per FR-09's description), not fixed splits.
function buildBudgetBreakdown(totalBudget: number, interests: string[]): BudgetBreakdown {
  const isTrekHeavy = interests.includes("Trekking") || interests.includes("Adventure");
  const split = isTrekHeavy
    ? { accommodation: 0.3, transport: 0.15, food: 0.2, permitsAndFees: 0.25, miscellaneous: 0.1 }
    : { accommodation: 0.4, transport: 0.2, food: 0.25, permitsAndFees: 0.05, miscellaneous: 0.1 };
  return {
    accommodation: Math.round(totalBudget * split.accommodation),
    transport: Math.round(totalBudget * split.transport),
    food: Math.round(totalBudget * split.food),
    permitsAndFees: Math.round(totalBudget * split.permitsAndFees),
    miscellaneous: Math.round(totalBudget * split.miscellaneous),
  };
}

function buildAlternativeSuggestions(interests: string[]): string[] {
  const suggestions = [
    "Switch to teahouse/homestay lodging instead of hotels to save roughly 15-20% on accommodation.",
    "Travel in shoulder season (Mar-Apr or Sep-Oct) for lower rates on hotels and permits.",
  ];
  if (interests.includes("Trekking") || interests.includes("Adventure")) {
    suggestions.push("Join a group trek instead of a private guide to reduce per-person permit and guide costs.");
  } else {
    suggestions.push("Book local buses instead of private transfers between cities to cut transport costs.");
  }
  return suggestions;
}

export default function TripPlanner() {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");
  const [travelers, setTravelers] = useState(2);
  const [interests, setInterests] = useState<string[]>([]);
  const [itinerary, setItinerary] = useState<MockItineraryDay[] | null>(null);
  const [budgetBreakdown, setBudgetBreakdown] = useState<BudgetBreakdown | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  function toggleInterest(interest: string) {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  }

  function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!destination || !startDate || !endDate || !budget) {
      setError("Please fill in destination, dates, and budget to generate an itinerary.");
      return;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      setError("Return date must be after your start date.");
      return;
    }

    setIsGenerating(true);
    setItinerary(null);

    // --- Where the real AI Agent connects (FR-04) ---
    // This phase is frontend-only, and per current scope the conversational
    // AI Chat Assistant (FR-11) isn't built yet either. Once the backend and
    // Gemini API integration exist, replace this block with a real request:
    //
    // const response = await axios.post("/api/trip-planner/generate", {
    //   destination, startDate, endDate, budget, travelers, interests,
    // });
    // setItinerary(response.data.itinerary);
    //
    // For now, we simulate the AI's response with a short delay and a
    // deterministic mock itinerary so the full UI/UX is demonstrable.
    setTimeout(() => {
      const days = Math.max(1, Math.round(
        (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
      ));
      const mockDays: MockItineraryDay[] = Array.from({ length: Math.min(days, 5) }, (_, i) => ({
        day: i + 1,
        title: i === 0 ? `Arrive in ${destination}` : i === days - 1 ? "Departure" : `Explore ${destination}`,
        activities:
          i === 0
            ? ["Airport/bus pickup", "Check in to hotel", "Evening orientation walk"]
            : i === days - 1
            ? ["Final souvenir shopping", "Checkout", "Transfer to airport/bus station"]
            : [
                interests.includes("Trekking") ? "Half-day guided trek" : "Sightseeing at key landmarks",
                interests.includes("Culture & Heritage") ? "Visit a heritage/temple site" : "Local market visit",
                interests.includes("Food") ? "Food tour / cooking class" : "Free evening",
              ],
      }));
      setItinerary(mockDays);
      setBudgetBreakdown(buildBudgetBreakdown(Number(budget), interests));
      setIsGenerating(false);
    }, 1100);
  }

  return (
    <div className="tp-page">
      <CulturalBackdrop variant="light" />
      <Navbar />

      <section className="tp-hero">
        <p className="tp-eyebrow">AI Trip Planner</p>
        <h1>Tell us your trip details.</h1>
        <p className="tp-subtitle">
          Enter your destination, dates, and interests below to generate a sample itinerary.
        </p>
      </section>

      <div className="tp-body">
        <form className="tp-form" onSubmit={handleGenerate}>
          <div className="tp-field">
            <label htmlFor="tp-destination">Destination</label>
            <select
              id="tp-destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            >
              <option value="">Select a destination</option>
              {destinations.map((d) => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className="tp-field-row">
            <div className="tp-field">
              <label htmlFor="tp-start">Start date</label>
              <input
                id="tp-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().slice(0, 10)}
              />
            </div>
            <div className="tp-field">
              <label htmlFor="tp-end">Return date</label>
              <input
                id="tp-end"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || new Date().toISOString().slice(0, 10)}
              />
            </div>
          </div>

          <div className="tp-field-row">
            <div className="tp-field">
              <label htmlFor="tp-budget">Budget (NPR)</label>
              <input
                id="tp-budget"
                type="number"
                min={1}
                placeholder="e.g. 50000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>
            <div className="tp-field">
              <label htmlFor="tp-travelers">Travelers</label>
              <input
                id="tp-travelers"
                type="number"
                min={1}
                max={20}
                value={travelers}
                onChange={(e) => setTravelers(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="tp-field">
            <label>Travel interests</label>
            <div className="tp-interest-grid">
              {INTERESTS.map((interest) => (
                <button
                  type="button"
                  key={interest}
                  className={`tp-interest-chip ${interests.includes(interest) ? "is-selected" : ""}`}
                  onClick={() => toggleInterest(interest)}
                  aria-pressed={interests.includes(interest)}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="tp-error" role="alert">{error}</p>}

          <button type="submit" className="tp-generate-btn" disabled={isGenerating}>
            {isGenerating ? "Generating..." : "Generate Itinerary"}
          </button>
        </form>

        <div className="tp-result">
          {!itinerary && !isGenerating && (
            <div className="tp-placeholder">
              <p>Your generated itinerary will appear here.</p>
              <p className="tp-placeholder-note">
                This is a sample itinerary builder for the frontend phase — it isn't
                connected to the real AI recommendation engine yet.
              </p>
            </div>
          )}

          {isGenerating && (
            <div className="tp-placeholder">
              <p>Building your itinerary...</p>
            </div>
          )}

          {itinerary && (
            <div className="tp-itinerary">
              <h2>Sample itinerary — {destination}</h2>
              <p className="tp-itinerary-meta">
                {travelers} traveler{travelers !== 1 ? "s" : ""} · Budget Rs. {Number(budget).toLocaleString()}
              </p>
              {itinerary.map((day) => (
                <div className="tp-day" key={day.day}>
                  <div className="tp-day-number">Day {day.day}</div>
                  <div className="tp-day-content">
                    <p className="tp-day-title">{day.title}</p>
                    <ul>
                      {day.activities.map((a) => <li key={a}>{a}</li>)}
                    </ul>
                  </div>
                </div>
              ))}
              <div className="tp-itinerary-actions">
                <Link to="/hotels" className="tp-itinerary-link">Browse hotels →</Link>
                <Link to="/treks" className="tp-itinerary-link">Browse treks →</Link>
              </div>

              {budgetBreakdown && (
                <div className="tp-budget-section">
                  <h3>Budget Breakdown</h3>
                  <div className="tp-budget-rows">
                    <div className="tp-budget-row">
                      <span>Accommodation</span>
                      <span>Rs. {budgetBreakdown.accommodation.toLocaleString()}</span>
                    </div>
                    <div className="tp-budget-row">
                      <span>Transport</span>
                      <span>Rs. {budgetBreakdown.transport.toLocaleString()}</span>
                    </div>
                    <div className="tp-budget-row">
                      <span>Food</span>
                      <span>Rs. {budgetBreakdown.food.toLocaleString()}</span>
                    </div>
                    <div className="tp-budget-row">
                      <span>Permits & fees</span>
                      <span>Rs. {budgetBreakdown.permitsAndFees.toLocaleString()}</span>
                    </div>
                    <div className="tp-budget-row">
                      <span>Miscellaneous</span>
                      <span>Rs. {budgetBreakdown.miscellaneous.toLocaleString()}</span>
                    </div>
                    <div className="tp-budget-row-total">
                      <span>Total</span>
                      <span>
                        Rs. {(
                          budgetBreakdown.accommodation +
                          budgetBreakdown.transport +
                          budgetBreakdown.food +
                          budgetBreakdown.permitsAndFees +
                          budgetBreakdown.miscellaneous
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <h3 className="tp-budget-alt-title">Alternative Suggestions</h3>
                  <ul className="tp-budget-alt-list">
                    {buildAlternativeSuggestions(interests).map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
