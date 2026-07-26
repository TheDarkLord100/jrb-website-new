// src/components/layout/MobileDrawer.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { X, ChevronDown } from 'lucide-react';
import { NAV_ITEMS } from './navItems';

export default function MobileDrawer({
  mobileOpen,
  onClose,
}: {
  mobileOpen: boolean;
  onClose: () => void;
}) {
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
      {/* ── Mobile Overlay ───────────────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/65 z-40 lg:hidden" onClick={onClose} />
      )}

      {/* ── Mobile Drawer ────────────────────────────────────────────────────── */}
      <div
        className={`fixed top-0 left-0 h-full w-3/4 max-w-xs bg-[#001A23] z-50 lg:hidden overflow-y-auto transition-transform duration-700 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close button */}
        <div className="flex justify-end p-4">
          <button className="text-white" onClick={onClose} aria-label="Close menu">
            <X size={24} />
          </button>
        </div>

        {/* Logo in drawer */}
        <div className="px-5 pb-4 border-b border-white/10">
          <Link href="/" onClick={onClose} className="flex items-center gap-3 text-white font-semibold">
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
                    aria-expanded={openItems.has(item.label)}
                    className="flex justify-between items-center w-full py-3 text-white font-medium"
                  >
                    {item.label}
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${openItems.has(item.label) ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {openItems.has(item.label) && (
                    <ul className="pl-4 pb-2">
                      {item.children.map((child) => (
                        <li key={child.label}>
                          {child.children ? (
                            <>
                              <button
                                onClick={() => toggleItem(child.label)}
                                aria-expanded={openItems.has(child.label)}
                                className="flex justify-between items-center w-full py-2 text-white/80 font-medium text-sm"
                              >
                                {child.label}
                                <ChevronDown
                                  size={14}
                                  className={`transition-transform ${openItems.has(child.label) ? 'rotate-180' : ''}`}
                                />
                              </button>

                              {openItems.has(child.label) && (
                                <ul className="pl-4 pb-1">
                                  {child.children.map((nested) => (
                                    <li key={nested.label}>
                                      <Link
                                        href={nested.href!}
                                        onClick={onClose}
                                        className="block py-2 text-white/70 text-sm hover:text-amber-400 transition-colors"
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
                              onClick={onClose}
                              className="block py-2 text-white/80 text-sm hover:text-amber-400 transition-colors"
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
                  onClick={onClose}
                  className={`block py-3 font-medium hover:text-amber-400 transition-colors ${
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