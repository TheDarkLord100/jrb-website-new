import Image from 'next/image';
import Link from 'next/link';
import { Mail } from 'lucide-react';

// ─── LinkedIn SVG (not in Lucide) ─────────────────────────────────────────────

function LinkedInIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-label="LinkedIn"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#001A23] text-white">
      <div className="max-w-[75rem] mx-auto px-5 py-6 flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Logos */}
        <div className="flex items-center gap-4">
          <Image
            src="/Assets/logos/bird.png"
            alt="CoE BIRD Logo"
            width={40}
            height={40}
            className="h-10 w-auto"
          />
          <Image
            src="/Assets/logos/iit_logo.jpg"
            alt="IIT Delhi Logo"
            width={40}
            height={40}
            className="h-10 w-auto"
          />
        </div>

        {/* Copyright */}
        <p className="text-sm text-white/60 text-center">
          © CoE BIRD {currentYear}, IIT Delhi. All Rights Reserved.
        </p>

        {/* Social links */}
        <div className="flex items-center gap-5">
          <a
            href="mailto:robotics@iitd.ac.in"
            className="text-white/80 hover:text-yellow-400 transition-colors"
            aria-label="Email"
          >
            <Mail size={22} />
          </a>
          <a
            href="https://www.linkedin.com/company/center-of-excellence-bird-robotics-drones-iitd"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/80 hover:text-yellow-400 transition-colors"
            aria-label="LinkedIn"
          >
            <LinkedInIcon />
          </a>
        </div>

      </div>
    </footer>
  );
}