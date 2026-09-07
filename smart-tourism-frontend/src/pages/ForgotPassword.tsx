import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { validateEmail, validatePassword, validateConfirmPassword } from "../utils/validators";
import "../styles/auth.css";

// Three-step reset flow: request a code, verify the code, set a new
// password. No email is actually sent and no code is actually checked
// against anything real — this mocks the shape of a real flow (see the
// comments at each step) so the UI is fully built ahead of the backend's
// Notification and Auth services.
type Step = "email" | "code" | "newPassword" | "done";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("email");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    const error = validateEmail(email);
    setEmailError(error);
    if (error) return;

    setIsSubmitting(true);
    try {
      // A real backend would generate a one-time code, store it against
      // this account with a short expiry, and email it via the
      // Notification Service. Simulated here with a delay only.
      await new Promise((resolve) => setTimeout(resolve, 800));
      setStep("code");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    if (code.trim().length !== 6 || !/^\d{6}$/.test(code.trim())) {
      setCodeError("Enter the 6-digit code we sent.");
      return;
    }
    setCodeError("");

    setIsSubmitting(true);
    try {
      // A real backend checks the submitted code against the stored one
      // and its expiry. Any 6-digit code is accepted here since there's
      // no real code to check against.
      await new Promise((resolve) => setTimeout(resolve, 600));
      setStep("newPassword");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSetPassword(e: React.FormEvent) {
    e.preventDefault();
    const pwError = validatePassword(password);
    const confirmErr = validateConfirmPassword(password, confirmPassword);
    setPasswordError(pwError);
    setConfirmError(confirmErr);
    if (pwError || confirmErr) return;

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setStep("done");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (step === "done") {
    return (
      <AuthLayout title="Password reset" subtitle="Sign in with your new password to continue.">
        <button type="button" className="auth-button auth-button-link" onClick={() => navigate("/login")}>
          Continue to sign in
        </button>
      </AuthLayout>
    );
  }

  if (step === "newPassword") {
    return (
      <AuthLayout title="Set a new password" subtitle={`Choose a new password for ${email}.`}>
        <form className="auth-form" onSubmit={handleSetPassword} noValidate>
          <label className="auth-label" htmlFor="new-password">New password</label>
          <input
            id="new-password"
            type="password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          {passwordError && <p className="auth-error">{passwordError}</p>}

          <label className="auth-label" htmlFor="confirm-password">Confirm new password</label>
          <input
            id="confirm-password"
            type="password"
            className="auth-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
          />
          {confirmError && <p className="auth-error">{confirmError}</p>}

          <button type="submit" className="auth-button" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Reset password"}
          </button>
        </form>
      </AuthLayout>
    );
  }

  if (step === "code") {
    return (
      <AuthLayout
        title="Enter the code"
        subtitle={`We sent a 6-digit code to ${email}. It expires in 10 minutes.`}
      >
        <form className="auth-form" onSubmit={handleVerifyCode} noValidate>
          <label className="auth-label" htmlFor="reset-code">Verification code</label>
          <input
            id="reset-code"
            type="text"
            inputMode="numeric"
            maxLength={6}
            className="auth-input auth-code-input"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            placeholder="123456"
          />
          {codeError && <p className="auth-error">{codeError}</p>}

          <button type="submit" className="auth-button" disabled={isSubmitting}>
            {isSubmitting ? "Verifying…" : "Verify code"}
          </button>
          <button type="button" className="auth-link auth-resend" onClick={() => setStep("email")}>
            Use a different email
          </button>
        </form>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot password?"
      subtitle="Enter the email on your account and we'll send you a code to reset your password."
    >
      <form className="auth-form" onSubmit={handleSendCode} noValidate>
        <label className="auth-label" htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          className="auth-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        {emailError && <p className="auth-error">{emailError}</p>}

        <button type="submit" className="auth-button" disabled={isSubmitting}>
          {isSubmitting ? "Sending…" : "Send code"}
        </button>

        <p className="auth-footer-text">
          Remembered it?{" "}
          <Link to="/login" className="auth-link">Back to sign in</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
