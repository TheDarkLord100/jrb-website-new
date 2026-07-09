"use client";

import { useState } from "react";
import { useAnnouncements } from "@/lib/useAnnouncements";
import { formatAnnouncementDate } from "@/lib/announcements";
import AnnouncementModal from "@/components/ui/AnnouncementModal";
import type { Announcement } from "@/types/announcement";

export default function AdmissionAnnouncements() {
  const items = useAnnouncements();
  const [modalItem, setModalItem] = useState<Announcement | null>(null);

  return (
    <>
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-[#001A23]">Announcements</h2>

        <ul className="mt-4 flex flex-col gap-4">
          {items !== null && items.length === 0 && (
            <li className="text-sm text-gray-500">No Announcements Available</li>
          )}
          {items?.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setModalItem(item)}
                className="w-full text-left"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-400">
                    {formatAnnouncementDate(item.date)}
                  </span>
                  {item.is_important && (
                    <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-yellow-700 uppercase">
                      Important
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm font-semibold text-[#001A23]">{item.title}</p>
                <p className="mt-1 line-clamp-2 text-xs text-gray-500">{item.description}</p>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <AnnouncementModal item={modalItem} onClose={() => setModalItem(null)} />
    </>
  );
}
