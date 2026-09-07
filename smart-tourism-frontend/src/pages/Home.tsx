import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CulturalBackdrop from "../components/CulturalBackdrop";
import { useLanguage } from "../context/useLanguage";
import "../styles/home.css";
import heroImg from "../assets/hero-mountains.webp";
import FeaturedCarousel from "../components/FeaturedCarousel";
import { useState } from "react";

export default function Home() {
  const navigate = useNavigate();
  const [heroKeyword, setHeroKeyword] = useState("");
  const { t } = useLanguage();

  function handleHeroSearch(e: React.FormEvent) {
    e.preventDefault();
    navigate(heroKeyword.trim() ? `/destinations?q=${encodeURIComponent(heroKeyword.trim())}` : "/destinations");
  }

  return (
    <div className="home-page">
      <div className="prayer-thread" aria-hidden="true" />
      <Navbar />

      {/* ---- Hero ---- */}
      <section className="hero">
        <div
  className="hero-mountains"
  style={{ backgroundImage: `url(${heroImg})` }}
  aria-hidden="true"
/>
        <div className="hero-content">
          <p className="hero-eyebrow">{t("heroEyebrow")}</p>
          <h1 className="hero-title">{t("heroTitle")}</h1>
          <p className="hero-subtitle">{t("heroSubtitle")}</p>
          <form className="hero-search" onSubmit={handleHeroSearch}>
            <label htmlFor="hero-destination" className="visually-hidden">
              {t("heroSearchPlaceholder")}
            </label>
            <input
              id="hero-destination"
              name="destination"
              type="text"
              placeholder={t("heroSearchPlaceholder")}
              value={heroKeyword}
              onChange={(e) => setHeroKeyword(e.target.value)}
            />
            <button type="submit">{t("heroSearchButton")}</button>
          </form>
        </div>
      </section>

      {/* ---- Featured Destinations ---- */}
      <section className="section section-cream">
        <CulturalBackdrop variant="light" />
        <p className="section-eyebrow">{t("featuredEyebrow")}</p>
        <h2 className="section-title">{t("featuredTitle")}</h2>
        <FeaturedCarousel />
      </section>
      {/* ---- Popular Treks ---- */}
      <section className="section section-dark">
        <p className="section-eyebrow">{t("treksEyebrow")}</p>
        <h2 className="section-title">{t("treksTitle")}</h2>
        <div className="trek-list">
          <div className="trek-row">
            <span className="trek-name">Annapurna Base Camp</span>
            <div className="trek-meta">
              <span>7–10 days</span>
              <span className="difficulty-pill difficulty-moderate">Moderate</span>
            </div>
          </div>
          <div className="trek-row">
            <span className="trek-name">Everest Base Camp</span>
            <div className="trek-meta">
              <span>12–14 days</span>
              <span className="difficulty-pill difficulty-hard">Challenging</span>
            </div>
          </div>
          <div className="trek-row">
            <span className="trek-name">Poon Hill</span>
            <div className="trek-meta">
              <span>3–5 days</span>
              <span className="difficulty-pill difficulty-easy">Easy</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Heritage Highlights ---- */}
      <section className="section section-cream">
        <CulturalBackdrop variant="light" />
        <p className="section-eyebrow">{t("heritageEyebrow")}</p>
        <h2 className="section-title">{t("heritageTitle")}</h2>
        <div className="heritage-pills">
          <span className="heritage-pill">Kathmandu Durbar Square</span>
          <span className="heritage-pill">Patan Durbar Square</span>
          <span className="heritage-pill">Bhaktapur Durbar Square</span>
          <span className="heritage-pill">Pashupatinath Temple</span>
          <span className="heritage-pill">Boudhanath Stupa</span>
          <span className="heritage-pill">Swayambhunath Stupa</span>
          <span className="heritage-pill">Lumbini</span>
        </div>
        <Link to="/heritage" className="home-heritage-link">{t("heritageLink")}</Link>
      </section>

      {/* ---- CTA ---- */}
      <section className="cta-band">
        <h2>{t("ctaTitle")}</h2>
        <Link to="/register" className="cta-button">
          {t("ctaButton")}
        </Link>
      </section>

      <Footer />
    </div>
  );
}