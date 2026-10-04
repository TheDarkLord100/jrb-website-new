'use client';

import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import type { Publication } from '@/types/publication';

// How many papers show before "Show all". A prolific theme can have dozens,
// and the page shouldn't turn into one long bibliography by default.
const INITIAL_COUNT = 10;

// Newest year first; papers with no year go last under "Other".
function groupByYear(publications: Publication[]): [string, Publication[]][] {
  const groups = new Map<string, Publication[]>();
  for (const pub of publications) {
    const key = pub.year ? String(pub.year) : 'Other';
    groups.set(key, [...(groups.get(key) ?? []), pub]);
  }
  return [...groups.entries()].sort(([a], [b]) => {
    if (a === 'Other') return 1;
    if (b === 'Other') return -1;
    return Number(b) - Number(a);
  });
}

// Reduces a name to surname + first initial, ignoring titles, dots,
// hyphens, accents and case -- so "Prof. Shubhendu Bhasin", "S. Bhasin" and
// "Shubhendu  Bhasin" all compare equal.
function nameKey(name: string): string | null {
  const parts = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\b(prof|dr|mr|ms|mrs)\b\.?/g, ' ')
    .replace(/[.\-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return null;
  return `${parts[0][0]} ${parts[parts.length - 1]}`;
}

// The author list with the paper's CoE-BIRD faculty in bold. Only the
// faculty linked to this paper are compared, so an unrelated co-author who
// happens to share a surname and initial isn't highlighted.
function Authors({ authors, facultyNames }: { authors: string; facultyNames: string[] }) {
  const facultyKeys = new Set(facultyNames.map(nameKey).filter(Boolean));
  const names = authors.split(/,\s*/);

  return (
    <p className="mt-1 text-sm text-gray-600">
      {names.map((name, i) => (
        <span key={i}>
          {i > 0 && ', '}
          {facultyKeys.has(nameKey(name)) ? (
            <strong className="font-semibold text-[#001A23]">{name}</strong>
          ) : (
            name
          )}
        </span>
      ))}
    </p>
  );
}

// One theme's published papers as a plain, year-grouped list: title
// (linked to the paper), authors, venue. Arrives already sorted newest
// first from getThemePublications.
export default function ThemePublications({ publications }: { publications: Publication[] }) {
  const [showAll, setShowAll] = useState(false);

  if (publications.length === 0) {
    return <p className="mt-5 text-sm text-gray-500">To be added.</p>;
  }

  const visible = showAll ? publications : publications.slice(0, INITIAL_COUNT);
  const hidden = publications.length - visible.length;

  return (
    <div className="mt-5">
      <div className="space-y-8">
        {groupByYear(visible).map(([year, pubs]) => (
          <div key={year}>
            <h3 className="font-serif text-sm font-bold text-amber-700">{year}</h3>
            <ul className="mt-2 divide-y divide-gray-100 border-t-2 border-amber-400 bg-white shadow-sm ring-1 ring-gray-100">
              {pubs.map((pub) => (
                <li key={pub.id} className="px-5 py-4">
                  {pub.url ? (
                    <a
                      href={pub.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline font-semibold text-[#001A23] hover:text-amber-700"
                    >
                      {pub.title}
                      <ExternalLink
                        size={13}
                        className="ml-1.5 inline-block align-baseline text-gray-400 group-hover:text-amber-700"
                        aria-hidden="true"
                      />
                    </a>
                  ) : (
                    <span className="font-semibold text-[#001A23]">{pub.title}</span>
                  )}
                  {pub.authors && (
                    <Authors authors={pub.authors} facultyNames={pub.faculty_names} />
                  )}
                  {pub.venue && <p className="mt-0.5 text-sm text-gray-500 italic">{pub.venue}</p>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {publications.length > INITIAL_COUNT && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="mt-6 border border-gray-300 px-4 py-1.5 text-sm font-medium text-[#001A23] transition-colors hover:border-amber-400 hover:text-amber-700"
        >
          {showAll ? 'Show fewer' : `Show all ${publications.length} publications (${hidden} more)`}
        </button>
      )}
    </div>
  );
}