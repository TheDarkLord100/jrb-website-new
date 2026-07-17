"use client";

import { X } from "lucide-react";
import type { Announcement } from "@/types/announcement";

export default function AnnouncementModal({
  item,
  onClose,
}: {
  item: Announcement | null;
  onClose: () => void;
}) {
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/45 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-xl bg-white p-7 shadow-2xl">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 text-gray-400 transition-colors hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h3 className="font-serif pr-6 text-xl font-bold text-[#001A23]">{item.title}</h3>
        <p className="mt-3 leading-relaxed text-gray-600">{item.description}</p>

        {item.hyperlink && (
          <a
            href={item.hyperlink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-block border border-gray-300 px-5 py-2 text-sm font-medium text-[#001A23] transition-colors hover:border-amber-400 hover:text-amber-700"
          >
            {item.link_text ?? "Open Link"}
          </a>
        )}
      </div>
    </div>
  );
}