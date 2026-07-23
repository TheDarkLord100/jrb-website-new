"use client";

import { ExternalLink } from "lucide-react";
import Card from "@/components/ui/Card";
import Markdown from "@/components/ui/Markdown";
import { useAdmissions } from "@/lib/useAdmission";

function formatLastUpdated(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function ProcessBlocksSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-6 w-3/4 rounded bg-gray-200" />
      <div className="mt-3 h-3 w-48 rounded bg-gray-100" />
      <div className="mt-6 flex flex-col divide-y divide-gray-100">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="py-5 first:pt-0">
            <div className="h-4 w-40 rounded bg-gray-200" />
            <div className="mt-3 h-3 w-full rounded bg-gray-100" />
            <div className="mt-2 h-3 w-5/6 rounded bg-gray-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

function LinksSkeleton() {
  return (
    <div className="mt-4 grid animate-pulse gap-3 sm:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-11 rounded border border-gray-100 bg-gray-100" />
      ))}
    </div>
  );
}

export default function AdmissionsContent() {
  const { data, error } = useAdmissions();

  if (error) {
    return (
      <Card>
        <p className="py-10 text-center text-gray-500">
          Couldn&apos;t load admissions information right now. Please try again shortly.
        </p>
      </Card>
    );
  }

  if (!data) {
    return (
      <>
        <Card>
          <ProcessBlocksSkeleton />
        </Card>
        <Card>
          <div className="h-6 w-32 rounded bg-gray-200" />
          <LinksSkeleton />
        </Card>
      </>
    );
  }

  const { sections, links } = data;

  // "Last updated" reflects whichever section was most recently edited in
  // Supabase, rather than a manually-typed date that's easy to forget to bump.
  const lastUpdated = sections.reduce<string | null>((latest, s) => {
    if (!latest) return s.updated_at;
    return s.updated_at > latest ? s.updated_at : latest;
  }, null);

  return (
    <>
      <Card>
        <h2 className="font-serif text-xl font-bold text-[#001A23]">
          Admissions to M.Tech in Robotics (JRB) at IIT Delhi (2026–27)
        </h2>
        <p className="mt-3 text-sm text-gray-600">
          <strong>All admissions-related announcements will be made on this page.</strong>
          {lastUpdated && (
            <>
              <br />
              <span className="text-xs text-gray-400">
                Last updated: {formatLastUpdated(lastUpdated)}
              </span>
            </>
          )}
        </p>

        {sections.length === 0 ? (
          <p className="mt-6 text-sm text-gray-500">No admissions information posted yet.</p>
        ) : (
          <div className="mt-6 flex flex-col divide-y divide-gray-100">
            {sections.map((block) => (
              <div key={block.id} className="py-5 first:pt-0 last:pb-0">
                <h3 className="font-semibold text-[#001A23]">{block.title}</h3>
                <div className="mt-2 text-sm">
                  <Markdown>{block.body_markdown}</Markdown>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <h2 className="font-serif text-xl font-bold text-[#001A23]">Important Links</h2>

        {links.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">No links posted yet.</p>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {links.map((link) => (
              <a
                key={link.id}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-2 border border-gray-300 px-4 py-2.5 text-sm font-medium text-[#001A23] transition-colors hover:border-amber-400 hover:text-amber-700"
              >
                {link.label}
                <ExternalLink size={14} className="shrink-0 text-amber-600" />
              </a>
            ))}
          </div>
        )}
      </Card>
    </>
  );
}