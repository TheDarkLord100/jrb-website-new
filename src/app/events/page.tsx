import PageHeading from "@/components/ui/PageHeading";
import SectionHeading from "@/components/ui/SectionHeading";
import EventsAccordion from "@/components/sections/EventsAccordion";

export const metadata = { title: "Events" };

export default function EventsPage() {
  return (
    <div>
      <PageHeading title="Events" />
      <div className="mx-auto max-w-[75rem] px-5 pb-16">
        <SectionHeading title="Past Events" />
        <EventsAccordion />
      </div>
    </div>
  );
}
