import { Link } from "react-router-dom";
import { useLanguage } from "../context/useLanguage";

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="site-footer">
      <div className="footer-horizon-bar" aria-hidden="true" />

      <div className="footer-grid">
        <div className="footer-brand">
          <p className="footer-logo">Yatra</p>
          <p className="footer-tagline">{t("footerTagline")}</p>
        </div>

        <nav className="footer-col" aria-label={t("footerExplore")}>
          <p className="footer-col-title">{t("footerExplore")}</p>
          <Link to="/destinations">{t("navDestinations")}</Link>
          <Link to="/trip-planner">{t("navTripPlanner")}</Link>
          <Link to="/treks">{t("navTreks")}</Link>
        </nav>

        <nav className="footer-col" aria-label={t("footerCompany")}>
          <p className="footer-col-title">{t("footerCompany")}</p>
          <Link to="/about">{t("footerAbout")}</Link>
          <Link to="/support">{t("footerSupport")}</Link>
          <Link to="/privacy">{t("footerPrivacy")}</Link>
          <Link to="/terms">{t("footerTerms")}</Link>
        </nav>

        <div className="footer-col">
          <p className="footer-col-title">{t("footerFollow")}</p>
          <div className="footer-social">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Yatra on Instagram">Instagram</a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Yatra on Facebook">Facebook</a>
          </div>
        </div>
      </div>

      <p className="footer-copyright">{t("footerCopyright")}</p>
    </footer>
  );
}