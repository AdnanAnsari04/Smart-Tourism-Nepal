import { useEffect, useRef, useState } from "react";

interface GoogleSignInButtonProps {
  // Called with the raw Google ID token once the person picks an account.
  // The parent (Login.tsx) is responsible for sending it to the backend.
  onCredential: (idToken: string) => void;
  disabled?: boolean;
}

const GOOGLE_CLIENT_ID: string | undefined = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

// Real "Continue with Google" using Google Identity Services (loaded via the
// <script> tag in index.html — see src/types/google.d.ts for its ambient
// types). Google requires using their own rendered button rather than a
// custom-styled lookalike that triggers the flow programmatically, both for
// reliability (browser popup/FedCM permissions are tied to their button)
// and their branding guidelines — renderButton() below is themeable enough
// to fit reasonably well next to the rest of the form.
export default function GoogleSignInButton({ onCredential, disabled }: GoogleSignInButtonProps) {
  const buttonHostRef = useRef<HTMLDivElement>(null);
  const [sdkError, setSdkError] = useState(false);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      // Not configured — fail quietly with a helpful inline message rather
      // than a broken/invisible button. See smart-tourism-frontend/.env.
      setSdkError(true);
      return;
    }

    // The SDK script loads asynchronously (async/defer in index.html), so
    // window.google may not exist yet on first render. Poll briefly rather
    // than assuming it's ready.
    let attempts = 0;
    const maxAttempts = 50; // ~5 seconds at 100ms intervals

    const tryInitialize = () => {
      attempts += 1;

      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => onCredential(response.credential),
          cancel_on_tap_outside: true,
        });

        if (buttonHostRef.current) {
          buttonHostRef.current.innerHTML = ""; // clear on re-render/strict-mode double-invoke
          window.google.accounts.id.renderButton(buttonHostRef.current, {
            type: "standard",
            theme: "outline",
            size: "large",
            text: "continue_with",
            shape: "pill",
            width: 400 ,
            logo_alignment: "center",
          });
        }
        return;
      }

      if (attempts < maxAttempts) {
        setTimeout(tryInitialize, 100);
      } else {
        setSdkError(true);
      }
    };

    tryInitialize();
    // onCredential is expected to be stable (defined once in Login.tsx); if
    // it isn't, re-running this effect would re-render Google's button,
    // which is harmless but unnecessary.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (sdkError) {
    return (
      <p className="auth-form-error" role="alert">
        {GOOGLE_CLIENT_ID
          ? "Couldn't load Google Sign-In. Check your internet connection and try again."
          : "Google Sign-In isn't configured yet (missing VITE_GOOGLE_CLIENT_ID)."}
      </p>
    );
  }

  return <div ref={buttonHostRef} aria-disabled={disabled} style={{ opacity: disabled ? 0.6 : 1, pointerEvents: disabled ? "none" : "auto" }} />;
}
