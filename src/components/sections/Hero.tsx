"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Shape mirrors the `hero_slides` table in docs/DATABASE.md so this can be
// swapped for a Supabase fetch later without changing the markup below.
type HeroSlide = {
  id: string;
  image_url: string;
  video_url?: string;
  title: string;
  description: string;
};

const MISSION_STATEMENT = "Pushing the frontiers of Robotics and AI";

const SLIDES: HeroSlide[] = [
  {
    id: "1",
    image_url: "/Assets/projects/iit.jpg",
    title: "IIT Monument Representing Interdisciplinary Robotics",
    description:
      "A symbolic representation of interdisciplinary innovation, showcasing the fusion of mechanical, electronic, and computational domains that drive advancements in robotics.",
  },
  {
    id: "2",
    image_url: "/Assets/projects/hero.png",
    video_url: "/Assets/drone.mp4",
    title: "Aerial Manipulator for Object Grasping",
    description:
      "A drone equipped with a robotic arm capable of grasping and transporting objects in hard-to-reach environments.",
  },
  {
    id: "3",
    image_url: "/Assets/projects/hero.png",
    title: "Autonomous Surveillance Robot for Campus Security",
    description:
      "An autonomous surveillance robot powered by ROS and CNN-based object detection, capable of real-time person detection, waypoint navigation, and live remote monitoring for enhanced campus security.",
  },
  {
    id: "4",
    image_url: "/Assets/projects/8-snake.png",
    title: "Bio-Inspired Snake Robot for Search and Locomotion",
    description:
      "A snake-like robot inspired by biological locomotion for efficient movement in constrained environments.",
  },
  {
    id: "5",
    image_url: "/Assets/projects/3-pick.png",
    title: "Autonomous Mobile Cobot for Pick-and-Place Operations",
    description:
      "A mobile collaborative robot capable of autonomous navigation and manipulation for pick-and-place tasks.",
  },
];

const AUTOPLAY_MS = 8000;

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const start = () => {
    stop();
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, AUTOPLAY_MS);
  };

  useEffect(() => {
    start();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const go = (index: number) => {
    setCurrent((index + SLIDES.length) % SLIDES.length);
    start();
  };

  return (
    <section className="relative h-[85vh] w-full overflow-hidden">
      {/* Mission statement, fixed above the slides */}
      <div className="absolute top-24 left-0 z-20 w-full px-6 text-center text-white sm:top-28">
        <p className="text-sm font-semibold tracking-widest text-yellow-400 uppercase">
          Our Mission
        </p>
        <h1 className="mx-auto mt-2 max-w-3xl text-2xl font-bold sm:text-4xl">
          {MISSION_STATEMENT}
        </h1>
      </div>

      {SLIDES.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === current ? "z-10 opacity-100" : "opacity-0"
          }`}
        >
          {slide.video_url ? (
            <video
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              poster={slide.image_url}
            >
              <source src={slide.video_url} type="video/mp4" />
            </video>
          ) : (
            <Image
              src={slide.image_url}
              alt={slide.title}
              fill
              priority={i === 0}
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
          <div className="absolute bottom-10 left-6 max-w-xl text-white sm:left-12">
            <h2 className="text-xl font-bold italic sm:text-2xl">{slide.title}</h2>
            <p className="mt-3 text-sm leading-relaxed sm:text-base">{slide.description}</p>
          </div>
        </div>
      ))}

      <button
        onClick={() => go(current - 1)}
        aria-label="Previous slide"
        className="absolute top-1/2 left-4 z-20 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white transition-colors hover:bg-black/50"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={() => go(current + 1)}
        aria-label="Next slide"
        className="absolute top-1/2 right-4 z-20 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white transition-colors hover:bg-black/50"
      >
        <ChevronRight size={22} />
      </button>

      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.id}
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all ${
              i === current ? "w-6 bg-yellow-400" : "w-2 bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
