import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import "../styles/auth.css";

// FR-01: "An email verification link is generated and sent to the user's
// registered email address" and the account "remains inactive until email
// verification is completed." Frontend-only: this simulates the two states
// (pending / verified) without a real email send, so the flow is visible
// and testable ahead of the backend.
export default function VerifyEmail() {
  const [params] = useSearchParams();
  const email = params.get("email") || sessionStorage.getItem("verificationEmail") || "your email";
  const [isVerified, setIsVerified] = useState(false);
  const [resent, setResent] = useState(false);

  if (isVerified) {
    return (
      <AuthLayout title="Email verified" subtitle="Your account is ready. Sign in to start planning your Nepal trip.">
        <Link to="/login" className="auth-button auth-button-link">
          Continue to sign in
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Verify your email"
      subtitle={`We've sent a verification link to ${email}. This frontend preview keeps the step visible until the real email service is connected.`}
    >
      <div className="auth-form">
        <button type="button" className="auth-button" onClick={() => setIsVerified(true)}>
          Confirm email
        </button>
        <button type="button" className="auth-link auth-resend" onClick={() => setResent(true)}>
          Resend verification email
        </button>
        {resent && <p className="auth-success">A new verification email would be sent here once the backend is connected.</p>}
        <p className="auth-footer-text">
          <Link to="/login" className="auth-link">Back to sign in</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
