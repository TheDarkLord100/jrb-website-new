import PageHeading from '@/components/ui/PageHeading';
import PeopleAdminPanel from '@/components/admin/people/PeopleAdminPanel';

export default function Page() {
  return (
    <div className="p-8">
      <PageHeading
        title="People"
        subtitle="Manage faculty, students, post docs and alumni, and the Faculty filter tags."
      />
      <div className="mt-6">
        <PeopleAdminPanel />
      </div>
    </div>
  );
}