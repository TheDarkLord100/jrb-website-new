import PageHeading from '@/components/ui/PageHeading';
import MtechContent from '@/components/sections/academics/MtechContent';

export const metadata = { title: 'M.Tech. in Robotics' };

export default function MTechPage() {
  return (
    <div>
      <PageHeading
        eyebrow="Academics"
        title="M.Tech in Robotics"
        subtitle="Interdisciplinary M.Tech in Robotics (JRB), IIT Delhi"
      />
      <div className="mx-auto max-w-[75rem] px-5 pb-16">
        <MtechContent />
      </div>
    </div>
  );
}
