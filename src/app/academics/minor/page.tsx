import PageHeading from "@/components/ui/PageHeading";
import IdsrContent from "@/components/sections/IdsrContent";

export const metadata = { title: "Minor Degree in Robotics" };

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