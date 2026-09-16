'use client';

import { useState } from 'react';
import Accordion from '@/components/ui/Accordion';
import { SectionTitle, TextSkeleton, TableSkeleton } from '@/components/ui/ContentBlocks';
import Markdown from '@/components/ui/Markdown';
import TocNav, { type TocSection } from '@/components/ui/TocNav';
import { useMtechContent } from '@/lib/hooks/useMtechContent';
import { getLucideIcon } from '@/lib/lucideIconMap';
import type { MtechSection, MtechCreditCategory, MtechCourse, MtechCard } from '@/types/mtech';

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

// Specializations are hardcoded on the frontend for now. When the backend schema is
// extended to include specialization course lists, this can move back to `data`.
type Specialization = {
  id: string;
  icon: string;
  title: string;
  description: string;
  constraint: string;
  courses: string[];
};

const SPECIALIZATIONS: Specialization[] = [
  {
    id: 'collaborative-robotics',
    icon: 'Users',
    title: 'Collaborative Robotics',
    description:
      'Robots designed to work safely alongside people in shared workspaces — combining human flexibility with robotic precision, often with minimal programming and reduced safety barriers.',
    constraint: 'At most one course in total from the Advanced Control or Autonomy basket.',
    courses: [
      'ELL7122 Control of Networked & Complex Systems',
      'AIL8027 Advanced Reinforcement Learning',
      'MEL7115 Network Models for Public Systems',
      'MTL7763 Introduction to Game Theory / COL7155 Algorithmic Game Theory',
      'COL7151 Algorithmic Graph Theory',
      'AIL7023 Graph Machine Learning / COL7560 Machine Learning for Networked Systems',
      'CTL7013 Connected and Autonomous Vehicles',
      'COL7655 Foundations of Visual Computing',
    ],
  },
  {
    id: 'soft-bio-inspired-robotics',
    icon: 'Leaf',
    title: 'Soft and Bio-Inspired Robotics',
    description:
      'Flexible, adaptive robots built from compliant materials and inspired by biological movement — well suited to delicate tasks and unstructured environments.',
    constraint: 'At most one course in total from the Advanced Control or Computer Vision basket.',
    courses: [
      'AML7630 Soft Robotics',
      'BML7700 Fundamentals of Biomechanics / MEL7234 Principles of Human Movement / AML7620 Advanced Biomechanics / BML8700 Mechanics of Biological Systems',
      'SBV7050 Bioinspiration and Biomimetics',
      'JRL7999 Wearable Robotics',
      'BML8800 Healthcare Wearables: Design and Applications',
      'AML7800 Deep Learning for Mechanics / AML7810 Probabilistic Machine Learning for Mechanics / MEL7216 Machine Learning for Computational Design',
      'ELL8120 Model Reduction for Control',
    ],
  },
  {
    id: 'industrial-robotics',
    icon: 'Factory',
    title: 'Industrial Robotics',
    description:
      'Automated, programmable robots for high-speed, high-precision manufacturing tasks — widely used across automotive, electronics, and packaging.',
    constraint:
      'At most one course in total from the Advanced Control, Reinforcement Learning or Computer Vision basket.',
    courses: [
      'MEL7202 Mechanical System Design',
      'MEL7307 Smart Manufacturing',
      'MEL7225 Design Principles for Precision',
      'AML7090 Systems Engineering and Design / DDP7121 Introduction to DIY Prototyping',
      'BML7730 Industrial Manufacturing for Healthcare',
      'AML7830 Digital Twins',
      'MEL7103 Operations Planning and Control',
      'ELL7283 Embedded Systems',
      'DSL7711 Sensors and Transducers',
      'DSL7757 Generative AI for Cyber-Physical Systems',
    ],
  },
  {
    id: 'rehabilitation-medical-robotics',
    icon: 'HeartPulse',
    title: 'Rehabilitation and Medical Robotics',
    description:
      'Robotic systems that support patient recovery and clinical care — assisting physical therapy, surgery, and personalized treatment with greater precision and consistency.',
    constraint: 'At most one course in total from the Advanced Control or Computer Vision basket.',
    courses: [
      'JRL7999 Wearable Robotics',
      'MEL7225 Design Principles for Precision',
      'BML8300 Biosensor Technology',
      'BML7400 Biomedical Instrumentation',
      'BML7410 Medical Device Design',
      'BML8800 Healthcare Wearables: Design and Applications',
      'BML7700 Fundamentals of Biomechanics / MEL7234 Principles of Human Movement / AML7620 Advanced Biomechanics / BML7140 Advanced Neuromechanics',
      'BML7381 Deep Learning for Medical Image Analysis',
      'BML7500 Point of Care Medical Diagnostic Devices',
      'BML7350 Biomedical Signal and Image Processing',
      'BMP7460 Biomechanics, Rehabilitation Engineering and Haptics Lab',
      'SIL7020 Accessible Computing & Assistive Technologies',
    ],
  },
  {
    id: 'autonomous-intelligent-vehicles',
    icon: 'Car',
    title: 'Autonomous and Intelligent Vehicles',
    description:
      'Self-driving systems built on advanced sensing, AI, and control — aiming to improve safety, efficiency, and convenience across transportation.',
    constraint:
      'At most one course in total from the Computer Vision, Advanced Control, Reinforcement Learning, or Autonomy basket.',
    courses: [
      'JRL8730 Aerial Robotics',
      'CTL7013 Connected and Autonomous Vehicles',
      'CTL7003 Introduction to Electric Vehicles / CTL7005 Engineering of Electric Vehicles / ELL7505 Electric Vehicle Systems / CTL7008 Design and Control of EV Powertrain / CTL7032 Vehicle Propulsion and Transmissions / CTL7049 Digital Control Design for EV Applications / CTL7020 Vehicle System Dynamics and Control',
    ],
  },
];

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
  onExpand,
}: {
  specialization: Specialization;
  onExpand: () => void;
}) {
  const Icon = getLucideIcon(specialization.icon);
  return (
    <button
      type="button"
      onClick={onExpand}
      aria-haspopup="dialog"
      className="group flex flex-col items-start border-t-2 border-amber-400 bg-white p-5 text-left shadow-sm ring-1 ring-gray-100 transition-colors hover:bg-amber-50/30"
    >
      <div className="flex h-10 w-10 items-center justify-center border border-amber-200 bg-amber-50/60">
        <Icon size={18} className="text-amber-700" strokeWidth={1.75} />
      </div>
      <h4 className="mt-3 text-sm font-semibold text-[#001A23]">{specialization.title}</h4>
      <p className="mt-2 text-sm leading-relaxed text-gray-600">{specialization.description}</p>
      <span className="mt-3 text-xs font-semibold text-amber-700 group-hover:text-amber-800">
        View eligible courses
      </span>
    </button>
  );
}

function SpecializationDialog({
  specialization,
  onClose,
}: {
  specialization: Specialization;
  onClose: () => void;
}) {
  const Icon = getLucideIcon(specialization.icon);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="specialization-dialog-title"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto border-t-2 border-amber-400 bg-white p-6 shadow-lg ring-1 ring-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-amber-200 bg-amber-50/60">
              <Icon size={18} className="text-amber-700" strokeWidth={1.75} />
            </div>
            <h3
              id="specialization-dialog-title"
              className="font-serif text-lg font-bold text-[#001A23]"
            >
              {specialization.title}
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

        <p className="mt-4 text-sm leading-relaxed text-gray-600">{specialization.description}</p>

        <div className="mt-5">
          <h4 className="text-sm font-semibold text-[#001A23]">Approved courses</h4>
          <p className="mt-1 text-xs text-gray-500">{specialization.constraint}</p>
          <ul className="mt-2 flex flex-col gap-1.5 text-sm text-gray-600">
            {specialization.courses.map((course) => (
              <li key={course}>{course}</li>
            ))}
          </ul>
        </div>
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
    specializations: MtechCard[];
  } | null;
}) {
  const { data, error } = useMtechContent(initialData);

  const [openSpecializationId, setOpenSpecializationId] = useState<string | null>(null);
  const openSpecialization = SPECIALIZATIONS.find((s) => s.id === openSpecializationId) ?? null;

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
                  target='_blank'
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
              <li>Complete at least 6 PE/OC credits (typically two courses) from the approved course list of the chosen specialization</li>
              <li>Complete both MTP–I and MTP–II in the chosen specialization</li>
              <li>Submit an application to the PEC specifying the chosen specialization, for final approval at graduation</li>
            </ul>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SPECIALIZATIONS.map((s) => (
              <SpecializationCard
                key={s.id}
                specialization={s}
                onExpand={() => setOpenSpecializationId(s.id)}
              />
            ))}
          </div>
        </section>
      </div>

      {openSpecialization && (
        <SpecializationDialog
          specialization={openSpecialization}
          onClose={() => setOpenSpecializationId(null)}
        />
      )}
    </div>
  );
}