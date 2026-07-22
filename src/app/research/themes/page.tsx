import Link from "next/link";
import PageHeading from "@/components/ui/PageHeading";
import SectionHeading from "@/components/ui/SectionHeading";
import StaticPointCloud from "@/components/sections/StaticPointCloud";
import FeaturedProjectsCarousel from "@/components/sections/FeaturedProjectsCarousel";

export const metadata = { title: "Research Themes" };

const verticals = [
  {
    // TODO: "kuka" (robotic arm) is a placeholder — a dedicated shape (e.g.
    // an exosuit/assistive-device silhouette) would be a much better fit.
    shape: "kuka",
    title: "Human-Centred and Assistive Robotics",
    description:
      "This vertical focuses on robotic systems designed to interact safely and effectively with humans. Research includes assistive technologies, wearable robotics, rehabilitation systems, and collaborative robots that augment human capability and improve quality of life.",
    href: "/research/themes/human-robotics",
  },
  {
    // TODO: "drone" is a placeholder here too — something organic/soft-
    // bodied would represent this vertical far better.
    shape: "drone",
    title: "Soft, Compliant and Bio-Inspired Robotic Systems",
    description:
      "Inspired by biological organisms, this research explores soft materials, compliant actuation, adaptive morphology, and novel mechanisms that allow robots to operate safely and efficiently in unstructured environments.",
    href: "/research/themes/soft-bio-robotics",
  },
  {
    shape: "amr",
    title: "Autonomous Field Robotics",
    description:
      "This vertical studies robotic systems capable of operating in real-world environments such as agriculture, disaster response, infrastructure inspection, and aerial exploration. The work integrates sensing, perception, navigation, and robust autonomous decision-making.",
    href: "/research/themes/field-robotics",
  },
];

export default function ResearchThemesPage() {
  return (
    <div>
      <PageHeading eyebrow="Research" title="Research Themes" />

      <div className="mx-auto max-w-[75rem] px-5 pb-16">
        {/* Overview */}
        <div className="mb-16 text-justify">
          <p className="mx-auto max-w-5xl leading-relaxed text-gray-600">
            Research at the Centre of Excellence on Biologically Inspired Robots and Drones
            focuses on the development, analysis, and deployment of intelligent robotic systems.
            The centre brings together researchers from multiple disciplines to design robotic
            platforms capable of operating robustly in complex and dynamic environments.
          </p>
          <p className="mx-auto mt-4 max-w-5xl leading-relaxed text-gray-600">
            Our work spans autonomous navigation, learning-based control, human–robot
            interaction, bio-inspired design, and field robotics. A strong emphasis is placed on
            experimental validation, integrated system design, and translating fundamental
            research into real-world robotic applications.
          </p>
        </div>

        {/* Verticals */}
        <SectionHeading title="Research Verticals" />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {verticals.map((v) => (
            <div
              key={v.href}
              className="flex flex-col border-t-2 border-amber-400 bg-white p-5 shadow-sm ring-1 ring-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 shrink-0 overflow-hidden">
                  <StaticPointCloud shapeName={v.shape} />
                </div>
                <h3 className="font-serif font-semibold text-[#001A23]">{v.title}</h3>
              </div>
              <p className="mt-3 flex-1 text-sm text-gray-600 text-justify">{v.description}</p>
              <Link
                href={v.href}
                className="mt-4 inline-block w-fit border border-gray-300 px-4 py-1.5 text-sm font-medium text-[#001A23] transition-colors hover:border-amber-400 hover:text-amber-700"
              >
                View Details →
              </Link>
            </div>
          ))}
        </div>

        {/* Cross-cutting theme */}
        <div className="mt-16">
          <Link
            href="/research/themes/cross-cutting"
            className="group flex flex-col border-t-2 border-amber-400 bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:flex-row sm:items-center sm:gap-6"
          >
            <div className="h-16 w-16 shrink-0 overflow-hidden">
              {/* placeholder shape — reusing an existing point cloud, not a
                  dedicated one for this theme yet */}
              <StaticPointCloud shapeName="amr" />
            </div>
            <div className="mt-4 sm:mt-0">
              <span className="text-xs font-semibold tracking-widest text-amber-600 uppercase">
                Cross-Cutting Theme
              </span>
              <h3 className="mt-1 font-serif text-xl font-bold text-[#001A23]">
                Embodied Intelligence, Learning and Control
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                A unifying theme across the centre&apos;s research is the integration of
                intelligence directly within robotic systems through the interaction between
                perception, learning, control, and physical embodiment.
              </p>
              <span className="mt-3 inline-block text-sm font-medium text-amber-700 group-hover:underline">
                View Details →
              </span>
            </div>
          </Link>
        </div>

        {/* Featured Projects */}
        <div className="mt-16">
          <SectionHeading title="Featured Projects" />
          <FeaturedProjectsCarousel />
        </div>
      </div>
    </div>
  );
}