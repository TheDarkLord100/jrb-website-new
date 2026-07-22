export default function LabDetailSkeleton() {
  return (
    <div className="mx-auto max-w-[75rem] animate-pulse px-5 py-12">
      {/* Header */}
      <div className="h-9 w-72 rounded bg-gray-200 sm:h-10 sm:w-96" />
      <div className="mt-3 h-4 w-56 rounded bg-gray-100" />

      {/* Meta row */}
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-b border-gray-200 pb-6">
        <div className="h-4 w-40 rounded bg-gray-100" />
        <div className="h-4 w-32 rounded bg-gray-100" />
        <div className="h-4 w-32 rounded bg-gray-100" />
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_280px]">
        <div>
          {/* Research Areas */}
          <div className="h-5 w-36 rounded bg-gray-200" />
          <div className="mt-3 flex flex-wrap gap-2">
            <div className="h-6 w-24 rounded-full bg-gray-100" />
            <div className="h-6 w-28 rounded-full bg-gray-100" />
          </div>

          {/* Description */}
          <div className="mt-8 h-5 w-40 rounded bg-gray-200" />
          <div className="mt-3 space-y-2">
            <div className="h-3 w-full rounded bg-gray-100" />
            <div className="h-3 w-full rounded bg-gray-100" />
            <div className="h-3 w-2/3 rounded bg-gray-100" />
          </div>

          {/* Gallery */}
          <div className="mt-8 h-5 w-44 rounded bg-gray-200" />
          <div className="mt-3 grid grid-cols-2 gap-4">
            <div className="aspect-[4/3] bg-gray-100" />
            <div className="aspect-[4/3] bg-gray-100" />
            <div className="aspect-[4/3] bg-gray-100" />
            <div className="aspect-[4/3] bg-gray-100" />
          </div>
        </div>

        {/* Announcements sidebar */}
        <aside className="border-t-2 border-gray-200 bg-gray-50 p-5 shadow-sm ring-1 ring-gray-100">
          <div className="h-4 w-32 rounded bg-gray-200" />
          <div className="mt-4 space-y-3">
            <div className="h-3 w-full rounded bg-gray-100" />
            <div className="h-3 w-4/5 rounded bg-gray-100" />
            <div className="h-3 w-full rounded bg-gray-100" />
          </div>
        </aside>
      </div>
    </div>
  );
}