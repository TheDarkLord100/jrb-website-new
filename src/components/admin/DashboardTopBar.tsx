'use client';

import { usePathname } from 'next/navigation';
import { findActiveNav } from '@/lib/adminNav';

export default function DashboardTopBar() {
    const pathname = usePathname();
    const { node, parent } = findActiveNav(pathname);

    const label = node?.label ?? '';
    const path = parent ? `/ ${parent.label} / ${label}` : `/ ${label}`;

    return (
        <div className="flex items-center justify-between border-b border-stone-200 px-10 py-5">
            <div className="font-mono text-[12.5px] text-stone-400">
                site <span className="text-stone-900">{path}</span>
            </div>
            <div className="font-serif text-[15px] capitalize text-stone-400">{label}</div>
        </div>
    );
}