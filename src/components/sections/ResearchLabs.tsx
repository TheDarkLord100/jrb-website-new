"use client";

import Image from "next/image";
import { useState } from "react";

// Mirrors the `labs` table shape from docs/DATABASE.md (category field),
// so this can later be swapped for a Supabase fetch.
type Lab = {
  category: string;
  img: string;
  title: string;
};

const categories = [
  { key: "perception", icon: "/Assets/labs/categories/perception.png", label: "Perception & Cognition" },
  { key: "dynamics", icon: "/Assets/labs/categories/control.png", label: "Dynamics & Control" },
  { key: "human", icon: "/Assets/labs/categories/medical.png", label: "Human Centered & Medical Robotics" },
  { key: "manufacturing", icon: "/Assets/labs/categories/prototype.png", label: "Manufacturing & Prototyping" },
];

const labs: Lab[] = [
  { category: "perception", img: "/Assets/labs/vision.jpg", title: "Vision Lab" },
  { category: "perception", img: "/Assets/labs/multi.png", title: "Multi Agent Systems Lab" },
  { category: "perception", img: "/Assets/labs/swarm.jpg", title: "Swarm Intelligence Lab" },
  { category: "perception", img: "/Assets/404.jpg", title: "PAR Lab" },
  { category: "dynamics", img: "/Assets/labs/mecha.png", title: "Mechatronics Lab" },
  { category: "dynamics", img: "/Assets/labs/control.png", title: "Control Lab" },
  { category: "dynamics", img: "/Assets/labs/vehicle.jpg", title: "Vehicle Dynamics Centre" },
  { category: "human", img: "/Assets/labs/medical.png", title: "Medical Cobotics Centre" },
  { category: "human", img: "/Assets/labs/soft.png", title: "Soft Robotics Lab" },
  { category: "manufacturing", img: "/Assets/labs/fsm.png", title: "Facility for Smart Manufacturing" },
  { category: "manufacturing", img: "/Assets/labs/machine.png", title: "Central Manufacturing Facility" },
  { category: "manufacturing", img: "/Assets/labs/machine.png", title: "Central Workshop" },
  { category: "manufacturing", img: "/Assets/labs/machine.png", title: "Makerspace" },
];

export default function ResearchLabs() {
  const [active, setActive] = useState("perception");

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActive(cat.key)}
            className={`flex flex-col items-center gap-3 rounded-xl border p-5 text-center transition-all ${
              active === cat.key
                ? "border-[#001A23] bg-[#001A23] text-white shadow-md"
                : "border-gray-200 bg-white text-[#001A23] hover:border-gray-300"
            }`}
          >
            <Image
              src={cat.icon}
              alt={cat.label}
              width={40}
              height={40}
              className={active === cat.key ? "brightness-0 invert" : ""}
            />
            <span className="text-sm font-semibold">{cat.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {labs
          .filter((lab) => lab.category === active)
          .map((lab, i) => (
            <div
              key={`${lab.title}-${i}`}
              className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative h-44 w-full">
                <Image src={lab.img} alt={lab.title} fill className="object-cover" />
              </div>
              <div className="p-4">
                <p className="font-semibold text-[#001A23]">{lab.title}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
