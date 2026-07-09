import VerticalPage from "@/components/sections/VerticalPage";
import type { Project } from "@/components/sections/ProjectAccordion";

export const metadata = { title: "Soft & Bio-Inspired Robotics" };

const faculty = [
    "Jitendra Prasad Khatait",
    "Sitikantha Roy",
    "Shubhendu Bhasin",
    "Satinder Paul Singh",
    "Subir Kumar Saha"
];

const labs = [
    "Soft Robotics Lab",
    "Medical Cobotics Lab"
];

const projects: Project[] = [
  {
    title: "Control Co-Design and Development of Robotic Manipulators",
    lead: "Joint design of robotic hardware and control strategies to improve performance and stability of robotic manipulators.",
    image: "/Assets/projects/5-mani.jpg",
    alt: "Robotic Manipulator",
    abstract:
      "This project explored control co-design methodologies in which mechanical design and control algorithms are developed together rather than sequentially. Integrated modeling and simulation allowed researchers to identify optimal design parameters while simultaneously developing robust control strategies. The resulting manipulator design demonstrated improved stability, precision, and energy efficiency compared to traditional design approaches.",
  },
  {
    title: "Bio-Inspired Snake Robot for Search and Locomotion",
    lead: "A snake-like robot inspired by biological locomotion for navigating constrained and cluttered environments.",
    image: "/Assets/projects/8-snake.png",
    alt: "Snake Robot",
    abstract:
      "This project developed a modular snake-like robot capable of performing serpentine locomotion in narrow and complex environments. Inspired by biological snake motion, the robot employs coordinated joint actuation to achieve efficient movement over uneven terrain. Experimental testing demonstrated the robot’s ability to maneuver through constrained spaces, making it well suited for inspection, search-and-rescue, and industrial maintenance tasks.",
  },
  {
    title: "Bipedal Locomotion on Uneven Terrains and Staircase using Reinforcement Learning",
    lead: "",
    image: "/Assets/404.jpg",
    alt: "Bipedal Locomotion on Uneven Terrains and Staircase using Reinforcement Learning",
    abstract:
      "This project investigates robust bipedal walking strategies for robots operating on uneven terrain and staircases using reinforcement learning. The objective is to learn adaptive locomotion policies capable of handling terrain variations, disturbances, and changes in contact conditions. Through simulation-based training, the system learns stable gait patterns, balance recovery strategies, and energy-efficient motion policies that extend beyond traditional model-based control approaches. The research aims to advance the development of agile legged robots capable of reliable operation in complex environments.",
  }
];

export default function Page() {
  return (
    <VerticalPage
      title="Soft, Compliant and Bio-Inspired Robotic Systems"
      intro="This vertical investigates novel mechanisms and morphologies that enable safe physical interaction and adaptability in unstructured environments. Research activities include the design and fabrication of soft pneumatic and hydraulic actuators using multi-material 3D printing and molding techniques; development of bio-inspired platforms such as compliant quadrupeds and continuum manipulators that leverage morphological computation; creation of soft tactile sensors for contact-rich manipulation; and establishment of design principles that exploit mechanical compliance to simplify control and enhance robustness. Another important application domain is soft robotics for space applications and underwater navigation."
      faculty={faculty}
      labs={labs}
      image="/Assets/research_images/soft.png"
      projects={projects}
    />
  );
}
