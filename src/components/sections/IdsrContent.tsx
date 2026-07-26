'use client';

import { FileText, BookOpen } from 'lucide-react';
import Markdown from '@/components/ui/Markdown';
import TocNav, { type TocSection } from '@/components/ui/TocNav';
import { SectionTitle, TextSkeleton, TableSkeleton } from '@/components/ui/ContentBlocks';
import { useIdsrContent } from '@/lib/useIdsrContent';

const SECTIONS: TocSection[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'curriculum-structure', label: 'Curriculum Structure' },
  { id: 'core-courses', label: 'Core Courses' },
  { id: 'electives', label: 'Elective Courses' },
  { id: 'learning-approach', label: 'Learning Approach' },
];

export default function IdsrContent() {
  const { data, error } = useIdsrContent();

  if (error) {
    return (
      <p className="py-20 text-center text-gray-500">
        Couldn&apos;t load this page right now. Please try again shortly.
      </p>
    );
  }

  const bySectionKey = (key: string) => data?.sections.filter((s) => s.section_key === key) ?? [];

  return (
    <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
      <TocNav sections={SECTIONS} />

      <div className="flex min-w-0 flex-col gap-16">
        <section id="overview" className="scroll-mt-24">
          <SectionTitle>Overview</SectionTitle>
          {data === null ? (
            <TextSkeleton lines={5} />
          ) : (
            <div className="mt-5 flex flex-col gap-4">
              {bySectionKey('overview').map((s) => (
                <Markdown key={s.id}>{s.body_markdown}</Markdown>
              ))}

              <a
                href="/Assets/IDSR.pdf"
                download
                className="mt-2 inline-flex w-fit items-center gap-2 border border-gray-300 px-5 py-2.5 text-sm font-medium text-[#001A23] transition-colors hover:border-amber-400 hover:text-amber-700"
              >
                <FileText size={16} className="text-amber-600" />
                Download Complete Curriculum (PDF)
              </a>
            </div>
          )}
        </section>

        <section id="curriculum-structure" className="scroll-mt-24">
          <SectionTitle>Curriculum Structure</SectionTitle>
          {data === null ? (
            <TableSkeleton />
          ) : (
            <div className="mt-5 overflow-hidden border-t-2 border-amber-400 shadow-sm ring-1 ring-gray-100">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#001A23] text-white">
                  <tr>
                    <th className="px-4 py-3">Component</th>
                    <th className="px-4 py-3">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {data.curriculum.map((row) => (
                    <tr
                      key={row.id}
                      className={
                        row.is_highlighted
                          ? 'bg-gray-50 font-semibold text-[#001A23]'
                          : 'border-b border-gray-100'
                      }
                    >
                      <td className="px-4 py-3 text-gray-700">{row.component}</td>
                      <td className="px-4 py-3 text-gray-600">{row.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section id="core-courses" className="scroll-mt-24">
          <SectionTitle>Core Courses</SectionTitle>
          {data === null ? (
            <TableSkeleton />
          ) : (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[420px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500">
                    <th className="py-2 pr-4 font-semibold">Course</th>
                    <th className="px-2 py-2 font-semibold">Code</th>
                    <th className="px-2 py-2 font-semibold">L-T-P</th>
                    <th className="px-2 py-2 font-semibold">Credits</th>
                  </tr>
                </thead>
                <tbody>
                  {data.coreCourses.map((row) => (
                    <tr key={row.id} className="border-b border-gray-100">
                      <td className="py-2 pr-4 text-gray-700">{row.course}</td>
                      <td className="px-2 py-2 text-gray-600">{row.code ?? '—'}</td>
                      <td className="px-2 py-2 text-gray-600">{row.ltp ?? '—'}</td>
                      <td className="px-2 py-2 text-gray-600">{row.credits ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section id="electives" className="scroll-mt-24">
          <SectionTitle>Elective Courses</SectionTitle>
          <p className="mt-5 leading-relaxed text-gray-700">
            Electives are drawn from courses offered across departments, allowing students to shape
            their specialization around individual interests.
          </p>
          {data === null ? (
            <div className="mt-5 flex animate-pulse flex-wrap gap-2">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="h-9 w-32 rounded bg-gray-100" />
              ))}
            </div>
          ) : (
            <div className="mt-5 flex flex-wrap gap-2">
              {data.electives.map((e) => (
                <span
                  key={e.id}
                  className="flex items-center gap-2 border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700"
                >
                  <BookOpen size={14} className="text-amber-600" />
                  {e.label}
                </span>
              ))}
            </div>
          )}
        </section>

        <section id="learning-approach" className="scroll-mt-24">
          <SectionTitle>Learning Approach</SectionTitle>
          {data === null ? (
            <TextSkeleton lines={4} />
          ) : (
            <div className="mt-5 flex flex-col gap-4">
              {bySectionKey('learning-approach').map((s) => (
                <Markdown key={s.id}>{s.body_markdown}</Markdown>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
