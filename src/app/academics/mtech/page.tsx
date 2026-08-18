import PageHeading from '@/components/ui/PageHeading';
import MtechContent from '@/components/sections/academics/MtechContent';

import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'M.Tech. in Robotics',
  description:
    'The M.Tech in Robotics (JRB) at IIT Delhi — an interdisciplinary programme jointly offered by Electrical Engineering, Mechanical Engineering, Computer Science, and the School of AI.',
  path: '/academics/mtech',
});
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
