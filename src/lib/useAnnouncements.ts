"use client";

import { useEffect, useState } from "react";
import { getAnnouncements } from "@/lib/announcements";
import type { Announcement } from "@/types/announcement";

export function useAnnouncements() {
  const [items, setItems] = useState<Announcement[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    getAnnouncements().then((data) => {
      if (!cancelled) setItems(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return items;
}
