import PageHeading from '@/components/ui/PageHeading';
import EventsTable from '@/components/admin/EventsTable';

export default function EventsPage() {
  return (
    <div className="p-8">
      <PageHeading title="Events" />
      <div className="mt-6">
        <EventsTable />
      </div>
    </div>
  );
}