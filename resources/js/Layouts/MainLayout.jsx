import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function MainLayout({ children, title = 'HijabStyle - Anggun & Percaya Diri' }) {
    const { flash = {} } = usePage().props;

    return (
        <div className="min-h-screen flex flex-col bg-brand-cream/20 text-brand-text font-sans antialiased selection:bg-brand-pink/30 selection:text-brand-text">
            <Head title={title} />

            {/* Sticky Navigation */}
            <Navbar />

            {/* Flash Messages */}
            {flash?.success && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 w-full">
                    <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-medium shadow-sm animate-fade-in">
                        <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                        <span>{flash.success}</span>
                    </div>
                </div>
            )}

            {flash?.error && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 w-full">
                    <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-red-50 border border-red-200/80 text-red-800 text-xs font-medium shadow-sm animate-fade-in">
                        <AlertCircle size={18} className="text-red-600 shrink-0" />
                        <span>{flash.error}</span>
                    </div>
                </div>
            )}

            {/* Main Page Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Global Footer */}
            <Footer />
        </div>
    );
}
