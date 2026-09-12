import React, { useState } from 'react';
import { Link, usePage, Head } from '@inertiajs/react';
import {
    LayoutDashboard,
    Layers,
    ShoppingBag,
    FileText,
    LogOut,
    Store,
    Menu,
    X,
    CheckCircle2,
    AlertCircle,
    Package
} from 'lucide-react';

export default function AdminLayout({ children, title = 'Admin Dashboard — HijabStyle' }) {
    const { auth, flash = {} } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navItems = [
        { name: 'Dashboard', href: route('admin.dashboard'), icon: LayoutDashboard, active: route().current('admin.dashboard') },
        { name: 'Kelola Kategori', href: route('admin.categories.index'), icon: Layers, active: route().current('admin.categories.*') },
        { name: 'Kelola Produk', href: route('admin.products.index'), icon: ShoppingBag, active: route().current('admin.products.*') },
        { name: 'Kelola Pesanan', href: route('admin.orders.index'), icon: Package, active: route().current('admin.orders.*') },
        { name: 'Laporan Penjualan', href: route('admin.reports.index'), icon: FileText, active: route().current('admin.reports.*') },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row text-brand-text font-sans">
            <Head title={title} />

            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
                <Link href={route('admin.dashboard')} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-brand-pink/40 flex items-center justify-center font-playfair font-bold italic">
                        H
                    </div>
                    <span className="font-playfair text-lg font-bold italic text-brand-text">
                        Hijab<span className="text-brand-pink-hover">Admin</span>
                    </span>
                </Link>
                <button
                    type="button"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 rounded-xl text-gray-600 hover:bg-gray-100"
                >
                    {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Admin Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 p-5 flex flex-col justify-between transform transition-transform duration-200 lg:translate-x-0 lg:static ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <div className="space-y-6">
                    {/* Brand Logo */}
                    <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                        <Link href={route('admin.dashboard')} className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-2xl bg-brand-pink/30 flex items-center justify-center font-playfair font-bold italic text-xl shadow-inner">
                                H
                            </div>
                            <div>
                                <span className="font-playfair text-xl font-bold italic text-brand-text block">
                                    Hijab<span className="text-brand-pink-hover">Style</span>
                                </span>
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-sage-dark">
                                    Admin Panel
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation items */}
                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                                        item.active
                                            ? 'bg-brand-pink text-brand-text shadow-sm'
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-brand-text'
                                    }`}
                                >
                                    <Icon size={18} className={item.active ? 'text-brand-text' : 'text-gray-400'} />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Bottom user & actions */}
                <div className="pt-4 border-t border-gray-100 space-y-2">
                    <Link
                        href="/"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        <Store size={16} className="text-brand-sage" />
                        <span>Lihat Toko Publik</span>
                    </Link>

                    <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                        <div className="space-y-0.5 max-w-[140px] truncate">
                            <p className="text-xs font-bold text-brand-text truncate">{auth.user?.name}</p>
                            <p className="text-[10px] text-gray-500 truncate">{auth.user?.email}</p>
                        </div>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Keluar"
                        >
                            <LogOut size={16} />
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Flash Messages */}
                {flash?.success && (
                    <div className="px-6 pt-4">
                        <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium shadow-sm">
                            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                            <span>{flash.success}</span>
                        </div>
                    </div>
                )}
                {flash?.error && (
                    <div className="px-6 pt-4">
                        <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-medium shadow-sm">
                            <AlertCircle size={16} className="text-red-600 shrink-0" />
                            <span>{flash.error}</span>
                        </div>
                    </div>
                )}

                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
