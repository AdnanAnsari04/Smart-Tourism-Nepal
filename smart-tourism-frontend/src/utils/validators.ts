// Each function checks ONE field and returns an error message (string).
// An empty string "" means the field is valid.
// This directly implements the Validation Rules section (VR-01 to VR-06) of the FRD.

// VR-01: Full Name is mandatory, 3–100 characters.
export function validateFullName(value: string): string {
  if (value.trim().length === 0) return "Full name is required.";
  if (value.trim().length < 3) return "Name must be at least 3 characters.";
  if (value.trim().length > 100) return "Name must be under 100 characters.";
  return "";
}

// VR-02: Email is required, must be a valid format.
// (Server checks uniqueness. We can't check that from the browser alone.)
export function validateEmail(value: string): string {
  if (value.trim().length === 0) return "Email is required.";
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(value)) return "Enter a valid email address.";
  return "";
}

// VR-03: Password must have 8+ chars, one uppercase, one lowercase,
// one digit, and one special character.
export function validatePassword(value: string): string {
  if (value.length === 0) return "Password is required.";
  if (value.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(value)) return "Include at least one uppercase letter.";
  if (!/[a-z]/.test(value)) return "Include at least one lowercase letter.";
  if (!/[0-9]/.test(value)) return "Include at least one number.";
  if (!/[^A-Za-z0-9]/.test(value)) return "Include at least one special character.";
  return "";
}

// VR-04: Confirm Password must exactly match Password.
export function validateConfirmPassword(password: string, confirm: string): string {
  if (confirm.length === 0) return "Please confirm your password.";
  if (confirm !== password) return "Passwords do not match.";
  return "";
}

// VR-05: Phone number must be numeric only, within a reasonable length.
export function validatePhoneNumber(value: string): string {
  if (value.trim().length === 0) return "Phone number is required.";
  if (!/^[0-9]{7,15}$/.test(value.trim())) {
    return "Enter a valid phone number (digits only, 7–15 digits).";
  }
  return "";
}

// VR-06: Required field check, used for things like Country.
export function validateRequired(value: string, fieldLabel: string): string {
  if (value.trim().length === 0) return `${fieldLabel} is required.`;
  return "";
}