// src/components/layout/DesktopNav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { NAV_ITEMS } from './navItems';

export default function DesktopNav() {
  const pathname = usePathname();
  const isActive = (href?: string) => href === pathname;

  return (
    <nav className="hidden lg:flex items-center">
      <ul className="flex items-center">
        {NAV_ITEMS.map((item) => (
          <li key={item.label} className="relative group ml-6">
            {item.children ? (
              <>
                {/* Parent with dropdown */}
                <button
                  aria-haspopup="true"
                  className="flex items-center gap-1 text-white font-medium hover:text-amber-400 transition-colors cursor-pointer"
                >
                  {item.label}
                  <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
                </button>

                {/* Dropdown menu */}
                <ul className="absolute top-8 left-[-2rem] min-w-[13rem] pb-2 px-4 bg-[#001A23] border-t-2 border-amber-400 shadow-lg rounded-b opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 transition-all duration-500 ease-in-out z-50">
                  {item.children.map((child) => (
                    <li
                      key={child.label}
                      className={`mt-3 ${child.children ? 'relative group/sub' : ''}`}
                    >
                      {child.children ? (
                        <>
                          {/* Nested parent */}
                          <button
                            aria-haspopup="true"
                            className="flex items-center justify-between w-full text-white font-medium hover:text-amber-400 transition-colors text-sm"
                          >
                            {child.label}
                            <ChevronDown
                              size={12}
                              className="-rotate-90 transition-transform group-hover/sub:rotate-0"
                            />
                          </button>

                          {/* Nested dropdown */}
                          <ul className="absolute top-0 left-full ml-2 min-w-[14rem] pb-2 px-4 bg-[#001A23] border-t-2 border-amber-400 shadow-lg rounded-b opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible group-focus-within/sub:opacity-100 group-focus-within/sub:visible transition-all duration-500 ease-in-out z-50">
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
  );
}