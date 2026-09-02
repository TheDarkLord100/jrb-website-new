'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';
import DashboardSidebar from '@/components/admin/DashboardSidebar';
import DashboardTopBar from '@/components/admin/DashboardTopBar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { session, loading } = useAdminAuth();

    useEffect(() => {
        if (!loading && !session) {
            router.replace('/admin');
        }
    }, [loading, session, router]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-stone-50">
                <p className="text-sm text-stone-400">Checking session…</p>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <div className="flex min-h-screen">
            <DashboardSidebar />
            <div className="flex flex-1 flex-col bg-stone-50">
                <DashboardTopBar />
                <div className="flex flex-1 flex-col">{children}</div>
            </div>
        </div>
    );
}