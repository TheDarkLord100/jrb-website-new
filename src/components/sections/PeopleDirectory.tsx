'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { Mail, Phone, Link as LinkIcon, ChevronDown } from 'lucide-react';
import { usePeople } from '@/lib/usePeople';
import { Pill } from '@/components/ui/Pill';
import PeopleSkeleton from '@/components/sections/PeopleSkeleton';
import type { Person } from '@/types/person';

const TABS = [
  { key: 'faculty', label: 'Faculty' },
  { key: 'student', label: 'Students' },
  { key: 'postdoc', label: 'Post Docs' },
  { key: 'alumni', label: 'Alumni' },
] as const;

const DEPARTMENTS = [
  { key: 'all', label: 'All' },
  { key: 'Electrical Engineering', label: 'Electrical' },
  { key: 'Mechanical Engineering', label: 'Mechanical' },
  { key: 'Computer Science and Engineering', label: 'Computer Science' },
  { key: 'Applied Mechanics', label: 'Applied Mechanics' },
  { key: 'Center for Automotive Research and Tribology', label: 'C.A.R.T.' },
  { key: 'School of AI', label: 'School of AI' },
];

const TAGS = [
  { key: 'ai', label: 'AI' },
  { key: 'robotics', label: 'Robotics' },
  { key: 'control', label: 'Control' },
  { key: 'biomechanics', label: 'Biomechanics' },
  { key: 'vision', label: 'Computer Vision' },
  { key: 'embedded', label: 'Embedded' },
];

const STUDENT_BATCHES = [
  { key: 'all', label: 'All' },
  { key: '2025-27', label: '2025–27' },
];

const ALUMNI_BATCHES = [
  { key: 'all', label: 'All' },
  { key: '2023-25', label: '2023–25' },
  { key: '2024-26', label: '2024–26' },
];

function ContactIcons({
  webmail,
  office_contact,
  link,
  linkOnly,
}: {
  webmail: string | null;
  office_contact: string | null;
  link: string | null;
  linkOnly?: boolean;
}) {
  return (
    <div className="mt-3 flex gap-3 text-[#001A23]" onClick={(e) => e.stopPropagation()}>
      {!linkOnly && office_contact && (
        <a href={`tel:${office_contact}`} aria-label="Phone" className="hover:text-amber-600">
          <Phone size={17} />
        </a>
      )}
      {!linkOnly && webmail && (
        <a href={`mailto:${webmail}`} aria-label="Email" className="hover:text-amber-600">
          <Mail size={17} />
        </a>
      )}
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Link"
          className="hover:text-amber-600"
        >
          <LinkIcon size={17} />
        </a>
      )}
    </div>
  );
}

function MemberCard({ p }: { p: Person }) {
  return (
    <div className="flex flex-col items-center border-t-2 border-amber-400 bg-white p-5 text-center shadow-sm ring-1 ring-gray-100">
      <div className="relative h-28 w-28 overflow-hidden rounded-full">
        <Image src={p.image_url} alt={p.name} fill className="object-cover" />
      </div>
      <h3 className="mt-3 font-serif font-semibold text-[#001A23]">{p.name}</h3>
      <p className="mt-1 text-xs text-gray-500">
        {p.role === 'student' || p.role === 'alumni' ? `M.Tech Robotics (${p.year})` : p.year}
      </p>
      <ContactIcons webmail={p.webmail} office_contact={p.office_contact} link={p.link} linkOnly />
    </div>
  );
}

export default function PeopleDirectory() {
  const { people, error } = usePeople();

  const [tab, setTab] = useState<(typeof TABS)[number]['key']>('faculty');
  const [dept, setDept] = useState('all');
  const [tag, setTag] = useState('');
  const [search, setSearch] = useState('');
  const [batch, setBatch] = useState('all');
  const [alumniBatch, setAlumniBatch] = useState('all');
  const [expandedFaculty, setExpandedFaculty] = useState<Set<string>>(new Set());

  const toggleFaculty = (id: string) => {
    setExpandedFaculty((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const faculty = useMemo(() => {
    if (!people) return [];
    const q = search.toLowerCase().trim();
    return people
      .filter((p) => p.role === 'faculty')
      .filter((p) => {
        const focusText = p.focus.join(' ').toLowerCase();
        const matchesSearch = q ? focusText.includes(q) : true;
        const matchesTag = tag ? focusText.includes(tag) : true;
        const matchesDept = dept === 'all' || p.department === dept;
        return matchesSearch && matchesTag && matchesDept;
      });
  }, [people, search, tag, dept]);

  const students = useMemo(() => {
    if (!people) return [];
    return people
      .filter((p) => p.role === 'student')
      .filter((p) => batch === 'all' || p.year === batch);
  }, [people, batch]);

  const postdocs = people?.filter((p) => p.role === 'postdoc') ?? [];

  const alumni = useMemo(() => {
    if (!people) return [];
    return people
      .filter((p) => p.role === 'alumni')
      .filter((p) => alumniBatch === 'all' || p.year === alumniBatch);
  }, [people, alumniBatch]);
  return (
    <div>
      {/* Primary tabs — always rendered, since labels are static and don't
          depend on the fetch, keeping the page height stable while loading */}
      <div className="mb-10 flex justify-center gap-8 border-b border-gray-200">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`-mb-px border-b-2 pb-3 font-serif text-sm font-semibold transition-colors sm:text-base ${
              tab === t.key
                ? 'border-amber-400 text-[#001A23]'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && (
        <p className="py-20 text-center text-gray-500">
          Couldn&apos;t load the People directory right now. Please try again shortly.
        </p>
      )}

      {!error && !people && <PeopleSkeleton />}

      {!error && people && (
        <>
          {tab === 'faculty' && (
            <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
              <aside className="flex flex-row flex-wrap gap-2 lg:flex-col">
                <h4 className="hidden text-sm font-bold tracking-wide text-[#001A23] uppercase lg:block">
                  Departments
                </h4>
                {DEPARTMENTS.map((d) => (
                  <button
                    key={d.key}
                    onClick={() => setDept(d.key)}
                    className={`px-3 py-1.5 text-left text-sm transition-colors lg:px-0 lg:py-1 ${
                      dept === d.key
                        ? 'bg-amber-50 text-amber-800 lg:bg-transparent lg:font-semibold lg:text-amber-700'
                        : 'bg-gray-100 text-gray-600 lg:bg-transparent lg:text-gray-600 lg:hover:text-[#001A23]'
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
                  className="w-full border border-gray-300 px-4 py-2 text-sm focus:border-amber-400 focus:outline-none"
                />

                <div className="mt-4 flex flex-wrap gap-2">
                  {TAGS.map((t) => (
                    <Pill
                      key={t.key}
                      active={tag === t.key}
                      onClick={() => setTag(tag === t.key ? '' : t.key)}
                    >
                      {t.label}
                    </Pill>
                  ))}
                </div>

                <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {faculty.map((p) => {
                    const expanded = expandedFaculty.has(p.id);
                    return (
                      <div
                        key={p.id}
                        onClick={() => toggleFaculty(p.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            toggleFaculty(p.id);
                          }
                        }}
                        className="flex cursor-pointer gap-4 border-t-2 border-amber-400 bg-white p-4 shadow-sm ring-1 ring-gray-100 transition-shadow hover:shadow-md"
                      >
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full">
                          <Image src={p.image_url} alt={p.name} fill className="object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="truncate font-serif font-semibold text-[#001A23]">
                              {p.name}
                            </h3>
                            {p.research_interest && (
                              <ChevronDown
                                size={16}
                                className={`mt-1 shrink-0 text-gray-400 transition-transform ${
                                  expanded ? 'rotate-180' : ''
                                }`}
                              />
                            )}
                          </div>
                          {p.research_interest && (
                            <p className="mt-1 text-xs text-gray-500">{p.department}</p>
                          )}
                          {p.research_interest && (
                            <p
                              className={`mt-1 text-sm text-gray-600 ${
                                expanded ? '' : 'line-clamp-2'
                              }`}
                            >
                              {p.research_interest}
                            </p>
                          )}
                          <ContactIcons
                            webmail={p.webmail}
                            office_contact={p.office_contact}
                            link={p.link}
                          />
                        </div>
                      </div>
                    );
                  })}
                  {faculty.length === 0 && (
                    <p className="col-span-full py-10 text-center text-gray-500">
                      No matching faculty.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {tab === 'student' && (
            <div>
              <div className="mb-6 flex justify-center gap-3">
                {STUDENT_BATCHES.map((b) => (
                  <Pill key={b.key} active={batch === b.key} onClick={() => setBatch(b.key)}>
                    {b.label}
                  </Pill>
                ))}
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {students.map((p) => (
                  <MemberCard key={p.id} p={p} />
                ))}
              </div>
            </div>
          )}

          {tab === 'postdoc' && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {postdocs.map((p) => (
                <MemberCard key={p.id} p={p} />
              ))}
            </div>
          )}

          {tab === 'alumni' && (
            <div>
              <div className="mb-6 flex justify-center gap-3">
                {ALUMNI_BATCHES.map((b) => (
                  <Pill
                    key={b.key}
                    active={alumniBatch === b.key}
                    onClick={() => setAlumniBatch(b.key)}
                  >
                    {b.label}
                  </Pill>
                ))}
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {alumni.map((p) => (
                  <MemberCard key={p.id} p={p} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}