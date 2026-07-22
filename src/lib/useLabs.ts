"use client";

import { useEffect, useState } from "react";
import { getLabs } from "@/lib/supabase/queries";
import type { Lab } from "@/types/lab";

export function useLabs() {
  const [labs, setLabs] = useState<Lab[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getLabs()
      .then((data) => {
        if (!cancelled) setLabs(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load labs");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { labs, error };
}