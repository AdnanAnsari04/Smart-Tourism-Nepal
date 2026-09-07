import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CulturalBackdrop from "../components/CulturalBackdrop";
import BackgroundImage from "../components/BackgroundImage";
import { destinations } from "../data/destinations";
import { provinces } from "../data/provinces";
import { categories } from "../data/categories";
import "../styles/destinations.css";

// Built from the shared province/category data instead of a hardcoded list,
// so adding a province or category in one place updates every page.
const PROVINCES = ["All Provinces", ...provinces.map((p) => p.name)];
const CATEGORIES = ["All Categories", ...categories.map((c) => c.id)];

export default function Destinations() {
  const [searchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get("q") || "");
  const [province, setProvince] = useState("All Provinces");
  const [category, setCategory] = useState("All Categories");

  const filtered = useMemo(() => {
    return destinations.filter((d) => {
      const matchesKeyword = d.name.toLowerCase().includes(keyword.toLowerCase());
      const matchesProvince = province === "All Provinces" || d.province === province;
      const matchesCategory = category === "All Categories" || d.category === category;
      return matchesKeyword && matchesProvince && matchesCategory;
    });
  }, [keyword, province, category]);

  return (
    <div className="destinations-page">
      <CulturalBackdrop variant="light" />
      <Navbar />

      <section className="dest-hero">
        <h1>Explore Nepal</h1>
        <p>Search by name, province, or category to find your next stop.</p>

        <div className="dest-filters">
          <label htmlFor="dest-keyword" className="visually-hidden">
            Search destinations
          </label>
          <input
            id="dest-keyword"
            name="keyword"
            type="text"
            placeholder="Search destinations, e.g. 'Pokhara'"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <label htmlFor="dest-province" className="visually-hidden">
            Filter by province
          </label>
          <select id="dest-province" name="province" value={province} onChange={(e) => setProvince(e.target.value)}>
            {PROVINCES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <label htmlFor="dest-category" className="visually-hidden">
            Filter by category
          </label>
          <select id="dest-category" name="category" value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </section>

      <div className="dest-results-bar">
        <p className="dest-results-count">{filtered.length} destination{filtered.length !== 1 ? "s" : ""} found</p>
      </div>

      {filtered.length === 0 ? (
        <p className="dest-empty">No destinations match your filters — try clearing one.</p>
      ) : (
        <div className="dest-grid">
          {filtered.map((d) => (
            <div className="dest-card" key={d.id}>
              <BackgroundImage src={d.imageUrl} className={`dest-photo ${d.photoClass}`} alt={d.name} />
              <div className="dest-body">
                <div className="dest-top-row">
                  <h3 className="dest-name">{d.name}</h3>
                  <span className="dest-rating">★ {d.rating}</span>
                </div>
                <p className="dest-meta">{d.province} · {d.distanceKm} km from Kathmandu</p>
                <p className="dest-desc">{d.description}</p>
                <div className="dest-tag-row">
                  <span className="dest-category-tag">{d.category}</span>
                  <Link to={`/destinations/${d.id}`} className="dest-view-link">View details →</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Footer />
    </div>
  );
}