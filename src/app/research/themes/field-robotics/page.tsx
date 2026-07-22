import VerticalPage from "@/components/sections/VerticalPage";

export const metadata = { title: "Autonomous Field Robotics" };

export default function Page() {
  return (
    <VerticalPage
      themeSlug="field-robotics"
      title="Autonomous Field Robotics"
      intro="This vertical addresses perception, planning, and coordination for robots operating autonomously in real-world outdoor and unstructured environments. Key activities include the development of robust perception systems combining vision, LiDAR, and thermal sensing for all-weather operation; creation of adaptive navigation and path-planning algorithms for diverse terrains and obstacle-rich settings; and investigation of multi-robot (ground, aerial and underwater) coordination for collaborative tasks in applications such as agriculture and infrastructure inspection."
    />
  );
}