import {
  Users,
  Leaf,
  Factory,
  HeartPulse,
  Car,
  Briefcase,
  FlaskConical,
  Lightbulb,
  GraduationCap,
} from "lucide-react";
import PageHeading from "@/components/ui/PageHeading";
import Accordion from "@/components/ui/Accordion";
import TocNav, { type TocSection } from "@/components/ui/TocNav";

export const metadata = { title: "M.Tech. in Robotics" };

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

type CourseRow = {
  code?: string;
  course: string;
  l: number | string;
  t: number | string;
  p: number | string;
  c: number | string;
};

// Shared source data -- referenced by both the "Programme Core Courses" /
// "Projects" tables and the semester-wise breakdown below, so the two can
// never drift out of sync with each other.
const programmeCore: CourseRow[] = [
  { code: "JRL7000", course: "Robotics Laboratory", l: 1, t: 0, p: 2, c: 2 },
  {
    code: "ELL7100",
    course: "Mathematical Foundation of Learning and Control",
    l: 3,
    t: 0,
    p: 0,
    c: 3,
  },
  { code: "JRL7030", course: "Robot Kinematics and Dynamics", l: 3, t: 0, p: 2, c: 4 },
  { code: "ELL7101", course: "Linear Systems", l: 3, t: 0, p: 0, c: 3 },
  { code: "ELL7102", course: "Stochastic Processes and Filtering", l: 3, t: 0, p: 0, c: 3 },
  { code: "JRL7680", course: "Computer Vision for Robotics", l: 3, t: 0, p: 2, c: 4 },
  {
    code: "AIL7024 / AIL7025 / COL7341",
    course:
      "Machine Learning OR Introduction to Artificial Intelligence OR Fundamentals of Machine Learning",
    l: 3,
    t: 0,
    p: 2,
    c: 4,
  },
  { course: "Professional Ethics", l: "—", t: "—", p: "—", c: 1 },
];

const projectCourses: CourseRow[] = [
  { code: "JRD7900", course: "Cornerstone Project", l: 0, t: 0, p: 8, c: 4 },
  { code: "JRT8900", course: "Summer Internship / Minor Project", l: 0, t: 0, p: 6, c: 3 },
  { code: "JRD8950", course: "Major Project – Part I", l: 0, t: 0, p: 12, c: 6 },
];

const semesters: {
  title: string;
  accent?: boolean;
  componentLabel?: string;
  rows: CourseRow[];
}[] = [
    {
      title: "Semester I",
      rows: [
        programmeCore[0], // Robotics Laboratory
        programmeCore[1], // Mathematical Foundation of Learning and Control
        programmeCore[3], // Linear Systems
        programmeCore[4], // Stochastic Processes and Filtering
        programmeCore[6], // ML / AI elective
      ],
    },
    {
      title: "Winter Break",
      accent: true,
      componentLabel: "Component",
      rows: [projectCourses[0]], // Cornerstone Project
    },
    {
      title: "Semester II",
      rows: [
        programmeCore[2], // Robot Kinematics and Dynamics
        programmeCore[5], // Computer Vision for Robotics
        { course: "Programme Elective (PE1)", l: 3, t: 0, p: 0, c: 3 },
        { course: "Open Category (OC1)", l: 3, t: 0, p: 0, c: 3 },
      ],
    },
    {
      title: "Summer Term",
      accent: true,
      componentLabel: "Component",
      rows: [projectCourses[1]], // Summer Internship / Minor Project
    },
    {
      title: "Semester III",
      rows: [
        { course: "Programme Elective (PE2)", l: 3, t: 0, p: 0, c: 3 },
        { course: "Professional Ethics", l: 1, t: 0, p: 0, c: 1 },
        projectCourses[2], // Major Project – Part I
      ],
    },
    {
      title: "Semester IV",
      rows: [
        { course: "Open Category (OC2)", l: 3, t: 0, p: 0, c: 3 },
        { code: "JRD8990",course: "Major Project – Part II", l: 0, t: 0, p: 24, c: 12 }],
    },
  ];

const creditStructure = [
  ["Programme Core", "Computer Vision, Robot Kinematics and Dynamics, etc.", "24"],
  ["Programme Electives", "Soft Robotics, Deep Learning, etc.", "18"],
  ["Project", "Cornerstone Project, Summer Internship, Major Project", "13"],
  ["Open Category (OC)", "Courses across departments", "6"],
];

const specializations = [
  {
    icon: Users,
    title: "Collaborative Robotics",
    text: "Robots designed to work safely alongside people in shared workspaces — combining human flexibility with robotic precision, often with minimal programming and reduced safety barriers.",
  },
  {
    icon: Leaf,
    title: "Soft and Bio-Inspired Robotics",
    text: "Flexible, adaptive robots built from compliant materials and inspired by biological movement — well suited to delicate tasks and unstructured environments.",
  },
  {
    icon: Factory,
    title: "Industrial Robotics",
    text: "Automated, programmable robots for high-speed, high-precision manufacturing tasks — widely used across automotive, electronics, and packaging.",
  },
  {
    icon: HeartPulse,
    title: "Rehabilitation and Medical Robotics",
    text: "Robotic systems that support patient recovery and clinical care — assisting physical therapy, surgery, and personalized treatment with greater precision and consistency.",
  },
  {
    icon: Car,
    title: "Autonomous and Intelligent Vehicles",
    text: "Self-driving systems built on advanced sensing, AI, and control — aiming to improve safety, efficiency, and convenience across transportation.",
  },
];

function SectionTitle({ children }: { children: string }) {
  return (
    <>
      <h2 className="font-serif text-2xl font-bold text-[#001A23]">{children}</h2>
      <div className="mt-2 h-0.5 w-12 bg-amber-400" />
    </>
  );
}

function CourseTable({
  rows,
  componentLabel = "Course",
}: {
  rows: CourseRow[];
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
            <tr key={row.course} className="border-b border-gray-100">
              {hasCode && (
                <td className="py-2 pr-3 text-xs whitespace-nowrap text-gray-500">
                  {row.code ?? "—"}
                </td>
              )}
              <td className="py-2 pr-4 text-gray-700">{row.course}</td>
              <td className="px-2 py-2 text-gray-600">{row.l}</td>
              <td className="px-2 py-2 text-gray-600">{row.t}</td>
              <td className="px-2 py-2 text-gray-600">{row.p}</td>
              <td className="px-2 py-2 text-gray-600">{row.c}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function MTechPage() {
  return (
    <div>
      <PageHeading
        eyebrow="Academics"
        title="M.Tech in Robotics"
        subtitle="Interdisciplinary M.Tech in Robotics (JRB), IIT Delhi"
      />

      <div className="mx-auto max-w-[75rem] px-5 pb-16">
        <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
          <TocNav sections={SECTIONS} />

          <div className="flex min-w-0 flex-col gap-16">
            <section id="overview" className="scroll-mt-24">
              <SectionTitle>Overview</SectionTitle>
              <div className="mt-5 flex flex-col gap-4 text-gray-700 text-justify">
                <p className="leading-relaxed">
                  The Interdisciplinary M.Tech in Robotics (JRB) at IIT Delhi is offered as two
                  pathways — full-time, completed in two years, and part-time, completed in
                  three years for working professionals. It is run jointly by the Departments of
                  Computer Science &amp; Engineering, Electrical Engineering, and Mechanical
                  Engineering, along with the Yardi School of Artificial Intelligence, in
                  collaboration with the Centre of Excellence in Biologically Inspired Robots and
                  Drones (CoE-BIRD).
                </p>
                <p className="leading-relaxed">
                  Across the programme, students work with robotic systems, intelligent control,
                  computer vision, AI-driven perception, embedded systems, mechanical design, and
                  autonomous vehicles — with the curriculum built to balance rigorous theoretical
                  grounding with hands-on, experiential learning.
                </p>
              </div>
            </section>

            <section id="outcomes" className="scroll-mt-24">
              <SectionTitle>Learning Outcomes</SectionTitle>
              <p className="mt-5 leading-relaxed text-gray-700">
                Graduates of the JRB programme are expected to be able to:
              </p>
              <ul className="mt-4 flex flex-col gap-3 border-l-2 border-amber-400 pl-5 text-gray-700 text-justify">
                <li className="leading-relaxed">
                  Apply core robotics knowledge — mechanics, control systems, perception, and
                  artificial intelligence — to solve complex, real-world problems.
                </li>
                <li className="leading-relaxed">
                  Design, develop, and deploy robotic systems by drawing on multiple disciplines:
                  running simulations and experiments, analyzing data, and iterating to improve
                  system performance.
                </li>
                <li className="leading-relaxed">
                  Collaborate effectively in multidisciplinary teams, contribute to the robotics
                  research community through technical reports and presentations, and engage
                  with the ethical and societal implications of robotic technologies.
                </li>
              </ul>
            </section>

            <section id="why-jrb" className="scroll-mt-24">
              <SectionTitle>Why Choose JRB@IITD</SectionTitle>

              <div className="mt-5 flex flex-col gap-8 text-justify">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#001A23]">
                    Strong Theoretical &amp; Mathematical Foundation
                  </h3>
                  <p className="mt-2 leading-relaxed text-gray-700">
                    The programme is built on a rigorous foundation in mathematics, physics, and
                    systems theory — the tools needed to model, analyze, and control complex
                    robotic systems. This grounding sharpens analytical thinking across
                    kinematics, dynamics, control, and intelligent perception.
                  </p>
                </div>

                <div>
                  <h3 className="font-serif text-lg font-bold text-[#001A23]">
                    Hands-on, Interdisciplinary Learning
                  </h3>
                  <p className="mt-2 leading-relaxed text-gray-700">
                    Learning here goes beyond the classroom. Project-based coursework is backed
                    by real facilities — including the Industrial Robotics and Mechatronics Lab
                    and the Multi-agent Systems and Drones Lab — where students work directly
                    with manipulators, drones, and autonomous vehicles. Course-linked lab
                    modules, system-integration projects, and collaborative research bridge the
                    gap between theory and practice.
                  </p>
                </div>

                <div>
                  <h3 className="font-serif text-lg font-bold text-[#001A23]">
                    Flexible Academic Pathways
                  </h3>
                  <p className="mt-2 leading-relaxed text-gray-700">
                    Electives can be tailored to individual interests, with the option to go
                    deeper into one of five specialization tracks — see{" "}
                    <a
                      href="#specializations"
                      className="text-[#001A23] underline underline-offset-2 hover:text-amber-700"
                    >
                      Areas of Specialization
                    </a>{" "}
                    below for details on each.
                  </p>
                </div>

                <div>
                  <h3 className="font-serif text-lg font-bold text-[#001A23]">
                    Cutting-Edge Research Opportunities
                  </h3>
                  <p className="mt-2 leading-relaxed text-gray-700">
                    Students work closely with JRB faculty on frontier problems in robotics, AI,
                    and intelligent systems — contributing to both academic publications and
                    applied research.
                  </p>
                </div>


              </div>
            </section>

            <section id="curriculum-structure" className="scroll-mt-24">
              <SectionTitle>Curriculum Structure</SectionTitle>
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
                    {creditStructure.map((row) => (
                      <tr key={row[0]} className="border-b border-gray-100">
                        <td className="px-4 py-3 text-gray-700">{row[0]}</td>
                        <td className="px-4 py-3 text-gray-600">{row[1]}</td>
                        <td className="px-4 py-3 text-gray-600">{row[2]}</td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50 font-semibold text-[#001A23]">
                      <td className="px-4 py-3">Total</td>
                      <td className="px-4 py-3"></td>
                      <td className="px-4 py-3">61</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="core-courses" className="scroll-mt-24">
              <SectionTitle>Programme Core Courses</SectionTitle>
              <p className="mt-5 leading-relaxed text-gray-700">
                24 credits, spread across Semesters I and II. The AI/ML core requirement can be
                satisfied by any one of three courses.
              </p>
              <div className="mt-5">
                <CourseTable rows={programmeCore} />
              </div>
            </section>

            <section id="electives" className="scroll-mt-24">
              <SectionTitle>Programme Electives</SectionTitle>
              <p className="mt-5 leading-relaxed text-gray-700">
                Every student completes 18 credits of Programme Electives (PE), through one of
                two tracks:
              </p>

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

              <p className="mt-4 text-sm leading-relaxed text-gray-600">
                Students are encouraged to pursue the Project-Intensive Track by default.
                Switching to the Course-Intensive Track requires prior approval from the
                Programme Evaluation Committee (PEC).
              </p>
            </section>

            <section id="projects" className="scroll-mt-24">
              <SectionTitle>Projects</SectionTitle>
              <p className="mt-5 leading-relaxed text-gray-700">
                13 credits across three project components, spanning the Winter Break, Summer
                Term, and Semester III.
              </p>
              <div className="mt-5">
                <CourseTable rows={projectCourses} />
              </div>
            </section>

            <section id="semester-plan" className="scroll-mt-24">
              <SectionTitle>Semester-wise Plan</SectionTitle>
              <div className="mt-5 flex flex-col gap-3">
                {semesters.map((sem) => (
                  <Accordion key={sem.title} title={sem.title} accent={sem.accent}>
                    <CourseTable rows={sem.rows} componentLabel={sem.componentLabel} />
                  </Accordion>
                ))}
              </div>
            </section>

            <section id="specializations" className="scroll-mt-24">
              <SectionTitle>Areas of Specialization</SectionTitle>
              <p className="mt-5 leading-relaxed text-gray-700">
                Students may pursue a specialization by completing at least 6 credits from
                Programme Electives (PE) or Open Category (OC) courses in the chosen area, along
                with undertaking MTP–II in the same area.
              </p>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {specializations.map((s) => (
                  <div
                    key={s.title}
                    className="border-t-2 border-amber-400 bg-white p-5 shadow-sm ring-1 ring-gray-100"
                  >
                    <div className="flex h-10 w-10 items-center justify-center border border-amber-200 bg-amber-50/60">
                      <s.icon size={18} className="text-amber-700" strokeWidth={1.75} />
                    </div>
                    <h4 className="mt-3 text-sm font-semibold text-[#001A23]">{s.title}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">{s.text}</p>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}