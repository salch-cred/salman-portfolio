import type { Metadata, Viewport } from 'next';
import { Gloock, IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google';
import { DEFAULT_PALETTE, paletteCss } from '@/lib/palettes';
import './globals.css';

const display = Gloock({ weight: '400', subsets: ['latin'], variable: '--font-display' });
const mono = IBM_Plex_Mono({ weight: ['400', '500'], subsets: ['latin'], variable: '--font-mono' });
const sans = IBM_Plex_Sans({ weight: ['400', '500', '600'], subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Mahammad Salman, AI/ML Engineer & Full-Stack Developer',
  description:
    'Agent infrastructure, settlement rails and reliability work. Upstream contributor to Hermes Agent. Builder of PayMate and MediVault.',
};

export const viewport: Viewport = { themeColor: '#f6f6f2' };

// Runs before paint, so the saved palette applies and returning visitors skip the intro without a flash.
const preload = `try{var p=localStorage.getItem('palette');if(p)document.documentElement.dataset.palette=p;
if(sessionStorage.getItem('booted')||location.search.indexOf('skip')>-1||matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('booted')}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-palette={DEFAULT_PALETTE}
      className={`${display.variable} ${mono.variable} ${sans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: paletteCss }} />
        <script dangerouslySetInnerHTML={{ __html: preload }} />
        <noscript>
          <style>{`.boot{display:none!important}.rise,.sec-title,.fig,.deco path{opacity:1!important;transform:none!important;stroke-dashoffset:0!important;fill-opacity:1!important}.hero-name span{transform:none!important}`}</style>
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
