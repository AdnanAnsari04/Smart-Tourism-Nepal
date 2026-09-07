import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/static-page.css";

export default function About() {
  return (
    <div className="static-page">
      <Navbar />
      <section className="static-hero">
        <p className="static-eyebrow">About Yatra</p>
        <h1>Built for how people actually plan Nepal trips.</h1>
        <p className="static-hero-subtitle">
          One platform for destinations, hotels, treks, and heritage, instead of a dozen open tabs.
        </p>
      </section>

      <section className="static-section">
        <h2>Why we built this</h2>
        <p>
          Planning a trip to Nepal usually means piecing together information from travel forums, outdated blog
          posts, and a handful of booking sites that don't talk to each other. Yatra brings destination research,
          hotel and trek booking, weather, budgeting, and cultural context into one place, so a trip that used to
          take days to plan takes minutes.
        </p>
      </section>

      <section className="static-section">
        <h2>What's in this release</h2>
        <p>
          This is the frontend of the Yatra platform: destination discovery, hotel and trek search, an AI trip
          planner, a cultural heritage hub, and account tools for both travelers and administrators. It runs
          against local sample data today; live bookings, payments, and AI-generated itineraries connect once the
          backend is in place.
        </p>
      </section>

      <section className="static-section">
        <h2>Who it's for</h2>
        <p>
          Independent travelers planning their own route through Nepal, and the local hotels, guides, and heritage
          sites who want to be found by them.
        </p>
      </section>
      <Footer />
    </div>
  );
}
