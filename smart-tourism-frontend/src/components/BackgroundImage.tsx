import { useEffect, useState } from "react";
import type { ReactNode } from "react";

interface BackgroundImageProps {
  /** Remote photo URL. Optional — records without one just show className's fallback. */
  src?: string;
  /** Always applied. Should carry a fallback background (see photo-* classes in each stylesheet). */
  className: string;
  /** Descriptive text for the photo, exposed to assistive tech via role="img". */
  alt: string;
  children?: ReactNode;
}

/**
 * Card/hero background photo with a verified-load fallback.
 *
 * The destination/hotel/trek photo classes (photo-nature, photo-heritage, ...)
 * each carry a themed gradient in CSS so there's always something to show
 * before a photo loads or if a record has no imageUrl. The problem: setting
 * `backgroundImage` as an inline style wins over that class's background
 * even when the URL 404s or the host is unreachable, so a broken photo used
 * to leave the card blank instead of falling back to the gradient.
 *
 * This preloads the image with a plain `Image()` and only applies the
 * inline background once `onload` actually fires; on `onerror` (or no src)
 * it leaves the inline style unset so the CSS class's background shows
 * through — the same fallback a missing imageUrl already gets.
 */
export default function BackgroundImage({ src, className, alt, children }: BackgroundImageProps) {
  const [loadedSrc, setLoadedSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    setLoadedSrc(undefined);
    if (!src) return;

    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (!cancelled) setLoadedSrc(src);
    };
    img.onerror = () => {
      if (!cancelled) setLoadedSrc(undefined);
    };
    img.src = src;

    return () => {
      cancelled = true;
    };
  }, [src]);

  return (
    <div
      className={className}
      role="img"
      aria-label={alt}
      style={loadedSrc ? { backgroundImage: `url("${loadedSrc}")` } : undefined}
    >
      {children}
    </div>
  );
}
