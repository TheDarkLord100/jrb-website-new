import Link from 'next/link';
import SectionHeading from '@/components/ui/SectionHeading';
import { buildMetadata } from '@/lib/metadata';
import BuildoffArenaAnimation from '@/components/sections/events/BuildoffArenaAnimation';
import AnnouncementSidebar from '@/components/sections/events/AnnouncementSidebar';
import { getAnnouncementsByType } from '@/lib/supabase/queries';
import { Mail, Phone } from 'lucide-react';
import Card from '@/components/ui/Card';

const BROCHURE_URL =
  'https://knoflbvmblkqbynlxsrp.supabase.co/storage/v1/object/public/documents/events/buildoff_brochure.pdf';

export const metadata = buildMetadata({
  title: 'BuildOff 2026 — The Autonomous Garbage-Collecting Robot Challenge',
  description:
    'Autonomy for a Better Tomorrow. Join CoE-BIRD IIT Delhi’s five-month robotics buildathon (December 2026 – May 2027) to design, simulate, and build an autonomous mobile manipulator.',
  path: '/events/buildoff',
});

// const CHALLENGE_STEPS = [
//   {
//     step: '01',
//     title: 'Find and classify',
//     description:
//       'Spot every item in the arena and accurately distinguish garbage from living plants.',
//   },
//   {
//     step: '02',
//     title: 'Pick and bin',
//     description:
//       'Lift cans, cups, and bottles into a 10 L onboard bin, including items located on raised ground accessed via a ramp.',
//   },
//   {
//     step: '03',
//     title: 'Never collide',
//     description:
//       'Navigate safely without colliding with arena walls, plants, people, or moving obstacles.',
//   },
//   {
//     step: '04',
//     title: 'Empty when full',
//     description:
//       'Autonomously return to and dock at the base station, tip collected waste into its bin, and resume clearing.',
//   },
//   {
//     step: '05',
//     title: 'Finish at rest',
//     description: 'Once the entire arena is clear of waste, return and park cleanly at the station.',
//   },
// ];

// const TIMELINE_PHASES = [
//   {
//     date: 'December 2026',
//     title: 'Launch & Registration',
//     badge: 'Phase 1',
//     description:
//       'Event launch and registration opens for all IIT Delhi students (teams of 3–5 members).',
//   },
//   {
//     date: 'January 2027',
//     title: 'Round 1 & 2: Ideas and Design',
//     badge: 'Phase 2',
//     description:
//       'Conceptual pitch sessions, mechanical & electrical design reviews, and technical talks from industry partners.',
//   },
//   {
//     date: 'March 2027',
//     title: 'Round 3: Simulation Round',
//     badge: 'Phase 3',
//     description:
//       'Teams validate autonomous navigation, perception, and manipulation pipelines in simulation before an expert judging panel.',
//   },
//   {
//     date: 'April 2027',
//     title: 'Round 4: The Build (Finalist Phase)',
//     badge: 'Phase 4',
//     description:
//       'Top 3 finalist teams receive hardware support, component store access, and 1-on-1 industry engineer mentorship over a six-week hardware build.',
//   },
//   {
//     date: 'May 2027',
//     title: 'Round 5: Final Demonstration',
//     badge: 'Finale',
//     description:
//       'Live autonomous arena trials at IIT Delhi before faculty, government bodies, waste-management leaders, and robotics startups.',
//   },
// ];

const PHASE_1_TIMELINE = [
  {
    when: 'December',
    title: 'Registration',
    note: 'Opens in December. Exact dates will be announced here.',
  },
  {
    when: 'Late Dec – early Jan',
    title: 'Round 1',
    note: 'Evaluated in the first week of January.',
  },
  {
    when: 'January',
    title: 'Round 2',
    note: 'Document submission, due 28 January.',
  },
  {
    when: 'February',
    title: 'Round 3A',
    note: 'SLAM. A feedback round: no team is eliminated.',
  },
  {
    when: 'Late Feb – mid-Mar',
    title: 'Round 3B',
    note: 'Perception and the full task, due 14 March.',
  },
  {
    when: 'Mid-March',
    title: 'Phase 1 results',
    note: 'Announced after Round 3B evaluation.',
  },
];

const COMING_SOON = [
  { title: 'Registration', note: 'Opens in December 2026.' },
  { title: 'Rulebook', note: 'Rounds, deliverables, scoring and exact dates.' },
  { title: 'Challenge & arena', note: 'The full mission and arena layout.' },
  { title: 'Knowledge sessions', note: 'ROS 2, SLAM and perception, alongside the rounds.' },
  { title: 'FAQ', note: 'Answers to common questions about taking part.' },
];

export default async function BuildoffPage() {
  const announcements = await getAnnouncementsByType('buildoff');

  return (
    <div className="bg-gray-50 pb-20">
      {/* 1. HERO */}
      <section className="relative w-full overflow-hidden border-b border-[#E4DFD2] bg-[#FAF7EF]">
        <div className="absolute inset-x-0 top-0 h-1 bg-[#FFC433]" />
        <img
          src="/Assets/buildoff/buildoff-circuit-pattern.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 right-0 hidden w-[640px] lg:block"
        />

        <div className="relative mx-auto grid max-w-[75rem] items-center gap-10 px-6 py-14 sm:px-12 lg:min-h-[72vh] lg:grid-cols-[1.1fr_1fr] lg:px-16 lg:py-20">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-amber-700 uppercase">
              CoE-BIRD · IIT Delhi
            </p>
            <h1 className="mt-5">
              <span className="sr-only">BuildOff 2026</span>
              <img
                src="/Assets/buildoff/buildoff-logo.svg"
                alt=""
                aria-hidden="true"
                className="h-16 w-auto sm:h-20"
              />
            </h1>
            <p className="mt-6 max-w-lg font-serif text-2xl leading-snug font-bold text-[#23232A] sm:text-3xl">
              Autonomy for a better tomorrow
            </p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-600 sm:text-base">
              Form a team, build an autonomous robot and prove it in simulation. This year&apos;s
              challenge: a robot that keeps public spaces clean by finding and collecting litter on
              its own.
            </p>
            <p className="mt-6 text-sm font-semibold text-[#23232A]">
              Phase 1 · December 2026 – March 2027
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#about"
                className="bg-[#23232A] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-black"
              >
                Explore the challenge <span className="text-[#FFC433]">→</span>
              </a>
              <a
                href="#sponsorship"
                className="border border-[#23232A]/25 px-6 py-3 text-sm font-semibold text-[#23232A] transition-colors hover:border-amber-500 hover:text-amber-700"
              >
                Partner with us
              </a>
            </div>
            <p className="mt-4 text-xs font-semibold tracking-wide text-gray-500 uppercase">
              Registration opens Dec 2026
            </p>
          </div>

          <div className="flex justify-center lg:justify-end">
            <img
              src="/Assets/buildoff/buildoff-robot.svg"
              alt=""
              aria-hidden="true"
              className="h-auto w-full max-w-[240px] sm:max-w-[380px] lg:max-w-[480px]"
            />
          </div>
        </div>
      </section>

      {/* 2. ABOUT + ANNOUNCEMENTS */}
      <section id="about" className="mx-auto max-w-[75rem] px-5 py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-amber-700 uppercase">
              About the challenge
            </p>
            <h2 className="mt-3 font-serif text-2xl font-bold text-[#001A23] sm:text-3xl">
              Build a robot that cleans up on its own
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base">
              Your team designs an autonomous mobile manipulator: a wheeled robot with an arm that
              searches an arena for litter, tells it apart from plants, picks it up and drops it in
              a bin, with no one at the controls.
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base">
              You don&apos;t need any hardware to take part. Phase 1 runs entirely in simulation, so
              a laptop is all you need to get started.
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {/* Phase 1: confirmed */}
              <div className="flex flex-col border-t-2 border-[#FFC433] bg-white shadow-sm ring-1 ring-gray-100">
                <div className="flex h-56 items-center justify-center bg-[#FAF7EF] p-5">
                  <img
                    src="/Assets/buildoff/buildoff-robot-simulation.svg"
                    alt="Line drawing of the robot on a simulation grid"
                    className="max-h-full max-w-full"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold tracking-[0.15em] text-amber-700 uppercase">
                      Phase 1 · Simulation
                    </p>
                    <span className="text-xs font-semibold text-gray-400">Dec – Mar</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    Every team builds and tests its robot in simulation, across four rounds. Phase 1
                    has its own results.
                  </p>
                </div>
              </div>

              {/* Phase 2: planned, deliberately muted */}
              <div className="flex flex-col border border-dashed border-gray-300 bg-white/60">
                <div className="flex h-56 items-center justify-center p-5">
                  <img
                    src="/Assets/buildoff/buildoff-robot-hardware.svg"
                    alt="Illustration of the finished hardware robot"
                    className="max-h-full max-w-full opacity-60 grayscale-[40%]"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold tracking-[0.15em] text-gray-500 uppercase">
                      Phase 2 · Hardware
                    </p>
                    <span className="bg-gray-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-gray-500 uppercase">
                      To be announced
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    A hardware phase is planned to follow. Details will be announced after Phase 1.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <aside className="lg:pt-1">
            <AnnouncementSidebar
              type="buildoff"
              heading="Announcements"
              emptyText="Updates will appear here as the challenge goes on."
              initialItems={announcements}
            />
          </aside>
        </div>
      </section>

      {/* <section id="the-challenge" className="mx-auto max-w-[75rem] px-5 py-12">
        <SectionHeading title="The Challenge: Clear the Arena, Autonomously" />

        <div className="mt-8">
          <BuildoffArenaAnimation />
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-8 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
            <div>
              <h3 className="text-xl font-bold text-[#001A23]">5-Stage Autonomous Mission</h3>
              <p className="mt-2 text-sm text-gray-600">
                Your robot must autonomously clear an arena containing scattered garbage (cans,
                cups, bottles), living plants to avoid, a raised platform with a ramp, and a home
                docking station.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {CHALLENGE_STEPS.map((item) => (
                <div
                  key={item.step}
                  className="rounded-xl border border-gray-100 bg-gray-50/70 p-4 transition-colors hover:border-amber-300"
                >
                  <span className="text-xs font-extrabold text-amber-600">STEP {item.step}</span>
                  <h4 className="mt-1 font-bold text-[#001A23]">{item.title}</h4>
                  <p className="mt-1 text-xs leading-relaxed text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-gray-200 bg-[#001A23] p-6 text-white">
              <h4 className="text-sm font-bold tracking-wider text-amber-400 uppercase">
                Arena Elements Overview
              </h4>
              <div className="mt-4 grid grid-cols-2 gap-4 text-xs sm:grid-cols-4">
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 shrink-0 rounded-sm bg-orange-500" />
                  <span>Garbage (Cans, Cups, Bottles)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 shrink-0 rounded-full bg-emerald-500" />
                  <span>Plants (Strict Avoidance)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 shrink-0 rounded-sm border border-amber-400 bg-amber-400/30" />
                  <span>Docking & Tipping Station</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 shrink-0 rounded-sm bg-gray-300" />
                  <span>Raised Area with Ramp</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="group relative flex flex-1 flex-col justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#001A23] to-slate-900 p-8 shadow-xl sm:p-10">
              <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl transition-colors duration-500 group-hover:bg-amber-400/20" />

              <div className="pointer-events-none absolute -right-6 -bottom-10 w-48 opacity-90 transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-105 sm:w-60">
                <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient
                      id="goldGrad"
                      x1="0"
                      y1="0"
                      x2="200"
                      y2="200"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#FDE047" />
                      <stop offset="0.5" stopColor="#F59E0B" />
                      <stop offset="1" stopColor="#B45309" />
                    </linearGradient>
                    <linearGradient
                      id="goldLight"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="200"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#FEF08A" />
                      <stop offset="1" stopColor="#F59E0B" />
                    </linearGradient>
                  </defs>
                  
                  <path d="M70 170 L130 170 L140 190 L60 190 Z" fill="url(#goldGrad)" />
                  <rect x="75" y="150" width="50" height="20" fill="#B45309" />
                  <path d="M85 150 L115 150 L105 100 L95 100 Z" fill="url(#goldLight)" />
                  <path
                    d="M50 40 C50 100 80 120 100 120 C120 120 150 100 150 40 Z"
                    fill="url(#goldGrad)"
                  />
                  <ellipse cx="100" cy="40" rx="50" ry="15" fill="#FEF08A" />
                  <ellipse cx="100" cy="42" rx="40" ry="10" fill="#B45309" />
                  <path
                    d="M55 55 C30 55 20 85 45 95"
                    stroke="url(#goldGrad)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M145 55 C170 55 180 85 155 95"
                    stroke="url(#goldGrad)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M40 20 L45 30 L55 35 L45 40 L40 50 L35 40 L25 35 L35 30 Z"
                    fill="#FEF08A"
                  />
                  <path
                    d="M160 10 L163 18 L171 21 L163 24 L160 32 L157 24 L149 21 L157 18 Z"
                    fill="#FEF08A"
                  />
                </svg>
              </div>

              <div className="relative z-10 max-w-[70%] sm:max-w-[75%]">
                <h3 className="text-2xl font-extrabold text-amber-400 sm:text-3xl">
                  Prizes & Named Awards
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-gray-300 sm:text-base">
                  Cash prizes, partner-named excellence awards (including{' '}
                  <em className="font-semibold text-white">Best Navigation</em>), and pilot
                  deployment opportunities are being finalized!
                </p>
                <div className="mt-8 inline-flex items-center gap-2 rounded-lg border border-amber-400/30 bg-amber-400/10 px-4 py-2.5 text-xs font-bold tracking-wider text-amber-400 uppercase backdrop-blur-md">
                  🏆 Prize Pool To Be Announced Soon
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-gray-100">
              <h3 className="text-lg font-bold text-[#001A23]">Hardware Support & Perks</h3>
              <ul className="mt-4 space-y-2.5 text-sm text-gray-600">
                <li>
                  🔧 <strong>Finalist Build Support:</strong> The 3 finalist teams build their
                  robots using parts sourced from approved Indian component stores, plus exclusive
                  discount codes for every participating team.
                </li>
                <li>
                  👨‍🏫 <strong>1-on-1 Industry Mentorship:</strong> Finalist teams are paired with a
                  dedicated engineer from our Gold/Platinum partners throughout the 6-week build.
                </li>
                <li>
                  📄 <strong>Official Résumé Book:</strong> CVs of participating students shared
                  directly with hiring robotics startups.
                </li>
                <li>
                  👕 <strong>Goodies & Swag:</strong> Team T-shirts, tech & hiring talks in Rounds 1
                  & 2, and feature reels.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section> */}

      {/* <section className="mx-auto max-w-[75rem] px-5 py-12">
        <SectionHeading title="Five-Month Event Timeline" />
        <div className="mt-8 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
          <div className="relative ml-3 space-y-8 border-l-2 border-amber-400 md:ml-6">
            {TIMELINE_PHASES.map((item, idx) => (
              <div key={idx} className="relative pl-8">
                <span className="absolute top-1.5 -left-[9px] h-4 w-4 rounded-full bg-amber-400 ring-4 ring-white" />
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-[#001A23] px-2.5 py-0.5 text-xs font-bold text-amber-400">
                    {item.badge}
                  </span>
                  <span className="text-sm font-bold text-amber-700">{item.date}</span>
                </div>
                <h4 className="mt-1 text-lg font-bold text-[#001A23]">{item.title}</h4>
                <p className="mt-1 text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* 3. TIMELINE */}
      <section id="timeline" className="mx-auto max-w-[75rem] px-5 py-16">
        <SectionHeading title="Timeline" />

        <div className="border-t-2 border-[#FFC433] bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-xs font-semibold tracking-[0.15em] text-amber-700 uppercase">
              Phase 1 · Simulation
            </p>
            <p className="text-xs font-semibold text-gray-400">December 2026 – March 2027</p>
          </div>

          <ol className="mt-6 grid gap-6 border-l-2 border-[#FFC433] pl-6 lg:grid-cols-6 lg:gap-4 lg:border-t-2 lg:border-l-0 lg:pt-6 lg:pl-0">
            {PHASE_1_TIMELINE.map((item) => (
              <li key={item.title} className="relative">
                <span className="absolute top-1 -left-[31px] h-3 w-3 rounded-full bg-[#FFC433] ring-4 ring-white lg:-top-[31px] lg:left-0" />
                <p className="text-xs font-semibold text-amber-700">{item.when}</p>
                <p className="mt-1 font-serif font-bold text-[#001A23]">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">{item.note}</p>
              </li>
            ))}
          </ol>

          <p className="mt-8 border-t border-gray-100 pt-5 text-sm text-gray-500">
            Knowledge sessions on ROS 2, SLAM and perception run alongside the rounds. Exact dates,
            deliverables and evaluation criteria for every round will be set out in the rulebook{' '}
            <span className="font-semibold text-gray-600">(coming soon)</span>.
          </p>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border border-dashed border-gray-300 bg-white/60 px-6 py-5 sm:px-8">
          <div>
            <p className="text-xs font-semibold tracking-[0.15em] text-gray-500 uppercase">
              Phase 2 · Hardware
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Planned to follow Phase 1. Details will be announced with the Phase 1 results.
            </p>
          </div>
          <span className="bg-gray-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-gray-500 uppercase">
            To be Announced
          </span>
        </div>
      </section>

      {/* <section id="sponsorship" className="mx-auto max-w-[75rem] px-5 py-12">
        <SectionHeading title="Partner With BuildOff 2026" />

        <div className="mt-8 flex flex-col items-center justify-center rounded-3xl bg-[#001A23] p-8 text-center text-white shadow-xl sm:p-14">
          <span className="mb-4 inline-block rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-semibold tracking-wider text-amber-400 uppercase">
            Corporate & Institutional Sponsorships
          </span>
          <h3 className="text-2xl font-bold text-white sm:text-3xl">
            Support the Next Generation of Robotics
          </h3>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-300">
            One partnership, five months of presence: from launch day in December 2026 to the final
            arena demonstration in May 2027. Tailored value for{' '}
            <strong className="text-white">Robotics Startups</strong>,{' '}
            <strong className="text-white">Component Platforms</strong>,{' '}
            <strong className="text-white">Waste Management Organisations (CSR)</strong>, and{' '}
            <strong className="text-white">Government Bodies</strong>.
          </p>

          <div className="mt-8">
            <a
              href="/assets/docs/BuildOff_2026_Sponsorship_Brochure.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-lg bg-amber-400 px-8 py-3.5 text-sm font-bold text-[#001A23] transition-colors hover:bg-amber-300"
            >
              Download Sponsorship Brochure
            </a>
          </div>

          <p className="mt-8 max-w-xl text-xs text-gray-400">
            Need a custom package or want to provide in-kind hardware support? Partners confirmed
            before registration opens get priority logo placement. Write to{' '}
            <a
              href="mailto:robotics@iitd.ac.in"
              className="font-semibold text-amber-400 hover:underline"
            >
              robotics@iitd.ac.in
            </a>
            .
          </p>
        </div>
      </section> */}

      {/* 4. PARTNER WITH US */}
      <section id="sponsorship" className="mx-auto max-w-[75rem] px-5 py-16">
        <div className="relative overflow-hidden border-t-4 border-[#FFC433] bg-[#FAF7EF] ring-1 ring-[#E4DFD2]">
          <img
            src="/Assets/buildoff/buildoff-circuit-pattern.svg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -bottom-24 hidden w-[420px] md:block"
          />

          <div className="relative flex flex-col gap-6 p-6 sm:p-10 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <p className="text-xs font-semibold tracking-[0.2em] text-amber-700 uppercase">
                For companies &amp; organisations
              </p>
              <h2 className="mt-3 font-serif text-2xl font-bold text-[#001A23] sm:text-3xl">
                Partner with BuildOff 2026
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
                Support the next generation of roboticists at IIT Delhi. Our brochure covers
                partnership options and what partners get.
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap gap-3">
              <a
                href={BROCHURE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#23232A] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-black"
              >
                Download brochure <span className="text-[#FFC433]">↓</span>
              </a>
              <a
                href="mailto:outreach.bird@iitd.ac.in?subject=BuildOff%202026%20partnership"
                className="border border-[#23232A]/25 bg-white/60 px-6 py-3 text-sm font-semibold text-[#23232A] transition-colors hover:border-amber-500 hover:text-amber-700"
              >
                Email us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 5. COMING SOON */}
      <section className="mx-auto max-w-[75rem] px-5 py-16">
        <SectionHeading eyebrow="Coming soon" title="More details on the way" />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {COMING_SOON.map((item) => (
            <li key={item.title} className="border border-dashed border-gray-300 bg-white/60 p-5">
              <p className="font-serif font-bold text-[#001A23]">{item.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-gray-500">{item.note}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-center text-sm text-gray-500">
          We&apos;ll post each one in Announcements as soon as it&apos;s out.
        </p>
      </section>

      {/* 6. SOCIAL MEDIA UPDATES & EVENT GALLERY */}
      {/* <section className="mx-auto max-w-[75rem] px-5 py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <SectionHeading title="Social Updates & Announcements" />
            <div className="mt-6 flex min-h-[320px] flex-col items-center justify-center rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-gray-100">
              <p className="text-sm font-medium text-[#001A23]">
                Follow CoE-BIRD across social channels for live round updates, simulation reels, and
                team build logs.
              </p>
              <p className="mt-2 text-xs text-gray-400">
                [Embed LinkedIn / Instagram / X Post iframe here once launch post goes live]
              </p>
            </div>
          </div>

          <div>
            <SectionHeading title="CoE-BIRD & Event Gallery" />
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="flex aspect-video items-center justify-center rounded-xl bg-gray-200 p-4 text-center text-xs font-medium text-gray-500">
                IIT Delhi Campus & CoE-BIRD Lab
              </div>
              <div className="flex aspect-video items-center justify-center rounded-xl bg-gray-200 p-4 text-center text-xs font-medium text-gray-500">
                Design & Pitch Sessions
              </div>
              <div className="flex aspect-video items-center justify-center rounded-xl bg-gray-200 p-4 text-center text-xs font-medium text-gray-500">
                Simulation Runs
              </div>
              <div className="flex aspect-video items-center justify-center rounded-xl bg-gray-200 p-4 text-center text-xs font-medium text-gray-500">
                Hardware Build & Arena Trials
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* 7. FAQs */}
      {/* <section className="mx-auto max-w-[54rem] px-5 py-12">
        <SectionHeading title="Frequently Asked Questions" />
        <div className="mt-6 space-y-4">
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <h4 className="font-bold text-[#001A23]">
              Who is eligible to participate in BuildOff 2026?
            </h4>
            <p className="mt-2 text-sm text-gray-600">
              BuildOff 2026 is open to all currently enrolled IIT Delhi students across all
              programmes (UG, PG, and PhD). Teams must have between 3 and 5 members.
            </p>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <h4 className="font-bold text-[#001A23]">
              Are we allowed to use off-board laptops for ROS / AI processing during the run?
            </h4>
            <p className="mt-2 text-sm text-gray-600">
              No. The rules require <strong>onboard compute only</strong> and{' '}
              <strong>no tethers</strong>. All vision, classification, path planning, and actuator
              control must run onboard the mobile manipulator.
            </p>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <h4 className="font-bold text-[#001A23]">
              How does hardware procurement work for the build phase?
            </h4>
            <p className="mt-2 text-sm text-gray-600">
              After Round 3 (Simulation Round) in March 2027, the three shortlisted finalist teams
              will build their physical robots in April 2027 using components bought through
              approved Indian robotics stores, supported by CoE-BIRD and partner discount codes.
            </p>
          </div>
        </div>
      </section> */}

      {/* 8. CURRENT PARTNERS & REGISTRATION CTA */}
      {/* <section className="border-t border-gray-200 bg-white py-16">
        <div className="mx-auto max-w-[75rem] px-5">
          <div className="mb-16 text-center">
            <h3 className="text-xs font-bold tracking-widest text-gray-400 uppercase">
              Current Partners Backing Hands-On Robotics at IIT Delhi
            </h3>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-8">
              <div className="flex h-20 w-48 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 px-6 text-lg font-extrabold tracking-wide text-[#001A23] shadow-sm">
                IHFC (TIH IIT Delhi)
              </div>
              <a
                href="mailto:robotics@iitd.ac.in"
                className="flex h-20 w-48 items-center justify-center rounded-xl border border-dashed border-amber-400 bg-amber-50/40 px-6 text-xs font-semibold text-amber-800 transition-colors hover:bg-amber-50"
              >
                + Your Logo Here (Partner With Us)
              </a>
            </div>
          </div>

          <div className="rounded-3xl bg-[#001A23] p-8 text-center text-white shadow-2xl sm:p-14">
            <span className="inline-block rounded-full bg-amber-400/20 px-3 py-1 text-xs font-semibold text-amber-300">
              Registration Opens December 2026
            </span>
            <h2 className="mt-3 text-3xl font-bold">Register Your Team for BuildOff 2026</h2>
            <p className="mx-auto mt-2 mb-8 max-w-2xl text-sm text-gray-300">
              Form a team of 3–5 IIT Delhi students and submit your initial details.
            </p>

            <Link
              href="/events/buildoff/register"
              className="inline-block rounded-lg bg-amber-400 px-8 py-3.5 text-base font-bold text-[#001A23] transition-colors hover:bg-amber-300"
            >
              Go to Registration Page
            </Link>
          </div>
        </div>
      </section> */}

      {/* 6. CONTACT */}
      <section className="mx-auto max-w-[75rem] px-5 py-16">
        <SectionHeading title="Points of Contact" />

        <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
          <Card>
            <p className="text-xs font-semibold tracking-[0.2em] text-amber-600 uppercase">
              Coordinator
            </p>
            <h3 className="mt-2 font-serif text-lg font-bold text-[#001A23]">
              Prof. Shubhendu Bhasin
            </h3>
            <p className="text-sm text-gray-500">Coordinator, CoE-BIRD</p>
            <ul className="mt-4 flex flex-col gap-2">
              <li>
                <a
                  href="mailto:sbhasin@ee.iitd.ac.in"
                  className="flex items-center gap-3 text-sm text-gray-700 hover:text-[#001A23]"
                >
                  <Mail size={16} className="shrink-0 text-[#001A23]" />
                  sbhasin@ee.iitd.ac.in
                </a>
              </li>
            </ul>
          </Card>

          <Card>
            <p className="text-xs font-semibold tracking-[0.2em] text-amber-600 uppercase">
              Student Coordinator
            </p>
            <h3 className="mt-2 font-serif text-lg font-bold text-[#001A23]">Vijayant Singh</h3>
            <p className="text-sm text-gray-500">M.Tech Robotics</p>
            <ul className="mt-4 flex flex-col gap-2">
              <li>
                <a
                  href="mailto:jrb252024@iitd.ac.in"
                  className="flex items-center gap-3 text-sm text-gray-700 hover:text-[#001A23]"
                >
                  <Mail size={16} className="shrink-0 text-[#001A23]" />
                  jrb252024@iitd.ac.in
                </a>
              </li>
              <li>
                <a
                  href="tel:+917318470477"
                  className="flex items-center gap-3 text-sm text-gray-700 hover:text-[#001A23]"
                >
                  <Phone size={16} className="shrink-0 text-[#001A23]" />
                  +91 73184 70477
                </a>
              </li>
            </ul>
          </Card>
        </div>
      </section>
    </div>
  );
}
