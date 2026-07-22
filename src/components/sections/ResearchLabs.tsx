"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useLabs } from "@/lib/useLabs";
import type { LabCategory } from "@/types/lab";

const CATEGORIES: { key: LabCategory; label: string }[] = [
  { key: "perception", label: "Perception & Cognition" },
  { key: "dynamics", label: "Dynamics & Control" },
  { key: "human", label: "Human Centered & Medical Robotics" },
  { key: "manufacturing", label: "Manufacturing & Prototyping" },
];

function LabsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {CATEGORIES.map((c) => (
          <div key={c.key} className="h-24 rounded-xl bg-gray-100" />
        ))}
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden border-t-2 border-gray-200 bg-white shadow-sm ring-1 ring-gray-100">
            <div className="h-44 w-full bg-gray-100" />
            <div className="p-4">
              <div className="h-4 w-2/3 rounded bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ResearchLabs() {
  const { labs, error } = useLabs();
  const [active, setActive] = useState<LabCategory>("perception");

  const filtered = useMemo(() => {
    if (!labs) return [];
    return labs
      .filter((lab) => lab.category === active)
      .sort((a, b) => {
        const pa = a.priority ?? Infinity;
        const pb = b.priority ?? Infinity;
        if (pa !== pb) return pa - pb;
        return a.name.localeCompare(b.name);
      });
  }, [labs, active]);

  if (error) {
    return (
      <p className="py-20 text-center text-gray-500">
        Couldn&apos;t load the labs directory right now. Please try again shortly.
      </p>
    );
  }

  if (!labs) {
    return <LabsSkeleton />;
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActive(cat.key)}
            className={`flex flex-col items-center justify-center gap-2 border-t-2 p-5 text-center text-sm font-semibold transition-colors ${
              active === cat.key
                ? "border-amber-400 bg-amber-50 text-amber-800"
                : "border-gray-200 bg-white text-[#001A23] hover:border-amber-300"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((lab) => {
          const content = (
            <>
              {lab.cover_image_url && (
                <div className="relative h-44 w-full">
                  <Image src={lab.cover_image_url} alt={lab.name} fill className="object-cover" />
                </div>
              )}
              <div className="p-4">
                <p className="font-serif font-semibold text-[#001A23]">{lab.name}</p>
              </div>
            </>
          );

          const cardClass =
            "block overflow-hidden border-t-2 border-amber-400 bg-white shadow-sm ring-1 ring-gray-100 transition-shadow hover:shadow-md";

          return lab.external_url ? (
            <a key={lab.id} href={lab.external_url} target="_blank" rel="noopener noreferrer" className={cardClass}>
              {content}
            </a>
          ) : (
            <Link key={lab.id} href={`/research/facilities/${lab.slug}`} className={cardClass}>
              {content}
            </Link>
          );
        })}
        {filtered.length === 0 && (
          <p className="col-span-full py-10 text-center text-gray-500">
            No labs listed in this category yet.
          </p>
        )}
      </div>
    </div>
  );
}