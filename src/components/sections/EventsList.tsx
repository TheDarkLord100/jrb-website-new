"use client";

import { useState } from "react";
import Image from "next/image";
import { useAnnouncementsByType } from "@/lib/useAnnouncementsByType";
import { formatAnnouncementDate } from "@/lib/announcements";
import { stripMarkdownPreview } from "@/lib/stripMarkdown";
import AnnouncementModal from "@/components/ui/AnnouncementModal";
import type { Announcement } from "@/types/announcement";

function EventsSkeleton() {
  return (
    <div className="grid animate-pulse gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden border-t-2 border-gray-200 bg-white shadow-sm ring-1 ring-gray-100"
        >
          <div className="aspect-[3/4] w-full bg-gray-100" />
          <div className="p-5">
            <div className="h-3 w-24 rounded bg-gray-100" />
            <div className="mt-2 h-4 w-3/4 rounded bg-gray-200" />
            <div className="mt-2 h-3 w-full rounded bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function EventsList() {
  const { items, error } = useAnnouncementsByType("event");
  const [modalItem, setModalItem] = useState<Announcement | null>(null);

  if (error) {
    return (
      <p className="py-20 text-center text-gray-500">
        Couldn&apos;t load events right now. Please try again shortly.
      </p>
    );
  }

  if (!items) {
    return <EventsSkeleton />;
  }

  if (items.length === 0) {
    return <p className="py-20 text-center text-gray-500">No past events listed yet.</p>;
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const thumbnail = item.image_urls?.[0];
          return (
            <button
              key={item.id}
              onClick={() => setModalItem(item)}
              className="flex flex-col overflow-hidden border-t-2 border-amber-400 bg-white text-left shadow-sm ring-1 ring-gray-100 transition-shadow hover:shadow-md"
            >
              {thumbnail && (
                <div className="relative aspect-[3/4] w-full bg-gray-100">
                  <Image src={thumbnail} alt={item.title} fill className="object-contain" />
                </div>
              )}
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-gray-400">
                    {formatAnnouncementDate(item.date)}
                  </span>
                  {item.is_important && (
                    <span className="shrink-0 bg-amber-50 px-2 py-0.5 text-[10px] font-bold tracking-wide text-amber-700 uppercase">
                      Important
                    </span>
                  )}
                </div>
                <h3 className="font-serif mt-2 font-semibold text-[#001A23]">{item.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                  {stripMarkdownPreview(item.description)}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <AnnouncementModal item={modalItem} onClose={() => setModalItem(null)} />
    </>
  );
}