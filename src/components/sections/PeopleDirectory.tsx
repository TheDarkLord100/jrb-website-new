"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Mail, Phone, Link as LinkIcon } from "lucide-react";
import { PEOPLE } from "@/lib/people-data";
import { Pill } from "@/components/ui/Pill";

const TABS = [
  { key: "faculty", label: "Faculty" },
  { key: "student", label: "Students" },
  { key: "postdoc", label: "Post Docs" },
  { key: "alumni", label: "Alumni" },
] as const;

const DEPARTMENTS = [
  { key: "all", label: "All" },
  { key: "electrical", label: "Electrical" },
  { key: "mechanical", label: "Mechanical" },
  { key: "computer", label: "Computer Science" },
  { key: "applied", label: "Applied Mechanics" },
  { key: "cart", label: "C.A.R.T." },
  { key: "scai", label: "School of AI" },
];

const TAGS = [
  { key: "ai", label: "AI" },
  { key: "robotics", label: "Robotics" },
  { key: "control", label: "Control" },
  { key: "biomechanics", label: "Biomechanics" },
  { key: "vision", label: "Computer Vision" },
  { key: "embedded", label: "Embedded" },
];

const BATCHES = [
  { key: "all", label: "All" },
  { key: "2024-26", label: "2024–26" },
  { key: "2025-27", label: "2025–27" },
];

function ContactIcons({ webmail, office_contact, link }: { webmail: string | null; office_contact: string | null; link: string | null }) {
  return (
    <div className="mt-3 flex gap-3 text-[#001A23]">
      {office_contact && (
        <a href={`tel:${office_contact}`} aria-label="Phone" className="hover:text-yellow-600">
          <Phone size={17} />
        </a>
      )}
      {webmail && (
        <a href={`mailto:${webmail}`} aria-label="Email" className="hover:text-yellow-600">
          <Mail size={17} />
        </a>
      )}
      {link && (
        <a href={link} target="_blank" rel="noopener noreferrer" aria-label="Link" className="hover:text-yellow-600">
          <LinkIcon size={17} />
        </a>
      )}
    </div>
  );
}

export default function PeopleDirectory() {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("faculty");
  const [dept, setDept] = useState("all");
  const [tag, setTag] = useState("");
  const [search, setSearch] = useState("");
  const [batch, setBatch] = useState("all");

  const faculty = useMemo(() => {
    const q = search.toLowerCase().trim();
    return PEOPLE.filter((p) => p.role === "faculty").filter((p) => {
      const focusText = p.focus.join(" ").toLowerCase();
      const matchesSearch = q ? focusText.includes(q) : true;
      const matchesTag = tag ? focusText.includes(tag) : true;
      const matchesDept = dept === "all" || p.department_category === dept;
      return matchesSearch && matchesTag && matchesDept;
    });
  }, [search, tag, dept]);

  const students = useMemo(
    () =>
      PEOPLE.filter((p) => p.role === "student").filter(
        (p) => batch === "all" || p.year === batch
      ),
    [batch]
  );

  const postdocs = PEOPLE.filter((p) => p.role === "postdoc");
  const alumni = PEOPLE.filter((p) => p.role === "alumni");

  return (
    <div>
      {/* Tabs */}
      <div className="mb-8 flex flex-wrap justify-center gap-3">
        {TABS.map((t) => (
          <Pill key={t.key} active={tab === t.key} onClick={() => setTab(t.key)}>
            {t.label}
          </Pill>
        ))}
      </div>

      {tab === "faculty" && (
        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          <aside className="flex flex-row flex-wrap gap-2 lg:flex-col">
            <h4 className="hidden text-sm font-bold tracking-wide text-[#001A23] uppercase lg:block">
              Departments
            </h4>
            {DEPARTMENTS.map((d) => (
              <button
                key={d.key}
                onClick={() => setDept(d.key)}
                className={`rounded-full px-3 py-1.5 text-left text-sm transition-colors lg:rounded-none lg:px-0 lg:py-1 ${
                  dept === d.key
                    ? "bg-[#001A23] text-white lg:bg-transparent lg:font-semibold lg:text-yellow-600"
                    : "bg-gray-100 text-gray-600 lg:bg-transparent lg:text-gray-600 lg:hover:text-[#001A23]"
                }`}
              >
                {d.label}
              </button>
            ))}
          </aside>

          <div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by research interest..."
              className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm focus:border-[#001A23] focus:outline-none"
            />

            <div className="mt-4 flex flex-wrap gap-2">
              {TAGS.map((t) => (
                <Pill key={t.key} active={tag === t.key} onClick={() => setTag(tag === t.key ? "" : t.key)}>
                  {t.label}
                </Pill>
              ))}
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {faculty.map((p) => (
                <div
                  key={p.id}
                  className="flex gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full">
                    <Image src={p.image_url} alt={p.name} fill className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-[#001A23]">{p.name}</h3>
                    {p.research_interest && (
                      <p className="mt-1 text-xs text-gray-500">{p.department}</p>
                    )}
                    {p.research_interest && (
                      <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                        {p.research_interest}
                      </p>
                    )}
                    <ContactIcons webmail={p.webmail} office_contact={p.office_contact} link={p.link} />
                  </div>
                </div>
              ))}
              {faculty.length === 0 && (
                <p className="col-span-full py-10 text-center text-gray-500">No matching faculty.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {tab === "student" && (
        <div>
          <div className="mb-6 flex justify-center gap-3">
            {BATCHES.map((b) => (
              <Pill key={b.key} active={batch === b.key} onClick={() => setBatch(b.key)}>
                {b.label}
              </Pill>
            ))}
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {students.map((p) => (
              <div
                key={p.id}
                className="flex flex-col items-center rounded-xl border border-gray-100 bg-white p-5 text-center shadow-sm"
              >
                <div className="relative h-20 w-20 overflow-hidden rounded-full">
                  <Image src={p.image_url} alt={p.name} fill className="object-cover" />
                </div>
                <h3 className="mt-3 font-semibold text-[#001A23]">{p.name}</h3>
                <p className="mt-1 text-xs text-gray-500">M.Tech Robotics ({p.year})</p>
                <ContactIcons webmail={p.webmail} office_contact={p.office_contact} link={p.link} />
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "postdoc" && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {postdocs.map((p) => (
            <div
              key={p.id}
              className="flex flex-col items-center rounded-xl border border-gray-100 bg-white p-5 text-center shadow-sm"
            >
              <div className="relative h-20 w-20 overflow-hidden rounded-full">
                <Image src={p.image_url} alt={p.name} fill className="object-cover" />
              </div>
              <h3 className="mt-3 font-semibold text-[#001A23]">{p.name}</h3>
              <p className="mt-1 text-xs text-gray-500">{p.year}</p>
              <ContactIcons webmail={p.webmail} office_contact={p.office_contact} link={p.link} />
            </div>
          ))}
        </div>
      )}

      {tab === "alumni" && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {alumni.map((p) => (
            <div
              key={p.id}
              className="flex flex-col items-center rounded-xl border border-gray-100 bg-white p-5 text-center shadow-sm"
            >
              <div className="relative h-20 w-20 overflow-hidden rounded-full">
                <Image src={p.image_url} alt={p.name} fill className="object-cover" />
              </div>
              <h3 className="mt-3 font-semibold text-[#001A23]">{p.name}</h3>
              <p className="mt-1 text-xs text-gray-500">{p.year}</p>
              <ContactIcons webmail={p.webmail} office_contact={p.office_contact} link={p.link} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
