"use client";

import { useEffect, useState } from "react";

export type TocSection = { id: string; label: string };

export default function TocNav({ sections }: { sections: TocSection[] }) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    // Treats a section as "active" once it crosses just below the fixed
    // navbar, and stops considering it once it's past the top ~30% of the
    // viewport -- keeps the highlighted item feeling in sync with what's
    // actually on screen instead of jumping the moment a heading appears.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const topMost = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b
        );
        setActiveId(topMost.target.id);
      },
      { rootMargin: "-110px 0px -70% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav
      aria-label="Page sections"
      className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:sticky lg:top-20 lg:flex lg:flex-col lg:gap-0.5 lg:self-start"
    >
      {sections.map((s) => {
        const active = activeId === s.id;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={`border-t-2 bg-white px-3 py-2 text-center text-sm font-medium transition-colors lg:border-t-0 lg:border-l-2 lg:bg-transparent lg:px-3 lg:py-1.5 lg:text-left ${
              active
                ? "border-amber-400 bg-amber-50 text-amber-800 lg:bg-transparent lg:font-semibold lg:text-[#001A23]"
                : "border-gray-200 text-gray-600 hover:border-amber-300 lg:border-transparent lg:font-normal lg:text-gray-500 lg:hover:border-transparent lg:hover:text-[#001A23]"
            }`}
          >
            {s.label}
          </a>
        );
      })}
    </nav>
  );
}