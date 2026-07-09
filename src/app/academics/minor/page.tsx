import PageHeading from "@/components/ui/PageHeading";
import SectionHeading from "@/components/ui/SectionHeading";
import { FileText } from "lucide-react";

export const metadata = { title: "Minor Degree in Robotics" };

export default function MinorPage() {
  return (
    <div>
      <PageHeading title="Interdisciplinary Specialization in Robotics (IDSR)" />

      <div className="mx-auto max-w-[75rem] px-5 pb-16">
        <div className="mx-auto max-w-3xl text-gray-700">
          <p className="leading-relaxed">
            The Interdisciplinary Specialization in Robotics (IDSR) is designed for undergraduate
            students at IIT Delhi to build a strong foundation across multiple domains relevant to
            robotics, including mechanical engineering, electrical engineering, and computer
            science.
          </p>
          <p className="mt-4 leading-relaxed">
            Introduced to address the growing demand for robotics expertise in industry and
            research, the programme enables students to integrate knowledge across disciplines and
            develop a holistic understanding of robotic systems through a combination of core
            courses, electives, and project-based learning.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-3xl">
          <SectionHeading title="Programme Overview" />
          <p className="leading-relaxed text-gray-700">
            Any IIT Delhi student admitted through JEE is eligible to pursue IDSR. The
            specialization requires a total of <strong>20 credits</strong> under the Open Category.
          </p>
          <p className="mt-4 leading-relaxed text-gray-700">
            The programme promotes interdisciplinary collaboration, enabling students from
            different departments to work together on robotics challenges.
          </p>

          <a
            href="/Assets/IDSR.pdf"
            download
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#001A23] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#00303f]"
          >
            <FileText size={16} />
            Download Complete Curriculum (PDF)
          </a>
        </div>

        <div className="mx-auto mt-14 max-w-3xl">
          <SectionHeading title="Curriculum Structure" />
          <div className="overflow-hidden rounded-xl border border-gray-100 shadow-sm">
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
                  <td className="px-4 py-3 text-gray-600">Robotics Technology and Mini Project</td>
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

          <h3 className="mt-10 text-lg font-bold text-[#001A23]">Core Courses</h3>
          <div className="mt-4 overflow-hidden rounded-xl border border-gray-100 shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Course</th>
                  <th className="px-4 py-3 font-semibold">Code</th>
                  <th className="px-4 py-3 font-semibold">L-T-P</th>
                  <th className="px-4 py-3 font-semibold">Credits</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="px-4 py-3 text-gray-700">Robotics Technology</td>
                  <td className="px-4 py-3 text-gray-600">JRL301</td>
                  <td className="px-4 py-3 text-gray-600">3-0-0</td>
                  <td className="px-4 py-3 text-gray-600">3</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-700">Mini Project in Robotics</td>
                  <td className="px-4 py-3 text-gray-600">JRD301</td>
                  <td className="px-4 py-3 text-gray-600">0-0-8</td>
                  <td className="px-4 py-3 text-gray-600">4</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="mt-10 text-lg font-bold text-[#001A23]">Elective Courses</h3>
          <ul className="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-700 sm:grid-cols-3">
            {[
              "Data Structures",
              "Artificial Intelligence",
              "Computer Vision",
              "Mechatronics",
              "Embedded Systems",
              "Image Processing",
              "Control Engineering",
              "Neural Networks",
              "Mechanics of Robots",
            ].map((c) => (
              <li key={c} className="flex gap-2">
                <span className="text-yellow-500">•</span> {c}
              </li>
            ))}
          </ul>
        </div>

        <div className="mx-auto mt-14 max-w-3xl">
          <SectionHeading title="Learning Approach" />
          <p className="leading-relaxed text-gray-700">
            IDSR emphasizes interdisciplinary collaboration. Students from multiple departments
            work together on robotics challenges, reflecting real-world engineering environments.
          </p>
          <p className="mt-4 leading-relaxed text-gray-700">
            The mini project enables students to integrate concepts from different domains and
            develop complete robotic systems involving both hardware and software.
          </p>
        </div>
      </div>
    </div>
  );
}
