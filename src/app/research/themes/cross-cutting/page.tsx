import VerticalPage from '@/components/sections/research/VerticalPage';
import { getThemeFaculty, getThemeLabs } from '@/lib/supabase/queries';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'Embodied Intelligence, Learning and Control',
  description:
    'A unifying research theme at CoE-BIRD: integrating intelligence directly within robotic systems through the interaction between perception, learning, control, and physical embodiment.',
  path: '/research/themes/cross-cutting',
});

export default async function Page() {
  const [faculty, labs] = await Promise.all([
    getThemeFaculty('cross-cutting'),
    getThemeLabs('cross-cutting'),
  ]);

  return (
    <VerticalPage
      themeSlug="cross-cutting"
      title="Embodied Intelligence, Learning and Control"
      intro="This cross-cutting research thrust integrates perception, learning, and control within physical robotic systems to ensure adaptability and real-world deployability across all three verticals. Core activities include developing learning-from-demonstration methods that enable robots to acquire skills from human operators; creating sim-to-real transfer pipelines that bridge high-fidelity simulation and physical deployment; investigating bio-inspired control architectures such as central pattern generators; and building foundation models that leverage multimodal sensing for task understanding and execution. These methods support personalized adaptation in assistive devices (V1), learned control of soft systems with complex dynamics (V2), and continual improvement during autonomous field deployment (V3)."
      initialData={{ faculty, labs }}
    />
  );
}
