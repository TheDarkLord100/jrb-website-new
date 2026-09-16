'use client';

import SectionsPanel from './SectionsPanel';
import CreditCategoriesPanel from './CreditCategoriesPanel';

// The static/copy parts of the page -- as opposed to the Courses/Baskets/
// Specializations tabs, which manage the underlying course data. Grouped
// as one tab with two stacked panels rather than two more top-level tabs,
// since both are small, low-frequency-edit content blocks.
export default function PageContentPanel() {
  return (
    <div className="flex flex-col gap-10">
      <SectionsPanel />
      <CreditCategoriesPanel />
    </div>
  );
}
