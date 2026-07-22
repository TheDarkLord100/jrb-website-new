import VerticalPage from "@/components/sections/VerticalPage";

export const metadata = { title: "Soft, Compliant and Bio-Inspired Robotic Systems" };

export default function Page() {
  return (
    <VerticalPage
      themeSlug="soft-bio-robotics"
      title="Soft, Compliant and Bio-Inspired Robotic Systems"
      intro="This vertical investigates novel mechanisms and morphologies that enable safe physical interaction and adaptability in unstructured environments. Research activities include the design and fabrication of soft pneumatic and hydraulic actuators using multi-material 3D printing and molding techniques; development of bio-inspired platforms such as compliant quadrupeds and continuum manipulators that leverage morphological computation; creation of soft tactile sensors for contact-rich manipulation; and establishment of design principles that exploit mechanical compliance to simplify control and enhance robustness. Another important application domain is soft robotics for space applications and underwater navigation."
    />
  );
}