'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, Search, Plus, X } from 'lucide-react';
import { useAuth } from '../../../lib/auth';
import { Sidebar } from '../../../components/dashboard/Sidebar';
import { MOCK_SELLER_PROFILE } from '../../../marketplace/services/mockData';
import Link from 'next/link';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { user, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [sellerProfile] = useState(MOCK_SELLER_PROFILE); // Should fetch real profile

    if (!user) {
        // Ideally handled by middleware
        return null;
    }

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Desktop Sidebar */}
            <div className="hidden md:block h-full">
                <Sidebar
                    setIsMobileMenuOpen={setIsMobileMenuOpen}
                    onNavigateHome={() => router.push('/')}
                    onLogout={() => { logout(); router.push('/'); }}
                    user={user}
                    sellerProfile={sellerProfile}
                />
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="absolute left-0 top-0 bottom-0" onClick={e => e.stopPropagation()}>
                        <Sidebar
                            setIsMobileMenuOpen={setIsMobileMenuOpen}
                            onNavigateHome={() => router.push('/')}
                            onLogout={() => { logout(); router.push('/'); }}
                            user={user}
                            sellerProfile={sellerProfile}
                        />
                    </div>
                    <button
                        className="absolute top-4 right-4 text-white p-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <X size={24} />
                    </button>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
                {/* Top Header */}
                <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <button className="md:hidden text-slate-500 hover:text-slate-800" onClick={() => setIsMobileMenuOpen(true)}>
                            <Menu size={24} />
                        </button>
                        <h2 className="text-xl font-bold text-slate-800 capitalize">
                            Dashboard
                        </h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                            <Search size={20} />
                        </button>
                        <Link
                            href="/dashboard/products/add"
                            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-lg shadow-brand-500/30"
                        >
                            <Plus size={18} /> <span className="hidden sm:inline">Add Product</span>
                        </Link>
                    </div>
                </header>

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50">
                    <div className="max-w-6xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
