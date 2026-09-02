import PageHeading from '@/components/ui/PageHeading';

export default function Page() {
  return (
    <div className="flex flex-1 items-center justify-center p-16">
      <div className="max-w-[340px] text-center">
        <PageHeading title="Admissions" />
        <p className="mt-2 text-sm leading-relaxed text-stone-400">
          This page is blank. Select another section from the sidebar to switch pages.
        </p>
      </div>
    </div>
  );
}