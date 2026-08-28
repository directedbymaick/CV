"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import { projects, jobs, certs } from "./content";
import HeroCarousel from "./hero-carousel";
import SocialBackground from "./social-background";
import ExperienceItem from "./experience-item";
const linkedin = "https://www.linkedin.com/in/rayan-m-3a8ba6145/";
const youtube = "https://www.youtube.com/@maickstream";
const instagram = "https://www.instagram.com/darthmaick/";
export default function CV() {
  const [selected, setSelected] = useState(0);
  const [preview, setPreview] = useState<"site" | "video" | null>(null);
  const [copyStatus, setCopyStatus] = useState("Copier l’email");
  const [quiet, setQuiet] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const feature = projects[selected];
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const nodes = document.querySelectorAll<HTMLElement>(".reveal");
    nodes.forEach((n) => n.classList.add("awaiting"));
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.remove("awaiting");
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.08 },
    );
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (preview) {
      dialog.current?.showModal();
      const old = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = old;
      };
    }
  }, [preview]);
  const close = () => {
    dialog.current?.close();
    setPreview(null);
  };
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText("rayan.mpondo@gmail.com");
      setCopyStatus("Email copié ✓");
    } catch {
      setCopyStatus("rayan.mpondo@gmail.com");
    }
  }
  function nextTab(e: React.KeyboardEvent<HTMLButtonElement>, i: number) {
    const next =
      e.key === "ArrowRight"
        ? (i + 1) % 3
        : e.key === "ArrowLeft"
          ? (i + 2) % 3
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? 2
              : null;
    if (next !== null) {
      e.preventDefault();
      setSelected(next);
      document.getElementById(`tab-${next}`)?.focus();
    }
  }
  return (
    <div className={quiet ? "site quiet" : "site"}>
      <a className="skip" href="#contenu">
        Aller au contenu
      </a>
      <header className="nav">
        <a
          className="wordmark"
          href="#accueil"
          aria-label="Rayan Mpondo, accueil"
        >
          rm<span>.</span>
        </a>
        <nav aria-label="Navigation principale">
          <a href="#projets">Projets</a>
          <a href="#parcours">Parcours</a>
          <a href="#expertises">Expertises</a>
        </nav>
        <a className="nav-contact" href="#contact">
          Contact
        </a>
      </header>
      <main id="contenu">
        <section className="hero" id="accueil" aria-labelledby="hero-title">
          <p className="eyebrow hero-identity">
            <img
              className="identity-portrait"
              src="/media/rayan-portrait.webp"
              alt=""
              width="48"
              height="48"
            />
            <span className="status-dot" /> RAYAN MPONDO · MARKETING & CRÉATION
            DIGITALE
          </p>
          <h1 id="hero-title">
            Marketing digital.
            <br />
            <em>Création web &amp; contenus.</em>
          </h1>
          <p className="hero-lead">
            Je suis Rayan Mpondo. Je conçois des sites web, produis des contenus
            <br />
            et coordonne des projets marketing. Basé en Île-de-France.
          </p>
          <div className="hero-actions">
            <a className="button accent" href="#projets">
              Voir mes projets <span>↓</span>
            </a>
            <a className="button ghost" href="/CV_Rayan_MPONDO.pdf" download>
              Télécharger mon CV
            </a>
          </div>
          <HeroCarousel quiet={quiet} onProject={setSelected} />
          <div className="hero-bottom">
            <span>MELUN · ÎLE-DE-FRANCE</span>
            <span>STRATÉGIE × DESIGN × IA</span>
            <button onClick={() => setQuiet(!quiet)} aria-pressed={quiet}>
              {quiet ? "ANIMATIONS DÉSACTIVÉES" : "ANIMATIONS ACTIVÉES"} ◌
            </button>
          </div>
        </section>
        <section
          id="projets"
          className="projects section"
          aria-labelledby="projects-title"
        >
          <div className="wrap">
            <div className="section-heading reveal">
              <div>
                <p className="eyebrow">PROJETS SÉLECTIONNÉS</p>
                <h2 id="projects-title">Sites web &amp; produit interactif.</h2>
              </div>
              <p>
                Trois projets personnels, de la conception
                <br />à la réalisation.
              </p>
            </div>
            <div
              className="project-tabs"
              role="tablist"
              aria-label="Sélectionner un projet"
            >
              {projects.map((p, i) => (
                <button
                  key={p.id}
                  id={`tab-${i}`}
                  role="tab"
                  aria-controls="project-panel"
                  aria-selected={selected === i}
                  tabIndex={selected === i ? 0 : -1}
                  onKeyDown={(e) => nextTab(e, i)}
                  onClick={() => setSelected(i)}
                >
                  <span>{p.number}</span>
                  {p.title}
                  <span aria-hidden="true">↗</span>
                </button>
              ))}
            </div>
            <article
              className="project-panel"
              id="project-panel"
              role="tabpanel"
              aria-labelledby={`tab-${selected}`}
              tabIndex={0}
            >
              <div className={`project-visual ${feature.id}`} key={feature.id}>
                {feature.image ? (
                  <img
                    className="project-cover"
                    src={feature.image}
                    alt={`Aperçu du site ${feature.title}`}
                    width="1875"
                    height="968"
                    loading="lazy"
                  />
                ) : (
                  <div className="game-art">
                    <div className="game-label">
                      <span>UN UNIVERS ORIGINAL</span>
                      <strong>EXPELLED</strong>
                      <span>NÉS DU SILENCE</span>
                    </div>
                    <div className="card-fan">
                      <img
                        src="/media/eshel.webp"
                        alt="Eshel, illustration du jeu EXPELLED"
                        width="640"
                        height="900"
                        loading="lazy"
                      />
                      <img
                        src="/media/doran.webp"
                        alt="Doran, illustration du jeu EXPELLED"
                        width="640"
                        height="900"
                        loading="lazy"
                      />
                      <img
                        src="/media/rasen.webp"
                        alt="Rasen, illustration du jeu EXPELLED"
                        width="640"
                        height="900"
                        loading="lazy"
                      />
                    </div>
                    <span className="art-caption">
                      ILLUSTRATIONS DU JEU · CRÉATION ASSISTÉE PAR IA
                    </span>
                  </div>
                )}
                <div className="project-visual-bar">
                  <span>{feature.category}</span>
                  <button
                    onClick={() =>
                      setPreview(feature.id === "frieren" ? "video" : "site")
                    }
                  >
                    {feature.id === "frieren"
                      ? "Voir la démo vidéo"
                      : "Explorer dans la page"}{" "}
                    ↗
                  </button>
                </div>
              </div>
              <div className="project-description">
                <div>
                  <p className="eyebrow">{feature.title.toUpperCase()}</p>
                  <h3>{feature.subtitle}</h3>
                  <div className="tags">
                    {feature.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p>{feature.description}</p>
                  <p className="project-proof">
                    <strong>Mon rôle</strong>
                    <br />
                    {feature.proof}
                  </p>
                  <a
                    className="text-link"
                    href={feature.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Ouvrir le projet ↗
                  </a>
                  <p className="project-note">{feature.note}</p>
                </div>
              </div>
            </article>
            <a
              className="studio-band"
              href="https://www.mad-makers.fr"
              target="_blank"
              rel="noreferrer"
            >
              <div>
                <span className="eyebrow">MAD-MAKERS.FR</span>
                <h3>
                  Mad Makers<span>.</span>
                </h3>
              </div>
              <p>
                Mon activité de création web.
                <br />
                Sites, direction artistique et développement.
              </p>
              <span className="circle-arrow" aria-hidden="true">
                ↗
              </span>
            </a>
          </div>
        </section>
        <section id="parcours" className="experience section">
          <div className="wrap career-grid">
            <div className="career-heading reveal">
              <p className="eyebrow">À PROPOS</p>
              <h2>Mon parcours.</h2>
              <figure className="career-portrait">
                <img
                  src="/media/rayan-portrait.webp"
                  alt="Portrait de Rayan Mpondo"
                  width="640"
                  height="640"
                  loading="lazy"
                />
                <figcaption>
                  <span>Rayan Mpondo</span>
                  <span>MARKETING · CRÉATION · IA</span>
                </figcaption>
              </figure>
              <p>
                Mon parcours a commencé dans la relation client, avant de se
                poursuivre dans le contenu et le marketing digital. Chez VINCI
                Construction et BIM&amp;CO, j’ai travaillé sur la communication,
                les campagnes et la coordination de projets.
              </p>
              <a className="button ghost" href="/CV_Rayan_MPONDO.pdf" download>
                Télécharger mon CV ↓
              </a>
            </div>
            <div className="timeline">
              {jobs.map((job, i) => (
                <ExperienceItem
                  key={job.company}
                  job={job}
                  initialOpen={i === 0}
                  quiet={quiet}
                />
              ))}
            </div>
          </div>
        </section>
        <section id="expertises" className="section wrap">
          <div className="section-heading reveal">
            <div>
              <p className="eyebrow">COMPÉTENCES</p>
              <h2>Mes domaines de pratique.</h2>
            </div>
          </div>
          <div className="skills-grid">
            <article className="skill reveal">
              <span className="skill-index">MARKETING</span>
              <h3>Campagnes &amp; coordination</h3>
              <p>
                Gestion de campagnes CRM, calendrier éditorial, suivi de projets
                et coordination d’événements.
              </p>
              <div className="tool-list">
                HubSpot · SharePoint · LinkedIn
                <br />
                Waalaxy · Sales Navigator
              </div>
            </article>
            <article className="skill reveal">
              <span className="skill-index">CONTENUS</span>
              <h3>Vidéo &amp; communication</h3>
              <p>
                Articles, supports de communication, montage vidéo et motion
                design pour le web et les réseaux sociaux.
              </p>
              <div className="tool-list">
                After Effects · Premiere Pro
                <br />
                Suite Adobe · Création éditoriale
              </div>
            </article>
            <article className="skill reveal">
              <span className="skill-index">WEB & IA</span>
              <h3>Sites &amp; interfaces</h3>
              <p>
                Conception de sites et d’interfaces interactives. Utilisation de
                l’IA générative pour les illustrations et la production de
                contenus.
              </p>
              <div className="tool-list">
                Framer · WordPress · Three.js
                <br />
                Midjourney · ChatGPT Images 2
              </div>
            </article>
          </div>
        </section>
        <section className="learning section">
          <div className="wrap">
            <div className="section-heading reveal">
              <div>
                <p className="eyebrow">FORMATION</p>
                <h2>Diplômes &amp; certifications.</h2>
              </div>
            </div>
            <div className="learning-grid">
              <div className="education">
                <h3>Formation</h3>
                <article>
                  <span>2026</span>
                  <div>
                    <h4>Créer son premier site web no code avec Framer</h4>
                    <p>
                      Product builder no-code
                      <br />
                      RNCP39108BC02
                    </p>
                  </div>
                </article>
                <article>
                  <span>2025</span>
                  <div>
                    <h4>Manager de la Stratégie Marketing</h4>
                    <p>
                      École DSP · Bac+5
                      <br />
                      Master ou équivalent
                    </p>
                  </div>
                </article>
                <article>
                  <span>2020–21</span>
                  <div>
                    <h4>Stratégies Marketing Opérationnel</h4>
                    <p>Césame Sup · Bachelor</p>
                  </div>
                </article>
              </div>
              <div className="certifications">
                <h3>Certifications en intelligence artificielle</h3>
                {certs.map((c) => (
                  <details key={c[0]}>
                    <summary>
                      <span className="cert-code">{c[0]}</span>
                      <span>{c[1]}</span>
                      <b aria-hidden="true">＋</b>
                    </summary>
                    <p>{c[2]}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section className="content-section section wrap" id="contenus">
          <div className="section-heading reveal">
            <div>
              <p className="eyebrow">VIDÉO & MONTAGE</p>
              <h2>Création de contenus.</h2>
            </div>
            <p>
              YouTube et montage vidéo :<br />
              une pratique personnelle régulière.
            </p>
          </div>
          <div className="creator-grid">
            <article className="youtube-card reveal">
              <SocialBackground kind="youtube" quiet={quiet} />
              <div className="social-heading">
                <span>YOUTUBE / @MAICKSTREAM</span>
                <span>↗</span>
              </div>
              <div className="youtube-mark" aria-hidden="true">
                ▶
              </div>
              <h3>YouTube · Maickstream</h3>
              <p>Je crée et publie des vidéos sur ma chaîne Maickstream.</p>
              <div className="metrics">
                <div>
                  <strong>≈ 2 000</strong>
                  <span>abonnés</span>
                </div>
                <div>
                  <strong>10–30 k</strong>
                  <span>vues sur certaines vidéos</span>
                </div>
              </div>
              <a
                className="social-cta"
                href={youtube}
                target="_blank"
                rel="noreferrer"
              >
                Découvrir la chaîne <span>↗</span>
              </a>
            </article>
            <article className="amv-card reveal">
              <SocialBackground kind="instagram" quiet={quiet} />
              <div className="social-heading">
                <span>INSTAGRAM / AMV</span>
                <span>↗</span>
              </div>
              <div className="amv-symbol" aria-hidden="true">
                <span>Ae</span>
                <span>Pr</span>
              </div>
              <h3>Montage &amp; effets visuels</h3>
              <p>
                Je réalise des AMV avec After Effects et Premiere Pro : montage,
                effets visuels et synchronisation musicale.
              </p>
              <a
                className="social-cta"
                href={instagram}
                target="_blank"
                rel="noreferrer"
              >
                Voir les montages sur Instagram <span>↗</span>
              </a>
            </article>
          </div>
          <p className="metrics-note">
            Audience YouTube approximative, communiquée en août 2026.
          </p>
        </section>
        <section id="contact" className="contact section wrap reveal">
          <img
            className="contact-portrait"
            src="/media/rayan-portrait.webp"
            alt="Rayan Mpondo"
            width="88"
            height="88"
            loading="lazy"
          />
          <p className="eyebrow">CONTACT</p>
          <h2>Parlons de votre projet.</h2>
          <p>
            Pour une opportunité en marketing digital, création de contenus
            <br />
            ou conception web, vous pouvez me contacter directement.
          </p>
          <div className="contact-actions">
            <a className="button accent" href="mailto:rayan.mpondo@gmail.com">
              Me contacter
            </a>
            <button
              className="button ghost"
              onClick={copyEmail}
              aria-live="polite"
            >
              {copyStatus}
            </button>
          </div>
          <a className="email-address" href="mailto:rayan.mpondo@gmail.com">
            rayan.mpondo@gmail.com
          </a>
          <div className="contact-meta">
            <span>Melun · Île-de-France</span>
            <a href="tel:+33766039808">07 66 03 98 08</a>
          </div>
        </section>
      </main>
      <footer className="footer wrap">
        <a className="wordmark" href="#accueil" aria-label="Retour à l’accueil">
          rm<span>.</span>
        </a>
        <span>RAYAN MPONDO · 2026</span>
        <div>
          <a href={linkedin} target="_blank" rel="noreferrer">
            LinkedIn ↗
          </a>
          <a href={youtube} target="_blank" rel="noreferrer">
            YouTube ↗
          </a>
          <a href={instagram} target="_blank" rel="noreferrer">
            Instagram ↗
          </a>
          <a
            href="https://www.twitch.tv/maickstream"
            target="_blank"
            rel="noreferrer"
          >
            Twitch ↗
          </a>
        </div>
        <a href="#accueil" className="back-top" aria-label="Retour en haut">
          ↑
        </a>
      </footer>
      <dialog
        ref={dialog}
        className="preview-dialog"
        aria-labelledby="preview-title"
        onCancel={close}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        onClose={() => setPreview(null)}
      >
        <div className="dialog-shell">
          <div className="dialog-heading">
            <div>
              <span className="eyebrow">
                {preview === "video"
                  ? "DÉMONSTRATION ENREGISTRÉE"
                  : "SITE EXTERNE INTERACTIF"}
              </span>
              <h2 id="preview-title">{feature.title}</h2>
            </div>
            <button
              className="close-preview"
              onClick={close}
              autoFocus
              aria-label="Fermer l’aperçu"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
                focusable="false"
              >
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
          {preview === "video" ? (
            <video
              src="/media/frieren-demo.mp4"
              controls
              playsInline
              preload="metadata"
              aria-label="Démonstration des interactions du site Frieren"
            />
          ) : preview === "site" ? (
            <iframe
              key={feature.id}
              src={feature.url}
              title={`Site ${feature.title}`}
              referrerPolicy="no-referrer"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
            />
          ) : null}
          <div className="dialog-foot">
            <p>
              {preview === "video"
                ? "Capture des interactions du projet Frieren."
                : "Le site peut limiter son affichage intégré. Ouvrez-le dans un nouvel onglet si nécessaire."}
            </p>
            <a
              className="text-link"
              href={feature.url}
              target="_blank"
              rel="noreferrer"
            >
              Ouvrir le site ↗
            </a>
          </div>
        </div>
      </dialog>
    </div>
  );
}
