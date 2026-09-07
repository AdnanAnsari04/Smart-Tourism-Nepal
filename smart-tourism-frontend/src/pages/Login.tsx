import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { validateEmail } from "../utils/validators";
import { setApiSession, getRole } from "../utils/session";
import { loginRequest, googleLoginRequest } from "../api/auth";
import { ApiError } from "../api/client";
import type { LoginFormData, LoginFormErrors } from "../types/auth";
import "../styles/auth.css";

// Where RequireAuth/RequireRole sent the user from before bouncing them
// here, e.g. { from: { pathname: "/hotels" } }. Falls back to the role's
// dashboard when someone lands on /login directly (typed URL, nav link).
function getRedirectPath(state: unknown, role: "tourist" | "admin"): string {
  const from = (state as { from?: { pathname?: string } } | null)?.from;
  if (from?.pathname && from.pathname !== "/login") {
    return from.pathname;
  }
  return role === "admin" ? "/admin" : "/dashboard";
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  // If someone is already signed in and lands on /login (back button, a
  // stale bookmark, typing the URL directly), send them straight along
  // instead of showing the form again — to wherever they were headed if
  // we know it, otherwise their dashboard.
  useEffect(() => {
    const role = getRole();
    if (role) {
      navigate(getRedirectPath(location.state, role), { replace: true });
    }
    // Only needs to run once on mount; re-checking on every location
    // change would fight with the navigate() calls below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState<{ email: boolean; password: boolean }>({
    email: false,
    password: false,
  });
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<LoginFormErrors>({ email: "", password: "" });
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear the field's error as soon as the user starts fixing it,
    // instead of making them wait for the next submit attempt.
    if (name === "email" && errors.email) {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
    if (name === "password" && errors.password) {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    if (name === "email") {
      setErrors((prev) => ({ ...prev, email: validateEmail(formData.email) }));
    }
    if (name === "password") {
      setErrors((prev) => ({
        ...prev,
        password: formData.password.length === 0 ? "Password is required." : "",
      }));
    }
  }

  function validateForm(): boolean {
    const emailError = validateEmail(formData.email);
    const passwordError = formData.password.length === 0 ? "Password is required." : "";
    setErrors({ email: emailError, password: passwordError });
    setTouched({ email: true, password: true });
    return emailError === "" && passwordError === "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Real backend call (SmartTourism.Api: POST /api/auth/login). Returns
      // the account's actual role — never guessed from the email locally.
      const result = await loginRequest({ email: formData.email, password: formData.password });
      setApiSession(result.user, result.accessToken, result.refreshToken);

      const role = result.user.role.trim().toLowerCase() === "admin" ? "admin" : "tourist";
      navigate(getRedirectPath(location.state, role), { replace: true });
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setFormError("Incorrect email or password. Please try again.");
      } else if (err instanceof ApiError && err.status === 0) {
        setFormError("Couldn't reach the server. Is the backend running?");
      } else {
        setFormError("We couldn't sign you in. Check your details and try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleCredential(idToken: string) {
    setFormError("");
    setIsGoogleLoading(true);
    try {
      // Real backend call (SmartTourism.Api: POST /api/auth/google-login).
      // The backend verifies idToken directly against Google's public keys
      // — nothing here is trusted just because the browser sent it.
      const result = await googleLoginRequest(idToken);
      setApiSession(result.user, result.accessToken, result.refreshToken);

      const role = result.user.role.trim().toLowerCase() === "admin" ? "admin" : "tourist";
      navigate(getRedirectPath(location.state, role), { replace: true });
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setFormError(err.message || "Google sign-in failed. Please try again.");
      } else if (err instanceof ApiError && err.status === 0) {
        setFormError("Couldn't reach the server. Is the backend running?");
      } else {
        setFormError("We couldn't sign you in with Google. Please try again.");
      }
    } finally {
      setIsGoogleLoading(false);
    }
  }

  return (
    <>
      <Link to="/" className="auth-back-home" aria-label="Back to home">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        <span>Back to Yatra</span>
      </Link>

      <AuthLayout title="Welcome back" subtitle="Sign in to keep planning your Nepal journey.">
        <GoogleSignInButton onCredential={handleGoogleCredential} disabled={isGoogleLoading} />
        <div className="auth-divider"><span>or continue with email</span></div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {formError && (
            <p className="auth-form-error" role="alert">
              {formError}
            </p>
          )}

          <label className="auth-label" htmlFor="email">
            Email
          </label>
          <div className="auth-input-wrapper">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className={`auth-input ${touched.email && errors.email ? "auth-input-error" : ""}`}
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="you@example.com"
              aria-invalid={!!(touched.email && errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
          </div>
          {touched.email && errors.email && (
            <p className="auth-error" id="email-error">
              {errors.email}
            </p>
          )}

          <label className="auth-label" htmlFor="password">
            Password
          </label>
          <div className="auth-input-wrapper">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              className={`auth-input auth-input-with-icon ${
                touched.password && errors.password ? "auth-input-error" : ""
              }`}
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="••••••••"
              aria-invalid={!!(touched.password && errors.password)}
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            <button
              type="button"
              className="auth-input-icon-btn"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showPassword ? (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          {touched.password && errors.password && (
            <p className="auth-error" id="password-error">
              {errors.password}
            </p>
          )}

          <div className="auth-row">
            <label className="auth-checkbox-label">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              Remember me
            </label>
            <Link to="/forgot-password" className="auth-link">
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="auth-button" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="auth-button-loading">
                <span className="auth-spinner" aria-hidden="true" />
                Signing in…
              </span>
            ) : (
              "Sign in"
            )}
          </button>

          <p className="auth-footer-text">
            New here?{" "}
            <Link to="/register" className="auth-link">
              Create an account
            </Link>
          </p>
        </form>
      </AuthLayout>
    </>
  );
}