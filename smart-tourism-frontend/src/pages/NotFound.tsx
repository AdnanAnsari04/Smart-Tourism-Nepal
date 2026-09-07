import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/home.css";

export default function NotFound() {
  return (
    <div className="home-page">
      <Navbar />

      <section className="section section-cream" style={{ textAlign: "center" }}>
        <p className="section-eyebrow">404</p>
        <h2 className="section-title" style={{ maxWidth: "none", margin: "0 0 24px" }}>
          This page doesn't exist yet.
        </h2>
        <Link to="/" className="cta-button">
          Back to home
        </Link>
      </section>

      <Footer />
    </div>
  );
}
