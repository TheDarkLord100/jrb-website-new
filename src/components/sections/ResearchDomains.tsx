import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";

const verticals = [
  {
    href: "/research/themes/human-robotics",
    title: "Human-Centred and Assistive Robotics",
    description:
      "Robotic systems designed to operate safely and effectively alongside people. Work spans wearable and assistive devices, rehabilitation robotics, and collaborative manipulation, with an emphasis on physical human–robot interaction and interfaces that adapt to individual users.",
  },
  {
    href: "/research/themes/soft-bio-robotics",
    title: "Soft & Bio-Inspired Robotics",
    description:
      "Robotic systems built from compliant materials and mechanisms inspired by biological structures. Research covers soft actuators, adaptive morphology, and locomotion strategies suited to unstructured environments where rigid robots struggle.",
  },
  {
    href: "/research/themes/field-robotics",
    title: "Autonomous Field Robotics",
    description:
      "Robotic systems that sense, navigate, and make decisions without human intervention in outdoor and semi-structured environments. Work spans perception under uncertainty, terrain-aware navigation, and multi-robot coordination.",
  },
];

const crossCutting = {
  href: "/research/themes/cross-cutting",
  title: "Embodied Intelligence, Learning & Control",
  description:
    "A shared foundation beneath all three verticals — how perception, learning, and control integrate directly with a robot's physical embodiment. This includes reinforcement learning for robotic control, adaptive control under uncertainty, and the co-design of algorithms and hardware.",
};

export default function ResearchDomains() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-[75rem] px-5">
        <SectionHeading eyebrow="Research" title="Research Domains" />

        <p className="mx-auto mb-14 max-w-2xl text-center text-gray-600">
          The Centre of Excellence on Biologically Inspired Robots and Drones (CoE-BIRD) 
          at IIT Delhi is an interdisciplinary research centre that aims to advance robotics for real-world autonomy.
          We design intelligent robotic systems, from assistive wearables to field-deployed drones, 
          that operate reliably in complex, unstructured environments.
        </p>

        <div className="relative">
          {/* Three verticals */}
          <div className="grid gap-6 sm:grid-cols-3">
            {verticals.map((v) => (
              <Link
                href={v.href}
                key={v.href}
                className="group flex flex-col border-t-2 border-amber-400 bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-shadow hover:shadow-md"
              >
                <h3 className="font-serif text-lg font-bold text-[#001A23]">{v.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600">
                  {v.description}
                </p>
                <span className="mt-5 text-sm font-medium text-amber-700 group-hover:underline">
                  View Research →
                </span>
              </Link>
            ))}
          </div>

          {/* Connectors down to the cross-cutting band — desktop only */}
          <div className="hidden sm:grid sm:grid-cols-3">
            {verticals.map((v) => (
              <div key={v.href} className="mx-auto h-8 w-px bg-amber-300" />
            ))}
          </div>

          {/* Cross-cutting theme: spans beneath all three verticals */}
          <Link
            href={crossCutting.href}
            className="group block border-2 border-amber-300 bg-amber-50/60 p-6 text-center transition-colors hover:bg-amber-50 sm:p-8"
          >
            <span className="text-xs font-semibold tracking-[0.2em] text-amber-700 uppercase">
              Cross-Cutting Theme
            </span>
            <h3 className="font-serif mt-2 text-xl font-bold text-[#001A23] sm:text-2xl">
              {crossCutting.title}
            </h3>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base">
              {crossCutting.description}
            </p>
            <span className="mt-4 inline-block text-sm font-medium text-amber-700 group-hover:underline">
              View Research →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}