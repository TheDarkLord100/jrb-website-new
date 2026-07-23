"use client";

import Image from "next/image";
import { X } from "lucide-react";
import Markdown from "@/components/ui/Markdown";
import type { Announcement } from "@/types/announcement";

export default function AnnouncementModal({
  item,
  onClose,
}: {
  item: Announcement | null;
  onClose: () => void;
}) {
  if (!item) return null;

  const images = item.image_urls ?? [];

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/45 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative max-h-[85vh] w-full max-w-xl overflow-y-auto bg-white p-7 shadow-2xl">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 text-gray-400 transition-colors hover:text-gray-700"
        >
          <X size={20} />
        </button>

        {images.length > 0 && (
          <div className={`mb-5 grid gap-2 ${images.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
            {images.slice(0, 4).map((src) => (
              <div key={src} className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                <Image src={src} alt={item.title} fill className="object-contain" />
              </div>
            ))}
          </div>
        )}

        <h3 className="font-serif pr-6 text-xl font-bold text-[#001A23]">{item.title}</h3>
        <div className="text-sm">
          <Markdown>{item.description}</Markdown>
        </div>

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