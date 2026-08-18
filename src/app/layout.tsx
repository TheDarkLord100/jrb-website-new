import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import '@/app/globals.css';

const inter = { variable: '' };
const libreBaskerville = { variable: '' };

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
// Structured data (JSON-LD) — describes CoE-BIRD as a research org under
// IIT Delhi for search engines. 
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ResearchOrganization',
  name: 'Centre of Excellence on Biologically Inspired Robots and Drones',
  alternateName: 'CoE-BIRD',
  url: 'https://robotics.iitd.ac.in',
  logo: 'https://robotics.iitd.ac.in/Assets/logos/bird.png',
  description: SITE_DESCRIPTION,
  email: 'robotics@iitd.ac.in',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'IIT Campus, Hauz Khas',
    addressLocality: 'New Delhi',
    addressRegion: 'Delhi',
    postalCode: '110016',
    addressCountry: 'IN',
  },
  parentOrganization: {
    '@type': 'CollegeOrUniversity',
    name: 'Indian Institute of Technology Delhi',
    url: 'https://home.iitd.ac.in',
  },
  sameAs: ['https://www.linkedin.com/company/center-of-excellence-bird-robotics-drones-iitd'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${libreBaskerville.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Navbar />
        {/* pt-16 offsets the fixed navbar height */}
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}