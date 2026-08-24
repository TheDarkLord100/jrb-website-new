import Link from 'next/link';
import PageHeading from '@/components/ui/PageHeading';
import EventsList from '@/components/sections/events/EventsList';
import AnnouncementSidebar from '@/components/sections/events/AnnouncementSidebar';
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
          <div>
            <EventsList initialItems={events} />
          </div>

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