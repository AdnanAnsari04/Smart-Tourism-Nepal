import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/static-page.css";

const FAQS = [
  {
    q: "Is this a real booking platform yet?",
    a: "Not yet — this is the frontend-only phase. Browsing, search, and planning tools all work; hotel and trek bookings, and payments, are previews that will connect to a live backend in a later phase.",
  },
  {
    q: "How do I switch between English and Nepali?",
    a: "Use the language toggle in the top navigation bar, or go to Settings if you're signed in. The choice is saved for your next visit.",
  },
  {
    q: "What payment methods will be supported?",
    a: "eSewa, Khalti, IME Pay, ConnectIPS (for any Nepali bank account), and international cards.",
  },
  {
    q: "How do I sign in as an administrator?",
    a: "On the login page, use the Tourist/Administrator toggle above the email field before signing in.",
  },
];

export default function Support() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [sent, setSent] = useState(false);

  return (
    <div className="static-page">
      <Navbar />
      <section className="static-hero">
        <p className="static-eyebrow">Support</p>
        <h1>How can we help?</h1>
        <p className="static-hero-subtitle">Common questions below, or send us a message.</p>
      </section>

      <section className="static-section">
        <h2>Frequently asked questions</h2>
        <div className="faq-list">
          {FAQS.map((item, i) => (
            <div className="faq-item" key={item.q}>
              <button
                type="button"
                className="faq-question"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                aria-expanded={openIndex === i}
              >
                {item.q}
                <span aria-hidden="true">{openIndex === i ? "−" : "+"}</span>
              </button>
              {openIndex === i && <p className="faq-answer">{item.a}</p>}
            </div>
          ))}
        </div>
      </section>

      <section className="static-section">
        <h2>Contact us</h2>
        {sent ? (
          <p className="static-success">Thanks — this preview doesn't send real messages yet, but your note would reach our team once the backend is connected.</p>
        ) : (
          <form
            className="contact-form"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <label htmlFor="support-email">Your email</label>
            <input id="support-email" type="email" required placeholder="you@example.com" />
            <label htmlFor="support-message">Message</label>
            <textarea id="support-message" required rows={4} placeholder="How can we help?" />
            <button type="submit" className="static-primary-btn">Send message</button>
          </form>
        )}
      </section>
      <Footer />
    </div>
  );
}
