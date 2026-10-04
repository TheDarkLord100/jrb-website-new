'use client';

import { useEffect, useState } from 'react';
import { usePeople } from '@/lib/hooks/usePeople';
import {
  getAllThemeLinks,
  getLabs,
  setThemeFacultyLink,
  setThemeLabLink,
  type ThemeFacultyLink,
  type ThemeLabLink,
} from '@/lib/supabase/queries';
import { getTheme } from '@/lib/researchThemes';
import { useToast } from '@/components/admin/Toast';
import ThemeLinkGrid, { type GridRow } from './ThemeLinkGrid';
import type { Lab } from '@/types/lab';

type Tab = 'faculty' | 'labs';

const keyOf = (rowId: string, themeSlug: string) => `${rowId}:${themeSlug}`;

// Which faculty and labs appear on each research theme page. Every tick
// saves straight away; there's no separate Save button.
export default function ThemeLinksPanel() {
  const { people, error: peopleError } = usePeople();
  const toast = useToast();

  const [tab, setTab] = useState<Tab>('faculty');
  const [labs, setLabs] = useState<Lab[] | null>(null);
  // Links held as key sets for quick lookup while rendering the grid.
  const [facultyLinks, setFacultyLinks] = useState<Set<string> | null>(null);
  const [labLinks, setLabLinks] = useState<Set<string> | null>(null);
  const [pending, setPending] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([getAllThemeLinks(), getLabs()])
      .then(([links, labRows]) => {
        if (cancelled) return;
        setFacultyLinks(new Set(links.faculty.map((l) => keyOf(l.person_id, l.theme_slug))));
        setLabLinks(new Set(links.labs.map((l) => keyOf(l.lab_id, l.theme_slug))));
        setLabs(labRows);
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load theme links.');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (error || peopleError) {
    return (
      <p className="py-20 text-center text-gray-500">
        Couldn&apos;t load theme links right now. Please try again shortly.
      </p>
    );
  }

  if (!people || !labs || !facultyLinks || !labLinks) {
    return (
      <div className="animate-pulse space-y-3 py-10">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-11 w-full rounded bg-gray-100" />
        ))}
      </div>
    );
  }

  // Faculty, plus anyone who's still linked to a theme but no longer has the
  // faculty role -- they'd otherwise keep showing under "Faculty Involved"
  // with no way to spot them here.
  const facultyRows: GridRow[] = people
    .filter(
      (p) => p.role === 'faculty' || [...facultyLinks].some((key) => key.startsWith(`${p.id}:`))
    )
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((p) => ({
      id: p.id,
      name: p.name,
      note:
        p.role === 'faculty'
          ? undefined
          : `No longer faculty (now ${p.role}) — still shown on these themes until unticked.`,
    }));

  const labRows: GridRow[] = [...labs]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((l) => ({ id: l.id, name: l.name }));

  // Flips one link: updates the grid at once, saves, and undoes the change
  // if the save fails.
    // Flips one link: updates the grid at once, saves, and undoes the change
  // if the save fails.
  const toggle = async (kind: Tab, rowId: string, themeSlug: string) => {
    const key = keyOf(rowId, themeSlug);
    const links = kind === 'faculty' ? facultyLinks : labLinks;
    const setLinks = kind === 'faculty' ? setFacultyLinks : setLabLinks;
    const linking = !links.has(key);

    const apply = (add: boolean) =>
      setLinks((prev) => {
        const next = new Set(prev);
        if (add) next.add(key);
        else next.delete(key);
        return next;
      });

    apply(linking);
    setPending((prev) => new Set(prev).add(key));

    const ok =
      kind === 'faculty'
        ? await setThemeFacultyLink(
            { theme_slug: themeSlug, person_id: rowId } satisfies ThemeFacultyLink,
            linking
          )
        : await setThemeLabLink(
            { theme_slug: themeSlug, lab_id: rowId } satisfies ThemeLabLink,
            linking
          );

    setPending((prev) => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });

    const name =
      (kind === 'faculty' ? facultyRows : labRows).find((r) => r.id === rowId)?.name ??
      (kind === 'faculty' ? 'Faculty member' : 'Lab');
    const theme = getTheme(themeSlug)?.shortLabel ?? themeSlug;

    if (!ok) {
      apply(!linking);
      toast.error(
        `Couldn't ${linking ? 'add' : 'remove'} ${name} ${linking ? 'to' : 'from'} ${theme}. Check the console for details.`
      );
      return;
    }
    toast.success(linking ? `${name} added to ${theme}.` : `${name} removed from ${theme}.`);
  };

  return (
    <div>
      <div className="flex gap-1 border-b border-stone-200">
        {(
          [
            { id: 'faculty', label: 'Faculty', count: facultyRows.length },
            { id: 'labs', label: 'Labs', count: labRows.length },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
              tab === t.id
                ? 'border-teal-700 text-teal-700'
                : 'border-transparent text-stone-400 hover:text-stone-600'
            }`}
          >
            {t.label}
            <span className="ml-1.5 text-xs font-normal text-stone-400">{t.count}</span>
          </button>
        ))}
      </div>

      <p className="mt-4 mb-3 text-xs text-stone-500">
        {tab === 'faculty'
          ? 'Ticked faculty appear under “Faculty Involved” on that theme’s page. A faculty member linked to exactly one theme also gets it pre-selected when importing their publications.'
          : 'Ticked labs appear under “Affiliated Labs” on that theme’s page.'}{' '}
        Changes save as you tick.
      </p>

      {tab === 'faculty' ? (
        <ThemeLinkGrid
          key="faculty"
          rows={facultyRows}
          isLinked={(id, slug) => facultyLinks.has(keyOf(id, slug))}
          onToggle={(id, slug) => toggle('faculty', id, slug)}
          pending={pending}
          itemLabel="faculty"
        />
      ) : (
        <ThemeLinkGrid
          key="labs"
          rows={labRows}
          isLinked={(id, slug) => labLinks.has(keyOf(id, slug))}
          onToggle={(id, slug) => toggle('labs', id, slug)}
          pending={pending}
          itemLabel="labs"
        />
      )}
    </div>
  );
}