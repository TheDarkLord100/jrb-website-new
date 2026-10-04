import PageHeading from '@/components/ui/PageHeading';
import ThemeLinksPanel from '@/components/admin/themes/ThemeLinksPanel';

export default function Page() {
  return (
    <div className="p-8">
      <PageHeading
        title="Research Themes"
        subtitle="Choose which faculty and labs appear on each research theme page."
      />
      <div className="mt-6">
        <ThemeLinksPanel />
      </div>
    </div>
  );
}