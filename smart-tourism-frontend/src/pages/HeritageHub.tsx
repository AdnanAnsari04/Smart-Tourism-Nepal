import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CulturalBackdrop from "../components/CulturalBackdrop";
import BackgroundImage from "../components/BackgroundImage";
import { destinations } from "../data/destinations";
import { heritageSites } from "../data/heritage";
import "../styles/heritage.css";

// Cultural Heritage Hub. Explicitly in scope per the FRD (section 4.1:
// "Cultural heritage information hub with multimedia content"; also listed
// as a module in the Functional Overview, 5.1). Frontend-only: no video/CDN
// hosting is wired up yet (that needs the backend's Heritage Service), so
// this uses descriptive content and the same photo-gradient placeholders
// used across the rest of the site rather than overclaiming real media.

// Real, verifiable facts about Nepal's UNESCO World Heritage Sites. Not
// mock data. Nepal has four inscribed sites; the Kathmandu Valley listing
// covers seven monument zones (matching the FRD's own "seven UNESCO sites"
// framing in its Business Overview).
const UNESCO_SITES = [
  {
    name: "Kathmandu Valley",
    year: "1979",
    detail:
      "A single UNESCO listing covering seven monument zones: the Durbar Squares of Kathmandu, Patan, and Bhaktapur, and the religious ensembles of Swayambhunath, Boudhanath, Pashupatinath, and Changu Narayan.",
  },
  {
    name: "Lumbini",
    year: "1997",
    detail: "The birthplace of Siddhartha Gautama, the Buddha, and one of Buddhism's most sacred pilgrimage sites.",
  },
  {
    name: "Sagarmatha National Park",
    year: "1979",
    detail: "Home to Mount Everest and Sherpa culture, protecting some of the world's highest terrain and rare alpine wildlife.",
  },
  {
    name: "Chitwan National Park",
    year: "1984",
    detail: "Nepal's first national park, protecting one-horned rhinoceros, Bengal tigers, and Tharu cultural heritage in the lowland Terai.",
  },
];

// Nepal's major living festivals. Real, not invented. Shown to give a
// sense of ongoing cultural practice rather than only historic sites.
const FESTIVALS = [
  { name: "Dashain", season: "Sep–Oct", note: "Nepal's longest and most important festival, marked by family gatherings and tika blessings." },
  { name: "Tihar", season: "Oct–Nov", note: "The festival of lights, honoring crows, dogs, cows, and the bond between siblings." },
  { name: "Indra Jatra", season: "Sep", note: "Kathmandu's chariot festival honoring the god of rain, featuring the Kumari (living goddess) procession." },
  { name: "Bisket Jatra", season: "Apr", note: "Bhaktapur's dramatic new year chariot-pulling festival, marking the start of the Nepali calendar." },
  { name: "Buddha Jayanti", season: "Apr–May", note: "Celebrating the birth of the Buddha, observed with particular devotion at Lumbini and Boudhanath." },
  { name: "Holi", season: "Mar", note: "The festival of colors, celebrated nationwide with color powder and water." },
];

const PROVINCES = ["All provinces", "Koshi", "Madhesh", "Bagmati", "Gandaki", "Lumbini", "Karnali", "Sudurpashchim"];

export default function HeritageHub() {
  const heritageSitesOnYatra = destinations.filter(
    (d) => d.category === "Heritage" || d.category === "Pilgrimage"
  );

  const [province, setProvince] = useState("All provinces");
  const [search, setSearch] = useState("");
  const filteredDirectory = useMemo(
    () =>
      heritageSites.filter(
        (site) =>
          (province === "All provinces" || site.province === province) &&
          `${site.name} ${site.type} ${site.context}`.toLowerCase().includes(search.toLowerCase())
      ),
    [province, search]
  );

  return (
    <div className="heritage-page">
      <CulturalBackdrop variant="light" />
      <Navbar />

      <section className="heritage-hero">
        <CulturalBackdrop variant="dark" />
        <div className="heritage-hero-content">
          <p className="heritage-eyebrow">Cultural Heritage Hub</p>
          <h1>Nepal's living heritage.</h1>
          <p className="heritage-hero-subtitle">
            Four UNESCO World Heritage Sites, centuries-old Newari architecture, and festivals
            still celebrated exactly as they have been for generations.
          </p>
        </div>
      </section>

      <section className="heritage-section">
        <p className="heritage-section-eyebrow">UNESCO World Heritage</p>
        <h2 className="heritage-section-title">Recognized by the world, lived in every day</h2>
        <div className="unesco-grid">
          {UNESCO_SITES.map((s) => (
            <div className="unesco-card" key={s.name}>
              <div className="unesco-card-top">
                <h3>{s.name}</h3>
                <span className="unesco-year">Inscribed {s.year}</span>
              </div>
              <p>{s.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="heritage-section heritage-section-cream">
        <p className="heritage-section-eyebrow">Explore the sites</p>
        <h2 className="heritage-section-title">Heritage &amp; pilgrimage destinations on Yatra</h2>
        <div className="heritage-grid">
          {heritageSitesOnYatra.map((d) => (
            <Link to={`/destinations/${d.id}`} className="heritage-card" key={d.id}>
              <BackgroundImage src={d.imageUrl} className={`heritage-card-photo ${d.photoClass}`} alt={d.name} />
              <div className="heritage-card-body">
                <p className="heritage-card-province">{d.province}</p>
                <h3>{d.name}</h3>
                <p>{d.description}</p>
                <span className="heritage-card-link">View details →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ---- Full heritage directory (30 sites, all 7 provinces) ----
          Editorial content, not tied to individual destination pages —
          this is the broader cultural reference the FRD's "Cultural
          Heritage Hub" scope calls for, beyond the bookable destinations
          above. Verify opening hours and local guidance before launch. */}
      <section className="heritage-section">
        <p className="heritage-section-eyebrow">Full directory</p>
        <h2 className="heritage-section-title">30 heritage places, all 7 provinces</h2>

        <div className="heritage-directory-tools">
          <label htmlFor="heritage-search" className="visually-hidden">Search heritage places</label>
          <input
            id="heritage-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, type, or context…"
          />
          <label htmlFor="heritage-province" className="visually-hidden">Filter by province</label>
          <select id="heritage-province" value={province} onChange={(e) => setProvince(e.target.value)}>
            {PROVINCES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <p className="heritage-directory-count">{filteredDirectory.length} places match</p>

        <div className="heritage-directory-grid">
          {filteredDirectory.map((site) => (
            <article className={`heritage-dir-card heritage-dir-${site.tone}`} key={site.id}>
              <div className="heritage-dir-top">
                <span>{site.province}</span>
                <span>{site.type}</span>
              </div>
              <h3>{site.name}</h3>
              <p>{site.context}</p>
              <p className="heritage-dir-visit">{site.visit}</p>
            </article>
          ))}
        </div>

        {filteredDirectory.length === 0 && (
          <div className="heritage-directory-empty">
            <h3>No places match</h3>
            <p>Try another province or clear your search.</p>
          </div>
        )}

        <p className="heritage-directory-principle">
          <strong>Heritage is not a backdrop.</strong> These places are lived in, worshipped in, worked in, and
          cared for by communities. Follow local guidance, ask before taking photographs, and choose experiences
          that return value to the people who host you.
        </p>
      </section>

      <section className="heritage-section">
        <p className="heritage-section-eyebrow">Living traditions</p>
        <h2 className="heritage-section-title">Festivals across the Nepali calendar</h2>
        <div className="festival-grid">
          {FESTIVALS.map((f) => (
            <div className="festival-card" key={f.name}>
              <div className="festival-card-top">
                <h3>{f.name}</h3>
                <span className="festival-season">{f.season}</span>
              </div>
              <p>{f.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="heritage-cta">
        <h2>Plan a heritage-focused trip</h2>
        <p>Let the AI Trip Planner build an itinerary centered on temples, stupas, and living culture.</p>
        <Link to="/trip-planner" className="heritage-cta-button">Open AI Trip Planner</Link>
      </section>

      <Footer />
    </div>
  );
}
