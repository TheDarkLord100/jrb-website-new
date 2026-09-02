import PageHeading from '@/components/ui/PageHeading';
import ResearchLabs from '@/components/sections/research/ResearchLabs';
import { getLabs } from '@/lib/supabase/queries';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'Research Facilities',
  description:
    'Labs and research facilities at CoE-BIRD, the Centre of Excellence on Biologically Inspired Robots and Drones at IIT Delhi.',
  path: '/research/facilities',
});

export default async function ResearchFacilitiesPage() {
  const labs = await getLabs();

  return (
    <div>
      <PageHeading eyebrow="Research" title="Research Facilities" />
      <div className="mx-auto max-w-[75rem] px-5 pb-16">
        <ResearchLabs initialLabs={labs} />
      </div>
    </div>
  );
}
