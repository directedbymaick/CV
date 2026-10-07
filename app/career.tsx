"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import { certs, education, jobs } from "./content";

// Le parcours affiché comme une timeline de montage : une piste « Postes »,
// une piste « Diplômes », une piste « Certifications IA », une piste audio
// « Contenus », une tête de lecture et un moniteur.
const FROM = 2016;
const TO = 2027;
const NOW = 2026.77;
const years = Array.from({ length: TO - FROM }, (_, i) => FROM + i);
const pct = (y: number) => ((y - FROM) / (TO - FROM)) * 100;

type Job = (typeof jobs)[number];
type Edu = (typeof education)[number];
type Clip =
  | { kind: "job"; id: string; at: number; job: Job }
  | { kind: "edu"; id: string; at: number; edu: Edu }
  | { kind: "certs"; id: string; at: number };

// Certifications IA obtenues au fil de 2026 (après Framer, en janvier).
const CERTS_FROM = 2026.08;

const clips: Clip[] = [
  ...jobs.map((job) => ({
    kind: "job" as const,
    id: job.logo,
    at: job.start,
    job,
  })),
  ...education.map((edu) => ({
    kind: "edu" as const,
    id: edu.id,
    at: edu.start ?? edu.at ?? edu.year,
    edu,
  })),
  { kind: "certs" as const, id: "certs-ia", at: CERTS_FROM },
].sort((a, b) => a.at - b.at || (a.kind === "edu" ? 1 : -1));

const jobLogos = (j: Job) => j.logoFiles ?? [`${j.logo}.png`];
const label = (f: string) => f.split(".")[0].replace(/^./, (c) => c.toUpperCase());

function LogoChip({
  files,
  tone,
  name,
}: {
  files: string[];
  tone: string;
  name: string;
}) {
  const multi = files.length > 1;
  return (
    <span className={`logo-chip ${tone}${multi ? " multi" : ""}`}>
      {files.map((f) => (
        <img
          key={f}
          src={`/logos/${f}`}
          alt={multi ? `Logo ${label(f)}` : `Logo ${name}`}
          loading="lazy"
        />
      ))}
    </span>
  );
}

const latest = clips.findIndex((c) => c.kind === "job" && c.id === "madmakers");

export default function Career() {
  const [sel, setSel] = useState(latest);
  const [rolled, setRolled] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const clip = clips[sel];

  // Au premier passage, la tête de lecture parcourt la timeline jusqu'au poste le plus récent.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setRolled(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Sur petit écran la timeline défile : on garde le clip actif centré.
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const sc = scroller.current;
    const target = document.getElementById(`clip-${clip.id}`);
    if (!sc || !target || sc.scrollWidth <= sc.clientWidth) return;
    const r = target.getBoundingClientRect();
    const box = sc.getBoundingClientRect();
    sc.scrollTo({
      left: sc.scrollLeft + r.left - box.left - sc.clientWidth / 2 + r.width / 2,
      behavior: rolled ? "smooth" : "auto",
    });
  }, [clip.id, rolled]);

  function go(i: number, focus = false) {
    const n = (i + clips.length) % clips.length;
    setSel(n);
    if (focus) document.getElementById(`clip-${clips[n].id}`)?.focus();
  }
  function onKey(e: React.KeyboardEvent, i: number) {
    const map: Record<string, number> = {
      ArrowRight: i + 1,
      ArrowLeft: i - 1,
      Home: 0,
      End: clips.length - 1,
    };
    if (e.key in map) {
      e.preventDefault();
      go(map[e.key], true);
    }
  }
  const head = rolled ? pct(clip.at) : 0;

  return (
    <div className="career" ref={root}>
      <div
        className="monitor"
        role="tabpanel"
        id="career-panel"
        aria-labelledby={`clip-${clip.id}`}
      >
        <div className="monitor-bar mono" aria-hidden="true">
          <span>
            <i className="dot" /> {clip.kind === "job"
              ? "Poste"
              : clip.kind === "edu"
                ? "Diplôme"
                : "Certifications"}
          </span>
          <span>
            {String(sel + 1).padStart(2, "0")} / {String(clips.length).padStart(2, "0")}
          </span>
        </div>
        <div className="monitor-body" key={clip.id}>
          {clip.kind === "job" ? (
            <>
              <div className="monitor-top">
                <LogoChip
                  files={jobLogos(clip.job)}
                  tone={clip.job.logoTone}
                  name={clip.job.company}
                />
                <p className="mono monitor-date">{clip.job.date}</p>
              </div>
              <h3 className="monitor-title">
                <span className="cond">{clip.job.company}</span>
                <span className="monitor-role">{clip.job.role}</span>
              </h3>
              <p className="mono monitor-meta">{clip.job.meta}</p>
              <p className="monitor-summary">{clip.job.summary}</p>
              <ul className="monitor-list">
                {clip.job.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
              <ul className="chips" aria-label="Domaines">
                {clip.job.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </>
          ) : clip.kind === "edu" ? (
            <>
              <div className="monitor-top">
                {clip.edu.logoFile ? (
                  <LogoChip
                    files={[clip.edu.logoFile]}
                    tone={clip.edu.logoTone ?? "light"}
                    name={clip.edu.school}
                  />
                ) : (
                  <span className="logo-chip diploma mono" aria-hidden="true">
                    Diplôme
                  </span>
                )}
                <p className="mono monitor-date">{clip.edu.date}</p>
              </div>
              <h3 className="monitor-title">
                <span className="cond">{clip.edu.title}</span>
                <span className="monitor-role">{clip.edu.school}</span>
              </h3>
              <p className="mono monitor-meta">
                {clip.edu.level}
                {clip.edu.code ? ` · ${clip.edu.code}` : ""}
              </p>
              {"note" in clip.edu && clip.edu.note ? (
                <p className="monitor-summary">{clip.edu.note}</p>
              ) : null}
            </>
          ) : (
            <>
              <div className="monitor-top">
                <span className="logo-chip diploma mono" aria-hidden="true">
                  Certifications
                </span>
                <p className="mono monitor-date">2026</p>
              </div>
              <h3 className="monitor-title">
                <span className="cond">Certifications en intelligence artificielle</span>
                <span className="monitor-role">
                  {certs.length} certifications obtenues en 2026
                </span>
              </h3>
              <p className="mono monitor-meta">
                Pilotage, développement et usage responsable de l’IA
              </p>
              <ul className="monitor-list">
                {certs.map(([code, title]) => (
                  <li key={code}>
                    {title} <span className="mono">· {code}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        <div className="monitor-nav">
          <button type="button" onClick={() => go(sel - 1)}>
            <span aria-hidden="true">←</span> Précédent
          </button>
          <button type="button" onClick={() => go(sel + 1)}>
            Suivant <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      <div className="nle">
        <div className="nle-scroll" ref={scroller}>
          <div className="nle-inner">
            <div className="nle-ruler" aria-hidden="true">
              {years.map((y) => (
                <span key={y} style={{ left: `${pct(y)}%` }}>
                  {y}
                </span>
              ))}
            </div>
            <div
              className="nle-lanes"
              role="tablist"
              aria-label="Parcours, du plus ancien au plus récent"
            >
              <div className="lane">
                <span className="lane-label mono" aria-hidden="true">
                  V1 · Postes
                </span>
                {clips.map((c, i) =>
                  c.kind === "job" && c.job.track !== "a1" ? (
                    <button
                      key={c.id}
                      id={`clip-${c.id}`}
                      role="tab"
                      type="button"
                      className="clip"
                      aria-selected={sel === i}
                      aria-controls="career-panel"
                      tabIndex={sel === i ? 0 : -1}
                      onClick={() => go(i)}
                      onKeyDown={(e) => onKey(e, i)}
                      style={{
                        left: `${pct(c.job.start)}%`,
                        width: `${pct(c.job.end) - pct(c.job.start)}%`,
                      }}
                    >
                      <span className="clip-name">{c.job.company}</span>
                      <span className="clip-date mono">{c.job.date}</span>
                    </button>
                  ) : null,
                )}
              </div>
              <div className="lane lane-markers">
                <span className="lane-label mono" aria-hidden="true">
                  V2 · Diplômes
                </span>
                {clips.map((c, i) =>
                  c.kind === "edu" && c.edu.start !== undefined ? (
                    <button
                      key={c.id}
                      id={`clip-${c.id}`}
                      role="tab"
                      type="button"
                      className="clip clip-edu"
                      aria-selected={sel === i}
                      aria-controls="career-panel"
                      tabIndex={sel === i ? 0 : -1}
                      onClick={() => go(i)}
                      onKeyDown={(e) => onKey(e, i)}
                      style={{
                        left: `${pct(c.edu.start)}%`,
                        width: `${pct(c.edu.end) - pct(c.edu.start)}%`,
                      }}
                    >
                      <span className="clip-name">{c.edu.short}</span>
                      <span className="clip-date mono">{c.edu.date}</span>
                    </button>
                  ) : c.kind === "edu" ? (
                    <button
                      key={c.id}
                      id={`clip-${c.id}`}
                      role="tab"
                      type="button"
                      className="marker"
                      aria-selected={sel === i}
                      aria-controls="career-panel"
                      tabIndex={sel === i ? 0 : -1}
                      onClick={() => go(i)}
                      onKeyDown={(e) => onKey(e, i)}
                      style={{ left: `${pct(c.edu.at ?? c.edu.year + 0.5)}%` }}
                    >
                      <span className="marker-gem" aria-hidden="true" />
                      <span className="marker-name">{c.edu.short}</span>
                      <span className="sr-only">
                        , {c.edu.title}, {c.edu.date}
                      </span>
                    </button>
                  ) : null,
                )}
              </div>
              <div className="lane lane-certs">
                <span className="lane-label mono" aria-hidden="true">
                  V3 · Certifs IA
                </span>
                {clips.map((c, i) =>
                  c.kind === "certs" ? (
                    <button
                      key={c.id}
                      id={`clip-${c.id}`}
                      role="tab"
                      type="button"
                      className="clip clip-edu"
                      aria-selected={sel === i}
                      aria-controls="career-panel"
                      tabIndex={sel === i ? 0 : -1}
                      onClick={() => go(i)}
                      onKeyDown={(e) => onKey(e, i)}
                      style={{
                        left: `${pct(c.at)}%`,
                        width: `${pct(NOW) - pct(c.at)}%`,
                      }}
                    >
                      <span className="clip-name">IA ×{certs.length}</span>
                      <span className="clip-date mono">2026</span>
                      <span className="sr-only">
                        , {certs.length} certifications en intelligence artificielle
                      </span>
                    </button>
                  ) : null,
                )}
              </div>
              <div className="lane lane-audio">
                <span className="lane-label mono" aria-hidden="true">
                  A1 · Contenus
                </span>
                {clips.map((c, i) =>
                  c.kind === "job" && c.job.track === "a1" ? (
                    <button
                      key={c.id}
                      id={`clip-${c.id}`}
                      role="tab"
                      type="button"
                      className="clip clip-audio"
                      aria-selected={sel === i}
                      aria-controls="career-panel"
                      tabIndex={sel === i ? 0 : -1}
                      onClick={() => go(i)}
                      onKeyDown={(e) => onKey(e, i)}
                      style={{
                        left: `${pct(c.job.start)}%`,
                        width: `${pct(c.job.end) - pct(c.job.start)}%`,
                      }}
                    >
                      <span className="clip-name">
                        Création de contenu · Twitch &amp; YouTube
                      </span>
                      <span className="clip-date mono">{c.job.date}</span>
                    </button>
                  ) : null,
                )}
              </div>
              <span
                className="nle-now mono"
                aria-hidden="true"
                style={{ left: `${pct(NOW)}%` }}
              >
                <span>Aujourd’hui</span>
              </span>
              <div className="playhead" aria-hidden="true">
                <span style={{ transform: `translateX(${head}%)` }}>
                  <i />
                </span>
              </div>
            </div>
          </div>
        </div>
        <p className="nle-hint mono">
          Sélectionnez un clip ou utilisez les flèches du clavier.
          <span className="nle-hint-touch"> Faites glisser pour voir toute la timeline.</span>
        </p>
      </div>
    </div>
  );
}
