import Image from "next/image";
import PageHeading from "@/components/ui/PageHeading";
import ProjectAccordion, { type Project } from "@/components/sections/ProjectAccordion";

export default function VerticalPage({
  title,
  intro,
  faculty,
  labs,
  image,
  projects,
}: {
  title: string;
  intro: string;
  faculty: string[];
  labs: string[];
  image: string;
  projects: Project[];
}) {
  return (
    <div>
      <PageHeading title={title} />

      <div className="mx-auto max-w-[75rem] px-5 pb-16">
        <div className="mb-12 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            <p className="leading-relaxed text-gray-700">{intro}</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <h3 className="text-sm font-bold tracking-wide text-[#001A23] uppercase">
                  Faculty Involved
                </h3>
                <ul className="mt-3 flex flex-col gap-1.5 text-sm text-gray-600">
                  {faculty.map((name) => (
                    <li key={name}>{name}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <h3 className="text-sm font-bold tracking-wide text-[#001A23] uppercase">
                  Affiliated Labs
                </h3>
                <ul className="mt-3 flex flex-col gap-1.5 text-sm text-gray-600">
                  {labs.map((lab) => (
                    <li key={lab}>{lab}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="relative h-56 w-full overflow-hidden rounded-xl shadow-md lg:h-full">
            <Image src={image} alt={title} fill className="object-cover" />
          </div>
        </div>

        <h2 className="mb-6 text-2xl font-bold text-[#001A23]">Completed Projects</h2>

        {projects.length === 0 ? (
          <p className="text-gray-500">Projects will be listed here soon.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {projects.map((project) => (
              <ProjectAccordion key={project.title} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
