'use client';

import { useEffect, useState } from 'react';
import { Layers, Plus, Search, X } from 'lucide-react';
import {
  getSpecializationItemsAdmin,
  addSpecializationCourseItem,
  addSpecializationBasketItem,
  removeSpecializationItem,
  getSpecializationConstraintsAdmin,
  createSpecializationConstraint,
  updateSpecializationConstraintMaxCourses,
  deleteSpecializationConstraint,
  addBasketToConstraint,
  removeBasketFromConstraint,
} from '@/lib/supabase/queries';
import { useToast } from '@/components/admin/Toast';
import Modal from '@/components/admin/Modal';
import type {
  MtechCard,
  MtechCourse,
  MtechBasket,
  MtechSpecializationItemRow,
  MtechSpecializationConstraintRow,
} from '@/types/mtech';

function itemLabel(item: MtechSpecializationItemRow): string {
  return item.kind === 'course'
    ? item.course.title
    : (item.basket.name ?? 'Untitled basket');
}

export default function SpecializationRequirementsModal({
  specialization,
  allCourses,
  allBaskets,
  onClose,
}: {
  specialization: MtechCard;
  allCourses: MtechCourse[];
  allBaskets: MtechBasket[];
  onClose: () => void;
}) {
  const toast = useToast();

  const [items, setItems] = useState<MtechSpecializationItemRow[] | null>(null);
  const [constraints, setConstraints] = useState<MtechSpecializationConstraintRow[] | null>(null);
  const [addMode, setAddMode] = useState<'course' | 'basket'>('course');
  const [itemSearch, setItemSearch] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getSpecializationItemsAdmin(specialization.id),
      getSpecializationConstraintsAdmin(specialization.id),
    ]).then(([itemRows, constraintRows]) => {
      if (!cancelled) {
        setItems(itemRows);
        setConstraints(constraintRows);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [specialization.id]);

  const refreshItems = async () => {
    const fresh = await getSpecializationItemsAdmin(specialization.id);
    setItems(fresh);
  };

  // --- Requirement list ---

  const handleAddCourse = async (course: MtechCourse) => {
    if (!items) return;
    setBusy(true);
    const result = await addSpecializationCourseItem(specialization.id, course.id, items.length);
    if (!result) {
      setBusy(false);
      toast.error('Failed to add the course. Check the console for details.');
      return;
    }
    await refreshItems();
    setBusy(false);
    toast.success(`Added "${course.title}" to the requirement list.`);
  };

  const handleAddBasket = async (basket: MtechBasket) => {
    if (!items) return;
    setBusy(true);
    const result = await addSpecializationBasketItem(specialization.id, basket.id, items.length);
    if (!result) {
      setBusy(false);
      toast.error('Failed to add the basket. Check the console for details.');
      return;
    }
    await refreshItems();
    setBusy(false);
    toast.success(`Added "${basket.name ?? 'Untitled basket'}" to the requirement list.`);
  };

  const handleRemoveItem = async (item: MtechSpecializationItemRow) => {
    if (!confirm(`Remove "${itemLabel(item)}" from this specialization's requirement list?`)) return;

    setBusy(true);
    const ok = await removeSpecializationItem(item.id);
    setBusy(false);

    if (!ok) {
      toast.error('Failed to remove the item. Check the console for details.');
      return;
    }
    setItems((prev) => (prev ? prev.filter((i) => i.id !== item.id) : prev));
    toast.success(`Removed "${itemLabel(item)}".`);
  };

  const usedCourseIds = new Set(
    (items ?? []).filter((i) => i.kind === 'course').map((i) => (i as { course: MtechCourse }).course.id)
  );
  const usedBasketIds = new Set(
    (items ?? []).filter((i) => i.kind === 'basket').map((i) => (i as { basket: MtechBasket }).basket.id)
  );

  const query = itemSearch.trim().toLowerCase();
  const availableCourses = allCourses
    .filter((c) => !usedCourseIds.has(c.id))
    .filter((c) =>
      query
        ? [c.code, c.title].filter((v): v is string => !!v).some((v) => v.toLowerCase().includes(query))
        : true
    );
  const availableBaskets = allBaskets
    .filter((b) => !usedBasketIds.has(b.id))
    .filter((b) => (query ? (b.name ?? '').toLowerCase().includes(query) : true));

  // --- Eligibility constraints ---

  const handleAddConstraint = async () => {
    setBusy(true);
    const result = await createSpecializationConstraint(specialization.id, 1);
    setBusy(false);

    if (!result) {
      toast.error('Failed to add a constraint. Check the console for details.');
      return;
    }
    setConstraints((prev) => [...(prev ?? []), { id: result.id, max_courses: result.max_courses, baskets: [] }]);
    toast.success('Constraint added.');
  };

  // Local state updates on every keystroke for a responsive input, but only
  // persists (and toasts) on blur -- a toast per keystroke would be spam.
  const handleMaxCoursesInput = (constraintId: string, value: number) => {
    setConstraints((prev) =>
      prev ? prev.map((c) => (c.id === constraintId ? { ...c, max_courses: value } : c)) : prev
    );
  };

  const handleMaxCoursesBlur = async (constraintId: string, value: number) => {
    const ok = await updateSpecializationConstraintMaxCourses(constraintId, value);
    if (!ok) {
      toast.error('Failed to save that change. Check the console for details.');
      return;
    }
    toast.success('Constraint updated.');
  };

  const handleDeleteConstraint = async (constraint: MtechSpecializationConstraintRow) => {
    if (!confirm('Delete this eligibility constraint? This can\'t be undone.')) return;

    setBusy(true);
    const ok = await deleteSpecializationConstraint(constraint.id);
    setBusy(false);

    if (!ok) {
      toast.error('Failed to delete the constraint. Check the console for details.');
      return;
    }
    setConstraints((prev) => (prev ? prev.filter((c) => c.id !== constraint.id) : prev));
    toast.success('Constraint deleted.');
  };

  const handleAddBasketToConstraint = async (constraint: MtechSpecializationConstraintRow, basket: MtechBasket) => {
    setBusy(true);
    const result = await addBasketToConstraint(constraint.id, basket.id, constraint.baskets.length);
    setBusy(false);

    if (!result) {
      toast.error('Failed to add the basket. Check the console for details.');
      return;
    }
    setConstraints((prev) =>
      prev
        ? prev.map((c) =>
            c.id === constraint.id
              ? { ...c, baskets: [...c.baskets, { linkId: result.id, basket }] }
              : c
          )
        : prev
    );
    toast.success(`Added "${basket.name ?? 'Untitled basket'}" to the constraint.`);
  };

  const handleRemoveBasketFromConstraint = async (
    constraint: MtechSpecializationConstraintRow,
    linkId: string
  ) => {
    const basketName =
      constraint.baskets.find((b) => b.linkId === linkId)?.basket.name ?? 'Untitled basket';

    setBusy(true);
    const ok = await removeBasketFromConstraint(linkId);
    setBusy(false);

    if (!ok) {
      toast.error('Failed to remove the basket. Check the console for details.');
      return;
    }
    setConstraints((prev) =>
      prev
        ? prev.map((c) =>
            c.id === constraint.id
              ? { ...c, baskets: c.baskets.filter((b) => b.linkId !== linkId) }
              : c
          )
        : prev
    );
    toast.success(`Removed "${basketName}" from the constraint.`);
  };

  const loading = items === null || constraints === null;

  return (
    <Modal
      title={specialization.title}
      subtitle="Requirement list and eligibility constraints"
      onClose={onClose}
      maxWidth="max-w-2xl"
      footer={
        <button
          type="button"
          onClick={onClose}
          className="rounded bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
        >
          Done
        </button>
      }
    >
      {loading ? (
        <div className="animate-pulse space-y-3 py-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-8 w-full rounded bg-gray-100" />
          ))}
        </div>
      ) : (
        <>
          {/* --- Requirement list --- */}
          <h3 className="text-xs font-semibold tracking-wide text-stone-500 uppercase">
            Requirement list ({items!.length})
          </h3>
          {items!.length === 0 ? (
            <p className="mt-2 text-sm text-stone-400">No courses or baskets added yet.</p>
          ) : (
            <ul className="mt-2 divide-y divide-stone-100 rounded border border-stone-200">
              {items!.map((item) => (
                <li key={item.id} className="flex items-center gap-3 px-3 py-2">
                  <div className="min-w-0 flex-1">
                    {item.kind === 'course' ? (
                      <>
                        <span className="font-mono text-xs text-stone-500">
                          {item.course.code ?? '—'}
                        </span>{' '}
                        <span className="text-sm text-stone-800">{item.course.title}</span>
                      </>
                    ) : (
                      <span className="flex items-center gap-1.5 text-sm text-stone-800">
                        <Layers size={13} className="text-amber-600" strokeWidth={1.75} />
                        {item.basket.name ?? 'Untitled basket'}
                        <span className="text-xs text-stone-400">
                          ({item.courses.length} option{item.courses.length === 1 ? '' : 's'})
                        </span>
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item)}
                    className="rounded p-1 text-stone-400 hover:bg-red-50 hover:text-red-700"
                    aria-label="Remove"
                  >
                    <X size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-4 flex gap-1 border-b border-stone-200">
            <button
              type="button"
              onClick={() => setAddMode('course')}
              className={`-mb-px border-b-2 px-3 py-1.5 text-xs font-semibold ${
                addMode === 'course'
                  ? 'border-teal-700 text-teal-700'
                  : 'border-transparent text-stone-400 hover:text-stone-600'
              }`}
            >
              Add a course
            </button>
            <button
              type="button"
              onClick={() => setAddMode('basket')}
              className={`-mb-px border-b-2 px-3 py-1.5 text-xs font-semibold ${
                addMode === 'basket'
                  ? 'border-teal-700 text-teal-700'
                  : 'border-transparent text-stone-400 hover:text-stone-600'
              }`}
            >
              Add a basket
            </button>
          </div>

          <div className="relative mt-2">
            <Search size={14} className="absolute top-1/2 left-2.5 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={itemSearch}
              onChange={(e) => setItemSearch(e.target.value)}
              placeholder={addMode === 'course' ? 'Search courses by title or code' : 'Search baskets by name'}
              className="w-full rounded border border-stone-300 py-1.5 pr-3 pl-8 text-sm"
            />
          </div>

          <ul className="mt-2 max-h-40 divide-y divide-stone-100 overflow-y-auto rounded border border-stone-200">
            {addMode === 'course' &&
              (availableCourses.length === 0 ? (
                <li className="px-3 py-4 text-center text-sm text-stone-400">No matching courses.</li>
              ) : (
                availableCourses.map((c) => (
                  <li key={c.id} className="flex items-center justify-between gap-3 px-3 py-2">
                    <div className="min-w-0">
                      <span className="font-mono text-xs text-stone-500">{c.code ?? '—'}</span>{' '}
                      <span className="text-sm text-stone-800">{c.title}</span>
                    </div>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => handleAddCourse(c)}
                      className="shrink-0 rounded bg-teal-700 px-2 py-1 text-xs font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
                    >
                      + Add
                    </button>
                  </li>
                ))
              ))}
            {addMode === 'basket' &&
              (availableBaskets.length === 0 ? (
                <li className="px-3 py-4 text-center text-sm text-stone-400">No matching baskets.</li>
              ) : (
                availableBaskets.map((b) => (
                  <li key={b.id} className="flex items-center justify-between gap-3 px-3 py-2">
                    <span className="text-sm text-stone-800">{b.name ?? 'Untitled basket'}</span>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => handleAddBasket(b)}
                      className="shrink-0 rounded bg-teal-700 px-2 py-1 text-xs font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
                    >
                      + Add
                    </button>
                  </li>
                ))
              ))}
          </ul>

          {/* --- Eligibility constraints --- */}
          <div className="mt-6 flex items-center justify-between">
            <h3 className="text-xs font-semibold tracking-wide text-stone-500 uppercase">
              Eligibility constraints ({constraints!.length})
            </h3>
            <button
              type="button"
              onClick={handleAddConstraint}
              disabled={busy}
              className="flex items-center gap-1 rounded bg-teal-50 px-2 py-1 text-xs font-semibold text-teal-700 hover:bg-teal-100 disabled:opacity-50"
            >
              <Plus size={12} /> Add constraint
            </button>
          </div>

          {constraints!.length === 0 ? (
            <p className="mt-2 text-sm text-stone-400">
              No constraints -- every course in the list above counts freely.
            </p>
          ) : (
            <div className="mt-2 flex flex-col gap-3">
              {constraints!.map((constraint) => (
                <div key={constraint.id} className="rounded border border-stone-200 p-3">
                  <div className="flex items-center gap-2 text-sm text-stone-700">
                    <span>At most</span>
                    <input
                      type="number"
                      min={0}
                      value={constraint.max_courses}
                      onChange={(e) =>
                        handleMaxCoursesInput(constraint.id, Number(e.target.value))
                      }
                      onBlur={(e) =>
                        handleMaxCoursesBlur(constraint.id, Number(e.target.value))
                      }
                      className="w-14 rounded border border-stone-300 px-2 py-1 text-sm"
                    />
                    <span>course(s) in total from:</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteConstraint(constraint)}
                      className="ml-auto rounded bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-100"
                    >
                      Delete constraint
                    </button>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {constraint.baskets.length === 0 && (
                      <span className="text-xs text-stone-400">No baskets attached yet.</span>
                    )}
                    {constraint.baskets.map(({ linkId, basket }) => (
                      <span
                        key={linkId}
                        className="flex items-center gap-1 rounded-full bg-amber-50 py-0.5 pr-1 pl-2 text-xs font-medium text-amber-800"
                      >
                        {basket.name ?? 'Untitled basket'}
                        <button
                          type="button"
                          onClick={() => handleRemoveBasketFromConstraint(constraint, linkId)}
                          className="rounded-full p-0.5 hover:bg-amber-200"
                          aria-label="Remove basket from constraint"
                        >
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>

                  <ConstraintBasketPicker
                    allBaskets={allBaskets}
                    attachedBasketIds={new Set(constraint.baskets.map((b) => b.basket.id))}
                    busy={busy}
                    onAdd={(basket) => handleAddBasketToConstraint(constraint, basket)}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </Modal>
  );
}

// A small inline "+ add basket to this constraint" search box -- its own
// component just to keep each constraint card's own search text
// independent of the others.
function ConstraintBasketPicker({
  allBaskets,
  attachedBasketIds,
  busy,
  onAdd,
}: {
  allBaskets: MtechBasket[];
  attachedBasketIds: Set<string>;
  busy: boolean;
  onAdd: (basket: MtechBasket) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-2 text-xs font-semibold text-teal-700 hover:text-teal-800"
      >
        + Add a basket to this constraint
      </button>
    );
  }

  const query = search.trim().toLowerCase();
  const available = allBaskets
    .filter((b) => !attachedBasketIds.has(b.id))
    .filter((b) => (query ? (b.name ?? '').toLowerCase().includes(query) : true));

  return (
    <div className="mt-2 rounded border border-stone-200 p-2">
      <div className="flex items-center gap-2">
        <input
          type="text"
          autoFocus
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search baskets by name"
          className="flex-1 rounded border border-stone-300 px-2 py-1 text-xs"
        />
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs text-stone-400 hover:text-stone-600"
        >
          Close
        </button>
      </div>
      <ul className="mt-2 max-h-28 divide-y divide-stone-100 overflow-y-auto">
        {available.length === 0 && (
          <li className="py-2 text-center text-xs text-stone-400">No matching baskets.</li>
        )}
        {available.map((b) => (
          <li key={b.id} className="flex items-center justify-between gap-2 py-1.5">
            <span className="text-xs text-stone-700">{b.name ?? 'Untitled basket'}</span>
            <button
              type="button"
              disabled={busy}
              onClick={() => onAdd(b)}
              className="shrink-0 rounded bg-teal-700 px-2 py-0.5 text-[11px] font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
            >
              + Add
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}