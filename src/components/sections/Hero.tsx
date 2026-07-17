import Link from "next/link";
import HeroPointCloud from "@/components/sections/hero/HeroPointCloud";

const MISSION_STATEMENT = "Pushing the frontiers of Robotics and AI";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#001A23] lg:min-h-[88vh]">
      {/* Text: normal flow on mobile (renders first, above the canvas),
          absolutely overlaid on desktop */}
      <div className="relative z-10 flex w-full flex-col justify-center px-6 py-16 sm:px-12 lg:min-h-[88vh] lg:w-[52%] lg:px-16 lg:py-24">
        <p className="text-sm font-semibold tracking-widest text-amber-400 uppercase">
          Our Mission
        </p>
        <h1 className="font-serif mt-4 max-w-lg text-3xl leading-tight font-bold text-white sm:text-4xl lg:text-5xl">
          {MISSION_STATEMENT}
        </h1>
        <p className="mt-6 max-w-md text-sm leading-relaxed text-white/70 sm:text-base">
          The Centre of Excellence on Biologically Inspired Robots and Drones at IIT Delhi —
          building intelligent systems that sense, learn, and act in the real world.
        </p>

        <Link
          href="/research/themes"
          className="mt-10 w-fit rounded border border-white/20 px-5 py-2.5 text-sm font-medium text-white/90 transition-colors hover:border-amber-400/60 hover:text-amber-400"
        >
          Explore Our Research →
        </Link>
      </div>

      {/* Point cloud: centered block below the text on mobile,
          full-bleed absolute background (shifted right) on desktop */}
      <HeroPointCloud />
    </section>
  );
}