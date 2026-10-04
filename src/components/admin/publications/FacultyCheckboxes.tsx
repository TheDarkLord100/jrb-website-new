'use client';

import type { Person } from '@/types/person';

// A compact grid of faculty checkboxes for linking a paper to the centre
// faculty who wrote it.
export default function FacultyCheckboxes({
  faculty,
  value,
  onChange,
}: {
  faculty: Person[];
  value: string[];
  onChange: (ids: string[]) => void;
}) {
  const toggle = (id: string) =>
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);

  return (
    <div className="grid max-h-48 grid-cols-2 gap-x-4 gap-y-1.5 overflow-y-auto rounded border border-stone-300 p-3">
      {faculty.map((person) => (
        <label
          key={person.id}
          className="flex cursor-pointer items-center gap-2 text-sm text-stone-700"
        >
          <input
            type="checkbox"
            checked={value.includes(person.id)}
            onChange={() => toggle(person.id)}
            className="accent-teal-700"
          />
          <span className="truncate">{person.name}</span>
        </label>
      ))}
    </div>
  );
}