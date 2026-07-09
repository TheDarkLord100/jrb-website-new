import VerticalPage from "@/components/sections/VerticalPage";
import type { Project } from "@/components/sections/ProjectAccordion";

export const metadata = { title: "Autonomous Field Robotics" };

const faculty = [
    "Vamsi Krishna Chalamalla",
    "Sunil Jha",
    "Chetan Arora",
    "Amber Srivastava",
    "Shubhendu Bhasin",
    "Subir Kumar Saha",
    "Deepak Umakant Patil",
    "S Janardhanan",
    "Husain Kanchwala",
    "Jitendra Prasad Khatait"
];

const labs = [
    "Vision Lab",
    "Control Lab",
    "Swarm Intelligence Lab",
    "PAR Lab"
];

const projects: Project[] = [
  {
    title: "Coverage Optimization Using Swarm Intelligence in Autonomous UAV Swarms",
    lead: "A swarm-based UAV system designed to maximize area coverage using decentralized intelligence.",
    image: "/Assets/projects/1-drone.jpg",
    alt: "Coverage Optimization Using Swarm Intelligence in Autonomous UAV Swarms",
    abstract:
      "This project applied swarm intelligence techniques to coordinate multiple UAVs for efficient area coverage. Distributed decision-making enabled scalability and robustness against individual agent failure. Experimental results demonstrated improved coverage efficiency compared to centralized approaches.",
  },
  {
    title: "Advanced Autonomous Surveillance Robot for Campus Security",
    lead: "An intelligent surveillance robot capable of autonomous patrolling and monitoring.",
    image: "/Assets/projects/2-auto.jpg",
    alt: "Advanced Autonomous Surveillance Robot for Campus Security",
    abstract:
      "The system integrates navigation, object detection, and real-time monitoring to perform autonomous surveillance tasks. Deployed in campus-like environments, the robot demonstrated reliable navigation and situational awareness.",
  },
  {
    title: "Drone-Image Object Detection (DIOD)",
    lead: "Deep learning-based object detection from aerial drone imagery.",
    image: "/Assets/projects/4-drone.jpg",
    alt: "Drone-Image Object Detection (DIOD)",
    abstract:
      "Object detection models were trained on drone imagery datasets to identify objects under varying altitude and lighting conditions. Applications include surveillance, mapping, and disaster response.",
  },
  {
    title: "Scene Recreation using SLAM for Archaeological Sites",
    lead: "3D reconstruction of archaeological environments using SLAM.",
    image: "/Assets/projects/12-slam.jpg",
    alt: "Scene Recreation using SLAM for Archaeological Sites",
    abstract:
      "Visual SLAM techniques were used to reconstruct archaeological sites in 3D. The system allows digital preservation and spatial analysis without disturbing sensitive heritage environments.",
  },
  {
    title: "Offline Vision-Based Navigation for Heritage Sites",
    lead: "Navigation system enabling robots to operate in GPS-denied environments.",
    image: "/Assets/projects/10-nav.jpg",
    alt: "Offline Vision-Based Navigation for Heritage Sites",
    abstract:
      "Vision-based localization and mapping enabled robots to navigate indoor and heritage environments without GPS infrastructure. The system preserves site integrity while enabling autonomous exploration.",
  },
  {
    title: "Autonomous Driving using Autoware on Mahindra e2O",
    lead: "Implementation of an autonomous driving stack using Autoware.",
    image: "/Assets/404.jpg",
    alt: "Autonomous Driving using Autoware on Mahindra e2O",
    abstract:
      "The system integrates localization, perception, and planning modules to enable lane following and obstacle avoidance on an electric vehicle platform.",
  },
  {
    title: "Autonomous Navigation using NVIDIA Isaac on Kaya Robot",
    lead: "Navigation system for the Kaya mobile robot using NVIDIA Isaac.",
    image: "/Assets/404.jpg",
    alt: "Autonomous Navigation using NVIDIA Isaac on Kaya Robot",
    abstract:
      "Simulation-to-real workflows enabled rapid testing and deployment of navigation algorithms for indoor robotic platforms.",
  },
  {
    title: "Autonomous Navigation of Mobile Robot",
    lead: "",
    image: "/Assets/404.jpg",
    alt: "Autonomous Navigation of Mobile Robot",
    abstract:
      "This project focuses on perception, mapping, and planning algorithms to enable robots to navigate complex environments without external infrastructure.",
  },
  {
    title: "In-Pipe Inspection Robot",
    lead: "",
    image: "/Assets/404.jpg",
    alt: "In-Pipe Inspection Robot",
    abstract:
      "Development of a robotic system capable of navigating confined pipe networks for inspection and defect detection in industrial infrastructure.",
  },
  {
    title: "Visual Simulation Tool for Factory Floor Planning",
    lead: "",
    image: "/Assets/404.jpg",
    alt: "Visual Simulation Tool for Factory Floor Planning",
    abstract:
      "Simulation framework for evaluating robot fleet coordination and factory layout planning for automated manufacturing.",
  },
  {
    title: "Parameterized Reinforcement Learning for Network Design",
    lead: "",
    image: "/Assets/404.jpg",
    alt: "Parameterized Reinforcement Learning for Network Design",
    abstract:
      "Reinforcement learning methods are applied to complex network design optimization problems combining discrete and continuous decisions.",
  }
];

export default function Page() {
  return (
    <VerticalPage
      title="Autonomous Field Robotics"
      intro="This vertical addresses perception, planning, and coordination for robots operating autonomously in real-world outdoor and unstructured environments. Key activities include the development of robust perception systems combining vision, LiDAR, and thermal sensing for all-weather operation; creation of adaptive navigation and path-planning algorithms for diverse terrains and obstacle-rich settings; and investigation of multi-robot (ground, aerial and underwater) coordination for collaborative tasks in applications such as agriculture and infrastructure inspection."
      faculty={faculty}
      labs={labs}
      image="/Assets/research_images/field.jpg"
      projects={projects}
    />
  );
}
