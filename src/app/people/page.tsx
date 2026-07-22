import PageHeading from "@/components/ui/PageHeading";
import PeopleDirectory from "@/components/sections/PeopleDirectory";

export const metadata = { title: "People" };

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