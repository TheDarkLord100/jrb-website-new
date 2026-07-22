"use client";

import { useEffect, useState } from "react";
import { getLabBySlug, getLabImages, getLabAnnouncements } from "@/lib/supabase/queries";
import type { Lab, LabImage, LabAnnouncement } from "@/types/lab";

type LabDetailData = {
  lab: Lab | null;
  images: LabImage[];
  announcements: LabAnnouncement[];
};

export function useLab(slug: string) {
  const [data, setData] = useState<LabDetailData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const lab = await getLabBySlug(slug);
        if (!lab) {
          if (!cancelled) setData({ lab: null, images: [], announcements: [] });
          return;
        }
        const [images, announcements] = await Promise.all([
          getLabImages(lab.id),
          getLabAnnouncements(lab.id),
        ]);
        if (!cancelled) setData({ lab, images, announcements });
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load lab");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { data, error };
}