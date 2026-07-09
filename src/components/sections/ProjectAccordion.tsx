"use client";

import { ChevronDown } from "lucide-react";

export type Project = {
  title: string;
  lead: string;
  image: string;
  alt: string;
  abstract: string;
};

export default function ProjectAccordion({ project }: { project: Project }) {
  return (
    <details className="group rounded-xl border border-gray-100 bg-white shadow-sm open:shadow-md">
      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-5">
        <div>
          <h3 className="font-semibold text-[#001A23]">{project.title}</h3>
          <p className="mt-1 text-sm text-gray-600">{project.lead}</p>
        </div>
        <ChevronDown
          size={20}
          className="mt-1 shrink-0 text-gray-400 transition-transform group-open:rotate-180"
        />
      </summary>

      <div className="flex flex-col gap-5 border-t border-gray-100 p-5 sm:flex-row">
        <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-lg sm:h-auto sm:w-56">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={project.image} alt={project.alt} className="h-full w-full object-cover" />
        </div>
        <div className="flex-1">
          <div className="mb-3 flex gap-4">
            <a href="#" className="text-sm font-medium text-[#001A23] underline underline-offset-2">
              Project Write up
            </a>
            <a href="#" className="text-sm font-medium text-[#001A23] underline underline-offset-2">
              GitHub Links
            </a>
          </div>
          <h4 className="text-sm font-semibold tracking-wide text-gray-500 uppercase">
            Abstract and Conclusions
          </h4>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">{project.abstract}</p>
        </div>
      </div>
    </details>
  );
}
