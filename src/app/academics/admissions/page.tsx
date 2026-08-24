import PageHeading from '@/components/ui/PageHeading';
import AdmissionsContent from '@/components/sections/academics/AdmissionsContent';
import AnnouncementSidebar from '@/components/sections/events/AnnouncementSidebar';
import { getAdmissionSections, getAdmissionLinks, getAnnouncementsByType } from '@/lib/supabase/queries';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'Admissions',
  description:
    "Admissions information and announcements for CoE-BIRD's robotics programmes at IIT Delhi, including the M.Tech in Robotics and the Interdisciplinary Specialization in Robotics.",
  path: '/academics/admissions',
});

export default async function AdmissionsPage() {
  const [sections, links, announcements] = await Promise.all([
    getAdmissionSections(),
    getAdmissionLinks(),
    getAnnouncementsByType('admission'),
  ]);

  return (
    <div>
      <PageHeading eyebrow="Academics" title="Admissions" />

      <div className="mx-auto grid max-w-[75rem] gap-8 px-5 pb-16 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          <AdmissionsContent initialData={{ sections, links }} />
        </div>

        <aside>
          <AnnouncementSidebar type="admission" heading="Announcements" initialItems={announcements} />
        </aside>
      </div>
    </div>
  );
}