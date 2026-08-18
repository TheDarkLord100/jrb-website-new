import type { Metadata } from 'next';
import { Inter, Libre_Baskerville } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import '@/app/globals.css';

const inter = Inter({ variable: '--font-inter', subsets: ['latin'] });
const libreBaskerville = Libre_Baskerville({
  variable: '--font-libre-baskerville',
  subsets: ['latin'],
  weight: ['400', '700'],
});

const SITE_DESCRIPTION =
  'Centre of Excellence on Biologically Inspired Robots and Drones (BIRD) at IIT Delhi. Advancing research in autonomous systems, cobotics, and intelligent robotics.';


export const metadata: Metadata = {
  metadataBase: new URL('https://robotics.iitd.ac.in'),
  title: {
    default: 'CoE on BIRD | IIT Delhi',
    template: '%s | CoE BIRD IIT Delhi',
  },
  description: SITE_DESCRIPTION,
  keywords: ['IIT Delhi', 'Robotics', 'BIRD', 'CoE', 'research', 'autonomous robots', 'drones'],
  openGraph: {
    type: 'website',
    siteName: 'CoE on BIRD | IIT Delhi',
    title: 'CoE on BIRD | IIT Delhi',
    description: SITE_DESCRIPTION,
    url: 'https://robotics.iitd.ac.in',
    images: ['/Assets/logos/bird.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CoE on BIRD | IIT Delhi',
    description: SITE_DESCRIPTION,
    images: ['/Assets/logos/bird.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${libreBaskerville.variable}`}>
      <body>
        <Navbar />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
