'use client';

import { useState } from 'react';
import { usePeople } from '@/lib/hooks/usePeople';
import { usePeopleTags } from '@/lib/hooks/usePeopleTags';
import { deletePerson } from '@/lib/supabase/queries';
import { useToast } from '@/components/admin/Toast';
import PeopleRoleTab from './PeopleRoleTab';
import PeopleTagsPanel from './PeopleTagsPanel';
import PersonFormModal from './PersonFormModal';
import PromoteBatchModal from './PromoteBatchModal';
import type { Person, PersonRole } from '@/types/person';

type Tab = PersonRole | 'tags';

const TABS: { id: Tab; label: string }[] = [
  { id: 'faculty', label: 'Faculty' },
  { id: 'student', label: 'Students' },
  { id: 'postdoc', label: 'Post Docs' },
  { id: 'alumni', label: 'Alumni' },
  { id: 'tags', label: 'Filter Tags' },
];

// People are loaded once here and shared by every tab, so a change in one
// (a role switch, a promoted batch) is immediately reflected in the others.
export default function PeopleAdminPanel() {
  const { people, setPeople, error } = usePeople();
  const { tags, setTags } = usePeopleTags();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<Tab>('faculty');
  const [editing, setEditing] = useState<Person | null>(null);
  const [creatingRole, setCreatingRole] = useState<PersonRole | null>(null);
  const [promoting, setPromoting] = useState(false);

  const counts = (role: PersonRole) => people?.filter((p) => p.role === role).length ?? 0;

  const handleSaved = (saved: Person) => {
    setPeople((prev) => {
      if (!prev) return prev;
      return prev.some((p) => p.id === saved.id)
        ? prev.map((p) => (p.id === saved.id ? saved : p))
        : [...prev, saved];
    });
    setEditing(null);
    setCreatingRole(null);
  };

  const handleDelete = async (person: Person) => {
    const extra =
      person.role === 'faculty' ? ' They will also be removed from any research themes.' : '';
    if (!confirm(`Delete ${person.name}? This can't be undone.${extra}`)) return;

    const ok = await deletePerson(person.id);
    if (!ok) {
      toast.error('Failed to delete. Check the console for details.');
      return;
    }
    setPeople((prev) => prev?.filter((p) => p.id !== person.id) ?? prev);
    toast.success(`${person.name} deleted.`);
  };

  const handlePromoted = (ids: string[]) => {
    const moved = new Set(ids);
    setPeople(
      (prev) => prev?.map((p) => (moved.has(p.id) ? { ...p, role: 'alumni' as const } : p)) ?? prev
    );
    setPromoting(false);
  };

  return (
    <div>
      <div className="flex gap-1 border-b border-stone-200">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
              activeTab === tab.id
                ? 'border-teal-700 text-teal-700'
                : 'border-transparent text-stone-400 hover:text-stone-600'
            }`}
          >
            {tab.label}
            {people && tab.id !== 'tags' && (
              <span className="ml-1.5 text-xs font-normal text-stone-400">{counts(tab.id)}</span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {error && (
          <p className="py-20 text-center text-gray-500">
            Couldn&apos;t load people right now. Please try again shortly.
          </p>
        )}

        {!error && !people && (
          <div className="animate-pulse space-y-3 py-10">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 w-full rounded bg-gray-100" />
            ))}
          </div>
        )}

        {!error && people && activeTab === 'tags' && (
          <PeopleTagsPanel tags={tags} setTags={setTags} people={people} />
        )}

        {!error && people && activeTab !== 'tags' && (
          <PeopleRoleTab
            // Remount per role so search and filter start fresh on each tab.
            key={activeTab}
            role={activeTab}
            people={people}
            onAdd={() => setCreatingRole(activeTab)}
            onEdit={setEditing}
            onDelete={handleDelete}
            onPromote={activeTab === 'student' ? () => setPromoting(true) : undefined}
          />
        )}
      </div>

      {people && (editing || creatingRole) && (
        <PersonFormModal
          key={editing?.id ?? `new-${creatingRole}`}
          initial={editing ?? undefined}
          defaultRole={editing?.role ?? creatingRole ?? 'faculty'}
          people={people}
          onClose={() => {
            setEditing(null);
            setCreatingRole(null);
          }}
          onSaved={handleSaved}
        />
      )}

      {people && promoting && (
        <PromoteBatchModal
          people={people}
          onClose={() => setPromoting(false)}
          onPromoted={handlePromoted}
        />
      )}
    </div>
  );
}