'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type NavChild = {
  label: string;
  href?: string;
  children?: NavChild[];
};

type NavItem = {
  label: string;
  href?: string;
  children?: NavChild[];
};

// ─── Nav Structure ────────────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  {
    label: 'Research',
    children: [
      { label: 'Themes', href: '/research/themes' },
      { label: 'Facilities', href: '/research/facilities' },
    ],
  },
  { label: 'People', href: '/people' },
  {
    label: 'Academics',
    children: [
      {
        label: 'Programmes',
        children: [
          { label: 'M.Tech. in Robotics', href: '/academics/mtech' },
          { label: 'Minor Degree in Robotics', href: '/academics/minor' },
        ],
      },
      { label: 'Admissions', href: '/academics/admissions' },
    ],
  },
  { label: 'Events', href: '/events' },
  { label: 'Contact Us', href: '/contact' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const pathname = usePathname();

  const toggleItem = (label: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });
  };

  const isActive = (href?: string) => href === pathname;

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

          {/* ── Desktop Nav ──────────────────────────────────────────────── */}
          <nav className="hidden lg:flex items-center">
            <ul className="flex items-center">
              {NAV_ITEMS.map((item) => (
                <li key={item.label} className="relative group ml-6">
                  {item.children ? (
                    <>
                      {/* Parent with dropdown */}
                      <button className="flex items-center gap-1 text-white font-medium hover:text-yellow-400 transition-colors cursor-pointer">
                        {item.label}
                      </button>

                      {/* Dropdown menu */}
                      <ul className="absolute top-8 left-[-2rem] min-w-[13rem] pb-2 px-4 bg-[#001A23] border-t-2 border-yellow-400 shadow-lg rounded-b opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-500 ease-in-out z-50">
                        {item.children.map((child) => (
                          <li
                            key={child.label}
                            className={`mt-3 ${child.children ? 'relative group/sub' : ''}`}
                          >
                            {child.children ? (
                              <>
                                {/* Nested parent */}
                                <button className="flex items-center justify-between w-full text-white font-medium hover:text-yellow-400 transition-colors text-sm">
                                  {child.label}
                                </button>

                                {/* Nested dropdown */}
                                <ul className="absolute top-0 left-full ml-2 min-w-[14rem] pb-2 px-4 bg-[#001A23] border-t-2 border-yellow-400 shadow-lg rounded-b opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-500 ease-in-out z-50">
                                  {child.children.map((nested) => (
                                    <li key={nested.label} className="mt-3">
                                      <Link
                                        href={nested.href!}
                                        className={`text-sm font-medium transition-colors hover:text-yellow-400 ${
                                          isActive(nested.href) ? 'text-yellow-400' : 'text-white'
                                        }`}
                                      >
                                        {nested.label}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </>
                            ) : (
                              <Link
                                href={child.href!}
                                className={`text-sm font-medium transition-colors hover:text-yellow-400 ${
                                  isActive(child.href) ? 'text-yellow-400' : 'text-white'
                                }`}
                              >
                                {child.label}
                              </Link>
                            )}
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <Link
                      href={item.href!}
                      className={`font-medium transition-colors hover:text-yellow-400 ${
                        isActive(item.href) ? 'text-yellow-400' : 'text-white'
                      }`}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

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

      {/* ── Mobile Overlay ───────────────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/65 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile Drawer ────────────────────────────────────────────────────── */}
      <div
        className={`fixed top-0 left-0 h-full w-3/4 max-w-xs bg-[#001A23] z-50 lg:hidden overflow-y-auto transition-transform duration-700 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close button */}
        <div className="flex justify-end p-4">
          <button
            className="text-white"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* Logo in drawer */}
        <div className="px-5 pb-4 border-b border-white/10">
          <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 text-white font-semibold">
            <Image src="/Assets/logos/bird.png" alt="CoE BIRD" width={36} height={36} className="h-9 w-auto" />
            <span className="text-sm">CoE on BIRD | IIT Delhi</span>
          </Link>
        </div>

        {/* Mobile nav items */}
        <ul className="px-5 py-4">
          {NAV_ITEMS.map((item) => (
            <li key={item.label} className="border-b border-white/10">
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleItem(item.label)}
                    className="flex justify-between items-center w-full py-3 text-white font-medium"
                  >
                    {item.label}
                  </button>

                  {openItems.has(item.label) && (
                    <ul className="pl-4 pb-2">
                      {item.children.map((child) => (
                        <li key={child.label}>
                          {child.children ? (
                            <>
                              <button
                                onClick={() => toggleItem(child.label)}
                                className="flex justify-between items-center w-full py-2 text-white/80 font-medium text-sm"
                              >
                                {child.label}
                              </button>

                              {openItems.has(child.label) && (
                                <ul className="pl-4 pb-1">
                                  {child.children.map((nested) => (
                                    <li key={nested.label}>
                                      <Link
                                        href={nested.href!}
                                        onClick={() => setMobileOpen(false)}
                                        className="block py-2 text-white/70 text-sm hover:text-yellow-400 transition-colors"
                                      >
                                        {nested.label}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </>
                          ) : (
                            <Link
                              href={child.href!}
                              onClick={() => setMobileOpen(false)}
                              className="block py-2 text-white/80 text-sm hover:text-yellow-400 transition-colors"
                            >
                              {child.label}
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <Link
                  href={item.href!}
                  onClick={() => setMobileOpen(false)}
                  className={`block py-3 font-medium hover:text-yellow-400 transition-colors ${
                    isActive(item.href) ? 'text-yellow-400' : 'text-white'
                  }`}
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}