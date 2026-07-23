import { FileText, BookOpen } from "lucide-react";
import PageHeading from "@/components/ui/PageHeading";
import TocNav, { type TocSection } from "@/components/ui/TocNav";

export const metadata = { title: "Minor Degree in Robotics" };

const SECTIONS: TocSection[] = [
  { id: "overview", label: "Overview" },
  { id: "curriculum-structure", label: "Curriculum Structure" },
  { id: "core-courses", label: "Core Courses" },
  { id: "electives", label: "Elective Courses" },
  { id: "learning-approach", label: "Learning Approach" },
];

const coreCourses = [
  { course: "Robotics Technology", code: "JRL301", ltp: "3-0-0", credits: "3" },
  { course: "Mini Project in Robotics", code: "JRD301", ltp: "0-0-8", credits: "4" },
];

const electives = [
  "Data Structures",
  "Artificial Intelligence",
  "Computer Vision",
  "Mechatronics",
  "Embedded Systems",
  "Image Processing",
  "Control Engineering",
  "Neural Networks",
  "Mechanics of Robots",
];

function SectionTitle({ children }: { children: string }) {
  return (
    <>
      <h2 className="font-serif text-2xl font-bold text-[#001A23]">{children}</h2>
      <div className="mt-2 h-0.5 w-12 bg-amber-400" />
    </>
  );
}

export default function MinorPage() {
  return (
    <div>
      <PageHeading
        eyebrow="Academics"
        title="Interdisciplinary Specialization in Robotics"
        subtitle="IDSR — an undergraduate specialization at IIT Delhi"
      />

      <div className="mx-auto max-w-[75rem] px-5 pb-16">
        <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
          <TocNav sections={SECTIONS} />

          <div className="flex min-w-0 flex-col gap-16">
            <section id="overview" className="scroll-mt-24">
              <SectionTitle>Overview</SectionTitle>
              <div className="mt-5 flex flex-col gap-4 text-gray-700">
                <p className="leading-relaxed">
                  The Interdisciplinary Specialization in Robotics (IDSR) is designed for
                  undergraduate students at IIT Delhi to build a strong foundation across
                  multiple domains relevant to robotics, including mechanical engineering,
                  electrical engineering, and computer science.
                </p>
                <p className="leading-relaxed">
                  Introduced to address the growing demand for robotics expertise in industry and
                  research, the programme enables students to integrate knowledge across
                  disciplines and develop a holistic understanding of robotic systems through a
                  combination of core courses, electives, and project-based learning.
                </p>
                <p className="leading-relaxed">
                  Any IIT Delhi student admitted through JEE is eligible to pursue IDSR. The
                  specialization requires a total of <strong>20 credits</strong> under the Open
                  Category, and promotes interdisciplinary collaboration — enabling students from
                  different departments to work together on robotics challenges.
                </p>

                <a
                  href="/Assets/IDSR.pdf"
                  download
                  className="mt-2 inline-flex w-fit items-center gap-2 border border-gray-300 px-5 py-2.5 text-sm font-medium text-[#001A23] transition-colors hover:border-amber-400 hover:text-amber-700"
                >
                  <FileText size={16} className="text-amber-600" />
                  Download Complete Curriculum (PDF)
                </a>
              </div>
            </section>

            <section id="curriculum-structure" className="scroll-mt-24">
              <SectionTitle>Curriculum Structure</SectionTitle>
              <div className="mt-5 overflow-hidden border-t-2 border-amber-400 shadow-sm ring-1 ring-gray-100">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#001A23] text-white">
                    <tr>
                      <th className="px-4 py-3">Component</th>
                      <th className="px-4 py-3">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="px-4 py-3 text-gray-700">Core Courses</td>
                      <td className="px-4 py-3 text-gray-600">
                        Robotics Technology and Mini Project
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="px-4 py-3 text-gray-700">Electives</td>
                      <td className="px-4 py-3 text-gray-600">Courses across departments</td>
                    </tr>
                    <tr className="bg-gray-50 font-semibold text-[#001A23]">
                      <td className="px-4 py-3">Total Credits</td>
                      <td className="px-4 py-3">20</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="core-courses" className="scroll-mt-24">
              <SectionTitle>Core Courses</SectionTitle>
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
                    {coreCourses.map((row) => (
                      <tr key={row.code} className="border-b border-gray-100">
                        <td className="py-2 pr-4 text-gray-700">{row.course}</td>
                        <td className="px-2 py-2 text-gray-600">{row.code}</td>
                        <td className="px-2 py-2 text-gray-600">{row.ltp}</td>
                        <td className="px-2 py-2 text-gray-600">{row.credits}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section id="electives" className="scroll-mt-24">
              <SectionTitle>Elective Courses</SectionTitle>
              <p className="mt-5 leading-relaxed text-gray-700">
                Electives are drawn from courses offered across departments, allowing students to
                shape their specialization around individual interests.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {electives.map((c) => (
                  <span
                    key={c}
                    className="flex items-center gap-2 border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700"
                  >
                    <BookOpen size={14} className="text-amber-600" />
                    {c}
                  </span>
                ))}
              </div>
            </section>

            <section id="learning-approach" className="scroll-mt-24">
              <SectionTitle>Learning Approach</SectionTitle>
              <div className="mt-5 flex flex-col gap-4 text-gray-700">
                <p className="leading-relaxed">
                  IDSR emphasizes interdisciplinary collaboration. Students from multiple
                  departments work together on robotics challenges, reflecting real-world
                  engineering environments.
                </p>
                <p className="leading-relaxed">
                  The mini project enables students to integrate concepts from different domains
                  and develop complete robotic systems involving both hardware and software.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}