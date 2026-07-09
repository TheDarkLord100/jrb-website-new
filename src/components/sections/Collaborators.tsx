import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";

const LOGO_COUNT = 13;
const logos = Array.from({ length: LOGO_COUNT }, (_, i) => `/Assets/collab_logos/logo_${i + 1}.png`);
const doubledLogos = [...logos, ...logos];

export default function Collaborators() {
  return (
    <section className="overflow-hidden bg-white py-16">
      <div className="mx-auto max-w-[75rem] px-5">
        <SectionHeading title="Our Collaborators" />
      </div>

      <div className="relative flex overflow-hidden">
        <div className="animate-marquee flex shrink-0 items-center gap-16 px-8">
          {doubledLogos.map((src, i) => (
            <Image
              key={`${src}-${i}`}
              src={src}
              alt="Collaborator logo"
              width={110}
              height={55}
              className="h-14 w-auto shrink-0 object-contain grayscale transition-all hover:grayscale-0"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
