import { useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CulturalBackdrop from "../components/CulturalBackdrop";
import WeatherForecast from "../components/WeatherForecast";
import BackgroundImage from "../components/BackgroundImage";
import { destinations } from "../data/destinations";
import { hotels } from "../data/hotels";
import { reviews as seedReviews } from "../data/reviews";
import type { Review } from "../types/review";
import "../styles/destination-detail.css";

// Best-season lookup is a simple stand-in. A real version would come from
// the Weather Prediction Service (FR-08) once the backend exists.
const BEST_SEASON_BY_CATEGORY: Record<string, string> = {
  Trekking: "Mar-May, Sep-Nov (clear skies, stable trails)",
  Nature: "Oct-Apr (dry season, best visibility)",
  Heritage: "Year-round (indoor/outdoor mix)",
  Pilgrimage: "Year-round; festival dates draw the biggest crowds",
  Adventure: "Jun-Sep (rain-shadow regions) or Mar-May",
  City: "Sep-Nov, Mar-Apr (mild temperatures)",
};

export default function DestinationDetail() {
  const { id } = useParams<{ id: string }>();
  const destination = destinations.find((d) => d.id === id);

  const [localReviews, setLocalReviews] = useState<Review[]>(
    seedReviews.filter((r) => r.destinationId === id)
  );
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  // A simple incrementing counter for locally-added review IDs. Avoids
  // calling an impure function like Date.now() during the component's
  // render/handler scope (see react-hooks/purity).
  const nextLocalIdRef = useRef(0);

  if (!destination) {
    return (
      <div className="dd-page">
        <Navbar />
        <div className="dd-not-found">
          <h1>Destination not found</h1>
          <Link to="/destinations">← Back to Destinations</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const nearbyHotels = hotels.filter((h) => h.destinationId === destination.id);
  const avgRating =
    localReviews.length > 0
      ? (localReviews.reduce((sum, r) => sum + r.rating, 0) / localReviews.length).toFixed(1)
      : destination.rating.toFixed(1);

  function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!comment.trim()) return;

    // Frontend-only for now (per FR-12, real submission needs an authenticated
    // user and a backend endpoint). This just appends to local state so the
    // review UI is fully demonstrable before the API exists.
    const newReview: Review = {
      id: `local-${nextLocalIdRef.current++}`,
      destinationId: destination!.id,
      authorName: localStorage.getItem("userName") || "You",
      rating,
      comment: comment.trim(),
      date: new Date().toISOString().slice(0, 10),
    };
    setLocalReviews((prev) => [newReview, ...prev]);
    setComment("");
    setRating(5);
    setSubmitted(true);
  }

  return (
    <div className="dd-page">
      <Navbar />

      <section className={`dd-hero dd-hero-${destination.photoClass.replace("photo-", "")}`}>
        {destination.imageUrl && (
          <>
            <BackgroundImage src={destination.imageUrl} className="dd-hero-photo" alt={destination.name} />
            <div className="dd-hero-scrim" />
          </>
        )}
        <CulturalBackdrop variant="dark" />
        <div className="dd-hero-content">
          <Link to="/destinations" className="dd-back-link">← Back to Destinations</Link>
          <h1>{destination.name}</h1>
          <p className="dd-hero-meta">
            {destination.province} · {destination.category} · ★ {avgRating}
          </p>
        </div>
      </section>

      <div className="dd-body">
        <div className="dd-main">
          <section className="dd-section">
            <h2>About</h2>
            <p>{destination.description}</p>
          </section>

          <section className="dd-section">
            <h2>Trip planning basics</h2>
            <div className="dd-info-grid">
              <div className="dd-info-card">
                <p className="dd-info-label">Best season</p>
                <p className="dd-info-value">{BEST_SEASON_BY_CATEGORY[destination.category] || "Year-round"}</p>
              </div>
              <div className="dd-info-card">
                <p className="dd-info-label">Distance from Kathmandu</p>
                <p className="dd-info-value">{destination.distanceKm} km</p>
              </div>
              <div className="dd-info-card">
                <p className="dd-info-label">Category</p>
                <p className="dd-info-value">{destination.category}</p>
              </div>
            </div>
          </section>

          <section className="dd-section">
            <h2>Weather</h2>
            <WeatherForecast destinationName={destination.name} category={destination.category} />
          </section>

          {destination.category === "Trekking" || destination.category === "Adventure" ? (
            <section className="dd-section">
              <h2>Trek information</h2>
              <p>
                Looking for a route through this region? Check{" "}
                <Link to="/treks">Trek Recommendations</Link> for difficulty, permits, and
                equipment lists matched to this area.
              </p>
            </section>
          ) : null}

          {(destination.category === "Heritage" || destination.category === "Pilgrimage") && (
            <section className="dd-section">
              <h2>Heritage information</h2>
              <p>
                This site is part of Nepal's cultural heritage hub — home to living traditions,
                centuries-old architecture, and (for several sites nationwide) UNESCO World
                Heritage status. Respect local customs: dress modestly, ask before photographing
                ceremonies, and follow posted guidance at religious sites.
              </p>
              <Link to="/heritage" className="dd-heritage-link">Visit the full Cultural Heritage Hub →</Link>
            </section>
          )}

          {/* ---- AR/VR Preview (MVP scope per FRD section 4.2) ----
              Honest placeholder: real AR/VR needs device camera/WebXR APIs
              and hosted 3D/360° assets, which are backend/content work, not
              something to fake convincingly on the frontend alone. This
              marks where that entry point will live once ready. */}
          <section className="dd-section">
            <h2>AR/VR Preview</h2>
            <div className="dd-arvr-card">
              <div className="dd-arvr-icon" aria-hidden="true">🥽</div>
              <div>
                <p className="dd-arvr-title">360° preview — coming soon</p>
                <p className="dd-arvr-text">
                  An immersive AR/VR preview of {destination.name} is planned as an MVP feature.
                  This needs hosted 3D/360° content and device camera access, so it isn't built in
                  this frontend-only phase — this card marks where it will appear.
                </p>
              </div>
            </div>
          </section>

          {/* ---- Reviews (FR-12) ---- */}
          <section className="dd-section">
            <h2>Reviews ({localReviews.length})</h2>

            <form className="dd-review-form" onSubmit={handleSubmitReview}>
              <label htmlFor="review-rating" className="dd-review-label">Your rating</label>
              <div className="dd-star-picker" role="radiogroup" aria-label="Rating out of 5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    type="button"
                    key={n}
                    role="radio"
                    aria-checked={rating === n}
                    className={`dd-star ${n <= rating ? "dd-star-filled" : ""}`}
                    onClick={() => setRating(n)}
                  >
                    ★
                  </button>
                ))}
              </div>

              <label htmlFor="review-comment" className="dd-review-label">Your review</label>
              <textarea
                id="review-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share tips for other travelers — what to expect, best time to visit, anything you wish you'd known."
                rows={3}
                maxLength={500}
              />
              <div className="dd-review-form-footer">
                <span className="dd-char-count">{comment.length}/500</span>
                <button type="submit" className="dd-review-submit">Submit review</button>
              </div>
              {submitted && (
                <p className="dd-review-success" role="status">
                  Thanks — your review has been added below. (Note: this is a frontend-only demo;
                  reviews aren't saved once you leave this page.)
                </p>
              )}
            </form>

            <div className="dd-review-list">
              {localReviews.length === 0 ? (
                <p className="dd-no-reviews">No reviews yet — be the first to share your experience.</p>
              ) : (
                localReviews.map((r) => (
                  <div className="dd-review-card" key={r.id}>
                    <div className="dd-review-top">
                      <span className="dd-review-author">{r.authorName}</span>
                      <span className="dd-review-stars">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                    </div>
                    <p className="dd-review-comment">{r.comment}</p>
                    <p className="dd-review-date">{r.date}</p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <aside className="dd-sidebar">
          <div className="dd-sidebar-card">
            <h3>Nearby hotels</h3>
            {nearbyHotels.length === 0 ? (
              <p className="dd-sidebar-empty">No listed hotels for this destination yet.</p>
            ) : (
              nearbyHotels.map((h) => (
                <div className="dd-sidebar-hotel" key={h.id}>
                  <p className="dd-sidebar-hotel-name">{h.name}</p>
                  <p className="dd-sidebar-hotel-price">Rs. {h.pricePerNight.toLocaleString()}/night · ★ {h.rating}</p>
                </div>
              ))
            )}
            <Link to="/hotels" className="dd-sidebar-link">See all hotels →</Link>
          </div>

          <div className="dd-sidebar-card">
            <h3>Plan this trip</h3>
            <p className="dd-sidebar-text">
              Let Yatra build a full itinerary around {destination.name}.
            </p>
            <Link to="/trip-planner" className="dd-sidebar-cta">Open AI Trip Planner</Link>
          </div>
        </aside>
      </div>

      <Footer />
    </div>
  );
}
