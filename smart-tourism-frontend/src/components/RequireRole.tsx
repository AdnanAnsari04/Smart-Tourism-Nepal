import { Navigate, useLocation } from "react-router-dom";
import type { ReactElement } from "react";
import { getRole, type UserRole } from "../utils/session";

interface RequireRoleProps {
  role?: UserRole;
  children: ReactElement;
}

export default function RequireRole({ role, children }: RequireRoleProps) {
  const current = getRole();
  const location = useLocation();

  if (!current) {
    // Same "remember where they were headed" behavior as RequireAuth, so
    // role-gated pages (dashboard, profile, bookings, ...) also send the
    // user back to what they clicked after they log in.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && current !== role) {
    return <Navigate to={current === "admin" ? "/admin" : "/dashboard"} replace />;
  }

  return children;
}
