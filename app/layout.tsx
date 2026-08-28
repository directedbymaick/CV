import type { Metadata } from "next";
import "./globals.css";
const origin = process.env.SITE_ORIGIN;
export const metadata: Metadata = {
  title: "Rayan Mpondo — Marketing digital & création web",
  description:
    "Stratégie marketing, expériences web et création de contenu. Découvrez le parcours et les réalisations de Rayan Mpondo.",
  icons: { icon: "/media/rayan-icon.png" },
  ...(origin
    ? { metadataBase: new URL(origin), alternates: { canonical: "/" } }
    : {}),
  openGraph: {
    title: "Rayan Mpondo — Marketing digital & création web",
    description:
      "De la stratégie à l’expérience. Parcours, projets web et création de contenu.",
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
    title: "Rayan Mpondo — Marketing digital & création web",
    ...(origin ? { images: [`${origin}/og.png`] } : {}),
  },
};
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Rayan Mpondo",
  jobTitle: "Chargé de marketing digital",
  description: "Marketing digital, création web et production de contenus.",
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
    "Marketing digital",
    "Création de contenu",
    "Conception web",
    "Intelligence artificielle générative",
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;450;500;600&family=Space+Grotesk:wght@400;500;600&display=swap"
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
