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
            {/* Featured: BuildOff 2026 */}
            <div>
              <SectionHeading title="Featured Event" />
              <Link
                href="/events/buildoff"
                className="group relative grid grid-cols-[1fr_auto] overflow-hidden border-t-4 border-[#FFC433] bg-[#FAF7EF] shadow-sm ring-1 ring-[#E4DFD2] transition-shadow hover:shadow-md sm:grid-cols-[1fr_300px]"
              >
                <img
                  src="/Assets/buildoff/buildoff-circuit-pattern.svg"
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-6 -right-10 hidden w-[420px] sm:block"
                />

                <div className="relative flex flex-col justify-center p-5 sm:p-8">
                  <img
                    src="/Assets/buildoff/buildoff-logo.svg"
                    alt="BuildOff 2026"
                    className="h-10 w-auto self-start sm:h-14"
                  />
                  <div className="mt-5 flex flex-col items-start gap-2 sm:mt-6 sm:flex-row sm:items-center sm:gap-4">
                    <span className="inline-block bg-[#23232A] px-5 py-2.5 text-sm font-semibold text-white transition-colors group-hover:bg-black sm:px-6">
                      View details <span className="text-[#FFC433]">→</span>
                    </span>
                    <span className="text-[11px] font-semibold tracking-wide text-gray-500 uppercase sm:text-xs">
                      Registration opens Dec 2026
                    </span>
                  </div>
                </div>

                <div className="relative flex items-end justify-center pt-5 pr-4 pb-5 sm:px-6 sm:pt-8 sm:pb-6">
                  <img
                    src="/Assets/buildoff/buildoff-robot.svg"
                    alt=""
                    aria-hidden="true"
                    className="h-auto w-[110px] sm:w-full sm:max-w-[220px]"
                  />
                </div>
              </Link>
            </div>

            {/* Dynamic Events List (Past Events) */}
            <EventsList initialItems={events} />
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
