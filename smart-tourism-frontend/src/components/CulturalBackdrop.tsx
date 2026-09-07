import culturalPattern from "../assets/cultural-pattern.svg";

// A very subtle, tileable background motif. Distant mountains, a pagoda
// roofline, and a string of prayer flags. Used behind page content to give
// pages a sense of place without competing with real content or photos.
// aria-hidden because it's purely decorative.
export default function CulturalBackdrop({ variant = "light" }: { variant?: "light" | "dark" }) {
  return (
    <div
      className={`cultural-backdrop cultural-backdrop-${variant}`}
      aria-hidden="true"
      style={{ backgroundImage: `url("${culturalPattern}")` }}
    />
  );
}
