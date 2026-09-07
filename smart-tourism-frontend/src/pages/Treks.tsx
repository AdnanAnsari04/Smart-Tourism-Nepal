import { useState, useMemo } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CulturalBackdrop from "../components/CulturalBackdrop";
import { treks } from "../data/treks";
import BackgroundImage from "../components/BackgroundImage";
import "../styles/treks.css";

const DIFFICULTIES = ["All Levels", "Easy", "Moderate", "Hard"];

export default function Treks() {
  const [difficulty, setDifficulty] = useState("All Levels");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [reservedId, setReservedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return treks.filter((t) => difficulty === "All Levels" || t.difficulty === difficulty);
  }, [difficulty]);

  function handleReserve(id: string) {
    // Frontend-only mock. Full booking flow (FR-10) needs the backend.
    setReservedId(id);
    setTimeout(() => setReservedId(null), 3000);
  }

  return (
    <div className="treks-page">
      <CulturalBackdrop variant="light" />
      <Navbar />

      <section className="treks-hero">
        <h1>Trek Recommendations</h1>
        <p>Matched to your fitness level, season, and available time.</p>

        <div className="treks-filter-row">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              className={`treks-filter-pill ${difficulty === d ? "is-active" : ""}`}
              onClick={() => setDifficulty(d)}
            >
              {d}
            </button>
          ))}
        </div>
      </section>

      <div className="treks-list">
        {filtered.map((t) => {
          const isOpen = expandedId === t.id;
          return (
            <div className="trek-card" key={t.id}>
              <BackgroundImage src={t.imageUrl} className={`trek-card-photo ${t.photoClass}`} alt={t.name} />
              <div className="trek-card-body">
                <div className="trek-card-top">
                  <div>
                    <h3>{t.name}</h3>
                    <p className="trek-card-region">{t.region}</p>
                  </div>
                  <span className={`difficulty-pill difficulty-${t.difficulty.toLowerCase()}`}>
                    {t.difficulty}
                  </span>
                </div>

                <p className="trek-card-desc">{t.description}</p>

                <div className="trek-card-meta">
                  <span>⏱ {t.durationDays} days</span>
                  <span>⛰ Max {t.maxAltitudeM.toLocaleString()}m</span>
                  <span>☀ {t.bestSeason}</span>
                </div>

                <button
                  className="trek-details-toggle"
                  onClick={() => setExpandedId(isOpen ? null : t.id)}
                  aria-expanded={isOpen}
                >
                  {isOpen ? "Hide details ▲" : "Permits & equipment ▼"}
                </button>

                {isOpen && (
                  <div className="trek-details">
                    <div>
                      <p className="trek-details-label">Required permits</p>
                      <ul>
                        {t.requiredPermits.map((p) => <li key={p}>{p}</li>)}
                      </ul>
                    </div>
                    <div>
                      <p className="trek-details-label">Suggested equipment</p>
                      <ul>
                        {t.equipment.map((e) => <li key={e}>{e}</li>)}
                      </ul>
                    </div>
                  </div>
                )}

                <button
                  className="trek-reserve-btn"
                  onClick={() => handleReserve(t.id)}
                  disabled={reservedId === t.id}
                >
                  {reservedId === t.id ? "Requested ✓" : "Reserve this trek"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <Footer />
    </div>
  );
}
