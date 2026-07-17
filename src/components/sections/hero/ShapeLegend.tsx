"use client";

import Link from "next/link";
import { SHAPE_CONTENT } from "@/components/sections/hero/shapeContent";

export default function ShapeLegend({
  shapeNames,
  activeShapeIndex,
  manualIndex,
  phase,
  onSelect,
}: {
  shapeNames: string[];
  activeShapeIndex: number;
  manualIndex: number | null;
  phase: "assembling" | "holding" | "dispersing";
  onSelect: (index: number | null) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5 rounded-lg border border-white/10 bg-[#001A23]/60 p-3 backdrop-blur-sm">
      <span className="mb-1 px-1 text-[10px] font-semibold tracking-[0.18em] text-white/40 uppercase">
        Research Platforms
      </span>

      {shapeNames.map((name, i) => {
        const content = SHAPE_CONTENT[name];
        const isForming = i === activeShapeIndex;
        const isHeld = isForming && phase === "holding";
        const isManuallySelected = manualIndex === i;

        return (
          <button
            key={name}
            onClick={() => onSelect(isManuallySelected ? null : i)}
            className={`group flex items-center gap-2.5 rounded px-2 py-1.5 text-left transition-colors ${
              isManuallySelected ? "bg-white/10" : "hover:bg-white/5"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors ${
                isHeld ? "bg-amber-400" : "bg-white/25"
              }`}
            />
            <span className="flex flex-col">
              <span
                className={`text-xs font-medium transition-colors ${
                  isForming ? "text-white" : "text-white/55"
                }`}
              >
                {content?.label ?? name}
              </span>
              {isForming && content && (
                <span className="text-[10px] text-amber-400/80">{content.vertical}</span>
              )}
            </span>
          </button>
        );
      })}

      {manualIndex !== null && SHAPE_CONTENT[shapeNames[manualIndex]] && (
        <Link
          href={SHAPE_CONTENT[shapeNames[manualIndex]].href}
          className="mt-1 px-2 text-[11px] font-medium text-amber-400 underline underline-offset-2 hover:text-amber-300"
        >
          View research →
        </Link>
      )}
    </div>
  );
}