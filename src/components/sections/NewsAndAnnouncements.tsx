"use client";

import { useState } from "react";
import Link from "next/link";
import { useAnnouncements } from "@/lib/useAnnouncements";
import { formatAnnouncementDate } from "@/lib/announcements";
import { stripMarkdownPreview } from "@/lib/stripMarkdown";
import AnnouncementModal from "@/components/ui/AnnouncementModal";
import SectionHeading from "@/components/ui/SectionHeading";
import type { Announcement } from "@/types/announcement";

const MAX_VISIBLE = 6;

const TYPE_LABELS: Record<Announcement["type"], string> = {
  news: "News",
  event: "Event",
  admission: "Admissions",
};

function NewsSkeleton() {
  return (
    <div className="grid animate-pulse gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="border-t-2 border-gray-200 bg-white p-5 shadow-sm ring-1 ring-gray-100"
        >
          <div className="h-3 w-24 rounded bg-gray-100" />
          <div className="mt-3 h-4 w-3/4 rounded bg-gray-200" />
          <div className="mt-2 h-3 w-full rounded bg-gray-100" />
          <div className="mt-1 h-3 w-2/3 rounded bg-gray-100" />
        </div>
      ))}
    </div>
  );
}

export default function NewsAndAnnouncements() {
  const { items, error } = useAnnouncements();
  const [modalItem, setModalItem] = useState<Announcement | null>(null);

  const important = items?.filter((item) => item.is_important) ?? [];
  const normal = items?.filter((item) => !item.is_important) ?? [];

  const total = items?.length ?? 0;
  const showViewAll = total > MAX_VISIBLE;
  const normalVisible = normal.slice(0, Math.max(0, MAX_VISIBLE - important.length));

  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-[75rem] px-5">
        <SectionHeading eyebrow="News" title="News & Events" />

        {error && (
          <p className="text-center text-gray-500">
            Couldn&apos;t load news &amp; events right now. Please try again shortly.
          </p>
        )}

        {!error && items === null && <NewsSkeleton />}

        {!error && items !== null && (
          <>
            {important.length > 0 && (
              <div className="mb-6 flex flex-col gap-3">
                {important.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setModalItem(item)}
                    className="flex flex-col gap-1 border-l-2 border-amber-400 bg-amber-50/60 p-4 text-left transition-colors hover:bg-amber-50 sm:flex-row sm:items-center sm:gap-4"
                  >
                    <span className="flex items-center gap-2 whitespace-nowrap">
                      <span className="text-[10px] font-bold tracking-wide text-amber-700 uppercase">
                        {TYPE_LABELS[item.type]}
                      </span>
                      <span className="text-xs font-semibold text-amber-700">
                        {formatAnnouncementDate(item.date)}
                      </span>
                    </span>
                    <span className="font-serif font-semibold text-[#001A23]">{item.title}</span>
                  </button>
                ))}
              </div>
            )}

            {total === 0 && (
              <p className="text-center text-gray-500">No announcements available</p>
            )}

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {normalVisible.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setModalItem(item)}
                  className="flex flex-col border-t-2 border-amber-400 bg-white p-5 text-left shadow-sm ring-1 ring-gray-100 transition-shadow hover:shadow-md"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold tracking-wide text-amber-600 uppercase">
                      {TYPE_LABELS[item.type]}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="text-xs font-semibold text-gray-400">
                      {formatAnnouncementDate(item.date)}
                    </span>
                  </div>
                  <span className="font-serif mt-2 font-semibold text-[#001A23]">
                    {item.title}
                  </span>
                  <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                    {stripMarkdownPreview(item.description)}
                  </p>
                </button>
              ))}
            </div>
          </>
        )}

        {showViewAll && (
          <div className="mt-10 text-center">
            <Link
              href="/events"
              className="inline-block border border-gray-300 px-6 py-2.5 text-sm font-medium text-[#001A23] transition-colors hover:border-amber-400 hover:text-amber-700"
            >
              View All →
            </Link>
          </div>
        )}
      </div>

      <AnnouncementModal item={modalItem} onClose={() => setModalItem(null)} />
    </section>
  );
}