import Image from 'next/image';
import Accordion from '@/components/ui/Accordion';
import Markdown from '@/components/ui/Markdown';
import GitHubIcon from '@/components/ui/GitHubIcon';
import type { Project } from '@/types/project';

// One theme's projects as a stack of accordions. Collapsed, each shows a
// small thumbnail (when the project has media), its title and one line of
// short description, so the list stays scannable; opened, it shows the
// media larger beside the full write-up and GitHub link. Media is kept at a
// fixed small width so the content, not the image, is what the eye lands on.

function Thumbnail({ project }: { project: Project }) {
  if (!project.media_url) return null;
  return (
    <span className="relative block h-14 w-20 shrink-0 overflow-hidden bg-gray-100">
      {project.media_type === 'video' ? (
        // First frame as a still -- no controls in the header row.
        <video
          src={project.media_url}
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
      ) : (
        <Image src={project.media_url} alt="" fill sizes="5rem" className="object-cover" />
      )}
    </span>
  );
}

function Header({ project }: { project: Project }) {
  return (
    <span className="flex min-w-0 items-center gap-4">
      <Thumbnail project={project} />
      <span className="min-w-0">
        <span className="block">{project.title}</span>
        {project.short_description && (
          <span className="mt-0.5 block truncate text-sm font-normal text-gray-500">
            {project.short_description}
          </span>
        )}
      </span>
    </span>
  );
}

export default function ThemeProjects({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return <p className="mt-5 text-sm text-gray-500">To be added.</p>;
  }

  return (
    <div className="mt-5 space-y-3">
      {projects.map((project) => (
        <Accordion key={project.id} title={<Header project={project} />}>
          <div className="flex flex-col gap-5 md:flex-row">
            {project.media_url && (
              <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-gray-100 md:w-64">
                {project.media_type === 'video' ? (
                  <video
                    src={project.media_url}
                    controls
                    muted
                    playsInline
                    preload="metadata"
                    aria-label={project.media_alt ?? project.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Image
                    src={project.media_url}
                    alt={project.media_alt ?? project.title}
                    fill
                    sizes="(min-width: 768px) 16rem, 100vw"
                    className="object-cover"
                  />
                )}
              </div>
            )}

            <div className="min-w-0 flex-1">
              {project.description ? (
                <Markdown>{project.description}</Markdown>
              ) : (
                project.short_description && (
                  <p className="leading-relaxed text-gray-700">{project.short_description}</p>
                )
              )}

              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 transition-colors hover:border-amber-400 hover:bg-amber-50 hover:text-amber-800"
                >
                  <GitHubIcon size={14} />
                  View on GitHub
                </a>
              )}
            </div>
          </div>
        </Accordion>
      ))}
    </div>
  );
}