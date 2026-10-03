'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSyncExternalStore } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Fade from 'embla-carousel-fade';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Project } from '@/types/project';

// Featured projects from the `projects` table (is_featured + published +
// has media) -- managed in the admin panel. Each slide is just the image or
// video plus title and short description; nothing links anywhere.
export default function FeaturedProjectsCarousel({ projects }: { projects: Project[] }) {
  // Plugins must be created exactly once, not on every render -- a fresh
  // array/plugin-instance identity on each render causes Embla to silently
  // tear down and rebuild its engine every time, which is what caused the
  // "internalEngine" crash. A lazy useState initializer runs only on the
  // first render and keeps the same array for the component's lifetime.
  const [plugins] = useState(() => [Fade(), Autoplay({ delay: 6000, stopOnInteraction: false })]);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, plugins);

  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

  const subscribe = useCallback(
    (callback: () => void) => {
      if (!emblaApi) return () => {};
      emblaApi.on('select', callback);
      return () => emblaApi.off('select', callback);
    },
    [emblaApi]
  );
  const getSnapshot = useCallback(() => emblaApi?.selectedScrollSnap() ?? 0, [emblaApi]);
  const getServerSnapshot = useCallback(() => 0, []);

  const selectedIndex = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  // The list can change after the client re-fetch; fall back to the first
  // slide if the selected index no longer exists.
  const project = projects[selectedIndex] ?? projects[0];
  const hasMultiple = projects.length > 1;

  useEffect(() => {
    // Guard on emblaApi existing -- calling into the Autoplay plugin
    // before Embla itself is ready is exactly what crashed before.
    if (!emblaApi || !project) return;
    const autoplay = emblaApi.plugins().autoplay;
    if (!autoplay) return;

    // Pause every other tracked video (in case one was left playing when
    // the user manually skipped away from it).
    videoRefs.current.forEach((el, id) => {
      if (id !== project.id) el.pause();
    });

    if (project.media_type === 'video') {
      // Video slides drive their own pacing via onEnded below, not the
      // fixed-delay timer.
      autoplay.stop();
      const el = videoRefs.current.get(project.id);
      if (el) {
        // Restart from the beginning every time this slide becomes active
        // again -- otherwise, since Embla never remounts slides, it would
        // just sit frozen on its last frame after the first play-through.
        el.currentTime = 0;
        el.play().catch(() => {
          // Autoplay can be rejected by the browser in rare cases (e.g. a
          // very fast repeated scroll); safe to ignore, the poster/last
          // frame just stays visible instead of erroring.
        });
      }
    } else if (hasMultiple && !autoplay.isPlaying()) {
      autoplay.play();
    }
  }, [emblaApi, project, hasMultiple]);

  const handleVideoEnded = useCallback(() => {
    if (hasMultiple) {
      emblaApi?.scrollNext();
    } else {
      // A lone video slide just loops.
      const el = project ? videoRefs.current.get(project.id) : undefined;
      if (el) {
        el.currentTime = 0;
        el.play().catch(() => {});
      }
    }
  }, [emblaApi, hasMultiple, project]);

  if (!project) return null;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {projects.map((p) => (
              <div key={p.id} className="relative h-80 w-full flex-[0_0_100%] sm:h-[28rem]">
                {p.media_type === 'video' ? (
                  <video
                    ref={(el) => {
                      if (el) videoRefs.current.set(p.id, el);
                      else videoRefs.current.delete(p.id);
                    }}
                    src={p.media_url!}
                    muted
                    playsInline
                    onEnded={handleVideoEnded}
                    aria-label={p.media_alt ?? p.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Image
                    src={p.media_url!}
                    alt={p.media_alt ?? p.title}
                    fill
                    sizes="(min-width: 64rem) 64rem, 100vw"
                    className="object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {hasMultiple && (
          <>
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
          </>
        )}
      </div>

      <div
        key={selectedIndex}
        className="animate-[fade-in-up_0.5s_ease] border-t-2 border-amber-400 bg-white p-6 text-center shadow-sm ring-1 ring-gray-100 sm:p-8"
      >
        <h3 className="font-serif text-xl font-bold text-[#001A23]">{project.title}</h3>
        {project.short_description && (
          <p className="mt-2 text-sm text-gray-600 sm:text-base">{project.short_description}</p>
        )}
      </div>

      {hasMultiple && (
        <div className="mt-5 flex justify-center gap-2">
          {projects.map((p, i) => (
            <button
              key={p.id}
              onClick={() => emblaApi?.scrollTo(i)}
              aria-label={`Go to ${p.title}`}
              className={`h-2 rounded-full transition-all ${
                i === selectedIndex ? 'w-6 bg-amber-400' : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}