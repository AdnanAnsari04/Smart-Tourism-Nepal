import { useRef, useEffect, useState } from "react";
import { destinations } from "../data/destinations";
import BackgroundImage from "./BackgroundImage";
import "../styles/carousel.css";

const PAGE_SIZE = 3;
const pages: (typeof destinations)[] = [];
for (let i = 0; i < destinations.length; i += PAGE_SIZE) {
  pages.push(destinations.slice(i, i + PAGE_SIZE));
}

export default function FeaturedCarousel() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [wrapperWidth, setWrapperWidth] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const dragOffset = useRef(0);
  const [liveDragPixels, setLiveDragPixels] = useState(0);
  // Mirrors isDragging.current for use in render (transition style below).
  // The ref itself stays for the synchronous guard checks inside the
  // mouse handlers. Reading a ref's .current during render is what
  // React's react-hooks/refs rule flags, so render reads this instead.
  const [isDraggingState, setIsDraggingState] = useState(false);

  useEffect(() => {
    function measure() {
      if (wrapperRef.current) setWrapperWidth(wrapperRef.current.offsetWidth);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % pages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused]);

  function handleMouseDown(e: React.MouseEvent) {
    isDragging.current = true;
    setIsDraggingState(true);
    startX.current = e.pageX;
    setIsPaused(true);
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!isDragging.current) return;
    dragOffset.current = e.pageX - startX.current;
    setLiveDragPixels(dragOffset.current);
  }

  function endDrag() {
    if (!isDragging.current) return;
    isDragging.current = false;
    setIsDraggingState(false);

    const threshold = wrapperWidth / 4;
    if (dragOffset.current < -threshold && currentPage < pages.length - 1) {
      setCurrentPage((p) => p + 1);
    } else if (dragOffset.current > threshold && currentPage > 0) {
      setCurrentPage((p) => p - 1);
    }
    dragOffset.current = 0;
    setLiveDragPixels(0);
    setIsPaused(false);
  }

  const baseOffset = -currentPage * wrapperWidth;
  const totalOffset = baseOffset + liveDragPixels;

  return (
    <div
      className="carousel-wrapper"
      ref={wrapperRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        endDrag();
        setIsPaused(false);
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={endDrag}
    >
      <div
        className="carousel-track"
        style={{
          transform: `translateX(${totalOffset}px)`,
          transition: isDraggingState ? "none" : "transform 0.5s ease",
        }}
      >
        {pages.map((page, pageIndex) => (
          <div className="carousel-page" key={pageIndex} style={{ width: wrapperWidth }}>
            {page.map((d) => (
              <div className="destination-card" key={d.id}>
                <BackgroundImage
                  src={d.imageUrl}
                  className={`destination-photo ${d.photoClass}`}
                  alt={d.name}
                />
                <div className="destination-body">
                  <h3>{d.name}</h3>
                  <p>{d.province} · {d.description}</p>
                  <span className="destination-tag">★ {d.rating}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="carousel-dots">
        {pages.map((_, index) => (
          <button
            key={index}
            className={`carousel-dot ${index === currentPage ? "active" : ""}`}
            onClick={() => setCurrentPage(index)}
            aria-label={`Go to page ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}