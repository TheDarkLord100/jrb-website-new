"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

// Photos from events, inaugurations, and team milestones — not tied to any
// specific research project. Each entry can hold one or more images; add
// new entries (or extend an existing entry's `images` array) as photos come
// in, and drop the files in /public/Assets/gallery/.
type GalleryEntry = {
  caption: string;
  images: { src: string; alt: string }[];
};

const galleryEntries: GalleryEntry[] = [
  {
    caption: "M.Tech Robotics, Batch 2024-26",
    images: [
      {
        src: "/Assets/gallery_images/group_26.jpg",
        alt: "M.Tech Batch 2024-26",
      },
      {
        src: "/Assets/gallery_images/group_26_2.jpg",
        alt: "M.Tech Batch 2024-26",
      },
      {
        src: "/Assets/gallery_images/group_26_3.jpg",
        alt: "M.Tech Batch 2024-26",
      },
    ],
  },
  {
    caption: "60th Edition of Cobotalks on 'Physical AI: AI for Robotics'",
    images: [
      {
        src: "/Assets/gallery_images/cobotalks_60/1.jpg",
        alt: "",
      },
      {
        src: "/Assets/gallery_images/cobotalks_60/2.jpg",
        alt: "",
      },
      {
        src: "/Assets/gallery_images/cobotalks_60/3.jpg",
        alt: "",
      },
      {
        src: "/Assets/gallery_images/cobotalks_60/4.jpg",
        alt: "",
      },
      {
        src: "/Assets/gallery_images/cobotalks_60/5.jpg",
        alt: "",
      },
      {
        src: "/Assets/gallery_images/cobotalks_60/6.jpg",
        alt: "",
      },
    ],
  },
  {
    caption: "IIT Monument Representing Interdisciplinary Engineering and Design",
    images: [
      {
        src: "/Assets/gallery_images/iit_monu.jpg",
        alt: "IIT Monument Representing Interdisciplinary Engineering and Design",
      },
    ],
  },
  {
    caption: "M.Tech Robotics, Batch 2023-25",
    images: [
      {
        src: "/Assets/gallery_images/group_25.jpg",
        alt: "M.Tech Batch 2023-25",
      },
    ],
  },
];

export default function AboutGallery() {
  const [openEntry, setOpenEntry] = useState<number | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  const entry = openEntry !== null ? galleryEntries[openEntry] : null;

  const showNext = () => {
    if (!entry) return;
    setActiveImage((i) => (i + 1) % entry.images.length);
  };

  const showPrev = () => {
    if (!entry) return;
    setActiveImage((i) => (i - 1 + entry.images.length) % entry.images.length);
  };

  const close = () => setOpenEntry(null);

  useEffect(() => {
    if (openEntry === null) return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openEntry, activeImage]);

  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-[75rem] px-5">
        <SectionHeading eyebrow="Moments" title="Gallery" />

        <p className="mx-auto mb-10 max-w-2xl text-center text-gray-600">
          Photos from CoE-BIRD events, inaugurations, and team milestones over the years.
        </p>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {galleryEntries.map((item, i) => (
            <button
              key={item.caption}
              onClick={() => {
                setOpenEntry(i);
                setActiveImage(0);
              }}
              className="group relative aspect-[4/3] overflow-hidden text-left"
            >
              <Image
                src={item.images[0].src}
                alt={item.images[0].alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {item.images.length > 1 && (
                <span className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 px-2 py-1 text-xs font-medium text-white">
                  <Images size={13} />
                  {item.images.length}
                </span>
              )}

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p className="text-sm text-white">{item.caption}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {entry && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/85 px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <button
            onClick={close}
            aria-label="Close"
            className="absolute top-5 right-5 text-white/70 transition-colors hover:text-white"
          >
            <X size={26} />
          </button>

          {entry.images.length > 1 && (
            <button
              onClick={showPrev}
              aria-label="Previous image"
              className="absolute left-3 text-white/70 transition-colors hover:text-white sm:left-6"
            >
              <ChevronLeft size={36} />
            </button>
          )}

          <div className="relative max-h-[80vh] w-full max-w-4xl">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={entry.images[activeImage].src}
                alt={entry.images[activeImage].alt}
                fill
                className="object-contain"
              />
            </div>
            <div className="mt-4 text-center">
              <p className="text-white">{entry.caption}</p>
              {entry.images.length > 1 && (
                <p className="mt-1 text-sm text-white/50">
                  {activeImage + 1} / {entry.images.length}
                </p>
              )}
            </div>
          </div>

          {entry.images.length > 1 && (
            <button
              onClick={showNext}
              aria-label="Next image"
              className="absolute right-3 text-white/70 transition-colors hover:text-white sm:right-6"
            >
              <ChevronRight size={36} />
            </button>
          )}
        </div>
      )}
    </section>
  );
}