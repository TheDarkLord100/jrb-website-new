import Link from 'next/link';
import PageHeading from '@/components/ui/PageHeading';
import SectionHeading from '@/components/ui/SectionHeading'; // Added for the new heading
import EventsList from '@/components/sections/events/EventsList';
import AnnouncementSidebar from '@/components/sections/events/AnnouncementSidebar';
import BuildoffRobotSvg from '@/components/illustrations/BuildoffRobotSvg'; // Imported our new asset
import { getAnnouncementsByType } from '@/lib/supabase/queries';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'Events',
  description:
    'Past events, talks, and announcements from CoE-BIRD, the Centre of Excellence on Biologically Inspired Robots and Drones at IIT Delhi.',
  path: '/events',
});

export default async function EventsPage() {
  const [events, news] = await Promise.all([
    getAnnouncementsByType('event'),
    getAnnouncementsByType('news'),
  ]);

  return (
    <div>
      <PageHeading eyebrow="Events" title="Events" />

      <div className="mx-auto max-w-[75rem] px-5 pb-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          {/* Main Events Column */}
          <div className="flex flex-col gap-10">

            {/* --- Promoted Banners Section --- */}
            <div>
              <div className="mb-5">
                <SectionHeading title="Upcoming Events" />
              </div>

              <Link
                href="/events/buildoff"
                className="group relative flex overflow-hidden rounded-2xl bg-gradient-to-br from-[#001A23] via-[#002836] to-slate-900 px-7 py-8 text-white shadow-xl transition-transform hover:-translate-y-1 hover:shadow-2xl sm:px-10"
              >
                <div className="relative z-10 flex w-full flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="sm:w-2/3">
                    <span className="mb-3 inline-block rounded-full bg-amber-400 px-3 py-1 text-xs font-extrabold tracking-wider text-[#001A23] uppercase">
                      Registration Opens Dec 2026
                    </span>
                    <h3 className="font-serif text-2xl font-bold sm:text-3xl text-white">
                      BuildOff 2026: Autonomous Garbage-Collecting Robot
                    </h3>
                    <p className="mt-3 text-sm text-gray-300 sm:text-base">
                      Autonomy for a Better Tomorrow. Join CoE-BIRD IIT Delhi’s flagship five-month robotics buildathon. Participate, simulate, and build!
                    </p>
                    <div className="mt-6 shrink-0">
                      <span className="inline-flex items-center justify-center rounded-lg bg-amber-400 px-6 py-3 text-sm font-bold text-[#001A23] transition-colors group-hover:bg-amber-300">
                        View Challenge Details →
                      </span>
                    </div>
                  </div>

                  {/* Reusable SVG Asset positioned on the right */}
                  <div className="flex shrink-0 justify-center sm:w-1/3 sm:justify-end">
                    <div className="w-48 opacity-90 transition-opacity duration-300 group-hover:opacity-100 sm:w-full sm:max-w-[200px]">
                      <BuildoffRobotSvg className="h-auto w-full drop-shadow-2xl" />
                    </div>
                  </div>
                </div>

                {/* Subtle background glow */}
                <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-amber-400/5 blur-3xl transition-colors duration-500 group-hover:bg-amber-400/10" />
              </Link>
            </div>
            {/* ----------------------------- */}

            {/* Dynamic Events List (Past Events) */}
            <div className="mt-4">
              <EventsList initialItems={events} />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="flex flex-col gap-6">
            <Link
              href="/academics/admissions"
              className="flex flex-col gap-1 border-l-2 border-amber-400 bg-amber-50/60 px-4 py-3 transition-colors hover:bg-amber-50"
            >
              <span className="text-sm text-[#001A23]">
                Looking for <strong>admissions-related announcements</strong>?
              </span>
              <span className="text-sm font-medium text-amber-700">Go to Admissions →</span>
            </Link>

            <AnnouncementSidebar
              type="news"
              heading="News"
              emptyText="No news posted yet."
              initialItems={news}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}