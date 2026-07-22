import PageHeading from "@/components/ui/PageHeading";
import ResearchLabs from "@/components/sections/ResearchLabs";

export const metadata = { title: "Research Facilities" };

export default function ResearchFacilitiesPage() {
  return (
    <div>
      <PageHeading eyebrow="Research" title="Research Facilities" />
      <div className="mx-auto max-w-[75rem] px-5 pb-16">
        <ResearchLabs />
      </div>
    </div>
  );
}