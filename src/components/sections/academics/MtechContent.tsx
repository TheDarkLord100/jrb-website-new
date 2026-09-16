'use client';

import { useEffect, useState } from 'react';
import Accordion from '@/components/ui/Accordion';
import { SectionTitle, TextSkeleton, TableSkeleton } from '@/components/ui/ContentBlocks';
import Markdown from '@/components/ui/Markdown';
import TocNav, { type TocSection } from '@/components/ui/TocNav';
import { useMtechContent } from '@/lib/hooks/useMtechContent';
import { getLucideIcon } from '@/lib/lucideIconMap';
import { ChevronDown, Layers } from 'lucide-react';
import type {
  MtechSection,
  MtechCreditCategory,
  MtechCourse,
  MtechBasket,
  MtechSpecializationFull,
  MtechSpecializationConstraint,
} from '@/types/mtech';

const SECTIONS: TocSection[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'outcomes', label: 'Learning Outcomes' },
  { id: 'why-jrb', label: 'Why Choose JRB@IITD' },
  { id: 'curriculum-structure', label: 'Curriculum Structure' },
  { id: 'core-courses', label: 'Programme Core Courses' },
  { id: 'electives', label: 'Programme Electives' },
  { id: 'projects', label: 'Projects' },
  { id: 'semester-plan', label: 'Semester-wise Plan' },
  { id: 'specializations', label: 'Areas of Specialization' },
];

const SEMESTER_ORDER = [
  'Semester I',
  'Winter Break',
  'Semester II',
  'Summer Term',
  'Semester III',
  'Semester IV',
];

// TODO: point this at the hosted PDF once it's uploaded to the site (e.g. /documents/...).
const PE_LIST_PDF_URL = '/Assets/PE_List_JRB.pdf';

const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five'];

function numberWord(n: number): string {
  return NUMBER_WORDS[n] ?? String(n);
}

// Trailing connector text to render right after the basket pill at `index`
// (out of `total`), or '' after the last one -- produces the same
// "X, Y, or Z" / "X or Y" pattern as a plain-text join, but per-pill so
// JSX (the clickable basket pills) can be interleaved between the words.
function basketConnector(index: number, total: number): string {
  if (index === total - 1) return '';
  if (total === 2) return ' or';
  return index === total - 2 ? ', or' : ',';
}

function formatLTP(course: MtechCourse): string {
  return `${course.l ?? '—'}-${course.t ?? '—'}-${course.p ?? '—'}`;
}

function specializationAnchorId(specializationId: string): string {
  return `spec-${specializationId}`;
}

function CourseTable({
  rows,
  componentLabel = 'Course',
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
                  {row.code ?? '—'}
                </td>
              )}
              <td className="py-2 pr-4 text-gray-700">{row.title}</td>
              <td className="px-2 py-2 text-gray-600">{row.l ?? '—'}</td>
              <td className="px-2 py-2 text-gray-600">{row.t ?? '—'}</td>
              <td className="px-2 py-2 text-gray-600">{row.p ?? '—'}</td>
              <td className="px-2 py-2 text-gray-600">{row.credits}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SpecializationCard({
  specialization,
  isOpen,
  onToggle,
}: {
  specialization: MtechSpecializationFull;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const Icon = getLucideIcon(specialization.icon);

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      className="group flex flex-col items-start border-t-2 border-amber-400 bg-white p-5 text-left shadow-sm ring-1 ring-gray-100 transition-colors hover:bg-amber-50/30"
    >
      <div className="flex h-10 w-10 items-center justify-center border border-amber-200 bg-amber-50/60">
        <Icon size={18} className="text-amber-700" strokeWidth={1.75} />
      </div>
      <h4 className="mt-3 text-sm font-semibold text-[#001A23]">{specialization.title}</h4>
      <p className="mt-2 text-sm leading-relaxed text-gray-600">{specialization.description}</p>
      <span className="mt-3 flex items-center gap-1 text-xs font-semibold text-amber-700 group-hover:text-amber-800">
        {isOpen ? 'Hide eligible courses' : 'View eligible courses'}
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </span>
    </button>
  );
}

// Opens on clicking a basket row -- shows the full set of interchangeable
// courses that count as satisfying that one basket slot.
function BasketDialog({
  basket,
  courses,
  onClose,
}: {
  basket: MtechBasket;
  courses: MtechCourse[];
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="basket-dialog-title"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto border-t-2 border-amber-400 bg-white p-6 shadow-lg ring-1 ring-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-amber-200 bg-amber-50/60">
              <Layers size={18} className="text-amber-700" strokeWidth={1.75} />
            </div>
            <h3 id="basket-dialog-title" className="font-serif text-lg font-bold text-[#001A23]">
              {basket.name ?? 'Choose one of the following'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <p className="mt-2 text-xs text-gray-500">Counts as one course -- pick any one below.</p>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="py-2 pr-3 font-semibold">Code</th>
                <th className="py-2 pr-4 font-semibold">Course</th>
                <th className="px-2 py-2 font-semibold">L-T-P</th>
                <th className="px-2 py-2 font-semibold">Credits</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id} className="border-b border-gray-100">
                  <td className="py-2 pr-3 text-xs whitespace-nowrap text-gray-500">
                    {course.code ?? '—'}
                  </td>
                  <td className="py-2 pr-4 text-gray-700">{course.title}</td>
                  <td className="px-2 py-2 whitespace-nowrap text-gray-600">{formatLTP(course)}</td>
                  <td className="px-2 py-2 text-gray-600">{course.credits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// A single basket name inline in a constraint sentence -- highlighted as a
// pill and clickable to open the same BasketDialog used for in-list
// baskets in the table below.
function BasketPill({
  basket,
  courses,
  onOpen,
}: {
  basket: MtechBasket;
  courses: MtechCourse[];
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="mx-0.5 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 align-middle text-xs font-semibold text-amber-800 transition-colors hover:bg-amber-200"
    >
      <Layers size={11} strokeWidth={1.75} />
      {basket.name ?? 'Untitled basket'}
    </button>
  );
}

// Renders "At most one course in total from the [Advanced Control] or
// [Autonomy] basket." with each basket name as a clickable BasketPill,
// built from structured data instead of a typed-out string.
function ConstraintSentence({
  constraint,
  onOpenBasket,
}: {
  constraint: MtechSpecializationConstraint;
  onOpenBasket: (basket: MtechBasket, courses: MtechCourse[]) => void;
}) {
  const { max_courses, baskets } = constraint;
  const courseWord = max_courses === 1 ? 'course' : 'courses';
  const basketWord = baskets.length > 1 ? 'baskets' : 'basket';

  return (
    <p className="mt-1 text-xs leading-6 text-gray-500">
      {`At most ${numberWord(max_courses)} ${courseWord} in total from the `}
      {baskets.map(({ basket, courses }, i) => (
        <span key={basket.id}>
          <BasketPill
            basket={basket}
            courses={courses}
            onOpen={() => onOpenBasket(basket, courses)}
          />
          {basketConnector(i, baskets.length)}
        </span>
      ))}
      {` ${basketWord}.`}
    </p>
  );
}

// The "<Specialization> -- Eligible Courses" table. Baskets are listed
// first (each as one clickable row opening BasketDialog), followed by
// standalone courses.
function EligibleCoursesSection({
  specialization,
  onOpenBasket,
}: {
  specialization: MtechSpecializationFull;
  onOpenBasket: (basket: MtechBasket, courses: MtechCourse[]) => void;
}) {
  const basketItems = specialization.items.filter((i) => i.kind === 'basket');
  const courseItems = specialization.items.filter((i) => i.kind === 'course');

  return (
    <div id={specializationAnchorId(specialization.id)} className="scroll-mt-24">
      <h3 className="font-serif text-lg font-bold text-[#001A23]">
        {specialization.title} — Eligible Courses
      </h3>

      {specialization.constraints.map((c) => (
        <ConstraintSentence key={c.id} constraint={c} onOpenBasket={onOpenBasket} />
      ))}

      <div className="mt-4 overflow-x-auto border-t-2 border-amber-400 shadow-sm ring-1 ring-gray-100">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-gray-500">
              <th className="py-2 pr-3 pl-4 font-semibold">Code</th>
              <th className="py-2 pr-4 font-semibold">Course</th>
              <th className="px-2 py-2 font-semibold">L-T-P</th>
              <th className="px-2 py-2 pr-4 font-semibold">Credits</th>
            </tr>
          </thead>
          <tbody>
            {basketItems.map((item, i) =>
              item.kind === 'basket' ? (
                <tr
                  key={`basket-${item.basket.id}-${i}`}
                  onClick={() => onOpenBasket(item.basket, item.courses)}
                  className="cursor-pointer border-b border-gray-100 bg-amber-50/40 transition-colors hover:bg-amber-50"
                >
                  <td className="py-2 pr-3 pl-4 text-gray-400">—</td>
                  <td className="py-2 pr-4 text-gray-700">
                    <span className="flex items-center gap-2">
                      <Layers size={14} className="text-amber-600" strokeWidth={1.75} />
                      {item.basket.name ?? 'Choose one of the following'}
                      <span className="text-xs text-amber-700 underline underline-offset-2">
                        View {item.courses.length} options
                      </span>
                    </span>
                  </td>
                  <td className="px-2 py-2 text-gray-400">—</td>
                  <td className="px-2 py-2 pr-4 text-gray-400">—</td>
                </tr>
              ) : null
            )}

            {courseItems.map((item) =>
              item.kind === 'course' ? (
                <tr key={`course-${item.course.id}`} className="border-b border-gray-100">
                  <td className="py-2 pr-3 pl-4 text-xs whitespace-nowrap text-gray-500">
                    {item.course.code ?? '—'}
                  </td>
                  <td className="py-2 pr-4 text-gray-700">{item.course.title}</td>
                  <td className="px-2 py-2 whitespace-nowrap text-gray-600">
                    {formatLTP(item.course)}
                  </td>
                  <td className="px-2 py-2 pr-4 text-gray-600">{item.course.credits}</td>
                </tr>
              ) : null
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function MtechContent({
  initialData = null,
}: {
  initialData?: {
    sections: MtechSection[];
    creditCategories: MtechCreditCategory[];
    courses: MtechCourse[];
    specializations: MtechSpecializationFull[];
  } | null;
}) {
  const { data, error } = useMtechContent(initialData);

  const [openBasket, setOpenBasket] = useState<{
    basket: MtechBasket;
    courses: MtechCourse[];
  } | null>(null);

  // Nothing shown by default. Toggling a card adds/removes its id here, so
  // any number of specializations' tables can be open side by side.
  const [openSpecializationIds, setOpenSpecializationIds] = useState<Set<string>>(new Set());
  // Set only when a card is opened (not when closed) -- triggers the
  // scroll-into-view below without re-scrolling every time the set changes.
  const [justOpenedId, setJustOpenedId] = useState<string | null>(null);

  const toggleSpecialization = (id: string) => {
    setOpenSpecializationIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        setJustOpenedId(id);
      }
      return next;
    });
  };

  useEffect(() => {
    if (!justOpenedId) return;
    document
      .getElementById(specializationAnchorId(justOpenedId))
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setJustOpenedId(null);
  }, [justOpenedId]);

  if (error) {
    return (
      <p className="py-20 text-center text-gray-500">
        Couldn&apos;t load this page right now. Please try again shortly.
      </p>
    );
  }

  const bySectionKey = (key: string) => data?.sections.filter((s) => s.section_key === key) ?? [];
  const coreCourses = data?.courses.filter((c) => c.category === 'core') ?? [];
  const projectCourses = data?.courses.filter((c) => c.category === 'project') ?? [];
  const totalCredits = data?.creditCategories.reduce((sum, c) => sum + c.credits, 0) ?? null;

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
            bySectionKey('overview').map((s) => <Markdown key={s.id}>{s.body_markdown}</Markdown>)
          )}
        </section>

        <section id="outcomes" className="scroll-mt-24">
          <SectionTitle>Learning Outcomes</SectionTitle>
          {data === null ? (
            <TextSkeleton lines={4} />
          ) : (
            bySectionKey('outcomes').map((s) => <Markdown key={s.id}>{s.body_markdown}</Markdown>)
          )}
        </section>

        <section id="why-jrb" className="scroll-mt-24">
          <SectionTitle>Why Choose JRB@IITD</SectionTitle>
          {data === null ? (
            <TextSkeleton lines={6} />
          ) : (
            <div className="mt-5 flex flex-col gap-8">
              {bySectionKey('why-jrb').map((s) => (
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
          {data === null ? (
            <TableSkeleton />
          ) : (
            <div className="mt-5">
              <CourseTable rows={coreCourses} />
            </div>
          )}
        </section>

        <section id="electives" className="scroll-mt-24">
          <SectionTitle>Programme Electives</SectionTitle>
          {data === null ? (
            <TextSkeleton lines={2} />
          ) : (
            bySectionKey('electives-intro').map((s) => (
              <Markdown key={s.id}>{s.body_markdown}</Markdown>
            ))
          )}

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="border-t-2 border-amber-400 bg-white p-5 shadow-sm ring-1 ring-gray-100">
              <span className="text-[10px] font-bold tracking-wide text-amber-600 uppercase">
                Default track
              </span>
              <h4 className="mt-1 text-sm font-semibold text-[#001A23]">Project-Intensive Track</h4>
              <ul className="mt-3 flex flex-col gap-1.5 text-sm text-gray-600">
                <li>MTP–II (12 credits)</li>
                <li>2 Programme Elective courses (3 credits each)</li>
              </ul>
            </div>

            <div className="border-t-2 border-gray-200 bg-white p-5 shadow-sm ring-1 ring-gray-100">
              <span className="text-[10px] font-bold tracking-wide text-gray-400 uppercase">
                Requires PEC approval
              </span>
              <h4 className="mt-1 text-sm font-semibold text-[#001A23]">Course-Intensive Track</h4>
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
            bySectionKey('projects-intro').map((s) => (
              <Markdown key={s.id}>{s.body_markdown}</Markdown>
            ))
          )}
          {data === null ? (
            <TableSkeleton />
          ) : (
            <div className="mt-5">
              <CourseTable rows={projectCourses} />
            </div>
          )}
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
                    componentLabel={sem.accent ? 'Component' : 'Course'}
                  />
                </Accordion>
              ))}
            </div>
          )}

          <div className="mt-5 border-t-2 border-amber-400 bg-white p-5 shadow-sm ring-1 ring-gray-100">
            <h4 className="text-sm font-semibold text-[#001A23]">Notes</h4>
            <ul className="mt-3 flex flex-col gap-2 text-sm leading-relaxed text-gray-600">
              <li>
                For Professional Ethics, students can choose from ELL7000, AIV7090, COL7707,
                MEL7001, or any other professional ethics course approved by the JRB Programme
                Executive Committee (PEC).
              </li>
              <li>
                The scheduling of PE, OC, and Professional Ethics courses in the semester-wise
                schedule above is indicative; students may take these courses in Semesters II–IV
                based on their academic plan, subject to fulfilling the prescribed credit
                requirements.
              </li>
              <li>
                For the complete list of Programme Electives and Specializations, refer to the{' '}
                <a
                  href={PE_LIST_PDF_URL}
                  target="_blank"
                  className="font-semibold text-amber-700 underline underline-offset-2 hover:text-amber-800"
                >
                  Programme Electives and Specializations list
                </a>
                .
              </li>
            </ul>
          </div>
        </section>

        <section id="specializations" className="scroll-mt-24">
          <SectionTitle>Areas of Specialization</SectionTitle>
          <p className="mt-5 leading-relaxed text-gray-700">
            Students may pursue a specialization by completing at least 6 credits from Programme
            Electives (PE) or Open Category (OC) courses in the chosen area, along with undertaking
            MTP–II in the same area.
          </p>

          <div className="mt-5 border-t-2 border-amber-400 bg-white p-5 shadow-sm ring-1 ring-gray-100">
            <h4 className="text-sm font-semibold text-[#001A23]">Eligibility</h4>
            <ul className="mt-2 flex flex-col gap-1.5 text-sm text-gray-600">
              <li>
                Complete at least 6 PE/OC credits (typically two courses) from the approved course
                list of the chosen specialization
              </li>
              <li>Complete both MTP–I and MTP–II in the chosen specialization</li>
              <li>
                Submit an application to the PEC specifying the chosen specialization, for final
                approval at graduation
              </li>
            </ul>
          </div>

          {data === null ? (
            <div className="mt-6">
              <TextSkeleton lines={3} />
            </div>
          ) : (
            <>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {data.specializations.map((s) => (
                  <SpecializationCard
                    key={s.id}
                    specialization={s}
                    isOpen={openSpecializationIds.has(s.id)}
                    onToggle={() => toggleSpecialization(s.id)}
                  />
                ))}
              </div>

              {openSpecializationIds.size > 0 && (
                <div className="mt-10 flex flex-col gap-12">
                  {data.specializations
                    .filter((s) => openSpecializationIds.has(s.id))
                    .map((s) => (
                      <EligibleCoursesSection
                        key={s.id}
                        specialization={s}
                        onOpenBasket={(basket, courses) => setOpenBasket({ basket, courses })}
                      />
                    ))}
                </div>
              )}
            </>
          )}
        </section>
      </div>

      {openBasket && (
        <BasketDialog
          basket={openBasket.basket}
          courses={openBasket.courses}
          onClose={() => setOpenBasket(null)}
        />
      )}
    </div>
  );
}
