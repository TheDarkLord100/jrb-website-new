"use client";

import { useEffect, useState } from "react";
import { getPeople } from "@/lib/supabase/queries";
import type { Person } from "@/types/person";

export function usePeople() {
  const [people, setPeople] = useState<Person[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getPeople()
      .then((data) => {
        if (!cancelled) setPeople(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load people");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { people, error };
}