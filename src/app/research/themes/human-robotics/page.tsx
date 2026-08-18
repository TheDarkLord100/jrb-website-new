import VerticalPage from '@/components/sections/research/VerticalPage';

import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'Human-Centred and Assistive Robotics',
  description:
    'CoE-BIRD research into robotic systems designed to interact safely with humans — assistive technologies, wearable robotics, rehabilitation systems, and collaborative robots.',
  path: '/research/themes/human-robotics',
});
export default function Page() {
  return (
    <VerticalPage
      themeSlug="human-robotics"
      title="Human-Centred and Assistive Robotics"
      intro="This vertical focuses on developing robotic systems that safely and effectively interact with humans in healthcare, rehabilitation, and collaborative work settings. Core research activities include the design of wearable robotic exoskeletons and prosthetic devices; investigation of physical human–robot interaction through force and impedance modulation; development of teleoperation interfaces with haptic feedback for remote manipulation; clinical validation studies with target user populations, conducted in collaboration with hospitals and clinical partners; and AR/VR-enhanced interfaces for immersive teleoperation and rehabilitation visualization."
    />
  );
}
