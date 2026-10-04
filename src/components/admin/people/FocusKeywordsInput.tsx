'use client';

import { useId, useState } from 'react';
import { X } from 'lucide-react';

// Chip input for a faculty member's focus keywords. Keywords are trimmed and
// lowercased as they're added, and the browser suggests keywords already in
// use elsewhere -- both nudge towards one spelling per idea, which is what
// keeps the filter tags matching consistently.
export default function FocusKeywordsInput({
  value,
  onChange,
  suggestions,
}: {
  value: string[];
  onChange: (keywords: string[]) => void;
  suggestions: string[];
}) {
  const [draft, setDraft] = useState('');
  const listId = useId();

  const add = (raw: string) => {
    const keyword = raw.trim().toLowerCase().replace(/\s+/g, ' ');
    if (keyword && !value.includes(keyword)) onChange([...value, keyword]);
    setDraft('');
  };

  const remove = (keyword: string) => onChange(value.filter((k) => k !== keyword));

  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded border border-stone-300 px-2 py-1.5">
      {value.map((keyword) => (
        <span
          key={keyword}
          className="flex items-center gap-1 rounded bg-stone-100 py-0.5 pr-1 pl-2 text-xs text-stone-700"
        >
          {keyword}
          <button
            type="button"
            onClick={() => remove(keyword)}
            aria-label={`Remove ${keyword}`}
            className="rounded p-0.5 text-stone-400 hover:bg-stone-200 hover:text-stone-700"
          >
            <X size={11} />
          </button>
        </span>
      ))}
      <input
        type="text"
        list={listId}
        value={draft}
        onChange={(e) => {
          // Picking a datalist suggestion fires a change with the full value;
          // a typed comma also commits the keyword.
          const next = e.target.value;
          if (next.endsWith(',')) add(next.slice(0, -1));
          else setDraft(next);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            // Commit the keyword instead of submitting the surrounding form.
            e.preventDefault();
            add(draft);
          } else if (e.key === 'Backspace' && draft === '' && value.length > 0) {
            remove(value[value.length - 1]);
          }
        }}
        onBlur={() => draft.trim() && add(draft)}
        placeholder={value.length === 0 ? 'Type a keyword, press Enter' : ''}
        className="min-w-[10rem] flex-1 px-1 py-0.5 text-sm focus:outline-none"
      />
      <datalist id={listId}>
        {suggestions
          .filter((s) => !value.includes(s))
          .map((s) => (
            <option key={s} value={s} />
          ))}
      </datalist>
    </div>
  );
}