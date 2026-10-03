'use client';

import SectionHeading from '@/components/ui/SectionHeading';
import FeaturedProjectsCarousel from '@/components/sections/FeaturedProjectsCarousel';
import { useFeaturedProjects } from '@/lib/hooks/useFeaturedProjects';
import type { Project } from '@/types/project';

// The whole "Featured Projects" section, heading included, so it can hide
// itself entirely when nothing is featured rather than showing an empty
// carousel under a heading.
export default function FeaturedProjects({
  initialProjects = [],
  className,
}: {
  initialProjects?: Project[];
  className?: string;
}) {
  const { items, error } = useFeaturedProjects(initialProjects);

  if (error || (items && items.length === 0)) return null;

  return (
    <section className={className}>
      <SectionHeading title="Featured Projects" />
      {items ? (
        <FeaturedProjectsCarousel projects={items} />
      ) : (
        <div className="mx-auto max-w-5xl animate-pulse">
          <div className="h-80 w-full bg-gray-100 sm:h-[28rem]" />
          <div className="h-28 w-full border-t-2 border-gray-200 bg-white" />
        </div>
      )}
    </section>
  );
}