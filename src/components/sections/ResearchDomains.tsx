import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";

const researchCards = [
  {
    href: "/research/themes/human-robotics",
    img: "/Assets/research_images/humanoid.jpg",
    title: "Human-Centred and Assistive Robotics",
    description: "Assistive systems, wearable robotics, and human–robot interaction.",
  },
  {
    href: "/research/themes/soft-bio-robotics",
    img: "/Assets/research_images/soft.png",
    title: "Soft & Bio-Inspired Robotics",
    description: "Compliant mechanisms, soft robots, and bio-inspired design.",
  },
  {
    href: "/research/themes/field-robotics",
    img: "/Assets/research_images/field.jpg",
    title: "Autonomous Field Robotics",
    description: "Robust perception, navigation, and decision-making in real-world environments.",
  },
];

export default function ResearchDomains() {
  return (
    <>
      <section className="bg-white py-16">
        <div className="mx-auto max-w-[75rem] px-5">
          <SectionHeading title="Research Domains" />

          <p className="mx-auto mb-10 max-w-3xl text-center text-gray-600">
            The Centre of Excellence on Biologically Inspired Robots and Drones (CoE-BIRD) at IIT
            Delhi is an interdisciplinary research centre that aims to advance bio-inspired robotics
            for real-world autonomy. We design intelligent robotic systems, from assistive wearables
            to field-deployed drones, that operate reliably in complex, unstructured environments.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {researchCards.map((card) => (
              <Link
                href={card.href}
                key={card.href}
                className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-lg"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={card.img}
                    alt={card.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-[#001A23]">{card.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{card.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-[75rem] px-5">
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
                Embodied Intelligence, Learning &amp; Control
              </h3>
              <p className="mt-3 text-sm text-white/85 sm:text-base">
                Reinforcement learning, adaptive control, and co-design of algorithms and hardware
                for intelligent robotic behaviour.
              </p>
            </div>
          </Link>
        </div>
      </section>
    </>
  );
}
