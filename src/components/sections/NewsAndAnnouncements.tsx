"use client";

import { useState } from "react";
import Link from "next/link";
import { useAnnouncements } from "@/lib/useAnnouncements";
import { formatAnnouncementDate } from "@/lib/announcements";
import AnnouncementModal from "@/components/ui/AnnouncementModal";
import SectionHeading from "@/components/ui/SectionHeading";
import type { Announcement } from "@/types/announcement";

const MAX_VISIBLE = 6;

export default function NewsAndAnnouncements() {
  const items = useAnnouncements();
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

        {important.length > 0 && (
          <div className="mb-6 flex flex-col gap-3">
            {important.map((item) => (
              <button
                key={item.id}
                onClick={() => setModalItem(item)}
                className="flex flex-col gap-1 border-l-2 border-amber-400 bg-amber-50/60 p-4 text-left transition-colors hover:bg-amber-50 sm:flex-row sm:items-center sm:gap-4"
              >
                <span className="text-xs font-semibold whitespace-nowrap text-amber-700">
                  {formatAnnouncementDate(item.date)}
                </span>
                <span className="font-serif font-semibold text-[#001A23]">{item.title}</span>
              </button>
            ))}
          </div>
        )}

        {items !== null && total === 0 && (
          <p className="text-center text-gray-500">No announcements available</p>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {normalVisible.map((item) => (
            <button
              key={item.id}
              onClick={() => setModalItem(item)}
              className="flex flex-col border-t-2 border-amber-400 bg-white p-5 text-left shadow-sm ring-1 ring-gray-100 transition-shadow hover:shadow-md"
            >
              <span className="text-xs font-semibold text-gray-400">
                {formatAnnouncementDate(item.date)}
              </span>
              <span className="font-serif mt-2 font-semibold text-[#001A23]">{item.title}</span>
              <p className="mt-2 line-clamp-2 text-sm text-gray-600">{item.description}</p>
            </button>
          ))}
        </div>

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