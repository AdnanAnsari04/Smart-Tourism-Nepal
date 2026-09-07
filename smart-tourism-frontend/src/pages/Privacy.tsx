import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/static-page.css";

export default function Privacy() {
  return (
    <div className="static-page">
      <Navbar />
      <section className="static-hero static-hero-compact">
        <p className="static-eyebrow">Legal</p>
        <h1>Privacy Policy</h1>
        <p className="static-hero-subtitle">Last updated: this is placeholder legal content for the frontend preview, not a reviewed policy.</p>
      </section>

      <section className="static-section">
        <h2>What this covers</h2>
        <p>
          This page describes, in general terms, the kind of information Yatra would collect and how it would be
          used once the platform is live. It is placeholder content for this frontend-only build and has not been
          reviewed by legal counsel — it should not be treated as a binding policy until it is.
        </p>
      </section>

      <section className="static-section">
        <h2>Information we'd collect</h2>
        <p>
          Account details you provide (name, email, phone), trip preferences (budget, interests, fitness level),
          and booking history. Payment details are handled directly by the payment provider you choose (eSewa,
          Khalti, IME Pay, ConnectIPS, or your card network) — Yatra would not store card or wallet credentials.
        </p>
      </section>

      <section className="static-section">
        <h2>How it would be used</h2>
        <p>
          To generate personalized itineraries and recommendations, process bookings, send the notifications you've
          opted into (see Settings), and improve the platform. It would not be sold to third parties.
        </p>
      </section>

      <section className="static-section">
        <h2>Your controls</h2>
        <p>
          You'd be able to update or delete your profile information, and choose which notification categories and
          channels reach you, from your account settings.
        </p>
      </section>
      <Footer />
    </div>
  );
}
