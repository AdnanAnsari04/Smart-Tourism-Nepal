import { useState } from "react";
import Sidebar from "../components/Sidebar";
import CulturalBackdrop from "../components/CulturalBackdrop";
import "../styles/dashboard.css";
import "../styles/profile.css";

// FR-03: travel interests, preferred destinations, budget range, language
// preference, travel history, fitness level. Frontend-only for now. This
// reads/writes localStorage as a stand-in for the real profile API.
const INTERESTS = ["Trekking", "Culture & Heritage", "Nature", "Adventure", "Food", "Pilgrimage", "Relaxation"];
const FITNESS_LEVELS = ["Beginner", "Moderate", "Experienced", "Expert"];
const LANGUAGES = ["English", "नेपाली (Nepali)"];

function readSavedUserName(): string {
  return localStorage.getItem("userName") || "";
}

export default function Profile() {
  const [fullName] = useState(readSavedUserName);
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [budgetRange, setBudgetRange] = useState("Rs. 30,000 - 60,000");
  const [fitnessLevel, setFitnessLevel] = useState("Moderate");
  const [language, setLanguage] = useState("English");
  const [interests, setInterests] = useState<string[]>(["Trekking", "Culture & Heritage"]);
  const [saved, setSaved] = useState(false);

  function toggleInterest(interest: string) {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    // Frontend-only mock. FR-03's real version validates and persists to
    // SQL Server, then the AI engine reads this on every recommendation.
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dash-main">
        <CulturalBackdrop variant="light" />
        <div className="dash-header">
          <div>
            <h1 className="dash-greeting">Your Profile</h1>
            <p className="dash-subgreeting">
              Tell us your preferences — the AI Trip Planner uses this to personalize recommendations.
            </p>
          </div>
          <div className="dash-avatar">{(fullName || "Y").charAt(0).toUpperCase()}</div>
        </div>
        <div className="horizon-divider" />

        <form className="profile-form" onSubmit={handleSave}>
          <section className="profile-section">
            <h2 className="dash-section-title">Basic information</h2>
            <div className="profile-field-row">
              <div className="profile-field">
                <label htmlFor="profile-name">Full name</label>
                <input id="profile-name" type="text" value={fullName} disabled />
                <p className="profile-hint">Change this from Account settings.</p>
              </div>
              <div className="profile-field">
                <label htmlFor="profile-phone">Phone number</label>
                <input
                  id="profile-phone"
                  type="tel"
                  placeholder="98XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
            <div className="profile-field-row">
              <div className="profile-field">
                <label htmlFor="profile-country">Country</label>
                <input
                  id="profile-country"
                  type="text"
                  placeholder="e.g. United States"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
              <div className="profile-field">
                <label htmlFor="profile-language">Preferred language</label>
                <select id="profile-language" value={language} onChange={(e) => setLanguage(e.target.value)}>
                  {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>
          </section>

          <section className="profile-section">
            <h2 className="dash-section-title">Travel preferences</h2>
            <div className="profile-field-row">
              <div className="profile-field">
                <label htmlFor="profile-budget">Typical budget range</label>
                <select id="profile-budget" value={budgetRange} onChange={(e) => setBudgetRange(e.target.value)}>
                  <option>Rs. 10,000 - 30,000</option>
                  <option>Rs. 30,000 - 60,000</option>
                  <option>Rs. 60,000 - 120,000</option>
                  <option>Rs. 120,000+</option>
                </select>
              </div>
              <div className="profile-field">
                <label htmlFor="profile-fitness">Fitness level</label>
                <select id="profile-fitness" value={fitnessLevel} onChange={(e) => setFitnessLevel(e.target.value)}>
                  {FITNESS_LEVELS.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
            </div>

            <div className="profile-field">
              <label>Travel interests</label>
              <div className="profile-interest-grid">
                {INTERESTS.map((interest) => (
                  <button
                    type="button"
                    key={interest}
                    className={`profile-interest-chip ${interests.includes(interest) ? "is-selected" : ""}`}
                    onClick={() => toggleInterest(interest)}
                    aria-pressed={interests.includes(interest)}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="profile-section">
            <h2 className="dash-section-title">Travel history</h2>
            <div className="list-card">
              <div className="list-row">
                <div>
                  <p className="list-row-title">Pokhara Weekend — 3 days</p>
                  <p className="list-row-meta">Completed · June 2026</p>
                </div>
                <span className="status-pill status-confirmed">Completed</span>
              </div>
              <div className="list-row">
                <div>
                  <p className="list-row-title">Poon Hill Trek</p>
                  <p className="list-row-meta">Completed · March 2026</p>
                </div>
                <span className="status-pill status-confirmed">Completed</span>
              </div>
            </div>
          </section>

          <button type="submit" className="profile-save-btn">Save profile</button>
          {saved && (
            <p className="profile-saved-note" role="status">
              Saved locally — full persistence needs the backend (not part of this phase).
            </p>
          )}
        </form>
      </main>
    </div>
  );
}
