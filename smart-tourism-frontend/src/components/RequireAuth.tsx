import { Navigate, useLocation } from "react-router-dom";
import type { ReactElement } from "react";
import { isLoggedIn } from "../utils/session";

// Generic "must be logged in" gate, for pages that any authenticated user
// (tourist or admin) can see — Destinations, Hotels, Treks, the map, etc.
// For pages that also need a specific role, use RequireRole instead (it
// already does everything this component does, plus the role check).
//
// We keep the attempted location so a future version could send the user
// back to where they were headed after login, instead of always dropping
// them on the dashboard.
export default function RequireAuth({ children }: { children: ReactElement }) {
  const location = useLocation();

  if (!isLoggedIn()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
