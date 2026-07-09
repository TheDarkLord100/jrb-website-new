import VerticalPage from "@/components/sections/VerticalPage";
import type { Project } from "@/components/sections/ProjectAccordion";

export const metadata = { title: "Human-Centred and Assistive Robotics" };

const faculty = [
    "Sitikantha Roy",
    "Subodh Kumar",
    "Jitendra Prasad Khatait",
    "Kaushik Mukherjee",
    "Shubhendu Bhasin",
    "Lalan Kumar",
    "Chetan Arora"
];

const labs = [
    "Soft Robotics Lab",
    "Medical Cobotics Lab"
];

const projects: Project[] = [
  {
    title: "Autonomous Mobile Cobot for Pick-and-Place Operations",
    lead: "A mobile collaborative robot capable of autonomous navigation and manipulation for pick-and-place tasks.",
    image: "/Assets/projects/3-pick.png",
    alt: "Mobile Cobot",
    abstract:
      "This project combined mobile robotics and manipulation to enable flexible material handling in dynamic environments. Vision-based perception and motion planning algorithms allowed the system to identify objects, navigate safely, and execute manipulation tasks with precision. The platform demonstrated improved operational flexibility compared to traditional fixed automation systems.",
  },
  {
    title: "Intelligent Space-Revealing Skills for Object Pushing",
    lead: "Learning-based robotic pushing strategies to reveal object configurations and workspace structure.",
    image: "/Assets/projects/6-space.jpg",
    alt: "Object Pushing Robot",
    abstract:
      "The system learns interaction strategies that reduce uncertainty in object pose and environment structure. Through intelligent pushing actions, the robot reveals hidden workspace information that improves manipulation planning success. The research demonstrates how interaction-driven perception can enhance robotic autonomy in cluttered environments.",
  },
  {
    title: "Soft Robotic Ankle Exosuit for Intelligent Gait Assistance",
    lead: "A cable-driven soft robotic exosuit designed to assist ankle motion during human walking.",
    image: "/Assets/projects/7-exo.jpg",
    alt: "Ankle Exosuit",
    abstract:
      "The exosuit leverages lightweight actuation and sensor feedback to provide adaptive assistance during walking. Human-in-the-loop experiments showed improved gait efficiency and reduced physical effort for the user. This work highlights the potential of soft wearable robotics in rehabilitation and assistive mobility applications.",
  },
  {
    title: "Basketball Throwing and Dribbling Robot (Robocon 2025)",
    lead: "A competition robot designed to autonomously throw and dribble basketballs based on the Robocon 2025 theme.",
    image: "/Assets/projects/15-basket.jpg",
    alt: "Robocon Robot",
    abstract:
      "The robot combined precise actuation mechanisms, control algorithms, and coordinated motion strategies to execute throwing and dribbling tasks under competition constraints. The project emphasized rapid prototyping, system integration, and robust real-time control.",
  },
  {
    title: "Intelligent Control of Hip Augmentation through Wearable Robotics",
    lead: "",
    image: "/Assets/404.jpg",
    alt: "Intelligent Control of Hip Augmentation through Wearable Robotics",
    abstract:
      "This project develops intelligent control strategies for wearable robotic systems designed to augment hip motion during walking. By leveraging sensor data and motion cues from the user, the system adapts assistance in real time to complement natural human movement.",
  },
  {
    title: "Estimating Human-Robot Interaction from Data in Wearable Robotics",
    lead: "",
    image: "/Assets/404.jpg",
    alt: "Estimating Human-Robot Interaction from Data in Wearable Robotics",
    abstract:
      "This project investigates data-driven approaches for estimating interaction forces and human intent in wearable robotic systems. Using sensor data and machine learning models, the system aims to infer interaction dynamics without relying on explicit physical models.",
  },
  {
    title: "Telemanipulation of Surgical Robot",
    lead: "",
    image: "/Assets/404.jpg",
    alt: "Telemanipulation of Surgical Robot",
    abstract:
      "This research explores telemanipulation techniques for surgical robotic systems, enabling precise and stable remote control of surgical manipulators. The work focuses on control interfaces, latency mitigation, and safe human-in-the-loop operation.",
  }
];

export default function Page() {
  return (
    <VerticalPage
      title="Human-Centred and Assistive Robotics"
      intro="This vertical focuses on developing robotic systems that safely and effectively interact with humans in healthcare, rehabilitation, and collaborative work settings. Core research activities include the design of wearable robotic exoskeletons and prosthetic devices; investigation of physical human–robot interaction through force and impedance modulation; development of teleoperation interfaces with haptic feedback for remote manipulation; clinical validation studies with target user populations, conducted in collaboration with hospitals and clinical partners; and AR/VR-enhanced interfaces for immersive teleoperation and rehabilitation visualization."
      faculty={faculty}
      labs={labs}
      image="/Assets/research_images/humanoid.jpg"
      projects={projects}
    />
  );
}
