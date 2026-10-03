import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Accordion({
  title,
  children,
  accent = false,
}: {
  // Usually plain text; can be richer markup (e.g. a thumbnail beside the
  // text) when a list needs more than a label in its collapsed state.
  title: ReactNode;
  children: ReactNode;
  accent?: boolean;
}) {
  return (
    <details
      className={`group border-t-2 bg-white shadow-sm ring-1 ring-gray-100 open:shadow-md ${
        accent ? 'border-amber-400' : 'border-gray-200'
      }`}
    >
      <summary
        className={`flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-3 font-semibold ${
          accent ? 'text-amber-700' : 'text-[#001A23]'
        }`}
      >
        {title}
        <ChevronDown
          size={18}
          className="shrink-0 text-gray-400 transition-transform group-open:rotate-180"
        />
      </summary>
      <div className="border-t border-gray-100 px-5 py-4">{children}</div>
    </details>
  );
}