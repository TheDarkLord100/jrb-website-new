import PageHeading from '@/components/ui/PageHeading';
import PeopleDirectory from '@/components/sections/people/PeopleDirectory';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'People',
  description:
    'Faculty, students, post-docs, and alumni of CoE-BIRD — the Centre of Excellence on Biologically Inspired Robots and Drones at IIT Delhi.',
  path: '/people',
});
export default function PeoplePage() {
  return (
    <div>
      <PageHeading eyebrow="People" title="Members" />
      <div className="mx-auto max-w-[90rem] px-5 pb-16">
        <PeopleDirectory />
      </div>
    </div>
  );
}
