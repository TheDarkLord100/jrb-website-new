import Link from 'next/link';
import PageHeading from '@/components/ui/PageHeading';
import SectionHeading from '@/components/ui/SectionHeading';
import StaticPointCloud from '@/components/sections/research/StaticPointCloud';
import FeaturedProjectsCarousel from '@/components/sections/FeaturedProjectsCarousel';

import { buildMetadata } from '@/lib/metadata';

function GitHubIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-label="GitHub"
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.755-1.333-1.755-1.089-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.807 1.305 3.492.998.108-.776.418-1.305.762-1.605-2.665-.303-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

export const metadata = buildMetadata({
  title: 'Research Themes',
  description:
    'Research at CoE-BIRD spans autonomous navigation, learning-based control, human-robot interaction, bio-inspired design, and field robotics, with an emphasis on experimental validation and real-world deployment.',
  path: '/research/themes',
});
const verticals = [
  {
    // TODO: "kuka" (robotic arm) is a placeholder — a dedicated shape (e.g.
    // an exosuit/assistive-device silhouette) would be a much better fit.
    shape: 'kuka',
    title: 'Human-Centred and Assistive Robotics',
    description:
      'This vertical focuses on robotic systems designed to interact safely and effectively with humans. Research includes assistive technologies, wearable robotics, rehabilitation systems, and collaborative robots that augment human capability and improve quality of life.',
    href: '/research/themes/human-robotics',
  },
  {
    // TODO: "drone" is a placeholder here too — something organic/soft-
    // bodied would represent this vertical far better.
    shape: 'drone',
    title: 'Soft, Compliant and Bio-Inspired Robotic Systems',
    description:
      'Inspired by biological organisms, this research explores soft materials, compliant actuation, adaptive morphology, and novel mechanisms that allow robots to operate safely and efficiently in unstructured environments.',
    href: '/research/themes/soft-bio-robotics',
  },
  {
    shape: 'amr',
    title: 'Autonomous Field Robotics',
    description:
      'This vertical studies robotic systems capable of operating in real-world environments such as agriculture, disaster response, infrastructure inspection, and aerial exploration. The work integrates sensing, perception, navigation, and robust autonomous decision-making.',
    href: '/research/themes/field-robotics',
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
            Research at the Centre of Excellence on Biologically Inspired Robots and Drones focuses
            on the development, analysis, and deployment of intelligent robotic systems. The centre
            brings together researchers from multiple disciplines to design robotic platforms
            capable of operating robustly in complex and dynamic environments.
          </p>
          <p className="mx-auto mt-4 max-w-5xl leading-relaxed text-gray-600">
            Our work spans autonomous navigation, learning-based control, human–robot interaction,
            bio-inspired design, and field robotics. A strong emphasis is placed on experimental
            validation, integrated system design, and translating fundamental research into
            real-world robotic applications.
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
              <p className="mt-3 flex-1 text-justify text-sm text-gray-600">{v.description}</p>
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

        <div className="mt-16">
          <SectionHeading title="Code Repository" />
          <a
            href="https://github.com/iitd-bird-robotics"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 border-t-2 border-amber-400 bg-white p-5 shadow-sm ring-1 ring-gray-100 transition-colors hover:border-amber-500"
          >
            <GitHubIcon />
            <div>
              <p className="font-serif font-semibold text-[#001A23]">iitd-bird-robotics</p>
              <p className="text-sm text-gray-600">
                Official GitHub organisation for CoE-BIRD — code for the centre&apos;s projects.
              </p>
            </div>
          </a>
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
