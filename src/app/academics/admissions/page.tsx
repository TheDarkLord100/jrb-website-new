import PageHeading from "@/components/ui/PageHeading";
import AdmissionsContent from "@/components/sections/AdmissionsContent";
import AnnouncementSidebar from "@/components/sections/AnnouncementSidebar";

export const metadata = { title: "Admissions" };

export default function AdmissionsPage() {
  return (
    <div>
      <PageHeading eyebrow="Academics" title="Admissions" />

      <div className="mx-auto grid max-w-[75rem] gap-8 px-5 pb-16 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          <AdmissionsContent />
        </div>

        <aside>
          <AnnouncementSidebar type="admission" heading="Announcements" />
        </aside>
      </div>
    </div>
  );
}