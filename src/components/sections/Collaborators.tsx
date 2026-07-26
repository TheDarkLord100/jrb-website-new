'use client';

import Image from 'next/image';
import SectionHeading from '@/components/ui/SectionHeading';
import { useCollaborators } from '@/lib/useCollaborators';

function LogosSkeleton() {
  return (
    <div className="flex animate-pulse items-center gap-16 px-8">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-14 w-28 shrink-0 rounded bg-gray-100" />
      ))}
    </div>
  );
}

export default function Collaborators() {
  const { collaborators, error } = useCollaborators();

  if (error) {
    return (
      <section className="bg-white py-16">
        <div className="mx-auto max-w-[75rem] px-5">
          <SectionHeading title="Our Collaborators" />
          <p className="text-center text-sm text-gray-500">
            Couldn&apos;t load collaborator logos right now.
          </p>
        </div>
      </section>
    );
  }

  // Nothing to show yet -- hide the section entirely rather than rendering
  // a heading over an empty marquee.
  if (collaborators !== null && collaborators.length === 0) {
    return null;
  }

  const doubled = collaborators ? [...collaborators, ...collaborators] : null;

  return (
    <section className="overflow-hidden bg-white py-16">
      <div className="mx-auto max-w-[75rem] px-5">
        <SectionHeading title="Our Collaborators" />
      </div>

      <div className="relative flex overflow-hidden">
        {doubled === null ? (
          <LogosSkeleton />
        ) : (
          <div className="animate-marquee flex shrink-0 items-center gap-16 px-8">
            {doubled.map((c, i) => (
              <Image
                key={`${c.id}-${i}`}
                src={c.logo_url}
                alt={c.name ?? 'Collaborator logo'}
                width={110}
                height={55}
                className="h-14 w-auto shrink-0 object-contain grayscale transition-all hover:grayscale-0"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
