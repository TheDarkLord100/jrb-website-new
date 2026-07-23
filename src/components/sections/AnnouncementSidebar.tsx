"use client";

import { useState } from "react";
import { useAnnouncementsByType } from "@/lib/useAnnouncementsByType";
import { formatAnnouncementDate } from "@/lib/announcements";
import { stripMarkdownPreview } from "@/lib/stripMarkdown";
import AnnouncementModal from "@/components/ui/AnnouncementModal";
import Card from "@/components/ui/Card";
import type { Announcement } from "@/types/announcement";

function AnnouncementsSkeleton() {
  return (
    <div className="animate-pulse">
      <ul className="flex flex-col gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <li key={i} className="border-t border-gray-100 pt-4 first:border-t-0 first:pt-0">
            <div className="h-3 w-24 rounded bg-gray-100" />
            <div className="mt-2 h-3.5 w-3/4 rounded bg-gray-200" />
            <div className="mt-2 h-3 w-full rounded bg-gray-100" />
            <div className="mt-1 h-3 w-2/3 rounded bg-gray-100" />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AnnouncementSidebar({
  type,
  heading,
  emptyText = "No announcements available.",
}: {
  type: Announcement["type"];
  heading: string;
  emptyText?: string;
}) {
  const { items, error } = useAnnouncementsByType(type);
  const [modalItem, setModalItem] = useState<Announcement | null>(null);

  return (
    <>
      <Card>
        <h2 className="font-serif text-lg font-bold text-[#001A23]">{heading}</h2>

        {error && (
          <p className="mt-4 text-sm text-gray-500">
            Couldn&apos;t load announcements right now. Please try again shortly.
          </p>
        )}

        {!error && items === null && (
          <div className="mt-4">
            <AnnouncementsSkeleton />
          </div>
        )}

        {!error && items !== null && items.length === 0 && (
          <p className="mt-4 text-sm text-gray-500">{emptyText}</p>
        )}

        {!error && items !== null && items.length > 0 && (
          <ul className="mt-4 flex flex-col divide-y divide-gray-100">
            {items.map((item) => (
              <li key={item.id} className="py-4 first:pt-0 last:pb-0">
                <button onClick={() => setModalItem(item)} className="w-full text-left">
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
                  <p className="mt-1 text-sm font-semibold text-[#001A23]">{item.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                    {stripMarkdownPreview(item.description)}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <AnnouncementModal item={modalItem} onClose={() => setModalItem(null)} />
    </>
  );
}