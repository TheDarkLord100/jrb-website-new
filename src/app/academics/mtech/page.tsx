import PageHeading from "@/components/ui/PageHeading";
import SectionHeading from "@/components/ui/SectionHeading";
import Accordion from "@/components/ui/Accordion";

export const metadata = { title: "M.Tech. in Robotics" };

type CourseRow = { course: string; l: number; t: number; p: number; c: number };

const semesters: { title: string; accent?: boolean; rows: CourseRow[]; componentLabel?: string }[] = [
  {
    title: "Semester I",
    rows: [
      { course: "Robotics Laboratory", l: 1, t: 0, p: 2, c: 2 },
      { course: "Mathematical Foundation of Learning and Control", l: 3, t: 0, p: 0, c: 3 },
      { course: "Linear Systems", l: 3, t: 0, p: 0, c: 3 },
      { course: "Stochastic Processes and Filtering", l: 3, t: 0, p: 0, c: 3 },
      { course: "Machine Learning / AI", l: 3, t: 0, p: 2, c: 4 },
    ],
  },
  {
    title: "Winter Break",
    accent: true,
    componentLabel: "Component",
    rows: [{ course: "Cornerstone Project", l: 0, t: 0, p: 8, c: 4 }],
  },
  {
    title: "Semester II",
    rows: [
      { course: "Robot Kinematics and Dynamics", l: 3, t: 0, p: 2, c: 4 },
      { course: "Computer Vision for Robotics", l: 3, t: 0, p: 2, c: 4 },
      { course: "Programme Elective (PE1)", l: 3, t: 0, p: 0, c: 3 },
      { course: "Open Category (OC1)", l: 3, t: 0, p: 0, c: 3 },
    ],
  },
  {
    title: "Summer Term",
    accent: true,
    componentLabel: "Component",
    rows: [{ course: "Summer Internship / Minor Project", l: 0, t: 0, p: 8, c: 4 }],
  },
  {
    title: "Semester III",
    rows: [
      { course: "Programme Elective (PE2)", l: 3, t: 0, p: 0, c: 3 },
      { course: "Programme Elective (PE3)", l: 3, t: 0, p: 0, c: 3 },
      { course: "Open Category (OC2)", l: 3, t: 0, p: 0, c: 3 },
      { course: "Major Project – Part I", l: 0, t: 0, p: 12, c: 6 },
    ],
  },
  {
    title: "Semester IV",
    rows: [{ course: "Major Project – Part II", l: 0, t: 0, p: 14, c: 7 }],
  },
];

const specializations = [
  {
    title: "Collaborative Robotics",
    text: "Collaborative robotics focuses on robots designed to safely work alongside humans in shared environments. These systems enhance productivity by combining human adaptability with robotic precision, often requiring minimal programming and reduced safety barriers.",
  },
  {
    title: "Soft and Bio-inspired Robotics",
    text: "Inspired by biological systems, this area focuses on designing flexible and adaptive robots using compliant materials. These robots excel in unstructured environments and delicate tasks, mimicking natural movements for enhanced safety and functionality.",
  },
  {
    title: "Industrial Robotics",
    text: "Industrial robotics involves automated systems designed for manufacturing tasks requiring high precision, speed, and repeatability. These robots are widely used across industries such as automotive, electronics, and logistics to improve efficiency and reduce operational costs.",
  },
  {
    title: "Rehabilitation and Medical Robotics",
    text: "This specialization focuses on robotic systems designed for healthcare applications, including rehabilitation, assistive technologies, and surgical support. These systems enhance precision, consistency, and personalization in patient care.",
  },
  {
    title: "Autonomous and Intelligent Vehicles",
    text: "This area focuses on the development of self-driving systems using advanced sensing, AI, and control algorithms. Applications span autonomous cars, drones, and mobile robots, aiming to improve safety, efficiency, and intelligent mobility.",
  },
];

function CourseTable({ rows, componentLabel = "Course" }: { rows: CourseRow[]; componentLabel?: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[420px] text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-gray-500">
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
      <PageHeading title="M.Tech in Robotics" />

      <div className="mx-auto max-w-[75rem] px-5 pb-16">
        <div className="mx-auto max-w-3xl text-gray-700">
          <p className="leading-relaxed">
            The Interdisciplinary M.Tech in Robotics (JRB) at IIT Delhi offers both a full-time
            (2-year) and a part-time (3-year) pathway, providing flexibility for students and
            working professionals. The programme is jointly offered by the Departments of Computer
            Science &amp; Engineering, Electrical Engineering, Mechanical Engineering, and the Yardi
            School of Artificial Intelligence, in collaboration with the Centre of Excellence in
            Biologically Inspired Robots and Drones (CoE-BIRD).
          </p>
          <p className="mt-4 leading-relaxed">
            The curriculum integrates mechanical design, control systems, artificial intelligence,
            computer vision, and embedded systems, ensuring a balance between strong theoretical
            foundations and hands-on experiential learning.
          </p>
        </div>

        <div className="mt-14">
          <SectionHeading title="Curriculum Structure" />
          <div className="mx-auto max-w-2xl overflow-hidden rounded-xl border border-gray-100 shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#001A23] text-white">
                <tr>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Credits</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Programme Core", "Computer Vision, Robot Kinematics and Dynamics, etc.", "24"],
                  ["Programme Electives", "Soft Robotics, Deep Learning, etc.", "18"],
                  ["Project", "Cornerstone Project, Internship, Major Project", "13"],
                  ["Open Category (OC)", "Courses across departments", "6"],
                ].map((row) => (
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
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <div>
            <h3 className="text-lg font-bold text-[#001A23]">Programme Core Courses</h3>
            <ul className="mt-4 flex flex-col gap-2 text-sm text-gray-700">
              {[
                "Robotics Laboratory",
                "Mathematical Foundation of Learning and Control",
                "Robot Kinematics and Dynamics",
                "Linear Systems",
                "Stochastic Processes and Filtering",
                "Computer Vision for Robotics",
                "Machine Learning / Artificial Intelligence",
                "Professional Ethics",
              ].map((c) => (
                <li key={c} className="flex gap-2">
                  <span className="text-yellow-500">•</span> {c}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#001A23]">Programme Electives</h3>
            <p className="mt-4 text-sm text-gray-600">
              Students must complete 18 credits in Programme Electives (PE), with the flexibility to
              choose between two academic pathways:
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-gray-50 p-4">
                <h4 className="text-sm font-semibold text-[#001A23]">Project-Intensive Track</h4>
                <ul className="mt-2 text-sm text-gray-600">
                  <li>MTP–II (12 credits)</li>
                  <li>2 elective courses (3 credits each)</li>
                </ul>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <h4 className="text-sm font-semibold text-[#001A23]">Course-Intensive Track</h4>
                <ul className="mt-2 text-sm text-gray-600">
                  <li>6 elective courses (3 credits each)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14">
          <SectionHeading title="Semester-wise Curriculum" />
          <div className="mx-auto flex max-w-3xl flex-col gap-3">
            {semesters.map((sem) => (
              <Accordion key={sem.title} title={sem.title} accent={sem.accent}>
                <CourseTable rows={sem.rows} componentLabel={sem.componentLabel} />
              </Accordion>
            ))}
          </div>
        </div>

        <div className="mt-14">
          <SectionHeading title="Areas of Specialization" />
          <p className="mx-auto mb-8 max-w-2xl text-center text-sm text-gray-600">
            Students may pursue a specialization by completing at least 6 credits from Programme
            Electives (PE) or Open Category (OC) courses in the chosen area, along with undertaking
            MTP–II in the same specialization.
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {specializations.map((s) => (
              <div key={s.title} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <h4 className="font-semibold text-[#001A23]">{s.title}</h4>
                <p className="mt-2 text-sm text-gray-600">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
