"use client";
import { useEffect, useRef, useState } from "react";

export type Chapter = { id: string; label: string };

// Durée fictive du « film » : la page entière dure 3 minutes à 24 images/s.
const RUNTIME_S = 180;
const FPS = 24;
const pad = (n: number) => String(n).padStart(2, "0");
function timecode(p: number) {
  const frames = Math.round(p * RUNTIME_S * FPS);
  const f = frames % FPS;
  const s = Math.floor(frames / FPS);
  return `00:${pad(Math.floor(s / 60))}:${pad(s % 60)}:${pad(f)}`;
}

export default function Scrubber({
  chapters,
  quiet,
  onQuiet,
}: {
  chapters: Chapter[];
  quiet: boolean;
  onQuiet: () => void;
}) {
  const [active, setActive] = useState(0);
  const [spans, setSpans] = useState<number[]>(() => chapters.map(() => 1));
  const tc = useRef<HTMLSpanElement>(null);
  const fill = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let tops: number[] = [];
    let max = 1;
    let frame = 0;
    let last = -1;
    const measure = () => {
      tops = chapters.map(
        (c) => document.getElementById(c.id)?.offsetTop ?? 0,
      );
      max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      // Chaque segment de la barre est proportionnel à la longueur de son chapitre.
      const starts = tops.map((t, i) =>
        i === 0 ? 0 : Math.min(max, Math.max(0, t - innerHeight * 0.4)),
      );
      const ends = [...starts.slice(1), max];
      setSpans(starts.map((s, i) => Math.max(1, ends[i] - s)));
      update();
    };
    const update = () => {
      frame = 0;
      const y = scrollY;
      const p = Math.min(1, Math.max(0, y / max));
      if (fill.current) fill.current.style.transform = `scaleX(${p})`;
      if (tc.current) tc.current.textContent = timecode(p);
      const probe = y + innerHeight * 0.4;
      let i = 0;
      tops.forEach((t, k) => {
        if (t <= probe) i = k;
      });
      if (i !== last) {
        last = i;
        setActive(i);
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    addEventListener("scroll", onScroll, { passive: true });
    return () => {
      ro.disconnect();
      removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [chapters]);

  const now = chapters[active];
  return (
    <nav className="scrubber" aria-label="Chapitres">
      <span className="scrubber-tc mono" aria-hidden="true">
        <i className="dot" />
        <span ref={tc}>00:00:00:00</span>
      </span>
      <div className="scrubber-track">
        <ol>
          {chapters.map((c, i) => (
            <li key={c.id} style={{ flexGrow: spans[i] }}>
              <a
                href={`#${c.id}`}
                aria-current={active === i ? "location" : undefined}
              >
                <span className="scrubber-label">{c.label}</span>
              </a>
            </li>
          ))}
        </ol>
        <span className="scrubber-rail" aria-hidden="true">
          <span ref={fill} />
        </span>
      </div>
      <span className="scrubber-now mono" aria-hidden="true">
        {now.label}
      </span>
      <button
        type="button"
        className="scrubber-quiet mono"
        aria-pressed={quiet}
        onClick={onQuiet}
      >
        <span aria-hidden="true">{quiet ? "▶" : "❚❚"}</span>
        <span className="scrubber-quiet-text">
          {quiet ? "Animations coupées" : "Couper les animations"}
        </span>
      </button>
    </nav>
  );
}
