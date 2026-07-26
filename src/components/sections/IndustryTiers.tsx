"use client";

import { useIndustryTiers } from "@/lib/useIndustryTiers";
import { getLucideIcon } from "@/lib/lucideIconMap";

function TiersSkeleton() {
  return (
    <div className="mt-12 grid animate-pulse gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="h-64 border-t-2 border-gray-200 bg-white p-5 shadow-sm ring-1 ring-gray-100"
        />
      ))}
    </div>
  );
}

export default function IndustryTiers() {
  const { tiers, error } = useIndustryTiers();

  if (error) {
    return (
      <p className="mt-12 text-center text-sm text-gray-500">
        Couldn&apos;t load collaboration opportunities right now.
      </p>
    );
  }

  if (tiers === null) {
    return <TiersSkeleton />;
  }

  if (tiers.length === 0) {
    return (
      <p className="mt-12 text-center text-sm text-gray-500">Collaboration details coming soon.</p>
    );
  }

  return (
    <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {tiers.map((tier) => {
        const Icon = getLucideIcon(tier.icon);
        return (
          <div
            key={tier.id}
            className="flex flex-col border-t-2 border-amber-400 bg-white p-5 shadow-sm ring-1 ring-gray-100"
          >
            <span className="text-[10px] font-bold tracking-wide text-amber-600 uppercase">
              {tier.tier_number}
            </span>
            <div className="mt-3 flex h-10 w-10 items-center justify-center border border-amber-200 bg-amber-50/60">
              <Icon size={18} className="text-amber-700" strokeWidth={1.75} />
            </div>
            <h3 className="font-serif mt-3 text-base font-bold text-[#001A23]">{tier.title}</h3>
            <ul className="mt-4 flex flex-1 flex-col gap-2 text-sm text-gray-600">
              {tier.items.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-amber-400">·</span>
                  {item}
                </li>
              ))}
            </ul>
            <a
              href="#start-collaboration"
              className="mt-5 text-sm font-medium text-amber-700 hover:underline"
            >
              Discuss this option →
            </a>
          </div>
        );
      })}
    </div>
  );
}