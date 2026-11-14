import Link from 'next/link';
import PageHeading from '@/components/ui/PageHeading';
import SectionHeading from '@/components/ui/SectionHeading';
import { buildMetadata } from '@/lib/metadata';
import BuildoffArenaAnimation from '@/components/sections/events/BuildoffArenaAnimation';

export const metadata = buildMetadata({
  title: 'BuildOff 2026 — The Autonomous Garbage-Collecting Robot Challenge',
  description:
    'Autonomy for a Better Tomorrow. Join CoE-BIRD IIT Delhi’s five-month robotics buildathon (December 2026 – May 2027) to design, simulate, and build an autonomous mobile manipulator.',
  path: '/events/buildoff',
});

const CHALLENGE_STEPS = [
  {
    step: '01',
    title: 'Find and classify',
    description:
      'Spot every item in the arena and accurately distinguish garbage from living plants.',
  },
  {
    step: '02',
    title: 'Pick and bin',
    description:
      'Lift cans, cups, and bottles into a 10 L onboard bin, including items located on raised ground accessed via a ramp.',
  },
  {
    step: '03',
    title: 'Never collide',
    description:
      'Navigate safely without colliding with arena walls, plants, people, or moving obstacles.',
  },
  {
    step: '04',
    title: 'Empty when full',
    description:
      'Autonomously return to and dock at the base station, tip collected waste into its bin, and resume clearing.',
  },
  {
    step: '05',
    title: 'Finish at rest',
    description: 'Once the entire arena is clear of waste, return and park cleanly at the station.',
  },
];

const TIMELINE_PHASES = [
  {
    date: 'December 2026',
    title: 'Launch & Registration',
    badge: 'Phase 1',
    description:
      'Event launch and registration opens for all IIT Delhi students (teams of 3–5 members).',
  },
  {
    date: 'January 2027',
    title: 'Round 1 & 2: Ideas and Design',
    badge: 'Phase 2',
    description:
      'Conceptual pitch sessions, mechanical & electrical design reviews, and technical talks from industry partners.',
  },
  {
    date: 'March 2027',
    title: 'Round 3: Simulation Round',
    badge: 'Phase 3',
    description:
      'Teams validate autonomous navigation, perception, and manipulation pipelines in simulation before an expert judging panel.',
  },
  {
    date: 'April 2027',
    title: 'Round 4: The Build (Finalist Phase)',
    badge: 'Phase 4',
    description:
      'Top 3 finalist teams receive hardware support, component store access, and 1-on-1 industry engineer mentorship over a six-week hardware build.',
  },
  {
    date: 'May 2027',
    title: 'Round 5: Final Demonstration',
    badge: 'Finale',
    description:
      'Live autonomous arena trials at IIT Delhi before faculty, government bodies, waste-management leaders, and robotics startups.',
  },
];

export default function BuildoffPage() {
  return (
    <div className="bg-gray-50 pb-20">
      <PageHeading eyebrow="CoE-BIRD Flagship Challenge" title="BuildOff 2026" />

      {/* 1. HERO SECTION */}
      <section className="mx-auto max-w-[75rem] px-5 pt-4 pb-12">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#001A23] via-[#002836] to-slate-900 px-8 py-14 text-white shadow-2xl sm:px-14 lg:flex lg:items-center lg:justify-between lg:gap-12">
          <div className="relative z-10 lg:w-3/5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-block rounded-full bg-amber-400 px-4 py-1 text-xs font-extrabold tracking-wider text-[#001A23] uppercase">
                December 2026 – May 2027
              </span>
              <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold text-amber-300 backdrop-blur-sm">
                Open to all IIT Delhi Students • Teams of 3–5
              </span>
            </div>

            <p className="mt-6 text-sm font-bold tracking-widest text-amber-400 uppercase">
              Autonomy for a Better Tomorrow
            </p>
            <h2 className="mt-2 font-serif text-3xl leading-tight font-extrabold tracking-tight sm:text-5xl">
              The Autonomous Garbage-Collecting Robot Challenge
            </h2>
            <p className="mt-4 max-w-2xl text-base text-gray-300 sm:text-lg">
              Built for the real world: design, simulate, and build a full autonomous mobile
              manipulator that could one day keep railway platforms, campuses, and parks clean.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/events/buildoff/register"
                className="rounded-lg bg-amber-400 px-7 py-3.5 text-sm font-bold text-[#001A23] transition-colors hover:bg-amber-300"
              >
                Register Your Team
              </Link>
              <a
                href="#the-challenge"
                className="rounded-lg border border-white/25 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Explore the Challenge
              </a>
              <a
                href="#sponsorship"
                className="rounded-lg border border-amber-400/40 px-7 py-3.5 text-sm font-semibold text-amber-300 transition-colors hover:bg-amber-400/10"
              >
                Become a Sponsor
              </a>
            </div>
          </div>

          {/* Vector Illustration of Mobile Manipulator (AMR + Robotic Arm + 10L Bin) */}
          <div className="relative z-10 mt-12 flex justify-center lg:mt-0 lg:w-2/5">
            <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <svg
                viewBox="0 0 320 240"
                className="h-auto w-full drop-shadow-lg"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line x1="10" y1="215" x2="310" y2="215" stroke="#FBBF24" strokeWidth="3" />
                <rect
                  x="35"
                  y="75"
                  width="85"
                  height="60"
                  rx="4"
                  fill="#1E293B"
                  stroke="#475569"
                  strokeWidth="2"
                />
                <rect x="30" y="70" width="95" height="8" rx="3" fill="#334155" />
                <text x="55" y="110" fill="#94A3B8" fontSize="11" fontWeight="bold">
                  10L BIN
                </text>
                <rect x="130" y="55" width="8" height="80" fill="#1E293B" />
                <rect
                  x="120"
                  y="42"
                  width="28"
                  height="18"
                  rx="4"
                  fill="#0F172A"
                  stroke="#38BDF8"
                  strokeWidth="2"
                />
                <circle cx="134" cy="51" r="4" fill="#38BDF8" />
                <rect x="25" y="135" width="185" height="55" rx="10" fill="#F59E0B" />
                <line
                  x1="85"
                  y1="152"
                  x2="95"
                  y2="172"
                  stroke="#001A23"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <line
                  x1="100"
                  y1="152"
                  x2="110"
                  y2="172"
                  stroke="#001A23"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <line
                  x1="115"
                  y1="152"
                  x2="125"
                  y2="172"
                  stroke="#001A23"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <path
                  d="M165 135 L215 45 L275 140"
                  stroke="#FBBF24"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="165" cy="135" r="12" fill="#1E293B" stroke="#FBBF24" strokeWidth="3" />
                <circle cx="215" cy="45" r="10" fill="#1E293B" stroke="#FBBF24" strokeWidth="3" />
                <circle cx="275" cy="140" r="9" fill="#1E293B" stroke="#FBBF24" strokeWidth="3" />
                <path
                  d="M275 148 L263 172 M275 148 L287 172"
                  stroke="#1E293B"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <rect x="264" y="175" width="22" height="32" rx="3" fill="#EA580C" />
                <circle cx="65" cy="190" r="24" fill="#0F172A" stroke="#334155" strokeWidth="4" />
                <circle cx="65" cy="190" r="10" fill="#F59E0B" />
                <circle cx="165" cy="190" r="24" fill="#0F172A" stroke="#334155" strokeWidth="4" />
                <circle cx="165" cy="190" r="10" fill="#F59E0B" />
              </svg>
              <p className="mt-3 text-center text-xs text-gray-300">
                Autonomous Mobile Manipulator with 10 L Onboard Bin & Vision Mast
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHAT, THEME & WHO */}
      <section className="mx-auto max-w-[75rem] px-5 py-8">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-gray-100">
            <span className="text-xs font-bold tracking-wider text-amber-600 uppercase">
              What is it?
            </span>
            <h3 className="mt-1 text-xl font-bold text-[#001A23]">5-Month Robotics Buildathon</h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Organized by CoE-BIRD at IIT Delhi, BuildOff 2026 takes students through five rigorous
              rounds—filtering from initial concept and simulation to building a physical mobile
              manipulator validated on real hardware.
            </p>
          </div>

          <div className="rounded-2xl border-b-4 border-amber-400 bg-white p-7 shadow-sm ring-1 ring-gray-100">
            <span className="text-xs font-bold tracking-wider text-amber-600 uppercase">Theme</span>
            <h3 className="mt-1 text-xl font-bold text-[#001A23]">Autonomy for Public Spaces</h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              In step with the Swachh Bharat Mission, teams build embodied, physically intelligent
              robots capable of finding, classifying, picking, and binning litter in unstructured
              environments.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-gray-100">
            <span className="text-xs font-bold tracking-wider text-amber-600 uppercase">
              Who is it for?
            </span>
            <h3 className="mt-1 text-xl font-bold text-[#001A23]">IIT Delhi Students (3–5/Team)</h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Open to all undergraduate, postgraduate, and PhD students at IIT Delhi across
              engineering, design, and sciences. Form multidisciplinary teams of 3 to 5 builders.
            </p>
          </div>
        </div>
      </section>

      {/* 3. THE CHALLENGE, ARENA & RULES */}
      <section id="the-challenge" className="mx-auto max-w-[75rem] px-5 py-12">
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
            {/* EXPANDED PREMIUM PRIZES CARD */}
            <div className="group relative flex flex-1 flex-col justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#001A23] to-slate-900 p-8 shadow-xl sm:p-10">
              {/* Background ambient glow */}
              <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl transition-colors duration-500 group-hover:bg-amber-400/20" />

              {/* Premium Trophy SVG positioned absolutely */}
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
                  {/* Base */}
                  <path d="M70 170 L130 170 L140 190 L60 190 Z" fill="url(#goldGrad)" />
                  <rect x="75" y="150" width="50" height="20" fill="#B45309" />
                  <path d="M85 150 L115 150 L105 100 L95 100 Z" fill="url(#goldLight)" />
                  {/* Cup */}
                  <path
                    d="M50 40 C50 100 80 120 100 120 C120 120 150 100 150 40 Z"
                    fill="url(#goldGrad)"
                  />
                  <ellipse cx="100" cy="40" rx="50" ry="15" fill="#FEF08A" />
                  <ellipse cx="100" cy="42" rx="40" ry="10" fill="#B45309" />
                  {/* Handles */}
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
                  {/* Sparkles */}
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

            {/* Hardware Support & Perks */}
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
      </section>

      {/* 4. EVENT TIMELINE (DEC 2026 - MAY 2027) */}
      <section className="mx-auto max-w-[75rem] px-5 py-12">
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
      </section>

      {/* 5. BECOME A SPONSOR - UPDATED TO DARK THEME */}
      <section id="sponsorship" className="mx-auto max-w-[75rem] px-5 py-12">
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
      </section>

      {/* 6. SOCIAL MEDIA UPDATES & EVENT GALLERY */}
      <section className="mx-auto max-w-[75rem] px-5 py-12">
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
      </section>

      {/* 7. FAQs */}
      <section className="mx-auto max-w-[54rem] px-5 py-12">
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
      </section>

      {/* 8. CURRENT PARTNERS & REGISTRATION CTA */}
      <section className="border-t border-gray-200 bg-white py-16">
        <div className="mx-auto max-w-[75rem] px-5">
          {/* Current Partners */}
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

          {/* CTA routing to new registration page */}
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
      </section>

      {/* 9. POINTS OF CONTACT */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-[75rem] px-5">
          <SectionHeading title="Points of Contact" />
          <p className="mt-2 text-sm text-gray-600">
            For event clarifications, rule queries, or sponsorship packages.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {/* Coordinator */}
            <div className="rounded-2xl border-t-4 border-amber-400 bg-white p-7 shadow-sm ring-1 ring-gray-100">
              <p className="text-xs font-bold tracking-wider text-amber-600 uppercase">
                Coordinator
              </p>
              <p className="mt-2 text-lg font-bold text-[#001A23]">Prof. Shubhendu Bhasin</p>
              <p className="text-sm text-gray-600">Professor, Electrical Engineering</p>
              <div className="mt-4 space-y-1 text-sm text-gray-600">
                <p>
                  Email:{' '}
                  <a href="mailto:sbhasin@ee.iitd.ac.in" className="text-amber-700 hover:underline">
                    sbhasin@ee.iitd.ac.in
                  </a>
                </p>
                <p>Tel: +91-11-2659-1124</p>
              </div>
            </div>

            {/* Student Coordinator */}
            <div className="rounded-2xl border-t-4 border-amber-400 bg-white p-7 shadow-sm ring-1 ring-gray-100">
              <p className="text-xs font-bold tracking-wider text-amber-600 uppercase">
                Student Coordinator
              </p>
              <p className="mt-2 text-lg font-bold text-[#001A23]">Vijayant Singh</p>
              <p className="text-sm text-gray-600">CoE-BIRD, IIT Delhi</p>
              <div className="mt-4 space-y-1 text-sm text-gray-600">
                <p>
                  Email:{' '}
                  <a href="mailto:jrb252024@iitd.ac.in" className="text-amber-700 hover:underline">
                    jrb252024@iitd.ac.in
                  </a>
                </p>
                <p>Phone: +91 73184 70477</p>
              </div>
            </div>

            {/* General & Partnerships */}
            <div className="rounded-2xl border-t-4 border-amber-400 bg-white p-7 shadow-sm ring-1 ring-gray-100">
              <p className="text-xs font-bold tracking-wider text-amber-600 uppercase">
                General & Partnerships
              </p>
              <p className="mt-2 text-lg font-bold text-[#001A23]">CoE-BIRD Office</p>
              <p className="text-sm text-gray-600">IIT Delhi, Hauz Khas, New Delhi</p>
              <div className="mt-4 space-y-1 text-sm text-gray-600">
                <p>
                  Partner Desk:{' '}
                  <a href="mailto:robotics@iitd.ac.in" className="text-amber-700 hover:underline">
                    robotics@iitd.ac.in
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
