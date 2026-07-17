import Image from "next/image";
import Link from "next/link";
import { Handshake, FlaskConical, GraduationCap } from "lucide-react";

const pillars = [
  {
    icon: Handshake,
    title: "Collaborate",
    description: "Work with our faculty on sponsored research and consulting projects.",
  },
  {
    icon: FlaskConical,
    title: "Co-Develop",
    description: "Access our labs, equipment, and technical expertise to prototype new systems.",
  },
  {
    icon: GraduationCap,
    title: "Engage Talent",
    description: "Connect with graduate students and researchers for internships and recruiting.",
  },
];

export default function IndustryConnect() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto grid max-w-[75rem] gap-12 px-5 lg:grid-cols-2 lg:items-center">
        {/* Left: copy + pillars + CTA */}
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-amber-600 uppercase">
            Industry &amp; Partnerships
          </p>
          <h2 className="font-serif mt-3 text-2xl font-bold text-[#001A23] sm:text-3xl">
            Partnering with Industry
          </h2>
          <p className="mt-4 max-w-md text-gray-600">
            CoE-BIRD partners with industry to move robotics research from the lab into
            real-world deployment — through sponsored projects, shared infrastructure, and
            direct engagement with our students and faculty.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {pillars.map((pillar) => (
              <div key={pillar.title}>
                <div className="flex h-11 w-11 items-center justify-center border border-amber-200 bg-amber-50/60">
                  <pillar.icon size={20} className="text-amber-700" strokeWidth={1.75} />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-[#001A23]">{pillar.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>

          <Link
            href="/industry"
            className="mt-9 inline-block border border-gray-300 px-6 py-2.5 text-sm font-medium text-[#001A23] transition-colors hover:border-amber-400 hover:text-amber-700"
          >
            Explore Industry Partnerships →
          </Link>
        </div>

        {/* Right: real project photo */}
        <div className="relative h-80 w-full sm:h-96 lg:h-[28rem]">
          <Image
            src="/Assets/research_images/industry_robot.png"
            alt="Autonomous mobile robot developed at CoE-BIRD, IIT Delhi"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}