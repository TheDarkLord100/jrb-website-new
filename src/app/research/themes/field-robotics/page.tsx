import VerticalPage from '@/components/sections/research/VerticalPage';

import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'Autonomous Field Robotics',
  description:
    'CoE-BIRD research into robotic systems for agriculture, disaster response, infrastructure inspection, and aerial exploration, integrating sensing, perception, navigation, and autonomous decision-making.',
  path: '/research/themes/field-robotics',
});
export default function Page() {
  return (
    <VerticalPage
      themeSlug="field-robotics"
      title="Autonomous Field Robotics"
      intro="This vertical addresses perception, planning, and coordination for robots operating autonomously in real-world outdoor and unstructured environments. Key activities include the development of robust perception systems combining vision, LiDAR, and thermal sensing for all-weather operation; creation of adaptive navigation and path-planning algorithms for diverse terrains and obstacle-rich settings; and investigation of multi-robot (ground, aerial and underwater) coordination for collaborative tasks in applications such as agriculture and infrastructure inspection."
    />
  );
}
