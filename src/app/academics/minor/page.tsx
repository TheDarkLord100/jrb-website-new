import PageHeading from '@/components/ui/PageHeading';
import IdsrContent from '@/components/sections/academics/IdsrContent';

import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'Minor Degree in Robotics',
  description:
    'The Interdisciplinary Specialization in Robotics (IDSR) — an undergraduate robotics specialization at IIT Delhi, grown from the university\'s robotics research programme.',
  path: '/academics/minor',
});
export default function MinorPage() {
  return (
    <div>
      <PageHeading
        eyebrow="Academics"
        title="Interdisciplinary Specialization in Robotics"
        subtitle="IDSR — an undergraduate specialization at IIT Delhi"
      />
      <div className="mx-auto max-w-[75rem] px-5 pb-16">
        <IdsrContent />
      </div>
    </div>
  );
}
