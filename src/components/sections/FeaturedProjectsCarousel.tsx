"use client";

import Image from "next/image";
import { useCallback } from "react";
import { useSyncExternalStore } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import { ChevronLeft, ChevronRight } from "lucide-react";

type FeaturedProject = {
  image: string;
  title: string;
  description: string;
};

// Curated highlights — not the full project list. Add/remove/reorder freely;
// each entry is just an image + title + one-line description, nothing links
// anywhere.
const featuredProjects: FeaturedProject[] = [
  {
    image: "/Assets/projects/3-pick.png",
    title: "Autonomous Mobile Cobot for Pick-and-Place Operations",
    description:
      "A mobile collaborative robot capable of autonomous navigation and manipulation for pick-and-place tasks.",
  },
  {
    image: "/Assets/projects/8-snake.png",
    title: "Bio-Inspired Snake Robot for Search and Locomotion",
    description:
      "A snake-like robot inspired by biological locomotion for efficient movement in constrained environments.",
  },
  {
    image: "/Assets/projects/1-drone.jpg",
    title: "Aerial Manipulation & Navigation",
    description:
      "Drones that sense, navigate, and manipulate objects in unstructured outdoor environments.",
  },
  {
    image: "/Assets/projects/12-slam.jpg",
    title: "SLAM-Based Autonomous Navigation",
    description: "Simultaneous localization and mapping for robust navigation in unknown environments.",
  },
];

export default function FeaturedProjectsCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Fade(),
    Autoplay({ delay: 6000, stopOnInteraction: false }),
  ]);

  const subscribe = useCallback(
    (callback: () => void) => {
      if (!emblaApi) return () => {};
      emblaApi.on("select", callback);
      return () => emblaApi.off("select", callback);
    },
    [emblaApi]
  );
  const getSnapshot = useCallback(() => emblaApi?.selectedScrollSnap() ?? 0, [emblaApi]);
  const getServerSnapshot = useCallback(() => 0, []);

  const selectedIndex = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const project = featuredProjects[selectedIndex];

  return (
    <div className="mx-auto max-w-5xl">
      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {featuredProjects.map((p) => (
              <div key={p.title} className="relative h-80 w-full flex-[0_0_100%] sm:h-[28rem]">
                <Image src={p.image} alt={p.title} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => emblaApi?.scrollPrev()}
          aria-label="Previous project"
          className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white transition-colors hover:bg-black/60"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => emblaApi?.scrollNext()}
          aria-label="Next project"
          className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white transition-colors hover:bg-black/60"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div
        key={selectedIndex}
        className="animate-[fade-in-up_0.5s_ease] border-t-2 border-amber-400 bg-white p-6 text-center shadow-sm ring-1 ring-gray-100 sm:p-8"
      >
        <h3 className="font-serif text-xl font-bold text-[#001A23]">{project.title}</h3>
        <p className="mt-2 text-sm text-gray-600 sm:text-base">{project.description}</p>
      </div>

      <div className="mt-5 flex justify-center gap-2">
        {featuredProjects.map((p, i) => (
          <button
            key={p.title}
            onClick={() => emblaApi?.scrollTo(i)}
            aria-label={`Go to ${p.title}`}
            className={`h-2 rounded-full transition-all ${
              i === selectedIndex ? "w-6 bg-amber-400" : "w-2 bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}