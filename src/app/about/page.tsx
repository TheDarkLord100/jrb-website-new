import PageHeading from "@/components/ui/PageHeading";
import Card from "@/components/ui/Card";
import AboutGallery from "@/components/sections/AboutGallery";

export const metadata = { title: "About" };

const timeline = [
  {
    year: "2002",
    text: "A student robotics club at IIT Delhi begins competing nationally. The foundation of everything that follows.",
  },
  {
    year: "2010",
    text: "The Programme for Autonomous Robotics (PAR), backed by BARC/BRNS, formalises collaborative research across departments for the first time.",
  },
  {
    year: "2011 – 2015",
    text: "PAR's momentum leads to the founding of the Robotics Society of India and the launch of the undergraduate Interdisciplinary Specialisation in Robotics (IDSR).",
  },
  {
    year: "2019",
    text: "IIT Delhi formally recognises BIRD as an institute-level Centre of Excellence.",
  },
  {
    year: "2020",
    text: "The I-Hub Foundation for Cobotics (IHFC) is established as IIT Delhi's Technology Innovation Hub under the Department of Science & Technology.",
  },
  {
    year: "2023",
    text: "The M.Tech in Robotics launches — jointly offered by EE, ME, CSE, and the School of AI.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <PageHeading eyebrow="About" title="About CoE-BIRD" />

      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-20 pb-20">
        <Card>
          <p className="leading-relaxed text-gray-700">
            Twenty years ago, a group of IIT Delhi students built a robot for a competition.
            Today, that same restless curiosity has grown into an interdisciplinary centre of
            excellence working on some of the hardest problems in robotics — how machines learn
            from biological systems, operate autonomously in unstructured environments, and work
            safely alongside people.
          </p>
          <p className="mt-4 leading-relaxed text-gray-700">
            CoE-BIRD is where that work happens. Established formally in 2019 and home to IIT
            Delhi&apos;s M.Tech. in Robotics since 2023, we bring together faculty from multiple
            departments around a shared conviction: that insights from biology can be translated
            into robust, real-world robotic systems.
          </p>
        </Card>

        <Card>
          <h2 className="font-serif text-xl font-bold text-[#001A23]">
            Inception and Evolution
          </h2>
          <ul className="mt-5 flex flex-col gap-5 border-l-2 border-amber-400 pl-5">
            {timeline.map((item) => (
              <li key={item.year}>
                <span className="font-serif block text-sm font-bold text-[#001A23]">
                  {item.year}
                </span>
                <p className="mt-1 text-sm text-gray-600">{item.text}</p>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <h2 className="font-serif text-xl font-bold text-[#001A23]">
            Education, Research, and Impact
          </h2>
          <p className="mt-4 leading-relaxed text-gray-700">
            In 2023, CoE-BIRD played a pivotal role in launching the M.Tech. in Robotics program
            at IIT Delhi, jointly offered by the Departments of Electrical Engineering, Mechanical
            Engineering, Computer Science and Engineering, and the School of Artificial
            Intelligence.
          </p>
          <p className="mt-4 leading-relaxed text-gray-700">
            The program features a rigorous interdisciplinary curriculum integrating mechanical
            design, control theory, computer vision, artificial intelligence, and human–robot
            interaction, with strong emphasis on hands-on learning through laboratory modules,
            research-driven projects, and collaborations with industry and national R&amp;D
            agencies.
          </p>
          <p className="mt-4 leading-relaxed text-gray-700">
            The centre brings together faculty, students, industry partners, and collaborators to
            pursue cutting-edge research and technology development spanning dynamics and control,
            perception and cognition, AI integration, and the deployment of robotic and drone
            systems in real-world applications.
          </p>
        </Card>
      </div>

      <AboutGallery />
    </div>
  );
}