"use client";

import { useEffect, useState } from "react";
import { getAdmissionSections, getAdmissionLinks } from "@/lib/supabase/queries";
import type { AdmissionSection, AdmissionLink } from "@/types/admissions";

type AdmissionsData = {
  sections: AdmissionSection[];
  links: AdmissionLink[];
};

export function useAdmissions() {
  const [data, setData] = useState<AdmissionsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([getAdmissionSections(), getAdmissionLinks()])
      .then(([sections, links]) => {
        if (!cancelled) setData({ sections, links });
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load admissions data");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, error };
}