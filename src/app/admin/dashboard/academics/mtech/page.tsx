import PageHeading from '@/components/ui/PageHeading';
import MtechAdminPanel from '@/components/admin/mtech/MtechAdminPanel';

export default function Page() {
  return (
    <div className="p-8">
      <PageHeading
        title="M.Tech"
        subtitle="Manage courses, baskets, and specializations for the M.Tech Robotics programme."
      />
      <div className="mt-6">
        <MtechAdminPanel />
      </div>
    </div>
  );
}
