import Image from 'next/image';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { Handshake, FlaskConical, GraduationCap } from 'lucide-react';
import Collaborators from '@/components/sections/Collaborators';
import IndustryTiers from '@/components/sections/IndustryTiers';
import IndustryContactForm from '@/components/sections/IndustryContactForm';

export const metadata = { title: 'Industry & Partnerships' };

// Reused verbatim from the homepage's IndustryConnect teaser -- real,
// already-established copy, not invented for this page.
const pillars = [
  {
    icon: Handshake,
    title: 'Collaborate',
    description: 'Work with our faculty on sponsored research and consulting projects.',
  },
  {
    icon: FlaskConical,
    title: 'Co-Develop',
    description: 'Access our labs, equipment, and technical expertise to prototype new systems.',
  },
  {
    icon: GraduationCap,
    title: 'Engage Talent',
    description: 'Connect with graduate students and researchers for internships and recruiting.',
  },
];

export default function IndustryPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative w-full overflow-hidden bg-[#001A23]">
        <div className="mx-auto grid max-w-[90rem] lg:grid-cols-2 lg:items-center">
          <div className="relative z-10 px-6 py-20 sm:px-12 lg:px-16 lg:py-24">
            <p className="text-sm font-semibold tracking-widest text-amber-400 uppercase">
              Industry &amp; Partnerships
            </p>
            <h1 className="mt-4 max-w-lg font-serif text-3xl leading-tight font-bold text-white sm:text-4xl lg:text-5xl">
              Industry Connect
            </h1>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-white/70 sm:text-base">
              Partner with CoE-BIRD to move robotics research from the lab into real-world impact —
              through sponsored projects, shared infrastructure, and direct engagement with our
              students and faculty.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#opportunities"
                className="rounded border border-amber-400 bg-amber-400/10 px-5 py-2.5 text-sm font-medium text-amber-400 transition-colors hover:bg-amber-400/20"
              >
                Explore Collaboration
              </a>
              <a
                href="#start-collaboration"
                className="rounded border border-white/20 px-5 py-2.5 text-sm font-medium text-white/90 transition-colors hover:border-amber-400/60 hover:text-amber-400"
              >
                Contact Us
              </a>
            </div>
          </div>

          <div className="relative h-72 w-full sm:h-96 lg:h-[32rem]">
            <Image
              src="/Assets/research_images/industry_robot.png"
              alt="Autonomous mobile robot developed at CoE-BIRD, IIT Delhi"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#001A23] to-transparent lg:bg-gradient-to-r" />
          </div>
        </div>
      </section>

      {/* Why Partner With Us */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-[75rem] px-5">
          <div className="text-center">
            <h2 className="font-serif text-2xl font-bold text-[#001A23] sm:text-3xl">
              Why Partner With Us
            </h2>
            <div className="mx-auto mt-2 h-0.5 w-12 bg-amber-400" />
          </div>

          <div className="mx-auto mt-12 grid max-w-3xl gap-10 sm:grid-cols-3">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center border border-amber-200 bg-amber-50/60">
                  <pillar.icon size={20} className="text-amber-700" strokeWidth={1.75} />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-[#001A23]">{pillar.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collaboration Opportunities */}
      <section id="opportunities" className="scroll-mt-20 bg-gray-50 py-20">
        <div className="mx-auto max-w-[75rem] px-5">
          <div className="text-center">
            <h2 className="font-serif text-2xl font-bold text-[#001A23] sm:text-3xl">
              Collaboration Opportunities
            </h2>
            <div className="mx-auto mt-2 h-0.5 w-12 bg-amber-400" />
            <p className="mt-3 text-sm text-gray-600">
              Illustrative starting points — every engagement is scoped to fit your goals.
            </p>
          </div>

          <IndustryTiers />
        </div>
      </section>

      {/* Collaborations / Partners -- real logos, existing component */}
      <Collaborators />

      {/* Start a Collaboration */}
      <section id="start-collaboration" className="scroll-mt-20 bg-gray-50 py-20">
        <div className="mx-auto grid max-w-[75rem] gap-10 px-5 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#001A23] sm:text-3xl">
              Start a Collaboration
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Let&apos;s build something together — reach out and we&apos;ll get back to you to
              start the conversation.
            </p>

            <a
              href="mailto:robotics@iitd.ac.in"
              className="mt-6 flex items-center gap-2 text-sm font-medium text-[#001A23] hover:text-amber-700"
            >
              <Mail size={16} className="text-amber-600" />
              robotics@iitd.ac.in
            </a>

            <Link
              href="/contact"
              className="mt-3 inline-block text-sm text-gray-500 underline underline-offset-2 hover:text-amber-700"
            >
              Or use our general contact page →
            </Link>
          </div>

          <div className="border-t-2 border-amber-400 bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <IndustryContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
