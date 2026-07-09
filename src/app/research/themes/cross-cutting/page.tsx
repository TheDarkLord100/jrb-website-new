import VerticalPage from "@/components/sections/VerticalPage";
import type { Project } from "@/components/sections/ProjectAccordion";

export const metadata = { title: "Embodied Intelligence, Learning & Control" };

const faculty = [
    "Amber Srivastava",
    "Vamsi Krishna Chalamalla",
    "Shubhendu Bhasin",
    "Sitikantha Roy",
    "Deepak Umakant Patil",
    "Rohan Paul"
];

const labs = [
    "Vision Lab",
    "Control Lab",
    "Swarm Intelligence Lab"
];

const projects: Project[] = [

];

export default function Page() {
  return (
    <VerticalPage
      title="Embodied Intelligence, Learning & Control"
      intro="This cross-cutting research thrust integrates perception, learning, and control within physical robotic systems to ensure adaptability and real-world deployability across all three verticals. Core activities include developing learning-from-demonstration methods that enable robots to acquire skills from human operators; creating sim-to-real transfer pipelines that bridge high-fidelity simulation and physical deployment; investigating bio-inspired control architectures such as central pattern generators; and building foundation models that leverage multimodal sensing for task understanding and execution. These methods support personalized adaptation in assistive devices (V1), learned control of soft systems with complex dynamics (V2), and continual improvement during autonomous field deployment (V3)."
      faculty={faculty}
      labs={labs}
      image="/Assets/research_images/cross.jpg"
      projects={projects}
    />
  );
}
