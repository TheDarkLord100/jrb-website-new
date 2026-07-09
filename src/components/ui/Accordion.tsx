import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export default function Accordion({
  title,
  children,
  accent = false,
}: {
  title: string;
  children: ReactNode;
  accent?: boolean;
}) {
  return (
    <details className="group rounded-lg border border-gray-200 bg-white open:shadow-sm">
      <summary
        className={`flex cursor-pointer list-none items-center justify-between px-5 py-3 font-semibold ${
          accent ? "text-yellow-600" : "text-[#001A23]"
        }`}
      >
        {title}
        <ChevronDown size={18} className="text-gray-400 transition-transform group-open:rotate-180" />
      </summary>
      <div className="border-t border-gray-100 px-5 py-4">{children}</div>
    </details>
  );
}
