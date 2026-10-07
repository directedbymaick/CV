import type { Metadata, Viewport } from "next";
import "./globals.css";
export const viewport: Viewport = { themeColor: "#0c0c0a", colorScheme: "dark" };
const origin = process.env.SITE_ORIGIN;
export const metadata: Metadata = {
  title: "Rayan Mpondo — Marketing digital B2B, création web & IA",
  description:
    "Marketing digital B2B, création web et IA pour les PME et ETI de l’industrie et de la construction. Parcours, projets et contact de Rayan Mpondo.",
  icons: { icon: "/media/rayan-icon.png" },
  ...(origin
    ? { metadataBase: new URL(origin), alternates: { canonical: "/" } }
    : {}),
  openGraph: {
    title: "Rayan Mpondo — Marketing digital B2B, création web & IA",
    description:
      "Marketing digital B2B, sites web et IA pour les PME et ETI. Parcours, projets et contact.",
    locale: "fr_FR",
    type: "website",
    ...(origin
      ? {
          images: [
            {
              url: `${origin}/og.png`,
              width: 1730,
              height: 909,
              alt: "Rayan Mpondo — Marketing digital, création web et IA",
            },
          ],
        }
      : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: "Rayan Mpondo — Marketing digital B2B, création web & IA",
    ...(origin ? { images: [`${origin}/og.png`] } : {}),
  },
};
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Rayan Mpondo",
  jobTitle: "Marketing digital B2B, création web & IA",
  description: "Marketing digital B2B, création web et IA pour les PME et ETI de l’industrie et de la construction.",
  email: "mailto:rayan.mpondo@gmail.com",
  telephone: "+33766039808",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Melun",
    addressRegion: "Île-de-France",
    addressCountry: "FR",
  },
  ...(origin ? { url: origin } : {}),
  sameAs: [
    "https://www.linkedin.com/in/rayan-m-3a8ba6145/",
    "https://www.youtube.com/@maickstream",
    "https://www.instagram.com/darthmaick/",
    "https://www.mad-makers.fr",
  ],
  knowsAbout: [
    "Marketing digital B2B",
    "Création de contenu",
    "Conception et développement web",
    "SEO technique",
    "Accessibilité web",
    "Intelligence artificielle générative",
    "Automatisation marketing",
  ],
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Root layout covers the whole site, so the font loads everywhere. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          precedence="default"
          href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,300..900&family=JetBrains+Mono:wght@400;500&display=swap"
        />
        <link
          rel="preload"
          as="image"
          type="image/avif"
          href="/media/rayan-still-1254.avif"
          imageSrcSet="/media/rayan-still-800.avif 800w, /media/rayan-still-1254.avif 1254w"
          imageSizes="(max-width: 820px) 100vw, 46vw"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
