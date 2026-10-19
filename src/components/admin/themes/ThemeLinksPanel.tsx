'use client';

import { useEffect, useState } from 'react';
import { getAllThemeLabLinks, getLabs, setThemeLabLink } from '@/lib/supabase/queries';
import { getTheme } from '@/lib/researchThemes';
import { useToast } from '@/components/admin/Toast';
import ThemeLinkGrid, { type GridRow } from './ThemeLinkGrid';
import type { Lab } from '@/types/lab';

const keyOf = (labId: string, themeSlug: string) => `${labId}:${themeSlug}`;

// Which labs appear under "Affiliated Labs" on each research theme page.
// Every tick saves straight away; there's no separate Save button.
export default function ThemeLinksPanel() {
  const toast = useToast();

  const [labs, setLabs] = useState<Lab[] | null>(null);
  // Links held as a key set for quick lookup while rendering the grid.
  const [links, setLinks] = useState<Set<string> | null>(null);
  const [pending, setPending] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([getAllThemeLabLinks(), getLabs()])
      .then(([labLinks, labRows]) => {
        if (cancelled) return;
        setLinks(new Set(labLinks.map((l) => keyOf(l.lab_id, l.theme_slug))));
        setLabs(labRows);
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load theme links.');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <p className="py-20 text-center text-gray-500">
        Couldn&apos;t load theme links right now. Please try again shortly.
      </p>
    );
  }

  if (!labs || !links) {
    return (
      <div className="animate-pulse space-y-3 py-10">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-11 w-full rounded bg-gray-100" />
        ))}
      </div>
    );
  }

  const rows: GridRow[] = [...labs]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((l) => ({ id: l.id, name: l.name }));

  // Flips one link: updates the grid at once, saves, and undoes the change
  // if the save fails.
  const toggle = async (labId: string, themeSlug: string) => {
    const key = keyOf(labId, themeSlug);
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

    const ok = await setThemeLabLink({ theme_slug: themeSlug, lab_id: labId }, linking);

    setPending((prev) => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });

    const name = rows.find((r) => r.id === labId)?.name ?? 'Lab';
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
      <p className="mb-3 text-xs text-stone-500">
        Ticked labs appear under “Affiliated Labs” on that theme’s page. Changes save as you tick.
      </p>

      <ThemeLinkGrid
        rows={rows}
        isLinked={(id, slug) => links.has(keyOf(id, slug))}
        onToggle={toggle}
        pending={pending}
        itemLabel="labs"
      />
    </div>
  );
}
