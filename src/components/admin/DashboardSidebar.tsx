'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ADMIN_NAV, findActiveNav } from '@/lib/adminNav';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';

export default function DashboardSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { session, signOut } = useAdminAuth();

    const { node: activeNode, parent: activeParent } = findActiveNav(pathname);

    const [open, setOpen] = useState<Record<string, boolean>>({
        academics: true,
        research: true,
    });

    // Auto-expand the relevant group on a direct link / page reload too,
    // not just when the user clicks to open it.
    useEffect(() => {
        if (activeParent) {
            setOpen((prev) => ({ ...prev, [activeParent.id]: true }));
        }
    }, [activeParent]);

    const toggleOpen = (id: string) => setOpen((prev) => ({ ...prev, [id]: !prev[id] }));

    const handleSignOut = async () => {
        await signOut();
        router.push('/admin');
    };

    return (
        <nav
            aria-label="Site sections"
            className="sticky top-0 flex h-screen w-[300px] shrink-0 flex-col bg-slate-900 text-slate-400"
        >
            <div className="border-b border-slate-700 px-6 pb-5 pt-7">
                <div className="font-serif text-xl font-semibold tracking-tight text-slate-100">
                    Department admin
                </div>
                <div className="mt-1 font-mono text-[11px] tracking-wide text-slate-500">
                    site structure
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-4">
                <div className="text-[13.5px]">
                    {ADMIN_NAV.map((node) => {
                        const isParent = !!node.children;
                        const isNodeActive = activeNode?.id === node.id;

                        return (
                            <div key={node.id}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (isParent) toggleOpen(node.id);
                                        else if (node.href) router.push(node.href);
                                    }}
                                    className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left transition-colors hover:bg-slate-800 hover:text-slate-100 ${isNodeActive ? 'bg-slate-800 text-teal-300' : isParent ? 'text-slate-300' : ''
                                        }`}
                                >
                                    {isParent ? (
                                        <span
                                            className={`inline-block w-3 text-[10px] text-slate-500 transition-transform ${open[node.id] ? 'rotate-90' : ''
                                                }`}
                                        >
                                            ▶
                                        </span>
                                    ) : (
                                        <span className="inline-block w-3" />
                                    )}
                                    <span className="capitalize">{node.label}</span>
                                </button>

                                {isParent && (
                                    <div
                                        className={`ml-5 overflow-hidden border-l border-slate-700 pl-3 transition-[max-height] duration-200 ${open[node.id] ? 'max-h-60' : 'max-h-0'
                                            }`}
                                    >
                                        {node.children!.map((child) => {
                                            const childActive = activeNode?.id === child.id;
                                            return (
                                                <button
                                                    key={child.id}
                                                    type="button"
                                                    onClick={() => router.push(child.href)}
                                                    className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left transition-colors hover:bg-slate-800 hover:text-slate-100 ${childActive ? 'bg-slate-800 text-teal-300' : ''
                                                        }`}
                                                >
                                                    <span
                                                        className={`h-1 w-1 rounded-full ${childActive ? 'bg-teal-300' : 'bg-slate-600'
                                                            }`}
                                                    />
                                                    <span className="capitalize">{child.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="border-t border-slate-700 px-6 py-4">
                <p className="truncate font-mono text-[11px] text-slate-500">{session?.user.email}</p>
                <button
                    type="button"
                    onClick={handleSignOut}
                    className="mt-1 text-xs font-semibold text-teal-400 hover:text-teal-300"
                >
                    Sign out
                </button>
            </div>
        </nav>
    );
}