'use client';

import { useState } from 'react';
import PageHeading from '@/components/ui/PageHeading';

type NavChild = { id: string; label: string };
type NavNode = { id: string; label: string; children?: NavChild[] };

const structure: NavNode[] = [
  { id: 'about', label: 'about' },
  {
    id: 'academics',
    label: 'academics',
    children: [
      { id: 'admissions', label: 'admissions' },
      { id: 'minor', label: 'minor' },
      { id: 'mtech', label: 'mtech' },
    ],
  },
  { id: 'contact', label: 'contact' },
  { id: 'events', label: 'events' },
  { id: 'industry', label: 'industry' },
  { id: 'people', label: 'people' },
  {
    id: 'research',
    label: 'research',
    children: [
      { id: 'facilities', label: 'facilities' },
      { id: 'themes', label: 'themes' },
    ],
  },
];

function findParentLabel(childId: string) {
  for (const n of structure) {
    if (n.children?.some((c) => c.id === childId)) return n.label;
  }
  return null;
}

export default function DashboardClient() {
  const [activeId, setActiveId] = useState('about');
  const [activeLabel, setActiveLabel] = useState('about');
  const [open, setOpen] = useState<Record<string, boolean>>({
    academics: true,
    research: true,
  });

  const parentLabel = findParentLabel(activeId);
  const path = parentLabel ? `/ ${parentLabel} / ${activeLabel}` : `/ ${activeLabel}`;
  const titleCase = activeLabel.charAt(0).toUpperCase() + activeLabel.slice(1);

  const toggleOpen = (id: string) =>
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));

  const select = (id: string, label: string) => {
    setActiveId(id);
    setActiveLabel(label);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <nav
        aria-label="Site sections"
        className="sticky top-0 flex h-screen w-[300px] shrink-0 flex-col bg-slate-900 text-slate-400"
      >
        <div className="border-b border-slate-700 px-6 pb-5 pt-7">
          <div className="font-serif text-xl font-semibold tracking-tight text-slate-100">
            Department admin
          </div>
          <div className="mt-1 font-mono text-[11px] tracking-wide text-slate-500">
            site structure
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          <div className="text-[13.5px]">
            {structure.map((node) => {
              const isParent = !!node.children;
              const isNodeActive = activeId === node.id;

              return (
                <div key={node.id}>
                  <button
                    type="button"
                    onClick={() =>
                      isParent
                        ? (toggleOpen(node.id), select(node.id, node.label))
                        : select(node.id, node.label)
                    }
                    className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left transition-colors hover:bg-slate-800 hover:text-slate-100 ${
                      isNodeActive ? 'bg-slate-800 text-teal-300' : isParent ? 'text-slate-300' : ''
                    }`}
                  >
                    {isParent ? (
                      <span
                        className={`inline-block w-3 text-[10px] text-slate-500 transition-transform ${
                          open[node.id] ? 'rotate-90' : ''
                        }`}
                      >
                        ▶
                      </span>
                    ) : (
                      <span className="inline-block w-3" />
                    )}
                    <span className="capitalize">{node.label}</span>
                  </button>

                  {isParent && (
                    <div
                      className={`ml-5 overflow-hidden border-l border-slate-700 pl-3 transition-[max-height] duration-200 ${
                        open[node.id] ? 'max-h-60' : 'max-h-0'
                      }`}
                    >
                      {node.children!.map((child) => {
                        const childActive = activeId === child.id;
                        return (
                          <button
                            key={child.id}
                            type="button"
                            onClick={() => select(child.id, child.label)}
                            className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left transition-colors hover:bg-slate-800 hover:text-slate-100 ${
                              childActive ? 'bg-slate-800 text-teal-300' : ''
                            }`}
                          >
                            <span
                              className={`h-1 w-1 rounded-full ${
                                childActive ? 'bg-teal-300' : 'bg-slate-600'
                              }`}
                            />
                            <span className="capitalize">{child.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t border-slate-700 px-6 py-4 font-mono text-[11px] text-slate-500">
          signed in as editor
        </div>
      </nav>

      {/* Content */}
      <div className="flex flex-1 flex-col bg-stone-50">
        <div className="flex items-center justify-between border-b border-stone-200 px-10 py-5">
          <div className="font-mono text-[12.5px] text-stone-400">
            site <span className="text-stone-900">{path}</span>
          </div>
          <div className="font-serif text-[15px] capitalize text-stone-400">{activeLabel}</div>
        </div>

        <div className="flex flex-1 items-center justify-center p-16">
          <div className="max-w-[340px] text-center">
            <PageHeading title={titleCase} />
            <p className="mt-2 text-sm leading-relaxed text-stone-400">
              This page is blank. Select another section from the tree on the left to switch pages.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}