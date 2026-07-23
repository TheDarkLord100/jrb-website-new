import Link from "next/link";
import PageHeading from "@/components/ui/PageHeading";
import SectionHeading from "@/components/ui/SectionHeading";
import EventsList from "@/components/sections/EventsList";
import AnnouncementSidebar from "@/components/sections/AnnouncementSidebar";

export const metadata = { title: "Events" };

export default function EventsPage() {
  return (
    <div>
      <PageHeading eyebrow="Events" title="Events" />

      <div className="mx-auto max-w-[75rem] px-5 pb-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div>
            <SectionHeading title="Past Events" />
            <EventsList />
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

            <AnnouncementSidebar type="news" heading="News" emptyText="No news posted yet." />
          </aside>
        </div>
      </div>
    </div>
  );
}