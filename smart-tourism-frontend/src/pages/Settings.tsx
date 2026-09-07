import { useState } from "react";
import Sidebar from "../components/Sidebar";
import CulturalBackdrop from "../components/CulturalBackdrop";
import { useLanguage } from "../context/useLanguage";
import "../styles/dashboard.css";
import "../styles/settings.css";

// FRD section 15 (Notifications). "User Preference Configuration: Users
// can configure which categories of notifications they receive and through
// which channels." Safety/Critical notifications are deliberately excluded
// from being toggled off, matching the FRD's own rule that critical alerts
// "are dispatched immediately... Regardless of the user's saved
// preferences, since safety notifications cannot be delayed."
const CATEGORIES = [
  { key: "onboarding", label: "Onboarding & tips", desc: "Welcome emails, platform tutorials, first-login guidance." },
  { key: "booking", label: "Bookings", desc: "Confirmations, pre-trip reminders, check-in reminders, review requests." },
  { key: "payment", label: "Payments", desc: "Payment success and failure notices." },
  { key: "promotion", label: "Promotions", desc: "Price drop alerts and seasonal offers." },
];

const CHANNELS = ["email", "sms", "inApp"] as const;
type Channel = (typeof CHANNELS)[number];
type Prefs = Record<string, Record<Channel, boolean>>;

function defaultPrefs(): Prefs {
  const prefs: Prefs = {};
  for (const c of CATEGORIES) {
    prefs[c.key] = { email: true, sms: c.key === "booking", inApp: true };
  }
  return prefs;
}

export default function Settings() {
  const { language, toggleLanguage } = useLanguage();
  const [prefs, setPrefs] = useState<Prefs>(defaultPrefs);
  const [saved, setSaved] = useState(false);

  function toggle(categoryKey: string, channel: Channel) {
    setPrefs((prev) => ({
      ...prev,
      [categoryKey]: { ...prev[categoryKey], [channel]: !prev[categoryKey][channel] },
    }));
    setSaved(false);
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dash-main">
        <CulturalBackdrop variant="light" />
        <div className="dash-header">
          <div>
            <h1>Settings</h1>
            <p>Choose your language and how Yatra reaches you.</p>
          </div>
        </div>
        <div className="horizon-divider" />

        <section className="settings-card">
          <h2>Language</h2>
          <p className="settings-card-desc">Switch the site's primary navigation and marketing copy between English and Nepali.</p>
          <button type="button" className="settings-lang-btn" onClick={toggleLanguage}>
            {language === "en" ? "Currently English — switch to नेपाली" : "हाल नेपाली — अंग्रेजीमा बदल्नुहोस्"}
          </button>
        </section>

        <section className="settings-card">
          <h2>Notification preferences</h2>
          <p className="settings-card-desc">
            Choose which categories reach you and how. Safety alerts (severe weather, trail closures) are always
            sent by SMS and in-app — they can't be turned off, since they cannot be delayed.
          </p>

          <div className="settings-table">
            <div className="settings-table-header">
              <span>Category</span>
              <span>Email</span>
              <span>SMS</span>
              <span>In-app</span>
            </div>
            {CATEGORIES.map((c) => (
              <div className="settings-table-row" key={c.key}>
                <div>
                  <p className="settings-row-label">{c.label}</p>
                  <p className="settings-row-desc">{c.desc}</p>
                </div>
                {CHANNELS.map((ch) => (
                  <label key={ch} className="settings-checkbox">
                    <input
                      type="checkbox"
                      checked={prefs[c.key][ch]}
                      onChange={() => toggle(c.key, ch)}
                      aria-label={`${c.label} via ${ch}`}
                    />
                  </label>
                ))}
              </div>
            ))}
            <div className="settings-table-row settings-row-locked">
              <div>
                <p className="settings-row-label">Safety alerts</p>
                <p className="settings-row-desc">Severe weather warnings and trail closures. Always on.</p>
              </div>
              <span className="settings-locked-cell">—</span>
              <span className="settings-locked-cell settings-locked-on">✓</span>
              <span className="settings-locked-cell settings-locked-on">✓</span>
            </div>
          </div>

          <button type="button" className="settings-save-btn" onClick={() => setSaved(true)}>
            Save preferences
          </button>
          {saved && <p className="settings-saved-note">Preferences saved locally — this will sync once the backend is connected.</p>}
        </section>
      </main>
    </div>
  );
}
