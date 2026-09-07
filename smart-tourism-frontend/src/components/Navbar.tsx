import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLanguage } from "../context/useLanguage";
import { getRole, clearSession } from "../utils/session";
import "../styles/layout.css";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const role = getRole();
  const accountHref = role === "admin" ? "/admin" : "/dashboard";
  const accountLabel = role === "admin" ? "Admin panel" : "My dashboard";

  function handleLogout() {
    clearSession();
    setIsMenuOpen(false);
    navigate("/login", { replace: true });
  }

  return (
    <header className="site-navbar">
      <Link to="/" className="site-logo" onClick={() => setIsMenuOpen(false)}>
        Yatra
      </Link>

      <nav className={`site-nav-links ${isMenuOpen ? "is-open" : ""}`}>
        <Link to="/destinations" onClick={() => setIsMenuOpen(false)}>{t("navDestinations")}</Link>
        <Link to="/hotels" onClick={() => setIsMenuOpen(false)}>{t("navHotels")}</Link>
        <Link to="/treks" onClick={() => setIsMenuOpen(false)}>{t("navTreks")}</Link>
        <Link to="/trip-planner" onClick={() => setIsMenuOpen(false)}>{t("navTripPlanner")}</Link>
        <Link to="/heritage" onClick={() => setIsMenuOpen(false)}>{t("navHeritage")}</Link>
        <Link to="/map" onClick={() => setIsMenuOpen(false)}>{t("navMap")}</Link>
        <div className="site-nav-actions-mobile">
          <button
            type="button"
            className="lang-toggle lang-toggle-mobile"
            onClick={toggleLanguage}
            aria-label={language === "en" ? "Switch to Nepali" : "Switch to English"}
          >
            {language === "en" ? "EN" : "ने"}
          </button>
          {role ? (
            <>
              <Link to={accountHref} className="nav-button" onClick={() => setIsMenuOpen(false)}>
                {accountLabel}
              </Link>
              <button type="button" className="nav-link-ghost" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link-ghost" onClick={() => setIsMenuOpen(false)}>
                {t("navSignIn")}
              </Link>
              <Link to="/register" className="nav-button" onClick={() => setIsMenuOpen(false)}>
                {t("navGetStarted")}
              </Link>
            </>
          )}
        </div>
      </nav>

      <div className="site-nav-actions">
        <button
          type="button"
          className="lang-toggle"
          onClick={toggleLanguage}
          aria-label={language === "en" ? "Switch to Nepali" : "Switch to English"}
        >
          {language === "en" ? "EN" : "ने"}
        </button>
        {role ? (
          <>
            <span className={`nav-role-badge nav-role-${role}`}>
              {role === "admin" ? "Admin" : "Tourist"}
            </span>
            <Link to={accountHref} className="nav-button">
              {accountLabel}
            </Link>
            {/* <button type="button" className="nav-link-ghost" onClick={handleLogout}>
              Log out
            </button> */}
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link-ghost">
              {t("navSignIn")}
            </Link>
            <Link to="/register" className="nav-button">
              {t("navGetStarted")}
            </Link>
          </>
        )}
      </div>

      <button
        type="button"
        className="nav-menu-toggle"
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        aria-expanded={isMenuOpen}
        onClick={() => setIsMenuOpen((open) => !open)}
      >
        <span />
        <span />
        <span />
      </button>
    </header>
  );
}