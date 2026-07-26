export function SectionTitle({ children }: { children: string }) {
  return (
    <>
      <h2 className="font-serif text-2xl font-bold text-[#001A23]">{children}</h2>
      <div className="mt-2 h-0.5 w-12 bg-amber-400" />
    </>
  );
}

export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="mt-5 animate-pulse space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-3 rounded bg-gray-100 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}
        />
      ))}
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="mt-5 animate-pulse space-y-2">
      <div className="h-8 w-full rounded bg-gray-100" />
      <div className="h-6 w-full rounded bg-gray-50" />
      <div className="h-6 w-full rounded bg-gray-50" />
      <div className="h-6 w-3/4 rounded bg-gray-50" />
    </div>
  );
}
