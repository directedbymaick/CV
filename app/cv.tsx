"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { certs, education, links, projects, skills } from "./content";
import Career from "./career";
import NavMenu from "./nav-menu";
import Scrubber, { type Chapter } from "./scrubber";

const CHAPTERS: Chapter[] = [
  { id: "ouverture", label: "Ouverture" },
  { id: "synopsis", label: "Synopsis" },
  { id: "projets", label: "Projets" },
  { id: "studio", label: "Mad Makers" },
  { id: "parcours", label: "Parcours" },
  { id: "savoir-faire", label: "Savoir-faire" },
  { id: "formation", label: "Formation" },
  { id: "contenus", label: "Bande démo" },
  { id: "contact", label: "Contact" },
];
const NB = " ";
const PITCH = [
  {
    icon: "building",
    title: "Je parle le langage du B2B technique.",
    text: "Chez VINCI Construction et BIM&CO, j’ai communiqué sur des sujets d’ingénierie et de maquette numérique. Chez Orange Business, j’ai suivi des comptes comme Fayat et ECF. Je comprends les enjeux de vos métiers et de vos clients.",
    proof: "VINCI Construction · BIM&CO · Orange Business",
  },
  {
    icon: "route",
    title: "Je livre de bout en bout.",
    text: "Site, contenus, vidéo, campagnes et événements : une seule personne qui sait aussi construire, au lieu de trois prestataires à coordonner.",
    proof: "Site ARMD livré en six semaines",
  },
  {
    icon: "spark",
    title: "J’industrialise avec l’IA.",
    text: "Agents de développement, production visuelle et prospection automatisée : je mets en place des outils qui font gagner du temps à toute l’équipe, avec un usage responsable.",
    proof: "Quatre certifications IA obtenues en 2026",
  },
  {
    icon: "gauge",
    title: "Je vise la qualité, et je la mesure.",
    text: "Sites accessibles (WCAG 2.2 AA), rapides (Core Web Vitals) et bien référencés. Des contenus suivis, des campagnes mesurées.",
    proof: "SEO technique · Accessibilité · Performance",
  },
];
const ICONS: Record<string, React.ReactNode> = {
  building: (
    <>
      <path d="M3 21h18" />
      <path d="M5 21V8l7-4.5L19 8v13" />
      <path d="M9.5 21v-4.5h5V21" />
      <path d="M9 10h.01M15 10h.01M9 13.5h.01M15 13.5h.01" />
    </>
  ),
  route: (
    <>
      <circle cx="6" cy="19" r="2.2" />
      <circle cx="18" cy="5" r="2.2" />
      <path d="M8.2 19H16a3.5 3.5 0 0 0 0-7H8a3.5 3.5 0 0 1 0-7h7.8" />
    </>
  ),
  spark: (
    <>
      <path d="M11 3.5 12.9 8.6 18 10.5 12.9 12.4 11 17.5 9.1 12.4 4 10.5 9.1 8.6Z" />
      <path d="M18.5 15.5 19.3 17.7 21.5 18.5 19.3 19.3 18.5 21.5 17.7 19.3 15.5 18.5 17.7 17.7Z" />
    </>
  ),
  gauge: (
    <>
      <path d="M3.5 17.5a8.5 8.5 0 1 1 17 0" />
      <path d="M12 17.5 16 11" />
      <path d="M12 6.5v1.5M6.3 9.2l1 1M17.7 9.2l-1 1" />
      <circle cx="12" cy="17.5" r="1.2" />
    </>
  ),
};
const SHOWCASE = [
  {
    id: "walk",
    src: "/media/mm/walk.webp",
    w: 900,
    h: 970,
    alt: "Section réalisations de mad-makers.fr : un personnage marche devant le numéro du projet",
    title: "Un pas, un projet.",
    text: "Un personnage traverse les réalisations au rythme du scroll.",
  },
  {
    id: "logo",
    src: "/media/mm/logo3d.webp",
    w: 1200,
    h: 794,
    alt: "Le logo Mad Makers en relief, noir et chromé, avec un éclat lime",
    title: "Une signature en relief.",
    text: "Le logo rendu en 3D temps réel avec Three.js.",
  },
  {
    id: "voice",
    src: "/media/mm/intro.webp",
    w: 1600,
    h: 422,
    alt: "Bandeau crème de mad-makers.fr : « Le beau attire. Le caractère reste. »",
    title: "Une voix de marque.",
    text: "Des titres larges et des pages crème et nuit qui alternent.",
  },
  {
    id: "night",
    src: "/media/mm/night.webp",
    w: 1800,
    h: 750,
    alt: "Pied de page de mad-makers.fr : une maison d’architecte au bord de l’eau, de nuit, sous la lune",
    title: "Un décor qui vit.",
    text: "Un paysage nocturne en pied de page, avec bascule jour/nuit, son optionnel et pause des animations.",
  },
];
const useIsoLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

function ChapterHead({
  kicker,
  id,
  title,
  aside,
}: {
  kicker: string;
  id: string;
  title: string;
  aside?: string;
}) {
  return (
    <header className="chapter-head" data-reveal>
      <p className="mono chapter-kicker">{kicker}</p>
      <h2 id={id} className="cond chapter-title">
        {title}
      </h2>
      {aside ? <p className="chapter-aside">{aside}</p> : null}
    </header>
  );
}

export default function CV() {
  const [quiet, setQuiet] = useState(false);
  const [preview, setPreview] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const demo = useRef<HTMLVideoElement>(null);
  const [demoPlaying, setDemoPlaying] = useState(false);

  // Mouvement réduit : la version calme est la version par défaut.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setQuiet(mq.matches);
    const id = requestAnimationFrame(() => {
      if (mq.matches) sync();
    });
    mq.addEventListener("change", sync);
    return () => {
      cancelAnimationFrame(id);
      mq.removeEventListener("change", sync);
    };
  }, []);

  // Révélations au scroll. Le contenu reste visible sans JavaScript.
  useIsoLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const nodes = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const vh = innerHeight;
    nodes.forEach((n) => {
      if (n.getBoundingClientRect().top > vh * 0.9) n.classList.add("is-held");
    });
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.remove("is-held");
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -12% 0px" },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  // La bande démo ne joue que visible, et jamais en mode calme.
  useEffect(() => {
    const v = demo.current;
    if (!v) return;
    // React ne pose pas l'attribut muted : sans lui, la lecture automatique est bloquée.
    v.muted = true;
    if (quiet) {
      v.pause();
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.4 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [quiet]);

  useEffect(() => {
    if (preview !== null) dialog.current?.showModal();
  }, [preview]);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(links.email);
    } catch {
      const t = document.createElement("textarea");
      t.value = links.email;
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      t.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  }

  const shown = preview === null ? null : projects[preview];

  return (
    <div className={quiet ? "site is-quiet" : "site"}>
      <a className="skip" href="#contenu">
        Aller au contenu
      </a>
      <div className="grain" aria-hidden="true" />

      <header className="topbar">
        <a className="mark" href="#ouverture" aria-label="Rayan Mpondo, début de page">
          rm<span>.</span>
        </a>
        <div className="topbar-actions">
          <NavMenu chapters={CHAPTERS} quiet={quiet} />
          <a className="btn ghost sm topbar-cv" href={links.cv} download>
            CV <span className="mono">PDF</span>
          </a>
          <a className="btn rec sm" href="#contact">
            Contact
          </a>
        </div>
      </header>

      <main id="contenu">
        {/* Ouverture */}
        <section id="ouverture" className="hero" aria-labelledby="hero-title">
          <div className="hero-shutter" aria-hidden="true">
            <span />
            <span />
          </div>
          <picture className="hero-still">
            <source
              type="image/avif"
              srcSet="/media/rayan-still-800.avif 800w, /media/rayan-still-1254.avif 1254w"
              sizes="(max-width: 820px) 100vw, 46vw"
            />
            <img
              src="/media/rayan-still-1254.webp"
              srcSet="/media/rayan-still-800.webp 800w, /media/rayan-still-1254.webp 1254w"
              sizes="(max-width: 820px) 100vw, 46vw"
              alt="Portrait de Rayan Mpondo, veste en jean sur chemise blanche"
              width={1254}
              height={1254}
              fetchPriority="high"
            />
          </picture>
          <div className="wrap hero-grid">
            <h1 id="hero-title" className="cond hero-name">
              <span className="line">
                <span>Rayan</span>
              </span>
              <span className="line">
                <span>Mpondo</span>
              </span>
              <span className="sr-only">
                {" "}
                — marketing digital B2B, création web et IA
              </span>
            </h1>
            <p className="hero-role">
              Marketing digital B2B, création web <em>&amp;</em> IA.
            </p>
            <p className="hero-lead">
              J’aide les PME et ETI B2B, dans l’industrie et la construction
              notamment, à moderniser leur marketing{NB}: un site qui convainc,
              des contenus réguliers et des outils d’IA qui font gagner du
              temps. Basé à Melun, en Île-de-France.
            </p>
            <div className="hero-actions">
              <a className="btn rec" href="#projets">
                Voir mes projets <span aria-hidden="true">↓</span>
              </a>
              <a className="btn ghost" href={links.cv} download>
                Télécharger le CV <span className="mono">PDF</span>
              </a>
            </div>
          </div>

          <aside className="slate" aria-label="Fiche d’identité">
            <dl className="slate-grid">
              <div>
                <dt>Rôle</dt>
                <dd>Marketing digital B2B · Web · IA</dd>
              </div>
              <div>
                <dt>Lieu</dt>
                <dd>Melun · Île-de-France</dd>
              </div>
              <div>
                <dt>Formation</dt>
                <dd>Bac+5 · Stratégie marketing</dd>
              </div>
              <div>
                <dt>Parcours</dt>
                <dd>2016 → 2026</dd>
              </div>
              <div>
                <dt>Statut</dt>
                <dd>Freelance · ouvert à un poste</dd>
              </div>
              <div>
                <dt>Pour</dt>
                <dd>PME &amp; ETI B2B · industrie, construction</dd>
              </div>
            </dl>
          </aside>
        </section>

        {/* Synopsis */}
        <section id="synopsis" className="chapter" aria-labelledby="synopsis-title">
          <div className="wrap">
            <ChapterHead
              kicker="Synopsis"
              id="synopsis-title"
              title="Ce que j’apporte"
              aside="À une entreprise B2B qui veut un marketing plus moderne, sans monter une équipe de cinq personnes."
            />
            <ol className="pitch">
              {PITCH.map((p) => (
                <li key={p.icon} data-reveal>
                  <span className="pitch-icon" aria-hidden="true">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" focusable="false">
                      {ICONS[p.icon]}
                    </svg>
                  </span>
                  <h3 className="pitch-title">{p.title}</h3>
                  <p className="pitch-text">{p.text}</p>
                  <p className="mono pitch-proof">
                    <span aria-hidden="true">↳</span> {p.proof}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Projets */}
        <section id="projets" className="chapter" aria-labelledby="projets-title">
          <div className="wrap">
            <ChapterHead
              kicker="Filmographie"
              id="projets-title"
              title="Projets"
              aside="Un projet client et trois projets personnels, de la conception à la mise en ligne."
            />
            <ol className="reels">
              {projects.map((p, i) => (
                <li className="reel" key={p.id}>
                  <figure className="reel-still" data-reveal="wipe">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={`Page d’accueil du site ${p.title}`}
                        width={1600}
                        height={1000}
                        loading="lazy"
                      />
                    ) : (
                      <div className="triptych">
                        {[
                          ["eshel", "Eshel"],
                          ["doran", "Doran"],
                          ["rasen", "Rasen"],
                        ].map(([f, n]) => (
                          <img
                            key={f}
                            src={`/media/${f}.webp`}
                            alt={`${n}, illustration du jeu EXPELLED`}
                            width={640}
                            height={800}
                            loading="lazy"
                          />
                        ))}
                      </div>
                    )}
                    <figcaption className="reel-hud mono" aria-hidden="true">
                      <span>
                        <i className="dot" /> {p.category}
                      </span>
                      <span>Bobine {p.number}</span>
                    </figcaption>
                  </figure>
                  <div className="reel-copy" data-reveal>
                    <p className="mono reel-num">
                      {p.number} <span>/ 0{projects.length}</span>
                      <span className={p.client ? "badge client" : "badge"}>
                        {p.client ? "Projet client" : "Projet personnel"}
                      </span>
                    </p>
                    <h3 className="cond reel-title">{p.title}</h3>
                    <p className="reel-sub">{p.subtitle}</p>
                    <p className="reel-text">{p.description}</p>
                    <dl className="reel-credits">
                      <div>
                        <dt className="mono">Mon rôle</dt>
                        <dd>{p.proof}</dd>
                      </div>
                      <div>
                        <dt className="mono">Savoir-faire</dt>
                        <dd>{p.tags.join(" · ")}</dd>
                      </div>
                    </dl>
                    <div className="reel-actions">
                      <a
                        className="btn rec"
                        href={p.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Ouvrir le site <span aria-hidden="true">↗</span>
                        <span className="sr-only"> (nouvel onglet)</span>
                      </a>
                      <button
                        type="button"
                        className="btn ghost"
                        onClick={() => setPreview(i)}
                      >
                        {p.id === "frieren" ? "Voir la démo vidéo" : "Aperçu dans la page"}
                      </button>
                    </div>
                    <p className="reel-note">{p.note}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Mad Makers */}
        <section id="studio" className="chapter studio-ch" aria-labelledby="studio-title">
          <div className="wrap">
            <ChapterHead
              kicker="Mon studio"
              id="studio-title"
              title="Mad Makers"
              aside="Mon activité indépendante depuis septembre 2025 : identité de marque, sites sur mesure et expériences web, de l’idée à la mise en ligne."
            />
            <div className="mm-lead">
              <figure className="mm-shot" data-reveal="wipe">
                <div className="mm-chrome" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <span className="mono">mad-makers.fr</span>
                </div>
                <img
                  src="/media/mm/hero-night.webp"
                  alt="Accueil de mad-makers.fr : le logo félin lumineux au-dessus de l’eau, une maison d’architecte de nuit et le titre « Des sites sur mesure qui ne ressemblent pas à vos concurrents »"
                  width={1800}
                  height={1125}
                  loading="lazy"
                />
              </figure>
              <div className="mm-intro" data-reveal>
                <p className="mm-pitch">
                  Ma meilleure carte de visite{NB}: un site dont j’ai conçu la
                  direction artistique, le design et le développement.
                </p>
                <dl className="mm-facts">
                  <div>
                    <dt className="mono">Rôle</dt>
                    <dd>Direction artistique, design, développement</dd>
                  </div>
                  <div>
                    <dt className="mono">Outils</dt>
                    <dd>Figma · Spline · Three.js · WebGL · GSAP</dd>
                  </div>
                  <div>
                    <dt className="mono">Détails</dt>
                    <dd>Bilingue FR/EN, mode jour/nuit, son optionnel, pause des animations</dd>
                  </div>
                  <div>
                    <dt className="mono">Exigence</dt>
                    <dd>Accessibilité WCAG 2.2 AA, Core Web Vitals</dd>
                  </div>
                </dl>
                <a
                  className="btn lime"
                  href={links.studio}
                  target="_blank"
                  rel="noreferrer"
                >
                  Visiter mad-makers.fr <span aria-hidden="true">↗</span>
                  <span className="sr-only"> (nouvel onglet)</span>
                </a>
              </div>
            </div>
            <ul className="mm-grid">
              {SHOWCASE.map((t) => (
                <li key={t.id} className={`mm-tile mm-${t.id}`} data-reveal>
                  <figure>
                    <div className="mm-frame">
                      <img
                        src={t.src}
                        alt={t.alt}
                        width={t.w}
                        height={t.h}
                        loading="lazy"
                      />
                    </div>
                    <figcaption>
                      <strong>{t.title}</strong> <span>{t.text}</span>
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Parcours */}
        <section id="parcours" className="chapter" aria-labelledby="parcours-title">
          <div className="wrap">
            <ChapterHead
              kicker="Timeline de montage"
              id="parcours-title"
              title="Parcours"
              aside="De la relation client au marketing digital, puis à la création web. Dix ans montés plan par plan."
            />
            <div data-reveal>
              <Career />
            </div>
          </div>
        </section>

        {/* Savoir-faire */}
        <section
          id="savoir-faire"
          className="chapter credits"
          aria-labelledby="savoir-title"
        >
          <div className="wrap">
            <ChapterHead
              kicker="Générique"
              id="savoir-title"
              title="Savoir-faire"
            />
            <div className="credit-roll">
              {skills.map((s) => (
                <article className="credit" key={s.id} data-reveal>
                  <p className="mono credit-role">{s.label}</p>
                  <h3 className="cond credit-title">{s.title}</h3>
                  <p className="credit-text">{s.text}</p>
                  <ul className="credit-tools" aria-label="Outils">
                    {s.tools.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                  {"extra" in s && s.extra ? (
                    <p className="mono credit-extra">{s.extra}</p>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Formation */}
        <section
          id="formation"
          className="chapter paper"
          aria-labelledby="formation-title"
        >
          <div className="wrap">
            <ChapterHead
              kicker="Dossier"
              id="formation-title"
              title="Formation"
              aside="Un master en stratégie marketing préparé en alternance, complété en 2026 par quatre certifications en intelligence artificielle."
            />
            <div className="dossier">
              <div data-reveal>
                <h3 className="mono dossier-head">Diplômes</h3>
                <ol className="diplomas">
                  {[...education].reverse().map((e) => (
                    <li key={e.id}>
                      <span className="cond diploma-year">{e.date}</span>
                      <div>
                        <h4>{e.title}</h4>
                        <p>
                          {e.school} · {e.level}
                        </p>
                        {"note" in e && e.note ? <p>{e.note}</p> : null}
                        {e.code ? <p className="mono">{e.code}</p> : null}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
              <div data-reveal>
                <h3 className="mono dossier-head">
                  Certifications en intelligence artificielle · 2026
                </h3>
                <ul className="certs">
                  {certs.map(([code, title, text]) => (
                    <li key={code}>
                      <span className="mono stamp">{code}</span>
                      <h4>{title}</h4>
                      <p>{text}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Bande démo */}
        <section id="contenus" className="chapter" aria-labelledby="contenus-title">
          <div className="wrap">
            <ChapterHead
              kicker="Bande démo"
              id="contenus-title"
              title="Contenus"
              aside={`Twitch, YouTube et montage vidéo${NB}: une pratique régulière depuis 2022.`}
            />
            <div className="demo">
              <figure className="demo-player" data-reveal="wipe">
                <video
                  ref={demo}
                  muted
                  loop
                  playsInline
                  preload="none"
                  poster="/media/instagram-amv.jpg"
                  width={720}
                  height={406}
                  aria-label="Extrait d’un AMV monté par Rayan Mpondo"
                  onPlay={() => setDemoPlaying(true)}
                  onPause={() => setDemoPlaying(false)}
                >
                  <source src="/media/instagram-amv.mp4" type="video/mp4" />
                </video>
                <div className="demo-hud mono" aria-hidden="true">
                  <span>
                    <i className="dot" /> AMV · Montage &amp; effets
                  </span>
                  <span>Ae · Pr</span>
                </div>
                <button
                  type="button"
                  className="demo-toggle mono"
                  onClick={() => {
                    const v = demo.current;
                    if (!v) return;
                    if (v.paused) v.play().catch(() => {});
                    else v.pause();
                  }}
                >
                  {demoPlaying ? "❚❚ Pause" : "▶ Lecture"}
                </button>
                <figcaption>
                  Extrait d’un AMV réalisé avec After Effects et Premiere Pro{NB}:
                  montage, effets visuels et synchronisation musicale.{" "}
                  <a href={links.instagram} target="_blank" rel="noreferrer">
                    Voir les montages sur Instagram ↗
                  </a>
                </figcaption>
              </figure>
              <article className="channel" data-reveal>
                <p className="mono channel-kicker">YouTube · @maickstream</p>
                <h3 className="cond channel-name">Maickstream</h3>
                <p>Je crée et publie des vidéos sur ma chaîne.</p>
                <dl className="stats">
                  <div>
                    <dd className="cond">≈{NB}2{NB}000</dd>
                    <dt className="mono">abonnés</dt>
                  </div>
                  <div>
                    <dd className="cond">10–30{NB}k</dd>
                    <dt className="mono">vues sur certaines vidéos</dt>
                  </div>
                </dl>
                <p className="channel-note">
                  Audience approximative, communiquée en août 2026.
                </p>
                <div className="channel-links">
                  <a className="btn ghost" href={links.youtube} target="_blank" rel="noreferrer">
                    Découvrir la chaîne <span aria-hidden="true">↗</span>
                  </a>
                  <a className="text-link" href={links.twitch} target="_blank" rel="noreferrer">
                    Twitch ↗
                  </a>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="chapter contact" aria-labelledby="contact-title">
          <div className="wrap">
            <p className="mono chapter-kicker" data-reveal>
              Prochaine scène
            </p>
            <h2 id="contact-title" className="cond contact-title" data-reveal>
              Et si la suite s’écrivait avec vous{NB}?
            </h2>
            <p className="contact-lead" data-reveal>
              Votre entreprise a besoin d’un marketing plus visible, d’un site
              qui convainc ou d’une équipe qui gagne du temps avec l’IA{NB}?
              Écrivez-moi directement.
            </p>
            <a className="contact-email" href={`mailto:${links.email}`} data-reveal>
              {links.email}
            </a>
            <div className="contact-actions" data-reveal>
              <a className="btn rec" href={`mailto:${links.email}`}>
                Écrire un email
              </a>
              <button type="button" className="btn ghost" onClick={copyEmail}>
                {copied ? "Adresse copiée ✓" : "Copier l’adresse"}
              </button>
              <a className="btn ghost" href={links.cv} download>
                CV <span className="mono">PDF</span>
              </a>
            </div>
            <p className="sr-only" role="status">
              {copied ? "Adresse email copiée dans le presse-papiers." : ""}
            </p>
            <dl className="contact-meta mono" data-reveal>
              <div>
                <dt>Téléphone</dt>
                <dd>
                  <a href={links.phoneHref}>{links.phone}</a>
                </dd>
              </div>
              <div>
                <dt>Lieu</dt>
                <dd>Melun · Île-de-France</dd>
              </div>
              <div>
                <dt>LinkedIn</dt>
                <dd>
                  <a href={links.linkedin} target="_blank" rel="noreferrer">
                    Rayan M. ↗
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </section>
      </main>

      <footer className="endcard">
        <div className="wrap endcard-inner">
          <p className="cond endcard-title" aria-hidden="true">
            À suivre…
          </p>
          <p className="mono">Un film de Rayan Mpondo · 2026</p>
          <ul className="endcard-links mono">
            <li>
              <a href={links.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
            </li>
            <li>
              <a href={links.youtube} target="_blank" rel="noreferrer">YouTube ↗</a>
            </li>
            <li>
              <a href={links.instagram} target="_blank" rel="noreferrer">Instagram ↗</a>
            </li>
            <li>
              <a href={links.twitch} target="_blank" rel="noreferrer">Twitch ↗</a>
            </li>
            <li>
              <a href={links.studio} target="_blank" rel="noreferrer">Mad Makers ↗</a>
            </li>
          </ul>
        </div>
      </footer>

      <Scrubber chapters={CHAPTERS} quiet={quiet} onQuiet={() => setQuiet((q) => !q)} />

      <dialog
        ref={dialog}
        className="preview"
        aria-labelledby="preview-title"
        onClose={() => setPreview(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        {shown ? (
          <div className="preview-shell">
            <div className="preview-head">
              <div>
                <p className="mono">
                  {shown.id === "frieren" ? "Démonstration enregistrée" : "Site externe interactif"}
                </p>
                <h2 id="preview-title" className="cond">
                  {shown.title}
                </h2>
              </div>
              <button
                type="button"
                className="preview-close"
                onClick={() => dialog.current?.close()}
                autoFocus
                aria-label="Fermer l’aperçu"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
                  <path d="m6 6 12 12M18 6 6 18" />
                </svg>
              </button>
            </div>
            {shown.id === "frieren" ? (
              <video
                src="/media/frieren-demo.mp4"
                controls
                playsInline
                preload="metadata"
                aria-label="Démonstration des interactions du site Frieren"
              />
            ) : (
              <iframe
                src={shown.url}
                title={`Site ${shown.title}`}
                referrerPolicy="no-referrer"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
              />
            )}
            <div className="preview-foot">
              <p>
                {shown.id === "frieren"
                  ? "Capture des interactions du projet Frieren."
                  : "Le site peut limiter son affichage intégré. Ouvrez-le dans un nouvel onglet si nécessaire."}
              </p>
              <a className="text-link" href={shown.url} target="_blank" rel="noreferrer">
                Ouvrir le site ↗
              </a>
            </div>
          </div>
        ) : null}
      </dialog>
    </div>
  );
}
