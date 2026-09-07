import { useState, useMemo, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CulturalBackdrop from "../components/CulturalBackdrop";
import { hotels } from "../data/hotels";
import { provinces } from "../data/provinces";
import BackgroundImage from "../components/BackgroundImage";
import "../styles/hotels.css";

const PROVINCES = ["All Provinces", ...provinces.map((p) => p.name)];
const SORTS = ["Recommended", "Price: Low to High", "Price: High to Low", "Rating"];

// Real destination names already used in our hotel data. Shown as
// "trending" suggestions in the destination dropdown, matching the
// Booking.com-style search bar's autocomplete pattern.
const TRENDING_DESTINATIONS = [
  { name: "Kathmandu", province: "Bagmati" },
  { name: "Pokhara", province: "Gandaki" },
  { name: "Chitwan National Park", province: "Bagmati" },
  { name: "Lumbini", province: "Lumbini" },
  { name: "Nagarkot", province: "Bagmati" },
  { name: "Everest Base Camp Region", province: "Koshi" },
];

function todayISO() {
  return new Date().toISOString().split("T")[0];
}
function addDaysISO(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

function BedIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 18v-6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v6" />
      <path d="M2 18v2M22 18v2M2 12V8a2 2 0 0 1 2-2h5v6" />
      <circle cx="6" cy="9" r="1.2" />
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 10h18" />
    </svg>
  );
}
function PersonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s7-6.4 7-12a7 7 0 1 0-14 0c0 5.6 7 12 7 12z" />
      <circle cx="12" cy="9" r="2.3" />
    </svg>
  );
}

function Stepper({ value, onChange, min = 0 }: { value: number; onChange: (v: number) => void; min?: number }) {
  return (
    <div className="occ-stepper">
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label="Decrease">−</button>
      <span>{value}</span>
      <button type="button" onClick={() => onChange(value + 1)} aria-label="Increase">+</button>
    </div>
  );
}

export default function Hotels() {
  // ---- Booking.com-style search bar state ----
  const [destination, setDestination] = useState("");
  const [destOpen, setDestOpen] = useState(false);
  const [checkIn, setCheckIn] = useState(todayISO());
  const [checkOut, setCheckOut] = useState(addDaysISO(2));
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [occOpen, setOccOpen] = useState(false);

  const destRef = useRef<HTMLDivElement>(null);
  const occRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (destRef.current && !destRef.current.contains(e.target as Node)) setDestOpen(false);
      if (occRef.current && !occRef.current.contains(e.target as Node)) setOccOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ---- Secondary filters (province, price, sort). Applied to results ----
  const [province, setProvince] = useState("All Provinces");
  const [maxPrice, setMaxPrice] = useState(15000);
  const [sort, setSort] = useState("Recommended");
  const [bookedId, setBookedId] = useState<string | null>(null);

  const nights = useMemo(() => {
    const diff = Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000);
    return Math.max(1, diff);
  }, [checkIn, checkOut]);

  const filtered = useMemo(() => {
    let list = hotels.filter((h) => {
      const matchesDestination =
        h.name.toLowerCase().includes(destination.toLowerCase()) ||
        h.destinationName.toLowerCase().includes(destination.toLowerCase());
      const matchesProvince = province === "All Provinces" || h.province === province;
      const matchesPrice = h.pricePerNight <= maxPrice;
      return matchesDestination && matchesProvince && matchesPrice;
    });

    if (sort === "Price: Low to High") list = [...list].sort((a, b) => a.pricePerNight - b.pricePerNight);
    if (sort === "Price: High to Low") list = [...list].sort((a, b) => b.pricePerNight - a.pricePerNight);
    if (sort === "Rating") list = [...list].sort((a, b) => b.rating - a.rating);

    return list;
  }, [destination, province, maxPrice, sort]);

  function handleBook(id: string) {
    // Frontend-only mock. FR-10 (Booking Management) needs a backend and
    // payment integration, which is out of scope for this phase.
    setBookedId(id);
    setTimeout(() => setBookedId(null), 3000);
  }

  return (
    <div className="hotels-page">
      <CulturalBackdrop variant="light" />
      <Navbar />

      <section className="hotels-hero">
        <h1>Find your stay across Nepal</h1>
        <p>Search hotels, lodges, and homestays — from lakeside resorts to Himalayan teahouses.</p>
      </section>

      {/* ---- Booking.com-style search bar ---- */}
      <div className="booking-searchbar-wrap">
        <div className="booking-searchbar">
          <div className="booking-seg booking-seg-dest" ref={destRef}>
            <BedIcon />
            <div className="booking-seg-body">
              <label htmlFor="dest-input">Destination</label>
              <input
                id="dest-input"
                type="text"
                placeholder="Where are you going?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                onFocus={() => setDestOpen(true)}
                autoComplete="off"
              />
            </div>
            {destOpen && (
              <div className="booking-dest-dropdown">
                <p className="booking-dropdown-label">Trending destinations</p>
                {TRENDING_DESTINATIONS.filter((t) =>
                  t.name.toLowerCase().includes(destination.toLowerCase())
                ).map((t) => (
                  <button
                    type="button"
                    key={t.name}
                    className="booking-dest-option"
                    onClick={() => {
                      setDestination(t.name);
                      setDestOpen(false);
                    }}
                  >
                    <PinIcon />
                    <span>
                      <strong>{t.name}</strong>
                      <em>{t.province}, Nepal</em>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="booking-seg booking-seg-dates">
            <CalendarIcon />
            <div className="booking-seg-body">
              <label htmlFor="check-in-input">Check-in — Check-out</label>
              <div className="booking-date-inputs">
                <input
                  id="check-in-input"
                  type="date"
                  value={checkIn}
                  min={todayISO()}
                  onChange={(e) => setCheckIn(e.target.value)}
                />
                <span aria-hidden="true">—</span>
                <label htmlFor="check-out-input" className="visually-hidden">Check-out date</label>
                <input
                  id="check-out-input"
                  type="date"
                  value={checkOut}
                  min={checkIn}
                  onChange={(e) => setCheckOut(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="booking-seg booking-seg-occupancy" ref={occRef}>
            <PersonIcon />
            <button
              type="button"
              className="booking-seg-body booking-occ-trigger"
              onClick={() => setOccOpen((o) => !o)}
              aria-expanded={occOpen}
            >
              <span className="booking-occ-label">Occupancy</span>
              <span className="booking-occ-value">
                {adults} adult{adults !== 1 ? "s" : ""} · {children} child{children !== 1 ? "ren" : ""} · {rooms} room{rooms !== 1 ? "s" : ""}
              </span>
            </button>
            {occOpen && (
              <div className="booking-occ-dropdown">
                <div className="occ-row">
                  <span>Adults</span>
                  <Stepper value={adults} onChange={setAdults} min={1} />
                </div>
                <div className="occ-row">
                  <span>Children</span>
                  <Stepper value={children} onChange={setChildren} min={0} />
                </div>
                <div className="occ-row">
                  <span>Rooms</span>
                  <Stepper value={rooms} onChange={setRooms} min={1} />
                </div>
                <button type="button" className="occ-done-btn" onClick={() => setOccOpen(false)}>
                  Done
                </button>
              </div>
            )}
          </div>

          <button type="button" className="booking-search-btn">
            Search
          </button>
        </div>
      </div>

      {/* ---- Secondary filters ---- */}
      <div className="hotels-secondary-filters">
        <label htmlFor="hotel-province" className="visually-hidden">Filter by province</label>
        <select id="hotel-province" value={province} onChange={(e) => setProvince(e.target.value)}>
          {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>

        <label htmlFor="hotel-sort" className="visually-hidden">Sort</label>
        <select id="hotel-sort" value={sort} onChange={(e) => setSort(e.target.value)}>
          {SORTS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <div className="hotels-price-filter">
          <label htmlFor="hotel-max-price">Max price: Rs. {maxPrice.toLocaleString()}/night</label>
          <input
            id="hotel-max-price"
            type="range"
            min={1500}
            max={15000}
            step={500}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="hotels-results-bar">
        <p>{filtered.length} hotel{filtered.length !== 1 ? "s" : ""} found · {nights} night{nights !== 1 ? "s" : ""} · {adults + children} guest{adults + children !== 1 ? "s" : ""}</p>
      </div>

      {filtered.length === 0 ? (
        <p className="hotels-empty">No hotels match your filters — try widening your budget or clearing the destination.</p>
      ) : (
        <div className="hotels-grid">
          {filtered.map((h) => (
            <div className="hotel-card" key={h.id}>
              <BackgroundImage src={h.imageUrl} className={`hotel-photo ${h.photoClass}`} alt={h.name} />
              <div className="hotel-body">
                <div className="hotel-top-row">
                  <h3>{h.name}</h3>
                  <span className="hotel-rating">★ {h.rating}</span>
                </div>
                <p className="hotel-location">{h.destinationName} · {h.province}</p>
                <div className="hotel-amenities">
                  {h.amenities.slice(0, 3).map((a) => (
                    <span key={a} className="hotel-amenity-pill">{a}</span>
                  ))}
                </div>
                <div className="hotel-footer">
                  <div>
                    <p className="hotel-price">
                      Rs. {(h.pricePerNight * nights).toLocaleString()}
                      <span> total · {nights} night{nights !== 1 ? "s" : ""}</span>
                    </p>
                    <p className="hotel-availability">{h.availableRooms} rooms left</p>
                  </div>
                  <button
                    className="hotel-book-btn"
                    onClick={() => handleBook(h.id)}
                    disabled={bookedId === h.id}
                  >
                    {bookedId === h.id ? "Requested ✓" : "Book"}
                  </button>
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
