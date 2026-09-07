import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/static-page.css";

export default function Terms() {
  return (
    <div className="static-page">
      <Navbar />
      <section className="static-hero static-hero-compact">
        <p className="static-eyebrow">Legal</p>
        <h1>Terms of Service</h1>
        <p className="static-hero-subtitle">Placeholder legal content for the frontend preview, not a reviewed policy.</p>
      </section>

      <section className="static-section">
        <h2>Status of this document</h2>
        <p>
          This is placeholder terms-of-service content written for this frontend-only build. It has not been
          reviewed by legal counsel and should not be treated as binding until it is replaced with a reviewed
          version ahead of any real launch.
        </p>
      </section>

      <section className="static-section">
        <h2>Using the platform</h2>
        <p>
          You'd need an account to book hotels or treks, save itineraries, or leave reviews. You're responsible for
          the accuracy of the information you provide and for any bookings made under your account.
        </p>
      </section>

      <section className="static-section">
        <h2>Bookings and payments</h2>
        <p>
          Bookings would be confirmed once payment is processed through your chosen provider. Cancellation terms
          vary by hotel or trek operator and would be shown before you confirm a booking.
        </p>
      </section>

      <section className="static-section">
        <h2>Content and conduct</h2>
        <p>
          Reviews and other content you submit should be honest and your own. Yatra reserves the right to remove
          content that violates these terms or applicable law.
        </p>
      </section>
      <Footer />
    </div>
  );
}
