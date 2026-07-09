import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import '@/app/globals.css';

const inter = Inter({ variable: '--font-inter', subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'CoE on BIRD | IIT Delhi',
    template: '%s | CoE BIRD IIT Delhi',
  },
  description:
    'Centre of Excellence on Biologically Inspired Robots and Drones (BIRD) at IIT Delhi. Advancing research in autonomous systems, cobotics, and intelligent robotics.',
  keywords: ['IIT Delhi', 'Robotics', 'BIRD', 'CoE', 'research', 'autonomous robots', 'drones'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Navbar />
        {/* pt-16 offsets the fixed navbar height */}
        <main className="pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}