import type { Metadata } from 'next';
import './globals.css';
const origin = process.env.SITE_ORIGIN;
export const metadata: Metadata = {
  title: 'Rayan Mpondo — Marketing digital & création web',
  description: 'Stratégie marketing, expériences web et création de contenu. Découvrez le parcours et les réalisations de Rayan Mpondo.',
  robots: { index: false, follow: false },
  icons: { icon: '/media/rayan.png' },
  openGraph: { title: 'Rayan Mpondo — Marketing digital & création web', description: 'De la stratégie à l’expérience. Parcours, projets web et création de contenu.', locale: 'fr_FR', type: 'website', ...(origin ? { images: [{url: `${origin}/og.png`,width:1730,height:909,alt:'Rayan Mpondo — Marketing digital, création web et IA'}] } : {}) },
  twitter: { card: 'summary_large_image', title: 'Rayan Mpondo — Marketing digital & création web', ...(origin ? {images:[`${origin}/og.png`]} : {}) },
};
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return <html lang="fr"><body>{children}</body></html>;
}
