import React from "react";
import CulturalBackdrop from "./CulturalBackdrop";
import "../styles/auth.css";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

// This wraps BOTH the Login and Register pages so they share
// the same background, card style, and branding.
// "children" is whatever form gets passed in from Login.tsx or Register.tsx.
export default function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="auth-page">
      <CulturalBackdrop variant="dark" />
      <div className="auth-mountains" aria-hidden="true" />

      <div className="auth-card">
        {/* Signature element: a horizon bar, sky blue fading into sunset orange */}
        <div className="horizon-bar" aria-hidden="true" />

        <h1 className="auth-title">{title}</h1>
        <p className="auth-subtitle">{subtitle}</p>

        {children}
      </div>
    </div>
  );
}