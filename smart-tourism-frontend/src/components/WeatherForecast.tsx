import "../styles/weather.css";

// FR-08: Seven-Day Forecast, Severe Weather Alert, Trekking Recommendation.
// Frontend-only mock. The real version integrates OpenWeather (per the
// FRD's Integration Requirements) plus ML-based route-level corrections.
// Deterministic mock data, seeded by destination name, so the same
// destination always shows the same forecast rather than random noise.
interface DayForecast {
  day: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
}

const CONDITIONS: { condition: string; icon: string }[] = [
  { condition: "Clear", icon: "☀️" },
  { condition: "Partly cloudy", icon: "⛅" },
  { condition: "Light rain", icon: "🌦️" },
  { condition: "Cloudy", icon: "☁️" },
  { condition: "Light snow", icon: "🌨️" },
];

function seedFromName(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) % 1000;
  return hash;
}

function buildForecast(destinationName: string, baseHigh: number, baseLow: number): DayForecast[] {
  const seed = seedFromName(destinationName);
  const days = ["Today", "Tomorrow", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map((day, i) => {
    const variance = ((seed + i * 37) % 7) - 3;
    const condIndex = (seed + i * 13) % CONDITIONS.length;
    return {
      day,
      high: baseHigh + variance,
      low: baseLow + variance,
      ...CONDITIONS[condIndex],
    };
  });
}

interface WeatherForecastProps {
  destinationName: string;
  category: string;
}

export default function WeatherForecast({ destinationName, category }: WeatherForecastProps) {
  // Rough base temps by category. A real version comes from the Weather
  // Service's route-level data, not a category guess.
  const baseHigh = category === "Trekking" || category === "Adventure" ? 12 : 24;
  const baseLow = category === "Trekking" || category === "Adventure" ? -2 : 14;
  const forecast = buildForecast(destinationName, baseHigh, baseLow);
  const seed = seedFromName(destinationName);
  const hasSevereAlert = seed % 5 === 0 && (category === "Trekking" || category === "Adventure");

  return (
    <div className="weather-card">
      <div className="weather-header">
        <h3>7-Day Forecast</h3>
        <p className="weather-subtitle">{destinationName}</p>
      </div>

      {hasSevereAlert && (
        <div className="weather-alert" role="alert">
          <span className="weather-alert-icon">⚠️</span>
          <div>
            <p className="weather-alert-title">Severe weather alert</p>
            <p className="weather-alert-text">
              Snow expected mid-week — check trail conditions before departing and carry
              appropriate gear.
            </p>
          </div>
        </div>
      )}

      <div className="weather-days">
        {forecast.map((d) => (
          <div className="weather-day" key={d.day}>
            <p className="weather-day-label">{d.day}</p>
            <p className="weather-day-icon" aria-hidden="true">{d.icon}</p>
            <p className="weather-day-temps">
              <span className="weather-high">{d.high}°</span>
              <span className="weather-low">{d.low}°</span>
            </p>
            <p className="weather-day-condition">{d.condition}</p>
          </div>
        ))}
      </div>

      {(category === "Trekking" || category === "Adventure") && (
        <p className="weather-trek-note">
          {hasSevereAlert
            ? "Trekking recommendation: consider postponing outdoor activity until conditions clear."
            : "Trekking recommendation: conditions look favorable for outdoor activity this week."}
        </p>
      )}
    </div>
  );
}
