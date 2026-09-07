import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import {
  validateFullName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validatePhoneNumber,
  validateRequired,
} from "../utils/validators";
import { getRole, setApiSession } from "../utils/session";
import { registerRequest } from "../api/auth";
import { ApiError } from "../api/client";
import type { RegisterFormData, RegisterFormErrors } from "../types/auth";
import "../styles/auth.css";

const emptyErrors: RegisterFormErrors = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  phoneNumber: "",
  country: "",
};

type TouchedFields = Record<keyof RegisterFormErrors, boolean>;

const emptyTouched: TouchedFields = {
  fullName: false,
  email: false,
  password: false,
  confirmPassword: false,
  phoneNumber: false,
  country: false,
};

// Re-runs just one field's validator, so onBlur can check a single
// field without re-validating everything else.
function validateField(name: keyof RegisterFormErrors, data: RegisterFormData): string {
  switch (name) {
    case "fullName":
      return validateFullName(data.fullName);
    case "email":
      return validateEmail(data.email);
    case "password":
      return validatePassword(data.password);
    case "confirmPassword":
      return validateConfirmPassword(data.password, data.confirmPassword);
    case "phoneNumber":
      return validatePhoneNumber(data.phoneNumber);
    case "country":
      return validateRequired(data.country, "Country");
    default:
      return "";
  }
}

export default function Register() {
  const navigate = useNavigate();

  // Already signed in? Don't show the registration form again.
  useEffect(() => {
    const role = getRole();
    if (role) {
      navigate(role === "admin" ? "/admin" : "/dashboard", { replace: true });
    }
  }, [navigate]);

  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    country: "",
  });

  const [errors, setErrors] = useState<RegisterFormErrors>(emptyErrors);
  const [touched, setTouched] = useState<TouchedFields>(emptyTouched);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear a field's error as soon as the user edits it, rather than
    // making them wait for the next submit attempt to see it clear.
    const fieldName = name as keyof RegisterFormErrors;
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: "" }));
    }
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    const name = e.target.name as keyof RegisterFormErrors;
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Confirm-password depends on password, so re-check it too whenever
    // either field is touched — otherwise "confirm" can go stale.
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, formData),
      ...(name === "password"
        ? { confirmPassword: formData.confirmPassword ? validateField("confirmPassword", formData) : prev.confirmPassword }
        : {}),
    }));
  }

  // Runs every VR rule from the FRD against the current form data.
  function validateForm(): boolean {
    const newErrors: RegisterFormErrors = {
      fullName: validateFullName(formData.fullName),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.password, formData.confirmPassword),
      phoneNumber: validatePhoneNumber(formData.phoneNumber),
      country: validateRequired(formData.country, "Country"),
    };
    setErrors(newErrors);
    setTouched({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true,
      phoneNumber: true,
      country: true,
    });
    // Valid only if every field's error message is empty.
    return Object.values(newErrors).every((msg) => msg === "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Real backend call (SmartTourism.Api: POST /api/auth/register).
      // Registration signs the account in immediately and returns tokens
      // just like login does, so we store the session the same way.
      const result = await registerRequest(formData);
      setApiSession(result.user, result.accessToken, result.refreshToken);

      sessionStorage.setItem("verificationEmail", formData.email);
      navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`);
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setFormError("An account with this email already exists. Try signing in instead.");
      } else if (err instanceof ApiError && err.status === 400 && err.fieldErrors) {
        // Surface the backend's field-level validation messages (e.g. password
        // rules) onto the same fields the frontend already validates locally.
        setErrors((prev) => ({
          ...prev,
          ...Object.fromEntries(
            Object.entries(err.fieldErrors!).map(([field, messages]) => [
              field.charAt(0).toLowerCase() + field.slice(1),
              messages[0],
            ])
          ),
        }));
      } else if (err instanceof ApiError && err.status === 0) {
        setFormError("Couldn't reach the server. Is the backend running?");
      } else {
        setFormError("We couldn't create your account. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
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

      <AuthLayout title="Create your account" subtitle="Plan smarter trips across Nepal with AI.">
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {formError && (
            <p className="auth-form-error" role="alert">
              {formError}
            </p>
          )}

          <label className="auth-label" htmlFor="fullName">
            Full Name
          </label>
          <div className="auth-input-wrapper">
            <input
              id="fullName"
              name="fullName"
              autoComplete="name"
              className={`auth-input ${touched.fullName && errors.fullName ? "auth-input-error" : ""}`}
              value={formData.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Sita Rai"
              aria-invalid={!!(touched.fullName && errors.fullName)}
              aria-describedby={errors.fullName ? "fullName-error" : undefined}
            />
          </div>
          {touched.fullName && errors.fullName && (
            <p className="auth-error" id="fullName-error">
              {errors.fullName}
            </p>
          )}

          <label className="auth-label" htmlFor="email">
            Email Address
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

          <label className="auth-label" htmlFor="phoneNumber">
            Phone Number
          </label>
          <div className="auth-input-wrapper">
            <input
              id="phoneNumber"
              name="phoneNumber"
              autoComplete="tel"
              className={`auth-input ${touched.phoneNumber && errors.phoneNumber ? "auth-input-error" : ""}`}
              value={formData.phoneNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="98XXXXXXXX"
              aria-invalid={!!(touched.phoneNumber && errors.phoneNumber)}
              aria-describedby={errors.phoneNumber ? "phoneNumber-error" : undefined}
            />
          </div>
          {touched.phoneNumber && errors.phoneNumber && (
            <p className="auth-error" id="phoneNumber-error">
              {errors.phoneNumber}
            </p>
          )}

          <label className="auth-label" htmlFor="country">
            Country
          </label>
          <div className="auth-input-wrapper">
            <input
              id="country"
              name="country"
              autoComplete="country-name"
              className={`auth-input ${touched.country && errors.country ? "auth-input-error" : ""}`}
              value={formData.country}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Nepal"
              aria-invalid={!!(touched.country && errors.country)}
              aria-describedby={errors.country ? "country-error" : undefined}
            />
          </div>
          {touched.country && errors.country && (
            <p className="auth-error" id="country-error">
              {errors.country}
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
              autoComplete="new-password"
              className={`auth-input auth-input-with-icon ${
                touched.password && errors.password ? "auth-input-error" : ""
              }`}
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="At least 8 characters"
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
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

          <label className="auth-label" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <div className="auth-input-wrapper">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              className={`auth-input auth-input-with-icon ${
                touched.confirmPassword && errors.confirmPassword ? "auth-input-error" : ""
              }`}
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Re-enter your password"
              aria-invalid={!!(touched.confirmPassword && errors.confirmPassword)}
              aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
            />
            <button
              type="button"
              className="auth-input-icon-btn"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showConfirmPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          {touched.confirmPassword && errors.confirmPassword && (
            <p className="auth-error" id="confirmPassword-error">
              {errors.confirmPassword}
            </p>
          )}

          <button type="submit" className="auth-button" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="auth-button-loading">
                <span className="auth-spinner" aria-hidden="true" />
                Creating account…
              </span>
            ) : (
              "Create account"
            )}
          </button>

          <p className="auth-footer-text">
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Sign in
            </Link>
          </p>
        </form>
      </AuthLayout>
    </>
  );
}