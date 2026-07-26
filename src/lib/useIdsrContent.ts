"use client";

import { useEffect, useState } from "react";
import {
  getIdsrSections,
  getIdsrCurriculumStructure,
  getIdsrCoreCourses,
  getIdsrElectives,
} from "@/lib/supabase/queries";
import type { IdsrSection, IdsrCurriculumRow, IdsrCoreCourse, IdsrElective } from "@/types/idsr";

type IdsrContentData = {
  sections: IdsrSection[];
  curriculum: IdsrCurriculumRow[];
  coreCourses: IdsrCoreCourse[];
  electives: IdsrElective[];
};

export function useIdsrContent() {
  const [data, setData] = useState<IdsrContentData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      getIdsrSections(),
      getIdsrCurriculumStructure(),
      getIdsrCoreCourses(),
      getIdsrElectives(),
    ])
      .then(([sections, curriculum, coreCourses, electives]) => {
        if (!cancelled) setData({ sections, curriculum, coreCourses, electives });
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load page content");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, error };
}