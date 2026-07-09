"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

type EventItem = {
  img: string;
  alt: string;
  tag: string;
  title: string;
  summary: string;
  date: string;
  expanded: ReactNode;
};

const events: EventItem[] = [
  {
    img: "/Assets/events/60.png",
    alt: "Cobotalks 60",
    tag: "Seminar",
    title: "60th Cobotalks – Physical AI for Robotics",
    summary: "Exploring intelligent, adaptive, and context-aware robotic systems.",
    date: "March 11, 2026",
    expanded: (
      <>
        <p>
          Hosted by IHFC (TIH IIT Delhi) in collaboration with CoE-BIRD, Robotics Club, and TRS
          Student Chapter.
        </p>
        <p className="mt-3 font-semibold">Focus of the session:</p>
        <ul className="mt-1 list-disc pl-5">
          <li>Evolution of Physical AI systems</li>
          <li>Context-aware and adaptive robotics</li>
          <li>Safe human–robot interaction</li>
          <li>Learning through feedback systems</li>
        </ul>
        <p className="mt-3 font-semibold">System Architecture Covered:</p>
        <ul className="mt-1 list-disc pl-5">
          <li>Observation &amp; perception</li>
          <li>Task planning &amp; cognition</li>
          <li>Decision-making &amp; action</li>
          <li>Continuous learning</li>
        </ul>
        <p className="mt-3">
          The session highlighted how robotics is moving toward intelligent systems capable of
          operating safely in real-world environments.
        </p>
      </>
    ),
  },
  {
    img: "/Assets/events/59.png",
    alt: "Cobotalks 59",
    tag: "Seminar",
    title: "59th Cobotalks – Building Builders",
    summary: "Entrepreneurship insights on developing impactful individuals.",
    date: "February 18, 2026",
    expanded: (
      <>
        <p>
          Speaker: <strong>Meenal Majumder</strong>, Founder &amp; CEO, The Innovation Story (IHFC
          incubated startup).
        </p>
        <p className="mt-3 font-semibold">Session Highlights:</p>
        <ul className="mt-1 list-disc pl-5">
          <li>Leadership through real-world problem solving</li>
          <li>Building purpose-driven teams</li>
          <li>Innovation through experiential learning</li>
          <li>Creating impact-driven culture</li>
        </ul>
        <p className="mt-3">
          The session provided practical insights into entrepreneurship and leadership for
          students and aspiring founders.
        </p>
      </>
    ),
  },
  {
    img: "/Assets/events/58.png",
    alt: "Cobotalks 58",
    tag: "Seminar",
    title: "58th Cobotalks – Flexible Wearable Sensors",
    summary: "Advancements in wearable sensing for biomedical and soft robotics applications.",
    date: "January 14, 2026",
    expanded: (
      <>
        <p>
          Speaker: <strong>Dr. Dhiman Mallick</strong>, Associate Professor, IIT Delhi.
        </p>
        <p className="mt-3 font-semibold">Key Topics Covered:</p>
        <ul className="mt-1 list-disc pl-5">
          <li>Flexible and stretchable sensor platforms</li>
          <li>High-resolution physiological sensing</li>
          <li>Soft robotic skins and tactile interfaces</li>
          <li>Human–machine interaction systems</li>
        </ul>
        <p className="mt-3 font-semibold">Opportunities:</p>
        <ul className="mt-1 list-disc pl-5">
          <li>Live Q&amp;A interaction</li>
          <li>Internship and research collaboration discussions</li>
        </ul>
        <p className="mt-3">
          The talk demonstrated how wearable sensing technologies are shaping the future of
          biomedical systems and robotics.
        </p>
      </>
    ),
  },
];

export default function EventsAccordion() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-4">
      {events.map((event, i) => {
        const open = activeIndex === i;
        return (
          <div
            key={event.title}
            className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
          >
            <button
              onClick={() => setActiveIndex(open ? null : i)}
              className="flex w-full items-center gap-4 p-4 text-left sm:p-5"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg sm:h-20 sm:w-20">
                <Image src={event.img} alt={event.alt} fill className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="inline-block rounded-full bg-yellow-50 px-2 py-0.5 text-[10px] font-bold tracking-wide text-yellow-700 uppercase">
                  {event.tag}
                </span>
                <h3 className="mt-1 truncate font-semibold text-[#001A23]">{event.title}</h3>
                <p className="mt-0.5 truncate text-sm text-gray-500">{event.summary}</p>
                <span className="mt-1 block text-xs text-gray-400">{event.date}</span>
              </div>
              <ChevronDown
                size={20}
                className={`shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
              />
            </button>

            {open && (
              <div className="border-t border-gray-100 p-5 text-sm leading-relaxed text-gray-700">
                {event.expanded}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
