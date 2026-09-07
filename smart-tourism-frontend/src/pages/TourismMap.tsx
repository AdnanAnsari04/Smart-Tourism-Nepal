import { useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { destinations } from "../data/destinations";
import { categories } from "../data/categories";
import "leaflet/dist/leaflet.css";
import "../styles/tourism-map.css";

// Interactive Tourism Map. GIS-based location services, per the FRD's
// in-scope list (section 4.1) and the "Interactive Tourism Map" module in
// the Functional Overview (5.1). Built with Leaflet + OpenStreetMap tiles,
// which needs no API key and no backend. Real map data, frontend-only.

// Leaflet's default marker icons reference image files by URL in a way that
// breaks under bundlers like Vite. We replace them with a small inline SVG
// pin instead, colored per category using the same tokens as the rest of
// the site.
const CATEGORY_COLORS: Record<string, string> = {
  Trekking: "#2aa8e0",
  Nature: "#7ac97a",
  Heritage: "#ff8f66",
  Pilgrimage: "#c98fe0",
  Adventure: "#6ac9e0",
  City: "#ffb84d",
};

function makeIcon(category: string) {
  const color = CATEGORY_COLORS[category] || "#ff6b45";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="34" viewBox="0 0 26 34">
    <path d="M13 0C5.8 0 0 5.8 0 13c0 9.75 13 21 13 21s13-11.25 13-21C26 5.8 20.2 0 13 0z" fill="${color}" stroke="#123b57" stroke-width="1.5"/>
    <circle cx="13" cy="13" r="5" fill="#ffffff"/>
  </svg>`;
  return L.divIcon({
    html: svg,
    className: "tourism-map-pin",
    iconSize: [26, 34],
    iconAnchor: [13, 34],
    popupAnchor: [0, -30],
  });
}

const CATEGORIES = ["All Categories", ...categories.map((c) => c.id)];

// Recenters the map when the category filter changes, without remounting
// the whole MapContainer (which would reset zoom/pan state unnecessarily).
function MapRecenter({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

export default function TourismMap() {
  const [category, setCategory] = useState("All Categories");

  const filtered = useMemo(
    () => destinations.filter((d) => category === "All Categories" || d.category === category),
    [category]
  );

  // Nepal's rough geographic center, used as the default view.
  const nepalCenter: [number, number] = [28.3949, 84.124];

  return (
    <div className="map-page">
      <Navbar />

      <section className="map-hero">
        <h1>Interactive Tourism Map</h1>
        <p>Every destination on the platform, plotted across Nepal — filter by category and click a pin to explore.</p>

        <div className="map-filter-row">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={`map-filter-pill ${category === c ? "is-active" : ""}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <div className="map-container-wrap">
        <MapContainer center={nepalCenter} zoom={7} scrollWheelZoom className="map-leaflet">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapRecenter center={nepalCenter} />
          {filtered.map((d) => (
            <Marker key={d.id} position={[d.lat, d.lng]} icon={makeIcon(d.category)}>
              <Popup>
                <div className="map-popup">
                  <p className="map-popup-category">{d.category}</p>
                  <p className="map-popup-name">{d.name}</p>
                  <p className="map-popup-province">{d.province} · ★ {d.rating}</p>
                  <Link to={`/destinations/${d.id}`} className="map-popup-link">View details →</Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <p className="map-attribution-note">
        {filtered.length} location{filtered.length !== 1 ? "s" : ""} shown · Map data ©{" "}
        <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors
      </p>

      <Footer />
    </div>
  );
}
