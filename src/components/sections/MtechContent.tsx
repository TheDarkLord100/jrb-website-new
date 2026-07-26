"use client";

import Accordion from "@/components/ui/Accordion";
import Markdown from "@/components/ui/Markdown";
import TocNav, { type TocSection } from "@/components/ui/TocNav";
import { useMtechContent } from "@/lib/useMtechContent";
import { getLucideIcon } from "@/lib/lucideIconMap";
import type { MtechCourse } from "@/types/mtech";

const SECTIONS: TocSection[] = [
  { id: "overview", label: "Overview" },
  { id: "outcomes", label: "Learning Outcomes" },
  { id: "why-jrb", label: "Why Choose JRB@IITD" },
  { id: "curriculum-structure", label: "Curriculum Structure" },
  { id: "core-courses", label: "Programme Core Courses" },
  { id: "electives", label: "Programme Electives" },
  { id: "projects", label: "Projects" },
  { id: "semester-plan", label: "Semester-wise Plan" },
  { id: "specializations", label: "Areas of Specialization" },
];

const SEMESTER_ORDER = [
  "Semester I",
  "Winter Break",
  "Semester II",
  "Summer Term",
  "Semester III",
  "Semester IV",
];

function SectionTitle({ children }: { children: string }) {
  return (
    <>
      <h2 className="font-serif text-2xl font-bold text-[#001A23]">{children}</h2>
      <div className="mt-2 h-0.5 w-12 bg-amber-400" />
    </>
  );
}

function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="mt-5 animate-pulse space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-3 rounded bg-gray-100 ${i === lines - 1 ? "w-2/3" : "w-full"}`}
        />
      ))}
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="mt-5 animate-pulse space-y-2">
      <div className="h-8 w-full rounded bg-gray-100" />
      <div className="h-6 w-full rounded bg-gray-50" />
      <div className="h-6 w-full rounded bg-gray-50" />
      <div className="h-6 w-3/4 rounded bg-gray-50" />
    </div>
  );
}

function CourseTable({
  rows,
  componentLabel = "Course",
}: {
  rows: MtechCourse[];
  componentLabel?: string;
}) {
  const hasCode = rows.some((r) => r.code);
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[480px] text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-gray-500">
            {hasCode && <th className="py-2 pr-3 font-semibold">Code</th>}
            <th className="py-2 pr-4 font-semibold">{componentLabel}</th>
            <th className="px-2 py-2 font-semibold">L</th>
            <th className="px-2 py-2 font-semibold">T</th>
            <th className="px-2 py-2 font-semibold">P</th>
            <th className="px-2 py-2 font-semibold">C</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-gray-100">
              {hasCode && (
                <td className="py-2 pr-3 text-xs whitespace-nowrap text-gray-500">
                  {row.code ?? "—"}
                </td>
              )}
              <td className="py-2 pr-4 text-gray-700">{row.title}</td>
              <td className="px-2 py-2 text-gray-600">{row.l ?? "—"}</td>
              <td className="px-2 py-2 text-gray-600">{row.t ?? "—"}</td>
              <td className="px-2 py-2 text-gray-600">{row.p ?? "—"}</td>
              <td className="px-2 py-2 text-gray-600">{row.credits}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function MtechContent() {
  const { data, error } = useMtechContent();

  if (error) {
    return (
      <p className="py-20 text-center text-gray-500">
        Couldn&apos;t load this page right now. Please try again shortly.
      </p>
    );
  }

  const bySectionKey = (key: string) => data?.sections.filter((s) => s.section_key === key) ?? [];
  const coreCourses = data?.courses.filter((c) => c.category === "core") ?? [];
  const projectCourses = data?.courses.filter((c) => c.category === "project") ?? [];
  const totalCredits =
    data?.creditCategories.reduce((sum, c) => sum + c.credits, 0) ?? null;

  const semesterGroups = SEMESTER_ORDER.map((title) => {
    const rows = (data?.courses ?? []).filter((c) => c.semester === title);
    return { title, rows, accent: rows.some((r) => r.is_break_component) };
  }).filter((g) => g.rows.length > 0);

  return (
    <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
      <TocNav sections={SECTIONS} />

      <div className="flex min-w-0 flex-col gap-16">
        <section id="overview" className="scroll-mt-24 text-justify">
          <SectionTitle>Overview</SectionTitle>
          {data === null ? (
            <TextSkeleton lines={5} />
          ) : (
            bySectionKey("overview").map((s) => <Markdown key={s.id}>{s.body_markdown}</Markdown>)
          )}
        </section>

        <section id="outcomes" className="scroll-mt-24">
          <SectionTitle>Learning Outcomes</SectionTitle>
          {data === null ? (
            <TextSkeleton lines={4} />
          ) : (
            bySectionKey("outcomes").map((s) => <Markdown key={s.id}>{s.body_markdown}</Markdown>)
          )}
        </section>

        <section id="why-jrb" className="scroll-mt-24">
          <SectionTitle>Why Choose JRB@IITD</SectionTitle>
          {data === null ? (
            <TextSkeleton lines={6} />
          ) : (
            <div className="mt-5 flex flex-col gap-8">
              {bySectionKey("why-jrb").map((s) => (
                <div key={s.id}>
                  {s.title && (
                    <h3 className="font-serif text-lg font-bold text-[#001A23]">{s.title}</h3>
                  )}
                  <Markdown>{s.body_markdown}</Markdown>
                </div>
              ))}
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
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3">Credits</th>
                  </tr>
                </thead>
                <tbody>
                  {data.creditCategories.map((row) => (
                    <tr key={row.id} className="border-b border-gray-100">
                      <td className="px-4 py-3 text-gray-700">{row.category}</td>
                      <td className="px-4 py-3 text-gray-600">{row.description}</td>
                      <td className="px-4 py-3 text-gray-600">{row.credits}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 font-semibold text-[#001A23]">
                    <td className="px-4 py-3">Total</td>
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3">{totalCredits}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section id="core-courses" className="scroll-mt-24">
          <SectionTitle>Programme Core Courses</SectionTitle>
          <p className="mt-5 leading-relaxed text-gray-700">
            24 credits, spread across Semesters I and II. The AI/ML core requirement can be
            satisfied by any one of three courses.
          </p>
          {data === null ? <TableSkeleton /> : <div className="mt-5"><CourseTable rows={coreCourses} /></div>}
        </section>

        <section id="electives" className="scroll-mt-24">
          <SectionTitle>Programme Electives</SectionTitle>
          {data === null ? (
            <TextSkeleton lines={2} />
          ) : (
            bySectionKey("electives-intro").map((s) => (
              <Markdown key={s.id}>{s.body_markdown}</Markdown>
            ))
          )}

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="border-t-2 border-amber-400 bg-white p-5 shadow-sm ring-1 ring-gray-100">
              <span className="text-[10px] font-bold tracking-wide text-amber-600 uppercase">
                Default track
              </span>
              <h4 className="mt-1 text-sm font-semibold text-[#001A23]">
                Project-Intensive Track
              </h4>
              <ul className="mt-3 flex flex-col gap-1.5 text-sm text-gray-600">
                <li>MTP–II (12 credits)</li>
                <li>2 Programme Elective courses (3 credits each)</li>
              </ul>
            </div>

            <div className="border-t-2 border-gray-200 bg-white p-5 shadow-sm ring-1 ring-gray-100">
              <span className="text-[10px] font-bold tracking-wide text-gray-400 uppercase">
                Requires PEC approval
              </span>
              <h4 className="mt-1 text-sm font-semibold text-[#001A23]">
                Course-Intensive Track
              </h4>
              <ul className="mt-3 flex flex-col gap-1.5 text-sm text-gray-600">
                <li>6 Programme Elective courses (3 credits each)</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="projects" className="scroll-mt-24">
          <SectionTitle>Projects</SectionTitle>
          {data === null ? (
            <TextSkeleton lines={2} />
          ) : (
            bySectionKey("projects-intro").map((s) => (
              <Markdown key={s.id}>{s.body_markdown}</Markdown>
            ))
          )}
          {data === null ? <TableSkeleton /> : <div className="mt-5"><CourseTable rows={projectCourses} /></div>}
        </section>

        <section id="semester-plan" className="scroll-mt-24">
          <SectionTitle>Semester-wise Plan</SectionTitle>
          {data === null ? (
            <TableSkeleton />
          ) : (
            <div className="mt-5 flex flex-col gap-3">
              {semesterGroups.map((sem) => (
                <Accordion key={sem.title} title={sem.title} accent={sem.accent}>
                  <CourseTable
                    rows={sem.rows}
                    componentLabel={sem.accent ? "Component" : "Course"}
                  />
                </Accordion>
              ))}
            </div>
          )}
        </section>

        <section id="specializations" className="scroll-mt-24">
          <SectionTitle>Areas of Specialization</SectionTitle>
          <p className="mt-5 leading-relaxed text-gray-700">
            Students may pursue a specialization by completing at least 6 credits from Programme
            Electives (PE) or Open Category (OC) courses in the chosen area, along with
            undertaking MTP–II in the same area.
          </p>
          {data === null ? (
            <div className="mt-6 grid animate-pulse gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-32 border-t-2 border-gray-200 bg-white p-5 shadow-sm ring-1 ring-gray-100"
                />
              ))}
            </div>
          ) : (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {data.specializations.map((s) => {
                const Icon = getLucideIcon(s.icon);
                return (
                  <div
                    key={s.id}
                    className="border-t-2 border-amber-400 bg-white p-5 shadow-sm ring-1 ring-gray-100"
                  >
                    <div className="flex h-10 w-10 items-center justify-center border border-amber-200 bg-amber-50/60">
                      <Icon size={18} className="text-amber-700" strokeWidth={1.75} />
                    </div>
                    <h4 className="mt-3 text-sm font-semibold text-[#001A23]">{s.title}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">{s.description}</p>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}