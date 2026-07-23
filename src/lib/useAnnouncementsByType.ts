"use client";

import { useEffect, useState } from "react";
import { getAnnouncementsByType } from "@/lib/supabase/queries";
import type { Announcement } from "@/types/announcement";

export function useAnnouncementsByType(type: Announcement["type"]) {
  const [items, setItems] = useState<Announcement[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setItems(null);
    setError(null);

    getAnnouncementsByType(type)
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load announcements");
      });

    return () => {
      cancelled = true;
    };
  }, [type]);

  return { items, error };
}