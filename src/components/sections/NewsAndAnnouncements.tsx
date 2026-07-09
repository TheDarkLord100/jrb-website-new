"use client";

import { useState } from "react";
import { useAnnouncements } from "@/lib/useAnnouncements";
import { formatAnnouncementDate } from "@/lib/announcements";
import AnnouncementModal from "@/components/ui/AnnouncementModal";
import SectionHeading from "@/components/ui/SectionHeading";
import type { Announcement } from "@/types/announcement";

export default function NewsAndAnnouncements() {
  const items = useAnnouncements();
  const [modalItem, setModalItem] = useState<Announcement | null>(null);

  const important = items?.filter((item) => item.is_important) ?? [];
  const normal = items?.filter((item) => !item.is_important) ?? [];

  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-[75rem] px-5">
        <SectionHeading title="News & Events" />

        {important.length > 0 && (
          <div className="mb-6 flex flex-col gap-3">
            {important.map((item) => (
              <button
                key={item.id}
                onClick={() => setModalItem(item)}
                className="flex flex-col gap-1 rounded-lg border-l-4 border-yellow-400 bg-yellow-50 p-4 text-left transition-colors hover:bg-yellow-100 sm:flex-row sm:items-center sm:gap-4"
              >
                <span className="text-xs font-semibold whitespace-nowrap text-yellow-700">
                  {formatAnnouncementDate(item.date)}
                </span>
                <span className="font-medium text-[#001A23]">{item.title}</span>
              </button>
            ))}
          </div>
        )}

        {items !== null && normal.length === 0 && important.length === 0 && (
          <p className="text-center text-gray-500">No announcements available</p>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {normal.map((item) => (
            <button
              key={item.id}
              onClick={() => setModalItem(item)}
              className="flex flex-col rounded-xl border border-gray-100 bg-white p-5 text-left shadow-sm transition-shadow hover:shadow-md"
            >
              <span className="text-xs font-semibold text-gray-400">
                {formatAnnouncementDate(item.date)}
              </span>
              <span className="mt-2 font-semibold text-[#001A23]">{item.title}</span>
              <p className="mt-2 line-clamp-2 text-sm text-gray-600">{item.description}</p>
            </button>
          ))}
        </div>
      </div>

      <AnnouncementModal item={modalItem} onClose={() => setModalItem(null)} />
    </section>
  );
}
