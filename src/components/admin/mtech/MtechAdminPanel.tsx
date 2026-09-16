'use client';

import { useState } from 'react';
import CoursesPanel from './CoursesPanel';
import BasketsPanel from './BasketsPanel';
import SpecializationsPanel from './SpecializationsPanel';
import PageContentPanel from './PageContentPanel';

type Tab = 'courses' | 'baskets' | 'specializations' | 'page-content';

const TABS: { id: Tab; label: string }[] = [
  { id: 'courses', label: 'Courses' },
  { id: 'baskets', label: 'Baskets' },
  { id: 'specializations', label: 'Specializations' },
  { id: 'page-content', label: 'Page Content' },
];

export default function MtechAdminPanel() {
  const [activeTab, setActiveTab] = useState<Tab>('courses');

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
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === 'courses' && <CoursesPanel />}
        {activeTab === 'baskets' && <BasketsPanel />}
        {activeTab === 'specializations' && <SpecializationsPanel />}
        {activeTab === 'page-content' && <PageContentPanel />}
      </div>
    </div>
  );
}
