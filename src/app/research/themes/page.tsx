import Image from "next/image";
import Link from "next/link";
import PageHeading from "@/components/ui/PageHeading";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata = { title: "Research Themes" };

const verticals = [
  {
    img: "/Assets/research_images/humanoid.jpg",
    title: "Human-Centred and Assistive Robotics",
    description:
      "This vertical focuses on robotic systems designed to interact safely and effectively with humans. Research includes assistive technologies, wearable robotics, rehabilitation systems, and collaborative robots that augment human capability and improve quality of life.",
    href: "/research/themes/human-robotics",
  },
  {
    img: "/Assets/research_images/soft.png",
    title: "Soft, Compliant and Bio-Inspired Robotic Systems",
    description:
      "Inspired by biological organisms, this research explores soft materials, compliant actuation, adaptive morphology, and novel mechanisms that allow robots to operate safely and efficiently in unstructured environments.",
    href: "/research/themes/soft-bio-robotics",
  },
  {
    img: "/Assets/research_images/field.jpg",
    title: "Autonomous Field Robotics",
    description:
      "This vertical studies robotic systems capable of operating in real-world environments such as agriculture, disaster response, infrastructure inspection, and aerial exploration. The work integrates sensing, perception, navigation, and robust autonomous decision-making.",
    href: "/research/themes/field-robotics",
  },
];

export default function ResearchThemesPage() {
  return (
    <div>
      <PageHeading title="Research" />

      <div className="mx-auto max-w-[75rem] px-5 pb-16">
        {/* Overview */}
        <div className="mb-16 grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-[#001A23]">Research Overview</h2>
            <p className="mt-4 leading-relaxed text-gray-600">
              Research at the Centre of Excellence on Biologically Inspired Robots and Drones
              focuses on the development, analysis, and deployment of intelligent robotic systems.
              The centre brings together researchers from multiple disciplines to design robotic
              platforms capable of operating robustly in complex and dynamic environments.
            </p>
            <p className="mt-4 leading-relaxed text-gray-600">
              Our work spans autonomous navigation, learning-based control, human–robot interaction,
              bio-inspired design, and field robotics. A strong emphasis is placed on experimental
              validation, integrated system design, and translating fundamental research into
              real-world robotic applications.
            </p>
          </div>
          <div className="relative h-64 w-full overflow-hidden rounded-xl shadow-md sm:h-80">
            <Image
              src="/Assets/research_images/1.png"
              alt="Robotics research"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Verticals */}
        <SectionHeading title="Research Verticals" />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {verticals.map((v) => (
            <div
              key={v.href}
              className="flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
            >
              <div className="relative h-44 w-full">
                <Image src={v.img} alt={v.title} fill className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-semibold text-[#001A23]">{v.title}</h3>
                <p className="mt-2 flex-1 text-sm text-gray-600">{v.description}</p>
                <Link
                  href={v.href}
                  className="mt-4 inline-block w-fit rounded-full bg-[#001A23] px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#00303f]"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Cross-cutting theme */}
        <div className="mt-16">
          <Link
            href="/research/themes/cross-cutting"
            className="group relative block overflow-hidden rounded-xl shadow-md"
          >
            <div className="relative h-72 w-full sm:h-80">
              <Image
                src="/Assets/research_images/cross.jpg"
                alt="Embodied Intelligence"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 max-w-xl p-8 text-white">
              <span className="text-xs font-semibold tracking-widest text-yellow-400 uppercase">
                Cross-Cutting Theme
              </span>
              <h3 className="mt-2 text-xl font-bold sm:text-2xl">
                Embodied Intelligence, Learning and Control
              </h3>
              <p className="mt-3 text-sm text-white/85 sm:text-base">
                A unifying theme across the centre&apos;s research is the integration of
                intelligence directly within robotic systems through the interaction between
                perception, learning, control, and physical embodiment.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
