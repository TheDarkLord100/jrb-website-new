// src/components/layout/Navbar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import DesktopNav from './DesktopNav';
import MobileDrawer from './MobileDrawer';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* ── Fixed Header ─────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#001A23] shadow-md h-16">
        <div className="max-w-[75rem] mx-auto px-5 h-full flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-4 text-white font-semibold text-lg hover:no-underline">
            <Image
              src="/Assets/logos/bird.png"
              alt="CoE BIRD Logo"
              width={48}
              height={48}
              className="h-12 w-auto"
            />
            <span className="hidden sm:block">CoE on BIRD | IIT Delhi</span>
          </Link>

          <DesktopNav />

          {/* Burger button */}
          <button
            className="lg:hidden text-white p-1"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      <MobileDrawer mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}