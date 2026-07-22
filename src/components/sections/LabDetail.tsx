"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, User, Users, ExternalLink, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useLab } from "@/lib/useLab";
import LabDetailSkeleton from "@/components/sections/LabDetailSkeleton";

function GalleryLightbox({
  images,
  index,
  onClose,
  onNavigate,
}: {
  images: { image_url: string; caption: string | null }[];
  index: number;
  onClose: () => void;
  onNavigate: (next: number) => void;
}) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate((index + 1) % images.length);
      if (e.key === "ArrowLeft") onNavigate((index - 1 + images.length) % images.length);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [index, images.length, onClose, onNavigate]);

  const img = images[index];

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/85 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-5 right-5 text-white/70 transition-colors hover:text-white"
      >
        <X size={26} />
      </button>

      {images.length > 1 && (
        <button
          onClick={() => onNavigate((index - 1 + images.length) % images.length)}
          aria-label="Previous image"
          className="absolute left-3 text-white/70 transition-colors hover:text-white sm:left-6"
        >
          <ChevronLeft size={36} />
        </button>
      )}

      <div className="relative max-h-[80vh] w-full max-w-4xl">
        <div className="relative aspect-[4/3] w-full">
          <Image src={img.image_url} alt={img.caption ?? ""} fill className="object-contain" />
        </div>
        {img.caption && <p className="mt-4 text-center text-white">{img.caption}</p>}
      </div>

      {images.length > 1 && (
        <button
          onClick={() => onNavigate((index + 1) % images.length)}
          aria-label="Next image"
          className="absolute right-3 text-white/70 transition-colors hover:text-white sm:right-6"
        >
          <ChevronRight size={36} />
        </button>
      )}
    </div>
  );
}

export default function LabDetail({ slug }: { slug: string }) {
  const { data, error } = useLab(slug);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (error) {
    return (
      <p className="py-20 text-center text-gray-500">
        Couldn&apos;t load this lab right now. Please try again shortly.
      </p>
    );
  }

  if (!data) {
    return <LabDetailSkeleton />;
  }

  if (!data.lab) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500">This lab couldn&apos;t be found.</p>
        <Link href="/research/facilities" className="mt-3 inline-block text-amber-700 hover:underline">
          ← Back to Research Facilities
        </Link>
      </div>
    );
  }

  const { lab, images, announcements } = data;

  return (
    <div className="mx-auto max-w-[75rem] px-5 py-12">
      {/* Header */}
      <h1 className="font-serif text-3xl font-bold text-[#001A23] sm:text-4xl">{lab.name}</h1>
      <p className="mt-2 text-gray-500">Centre of Excellence on BIRD, IIT Delhi</p>

      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-b border-gray-200 pb-6 text-sm text-gray-600">
        {lab.location && (
          <span className="flex items-center gap-1.5">
            <MapPin size={16} className="text-amber-600" />
            {lab.location}
          </span>
        )}
        {lab.faculty_lead && (
          <span className="flex items-center gap-1.5">
            <User size={16} className="text-amber-600" />
            {lab.faculty_lead}
          </span>
        )}
        {lab.coordinator && (
          <span className="flex items-center gap-1.5">
            <Users size={16} className="text-amber-600" />
            {lab.coordinator}
          </span>
        )}
        {lab.external_url && (
          <a
            href={lab.external_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-amber-700 hover:underline"
          >
            <ExternalLink size={16} />
            Official Lab Website
          </a>
        )}
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_280px]">
        <div>
          {lab.research_areas && lab.research_areas.length > 0 && (
            <>
              <h2 className="font-serif text-lg font-bold text-[#001A23]">Research Areas</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {lab.research_areas.map((area) => (
                  <span
                    key={area}
                    className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold tracking-wide text-amber-700 uppercase"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </>
          )}

          {lab.description && (
            <>
              <h2 className="mt-8 font-serif text-lg font-bold text-[#001A23]">Lab Description</h2>
              <p className="mt-3 leading-relaxed text-gray-600">{lab.description}</p>
            </>
          )}

          {images.length > 0 && (
            <>
              <h2 className="mt-8 font-serif text-lg font-bold text-[#001A23]">Laboratory Gallery</h2>
              <div className="mt-3 grid grid-cols-2 gap-4">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setLightboxIndex(i)}
                    className="relative aspect-[4/3] overflow-hidden"
                  >
                    <Image src={img.image_url} alt={img.caption ?? lab.name} fill className="object-cover" />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <aside className="border-t-2 border-amber-400 bg-gray-50 p-5 shadow-sm ring-1 ring-gray-100">
          <h2 className="font-serif text-base font-bold text-[#001A23]">Lab Announcements</h2>
          {announcements.length === 0 ? (
            <p className="mt-3 text-sm text-gray-500">No announcements yet.</p>
          ) : (
            <ul className="mt-3 flex flex-col gap-3">
              {announcements.map((a) => (
                <li key={a.id} className="text-sm text-gray-700">
                  <span className="text-amber-700">•</span> {a.title}
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>

      {lightboxIndex !== null && (
        <GalleryLightbox
          images={images}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
}