"use client";
import { useRef, useState } from "react";
import { links } from "./content";
import type { Chapter } from "./scrubber";

// Menu plein écran sur un <dialog> natif : Échap, piège du focus et retour du
// focus sont gérés par le navigateur. Animations en CSS (opacité + translation).
export default function NavMenu({
  chapters,
  quiet,
}: {
  chapters: Chapter[];
  quiet: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState(0);
  const [closing, setClosing] = useState(false);

  function open() {
    const probe = scrollY + innerHeight * 0.4;
    let i = 0;
    chapters.forEach((c, k) => {
      const el = document.getElementById(c.id);
      if (el && el.offsetTop <= probe) i = k;
    });
    setActive(i);
    dialog.current?.showModal();
  }

  function close(after?: () => void) {
    const d = dialog.current;
    if (!d?.open) return;
    const instant =
      quiet || matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (instant) {
      d.close();
      after?.();
      return;
    }
    setClosing(true);
    setTimeout(() => {
      d.close();
      setClosing(false);
      after?.();
    }, 220);
  }

  function go(e: React.MouseEvent, id: string) {
    e.preventDefault();
    close(() => {
      if (location.hash === `#${id}`) {
        document
          .getElementById(id)
          ?.scrollIntoView({ behavior: quiet ? "auto" : "smooth" });
      } else {
        location.hash = id;
      }
    });
  }

  return (
    <>
      <button
        type="button"
        className="btn ghost sm menu-open"
        aria-haspopup="dialog"
        onClick={open}
      >
        <span className="menu-icon" aria-hidden="true" />
        Menu
      </button>
      <dialog
        ref={dialog}
        className={closing ? "menu is-closing" : "menu"}
        aria-label="Menu"
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
      >
        <div className="wrap menu-top">
          <span className="mark" aria-hidden="true">
            rm<span>.</span>
          </span>
          <button
            type="button"
            className="btn ghost sm"
            onClick={() => close()}
            autoFocus
          >
            Fermer
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
        <div className="wrap menu-body">
          <nav aria-label="Sections">
            <ol className="menu-list">
              {chapters.map((c, i) => (
                <li key={c.id} style={{ "--i": i } as React.CSSProperties}>
                  <a
                    href={`#${c.id}`}
                    aria-current={active === i ? "location" : undefined}
                    onClick={(e) => go(e, c.id)}
                  >
                    {c.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="menu-side">
            <dl>
              <div>
                <dt className="mono">Email</dt>
                <dd>
                  <a href={`mailto:${links.email}`}>{links.email}</a>
                </dd>
              </div>
              <div>
                <dt className="mono">Téléphone</dt>
                <dd>
                  <a href={links.phoneHref}>{links.phone}</a>
                </dd>
              </div>
              <div>
                <dt className="mono">Réseaux</dt>
                <dd className="menu-socials">
                  <a href={links.linkedin} target="_blank" rel="noreferrer">
                    LinkedIn ↗
                  </a>
                  <a href={links.youtube} target="_blank" rel="noreferrer">
                    YouTube ↗
                  </a>
                  <a href={links.studio} target="_blank" rel="noreferrer">
                    Mad Makers ↗
                  </a>
                </dd>
              </div>
            </dl>
            <a className="btn rec" href={links.cv} download>
              Télécharger le CV <span className="mono">PDF</span>
            </a>
          </div>
        </div>
      </dialog>
    </>
  );
}
