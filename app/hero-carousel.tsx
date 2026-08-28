"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import "./hero-carousel.css";

const slides = [
  {
    name: "Frieren",
    label: "Beyond Journey’s End",
    image: "/media/frieren.webp",
    href: "#projets",
    project: 1,
  },
  {
    name: "Riot MMO",
    label: "Cinematic Web Experience",
    image: "/media/riot.webp",
    href: "#projets",
    project: 2,
  },
  {
    name: "Mad Makers",
    label: "Mon univers créatif",
    image: "/media/mad-makers-current.webp",
    href: "https://www.mad-makers.fr",
    project: null,
  },
];
export default function HeroCarousel({
  quiet,
  onProject,
}: {
  quiet: boolean;
  onProject: (index: number) => void;
}) {
  const [active, setActive] = useState(0);
  const [drag, setDrag] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [hidden, setHidden] = useState(false);
  const region = useRef<HTMLDivElement>(null);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);
  const manual = quiet || reduced;
  const rotating =
    playing &&
    !manual &&
    !hovering &&
    !focused &&
    visible &&
    !hidden &&
    drag === 0;
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener("change", sync);
    const visibility = () => setHidden(document.hidden);
    visibility();
    document.addEventListener("visibilitychange", visibility);
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.2 },
    );
    if (region.current) observer.observe(region.current);
    return () => {
      media.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", visibility);
      observer.disconnect();
    };
  }, []);
  useEffect(() => {
    if (!rotating) return;
    const timer = window.setInterval(
      () => setActive((i) => (i + 1) % slides.length),
      5500,
    );
    return () => window.clearInterval(timer);
  }, [rotating]);
  function select(index: number) {
    setActive((index + slides.length) % slides.length);
    setPlaying(true);
  }
  return (
    <div
      ref={region}
      className="hero-carousel"
      role="region"
      aria-roledescription="carrousel"
      aria-label="Mes créations web"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
          e.preventDefault();
          select(active + (e.key === "ArrowLeft" ? -1 : 1));
        }
      }}
    >
      <div
        className={`carousel-stage${drag !== 0 ? " dragging" : ""}`}
        style={{ translate: `${drag}px 0` }}
        onPointerDown={(e) => {
          if (e.button !== 0) return;
          pointer.current = { x: e.clientX, y: e.clientY };
          swiped.current = false;
        }}
        onPointerMove={(e) => {
          if (!pointer.current) return;
          const dx = e.clientX - pointer.current.x,
            dy = e.clientY - pointer.current.y;
          if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy) * 1.2) {
            swiped.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            setDrag(dx);
          }
        }}
        onPointerCancel={() => {
          pointer.current = null;
          setDrag(0);
        }}
        onPointerUp={(e) => {
          const start = pointer.current;
          pointer.current = null;
          setDrag(0);
          if (e.currentTarget.hasPointerCapture(e.pointerId))
            e.currentTarget.releasePointerCapture(e.pointerId);
          if (!start) return;
          const dx = e.clientX - start.x,
            dy = e.clientY - start.y;
          if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2) {
            swiped.current = true;
            select(active + (dx < 0 ? 1 : -1));
          }
        }}
      >
        {slides.map((slide, index) => {
          const position = (index - active + slides.length) % slides.length;
          const placement =
            position === 0 ? "current" : position === 1 ? "next" : "previous";
          const content = (
            <>
              <span className="carousel-window">
                <span aria-hidden="true">● ● ●</span>
                <span>
                  {slide.name} · {slide.label}
                </span>
                <span aria-hidden="true">↗</span>
              </span>
              <img
                src={slide.image}
                alt={`Aperçu du site ${slide.name}`}
                width="1280"
                height="661"
                draggable={false}
                fetchPriority={index === 0 ? "high" : "auto"}
              />
            </>
          );
          return (
            <div
              key={slide.name}
              className={`carousel-card ${placement}`}
              role="group"
              aria-roledescription="diapositive"
              aria-label={`${index + 1} sur ${slides.length} : ${slide.name}`}
            >
              {position === 0 ? (
                <a
                  href={slide.href}
                  target={slide.project === null ? "_blank" : undefined}
                  rel={slide.project === null ? "noreferrer" : undefined}
                  draggable={false}
                  onClick={(e) => {
                    if (swiped.current) {
                      e.preventDefault();
                      return;
                    }
                    if (slide.project !== null) onProject(slide.project);
                  }}
                  aria-label={`Découvrir ${slide.name}`}
                >
                  {content}
                </a>
              ) : (
                <button
                  onClick={() => {
                    if (!swiped.current) select(index);
                  }}
                  aria-label={`Afficher ${slide.name}`}
                >
                  {content}
                </button>
              )}
            </div>
          );
        })}
      </div>
      <p
        className="carousel-caption"
        aria-live={rotating ? "off" : "polite"}
        aria-atomic="true"
      >
        <span>{String(active + 1).padStart(2, "0")} / 03</span>{" "}
        {slides[active].name} <span>·</span> {slides[active].label}
      </p>
    </div>
  );
}
