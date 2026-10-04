import PageHeading from '@/components/ui/PageHeading';
import PublicationsPanel from '@/components/admin/publications/PublicationsPanel';

export default function Page() {
  return (
    <div className="p-8">
      <PageHeading
        title="Publications"
        subtitle="Import faculty papers from OpenAlex, assign them to research themes, or add them by hand."
      />
      <div className="mt-6">
        <PublicationsPanel />
      </div>
    </div>
  );
}