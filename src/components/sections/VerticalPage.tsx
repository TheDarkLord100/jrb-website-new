"use client";

import Link from "next/link";
import { User, FlaskConical } from "lucide-react";
import PageHeading from "@/components/ui/PageHeading";
import { useThemeAssociations } from "@/lib/useThemeAssociations";

function ChipsSkeleton() {
  return (
    <div className="mt-16 animate-pulse">
      <div className="h-6 w-40 rounded bg-gray-200" />
      <div className="mt-1 h-0.5 w-12 bg-gray-200" />
      <div className="mt-5 flex flex-wrap gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-9 w-32 rounded bg-gray-100" />
        ))}
      </div>
    </div>
  );
}

export default function VerticalPage({
  themeSlug,
  title,
  intro,
}: {
  themeSlug: string;
  title: string;
  intro: string;
}) {
  const { data, error } = useThemeAssociations(themeSlug);

  return (
    <div>
      <PageHeading eyebrow="Research" title={title} />

      <div className="mx-auto max-w-[75rem] px-5 pb-16">
        <p className="mx-auto max-w-5xl text-justify leading-relaxed text-gray-600">{intro}</p>

        {error && (
          <p className="mt-16 text-center text-gray-500">
            Couldn&apos;t load faculty and lab information right now.
          </p>
        )}

        {!error && !data && (
          <>
            <ChipsSkeleton />
            <ChipsSkeleton />
          </>
        )}

        {!error && data && (
          <>
            <section className="mt-16">
              <h2 className="font-serif text-xl font-bold text-[#001A23]">Faculty Involved</h2>
              <div className="mt-2 h-0.5 w-12 bg-amber-400" />
              {data.faculty.length === 0 ? (
                <p className="mt-5 text-sm text-gray-500">To be added.</p>
              ) : (
                <div className="mt-5 flex flex-wrap gap-3">
                  {data.faculty.map((person) => (
                    <Link
                      key={person.id}
                      href="/people"
                      onClick={() => {
                        // Handed off via sessionStorage, not a URL param, so
                        // the URL stays clean -- People reads this once on
                        // mount and immediately clears it, so a refresh (or
                        // a direct visit to /people) always shows everyone.
                        sessionStorage.setItem("peopleSearchPrefill", person.name);
                      }}
                      className="flex items-center gap-2 border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 transition-colors hover:border-amber-400 hover:bg-amber-50 hover:text-amber-800"
                    >
                      <User size={14} className="text-amber-600" />
                      {person.name}
                    </Link>
                  ))}
                </div>
              )}
            </section>

            <section className="mt-12">
              <h2 className="font-serif text-xl font-bold text-[#001A23]">Affiliated Labs</h2>
              <div className="mt-2 h-0.5 w-12 bg-amber-400" />
              {data.labs.length === 0 ? (
                <p className="mt-5 text-sm text-gray-500">To be added.</p>
              ) : (
                <div className="mt-5 flex flex-wrap gap-3">
                  {data.labs.map((lab) => (
                    <Link
                      key={lab.id}
                      href={`/research/facilities/${lab.slug}`}
                      className="flex items-center gap-2 border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 transition-colors hover:border-amber-400 hover:bg-amber-50 hover:text-amber-800"
                    >
                      <FlaskConical size={14} className="text-amber-600" />
                      {lab.name}
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        <section className="mt-16">
          <h2 className="font-serif text-xl font-bold text-[#001A23]">Projects</h2>
          <div className="mt-2 h-0.5 w-12 bg-amber-400" />
          <p className="mt-5 border-t-2 border-amber-400 bg-white p-10 text-center text-gray-500 shadow-sm ring-1 ring-gray-100">
            Coming soon.
          </p>
        </section>
      </div>
    </div>
  );
}