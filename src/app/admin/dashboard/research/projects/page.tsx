import PageHeading from '@/components/ui/PageHeading';
import ProjectsPanel from '@/components/admin/projects/ProjectsPanel';

export default function Page() {
  return (
    <div className="p-8">
      <PageHeading
        title="Projects"
        subtitle="Manage research projects for each theme and the featured projects carousel."
      />
      <div className="mt-6">
        <ProjectsPanel />
      </div>
    </div>
  );
}