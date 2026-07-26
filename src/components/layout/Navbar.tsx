'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';

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
  { label: 'Industry Connect', href: '/industry' },
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
      <header className="fixed top-0 left-0 z-50 h-16 w-full bg-[#001A23] shadow-md">
        <div className="mx-auto flex h-full max-w-[75rem] items-center justify-between px-5">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-4 text-lg font-semibold text-white hover:no-underline"
          >
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
          <nav className="hidden items-center lg:flex">
            <ul className="flex items-center">
              {NAV_ITEMS.map((item) => (
                <li key={item.label} className="group relative ml-6">
                  {item.children ? (
                    <>
                      {/* Parent with dropdown */}
                      <button
                        aria-haspopup="true"
                        className="flex cursor-pointer items-center gap-1 font-medium text-white transition-colors hover:text-amber-400"
                      >
                        {item.label}
                        <ChevronDown
                          size={14}
                          className="transition-transform group-hover:rotate-180"
                        />
                      </button>

                      {/* Dropdown menu */}
                      <ul className="invisible absolute top-8 left-[-2rem] z-50 min-w-[13rem] translate-y-2 rounded-b border-t-2 border-amber-400 bg-[#001A23] px-4 pb-2 opacity-0 shadow-lg transition-all duration-500 ease-in-out group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                        {item.children.map((child) => (
                          <li
                            key={child.label}
                            className={`mt-3 ${child.children ? 'group/sub relative' : ''}`}
                          >
                            {child.children ? (
                              <>
                                {/* Nested parent */}
                                <button
                                  aria-haspopup="true"
                                  className="flex w-full items-center justify-between text-sm font-medium text-white transition-colors hover:text-amber-400"
                                >
                                  {child.label}
                                  <ChevronDown
                                    size={12}
                                    className="-rotate-90 transition-transform group-hover/sub:rotate-0"
                                  />
                                </button>

                                {/* Nested dropdown */}
                                <ul className="invisible absolute top-0 left-full z-50 ml-2 min-w-[14rem] rounded-b border-t-2 border-amber-400 bg-[#001A23] px-4 pb-2 opacity-0 shadow-lg transition-all duration-500 ease-in-out group-focus-within/sub:visible group-focus-within/sub:opacity-100 group-hover/sub:visible group-hover/sub:opacity-100">
                                  {child.children.map((nested) => (
                                    <li key={nested.label} className="mt-3">
                                      <Link
                                        href={nested.href!}
                                        className={`text-sm font-medium transition-colors hover:text-amber-400 ${
                                          isActive(nested.href) ? 'text-amber-400' : 'text-white'
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
                                className={`text-sm font-medium transition-colors hover:text-amber-400 ${
                                  isActive(child.href) ? 'text-amber-400' : 'text-white'
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
                      className={`font-medium transition-colors hover:text-amber-400 ${
                        isActive(item.href) ? 'text-amber-400' : 'text-white'
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
            className="p-1 text-white lg:hidden"
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
          className="fixed inset-0 z-40 bg-black/65 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile Drawer ────────────────────────────────────────────────────── */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-3/4 max-w-xs overflow-y-auto bg-[#001A23] transition-transform duration-700 ease-in-out lg:hidden ${
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
        <div className="border-b border-white/10 px-5 pb-4">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 font-semibold text-white"
          >
            <Image
              src="/Assets/logos/bird.png"
              alt="CoE BIRD"
              width={36}
              height={36}
              className="h-9 w-auto"
            />
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
                    aria-expanded={openItems.has(item.label)}
                    className="flex w-full items-center justify-between py-3 font-medium text-white"
                  >
                    {item.label}
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${openItems.has(item.label) ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {openItems.has(item.label) && (
                    <ul className="pb-2 pl-4">
                      {item.children.map((child) => (
                        <li key={child.label}>
                          {child.children ? (
                            <>
                              <button
                                onClick={() => toggleItem(child.label)}
                                aria-expanded={openItems.has(child.label)}
                                className="flex w-full items-center justify-between py-2 text-sm font-medium text-white/80"
                              >
                                {child.label}
                                <ChevronDown
                                  size={14}
                                  className={`transition-transform ${openItems.has(child.label) ? 'rotate-180' : ''}`}
                                />
                              </button>

                              {openItems.has(child.label) && (
                                <ul className="pb-1 pl-4">
                                  {child.children.map((nested) => (
                                    <li key={nested.label}>
                                      <Link
                                        href={nested.href!}
                                        onClick={() => setMobileOpen(false)}
                                        className="block py-2 text-sm text-white/70 transition-colors hover:text-amber-400"
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
                              className="block py-2 text-sm text-white/80 transition-colors hover:text-amber-400"
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
                  className={`block py-3 font-medium transition-colors hover:text-amber-400 ${
                    isActive(item.href) ? 'text-amber-400' : 'text-white'
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
