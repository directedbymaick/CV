"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import type { jobs } from "./content";

export default function ExperienceItem({
  job,
  initialOpen,
  quiet,
}: {
  job: (typeof jobs)[number];
  initialOpen: boolean;
  quiet: boolean;
}) {
  const ref = useRef<HTMLDetailsElement>(null);
  const animation = useRef<Animation | null>(null);
  const desired = useRef(initialOpen);
  const [expanded, setExpanded] = useState(initialOpen);
  useEffect(() => () => animation.current?.cancel(), []);
  function toggle(event: React.MouseEvent<HTMLElement>) {
    event.preventDefault();
    const element = ref.current;
    if (!element) return;
    const start = element.getBoundingClientRect().height;
    const next = !desired.current;
    desired.current = next;
    setExpanded(next);
    animation.current?.cancel();
    animation.current = null;
    element.style.height = "";
    element.style.overflow = "";
    if (
      quiet ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      element.open = next;
      return;
    }
    // Measure the real destination, including padding and responsive content.
    element.open = next;
    const end = element.getBoundingClientRect().height;
    element.open = true;
    element.style.overflow = "hidden";
    const transition = element.animate(
      [{ height: `${start}px` }, { height: `${end}px` }],
      { duration: 420, easing: "cubic-bezier(.22,1,.36,1)", fill: "both" },
    );
    animation.current = transition;
    transition.onfinish = () => {
      if (animation.current !== transition) return;
      element.open = next;
      transition.cancel();
      animation.current = null;
      element.style.overflow = "";
    };
  }
  return (
    <details
      ref={ref}
      className="job reveal"
      open={initialOpen}
      data-expanded={expanded}
    >
      <summary onClick={toggle}>
        <span className="job-top">
          <span className={`job-logo ${job.logoTone}`}>
            <img
              src={`/logos/${job.logo}.png`}
              alt=""
              width="120"
              height="56"
              loading="lazy"
            />
          </span>
          <span className="job-date">{job.date}</span>
        </span>
        <span className="job-head">
          <span className="job-company">{job.company}</span>
          <span className="expand" aria-hidden="true">
            ＋
          </span>
        </span>
        <span className="job-role">{job.role}</span>
      </summary>
      <div className="job-detail">
        <p className="job-meta">{job.meta}</p>
        <ul>
          {job.details.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
        <div className="tags">
          {job.tags.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>
    </details>
  );
}
