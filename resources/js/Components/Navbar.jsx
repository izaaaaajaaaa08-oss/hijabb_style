import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { ShoppingBag, Heart, Search, User, Menu, X, ChevronDown, LogOut, Package, Shield } from 'lucide-react';

export default function Navbar() {
    const { auth, cart_count = 0, wishlist_count = 0 } = usePage().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.get(route('catalog.index'), { search: searchQuery.trim() });
            setSearchOpen(false);
        }
    };

    return (
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-brand-cream-dark/50 shadow-sm transition-all">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Left: Mobile menu button & Logo */}
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg text-brand-text hover:bg-brand-cream"
                        >
                            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>

                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-full bg-brand-pink/30 flex items-center justify-center border border-brand-pink/50 shadow-inner">
                                <span className="font-playfair text-lg font-bold italic text-brand-text">H</span>
                            </div>
                            <span className="font-playfair text-2xl font-bold italic text-brand-text tracking-wide">
                                Hijab<span className="text-brand-pink-hover">Style</span>
                            </span>
                        </Link>
                    </div>

                    {/* Center: Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-brand-text">
                        <Link
                            href="/"
                            className="hover:text-brand-pink-hover transition-colors py-1"
                        >
                            Beranda
                        </Link>
                        <Link
                            href={route('catalog.index')}
                            className="hover:text-brand-pink-hover transition-colors py-1"
                        >
                            Katalog Produk
                        </Link>
                        <Link
                            href={route('catalog.index', { category: 'pashmina' })}
                            className="hover:text-brand-pink-hover transition-colors py-1"
                        >
                            Pashmina
                        </Link>
                        <Link
                            href={route('catalog.index', { category: 'segi-empat' })}
                            className="hover:text-brand-pink-hover transition-colors py-1"
                        >
                            Segi Empat
                        </Link>
                        <Link
                            href={route('catalog.index', { category: 'bergo' })}
                            className="hover:text-brand-pink-hover transition-colors py-1"
                        >
                            Bergo
                        </Link>
                    </nav>

                    {/* Right: Actions (Search, Wishlist, Cart, Auth) */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Search toggle */}
                        <div className="relative">
                            {searchOpen ? (
                                <form onSubmit={handleSearch} className="flex items-center">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Cari hijab impianmu..."
                                        autoFocus
                                        className="w-48 sm:w-64 pl-3 pr-8 py-1.5 text-xs rounded-full border border-brand-pink/50 focus:ring-1 focus:ring-brand-pink bg-brand-cream/30 text-brand-text"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setSearchOpen(false)}
                                        className="absolute right-2 text-brand-text/50 hover:text-brand-text"
                                    >
                                        <X size={14} />
                                    </button>
                                </form>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setSearchOpen(true)}
                                    className="p-2 rounded-full text-brand-text hover:text-brand-pink-hover hover:bg-brand-cream/50 transition-colors"
                                    title="Pencarian"
                                >
                                    <Search size={20} />
                                </button>
                            )}
                        </div>

                        {/* Wishlist Icon */}
                        <Link
                            href={route('customer.wishlist.index')}
                            className="relative p-2 rounded-full text-brand-text hover:text-brand-pink-hover hover:bg-brand-cream/50 transition-colors"
                            title="Wishlist"
                        >
                            <Heart size={20} />
                            {wishlist_count > 0 && (
                                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-pink text-[10px] font-bold text-brand-text shadow-sm">
                                    {wishlist_count}
                                </span>
                            )}
                        </Link>

                        {/* Cart Icon */}
                        <Link
                            href={route('customer.cart.index')}
                            className="relative p-2 rounded-full text-brand-text hover:text-brand-pink-hover hover:bg-brand-cream/50 transition-colors"
                            title="Keranjang Belanja"
                        >
                            <ShoppingBag size={20} />
                            {cart_count > 0 && (
                                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-pink text-[10px] font-bold text-brand-text shadow-sm">
                                    {cart_count}
                                </span>
                            )}
                        </Link>

                        {/* User Profile / Auth */}
                        <div className="relative">
                            {auth.user ? (
                                <div>
                                    <button
                                        type="button"
                                        onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                        className="flex items-center gap-2 p-1.5 pl-2 rounded-full border border-brand-cream-dark hover:border-brand-pink/60 bg-brand-cream/30 text-xs font-semibold text-brand-text transition-all"
                                    >
                                        <div className="w-7 h-7 rounded-full bg-brand-pink/30 flex items-center justify-center text-brand-text font-bold">
                                            {auth.user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="hidden sm:inline max-w-[100px] truncate">
                                            {auth.user.name}
                                        </span>
                                        <ChevronDown size={14} className="text-brand-text/60" />
                                    </button>

                                    {userDropdownOpen && (
                                        <div
                                            className="absolute right-0 mt-2 w-52 rounded-2xl bg-white p-2 shadow-lg ring-1 ring-black/5 z-50 border border-brand-cream-dark/50"
                                            onClick={() => setUserDropdownOpen(false)}
                                        >
                                            <div className="px-3 py-2 border-b border-brand-cream">
                                                <p className="text-xs font-semibold text-brand-text truncate">{auth.user.name}</p>
                                                <p className="text-[11px] text-brand-text/60 truncate">{auth.user.email}</p>
                                                {auth.user.role === 'admin' && (
                                                    <span className="mt-1 inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                                                        Administrator
                                                    </span>
                                                )}
                                            </div>

                                            {auth.user.role === 'admin' && (
                                                <Link
                                                    href={route('admin.dashboard')}
                                                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-brand-text hover:bg-brand-cream transition-colors"
                                                >
                                                    <Shield size={15} className="text-brand-sage" />
                                                    <span>Admin Dashboard</span>
                                                </Link>
                                            )}

                                            <Link
                                                href={route('customer.orders.index')}
                                                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-brand-text hover:bg-brand-cream transition-colors"
                                            >
                                                <Package size={15} className="text-brand-pink-hover" />
                                                <span>Pesanan Saya</span>
                                            </Link>

                                            <Link
                                                href={route('profile.edit')}
                                                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-brand-text hover:bg-brand-cream transition-colors"
                                            >
                                                <User size={15} className="text-brand-text/70" />
                                                <span>Profil Akun</span>
                                            </Link>

                                            <div className="pt-1 mt-1 border-t border-brand-cream">
                                                <Link
                                                    href={route('logout')}
                                                    method="post"
                                                    as="button"
                                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                                                >
                                                    <LogOut size={15} />
                                                    <span>Keluar</span>
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Link
                                        href={route('login')}
                                        className="text-xs font-semibold text-brand-text hover:text-brand-pink-hover px-3 py-2 rounded-full transition-colors"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="text-xs font-semibold bg-brand-pink hover:bg-brand-pink-hover text-brand-text px-4 py-2 rounded-full shadow-sm hover:shadow transition-all"
                                    >
                                        Daftar
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Drawer */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-brand-cream bg-white/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-3">
                    <Link
                        href="/"
                        className="block py-2 px-3 rounded-xl text-sm font-medium text-brand-text hover:bg-brand-cream"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Beranda
                    </Link>
                    <Link
                        href={route('catalog.index')}
                        className="block py-2 px-3 rounded-xl text-sm font-medium text-brand-text hover:bg-brand-cream"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Katalog Lengkap
                    </Link>
                    <div className="pt-2 border-t border-brand-cream">
                        <span className="text-xs font-bold text-brand-text/50 uppercase tracking-wider px-3">
                            Kategori Hijab
                        </span>
                        <div className="grid grid-cols-2 gap-1.5 mt-2">
                            {['Pashmina', 'Segi Empat', 'Bergo', 'Instan'].map((cat) => (
                                <Link
                                    key={cat}
                                    href={route('catalog.index', { category: cat.toLowerCase().replace(' ', '-') })}
                                    className="py-1.5 px-3 rounded-lg text-xs font-medium text-brand-text hover:bg-brand-cream"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {cat}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
