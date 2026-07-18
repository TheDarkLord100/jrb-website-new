export default function PeopleSkeleton() {
  return (
    <div className="grid animate-pulse gap-8 lg:grid-cols-[220px_1fr]">
      {/* Department sidebar skeleton */}
      <aside className="hidden flex-col gap-3 lg:flex">
        <div className="h-3 w-24 rounded bg-gray-200" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-3 w-20 rounded bg-gray-100" />
        ))}
      </aside>

      <div>
        {/* Search bar skeleton */}
        <div className="h-9 w-full rounded border border-gray-200 bg-gray-100" />

        {/* Tag chips skeleton */}
        <div className="mt-4 flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-7 w-20 rounded-full bg-gray-200" />
          ))}
        </div>

        {/* Card grid skeleton */}
        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex gap-4 border-t-2 border-gray-200 bg-white p-4 shadow-sm ring-1 ring-gray-100"
            >
              <div className="h-20 w-20 shrink-0 rounded-full bg-gray-200" />
              <div className="min-w-0 flex-1">
                <div className="h-4 w-3/4 rounded bg-gray-200" />
                <div className="mt-2 h-3 w-1/2 rounded bg-gray-100" />
                <div className="mt-2 h-3 w-full rounded bg-gray-100" />
                <div className="mt-1 h-3 w-5/6 rounded bg-gray-100" />
                <div className="mt-3 flex gap-3">
                  <div className="h-4 w-4 rounded-full bg-gray-200" />
                  <div className="h-4 w-4 rounded-full bg-gray-200" />
                  <div className="h-4 w-4 rounded-full bg-gray-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}