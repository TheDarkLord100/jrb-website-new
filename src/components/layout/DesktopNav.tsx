// src/components/layout/DesktopNav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { NAV_ITEMS, INTERNAL_NAV_ITEM } from './navItems';
import { useStudentSession } from '@/lib/hooks/useStudentSession';

export default function DesktopNav() {
  const pathname = usePathname();
  const isActive = (href?: string) => href === pathname;
  const { isLoggedIn } = useStudentSession();
  const items = isLoggedIn
    ? [...NAV_ITEMS.slice(0, -1), INTERNAL_NAV_ITEM, NAV_ITEMS[NAV_ITEMS.length - 1]]
    : NAV_ITEMS;

  return (
    <nav className="hidden items-center lg:flex">
      <ul className="flex items-center">
        {items.map((item) => (
          <li key={item.label} className="group relative ml-6">
            {item.children ? (
              <>
                {/* Parent with dropdown */}
                <button
                  aria-haspopup="true"
                  className="flex cursor-pointer items-center gap-1 font-medium text-white transition-colors hover:text-amber-400"
                >
                  {item.label}
                  <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
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
  );
}
