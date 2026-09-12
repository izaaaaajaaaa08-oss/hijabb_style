import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import ProductCard from '@/Components/ProductCard';
import { Filter, Search, RotateCcw, ChevronRight } from 'lucide-react';

export default function ProductList({
    products = { data: [], links: [] },
    categories = [],
    filters = {},
    userWishlists = []
}) {
    const wishlistSet = new Set(userWishlists);

    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedColor, setSelectedColor] = useState(filters.color || '');
    const [sortOption, setSortOption] = useState(filters.sort || 'latest');
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

    const colorsList = ['Hitam', 'Maroon', 'Dusty Pink', 'Sage Green', 'Cream'];

    const applyFilters = (newFilters = {}) => {
        const queryParams = {
            category: selectedCategory || undefined,
            search: searchTerm || undefined,
            color: selectedColor || undefined,
            sort: sortOption || undefined,
            ...newFilters,
        };

        // Remove empty keys
        Object.keys(queryParams).forEach(key => {
            if (!queryParams[key]) delete queryParams[key];
        });

        router.get(route('catalog.index'), queryParams, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleCategoryClick = (slug) => {
        const next = selectedCategory === slug ? '' : slug;
        setSelectedCategory(next);
        applyFilters({ category: next || undefined });
    };

    const handleColorClick = (color) => {
        const next = selectedColor === color ? '' : color;
        setSelectedColor(next);
        applyFilters({ color: next || undefined });
    };

    const handleSortChange = (e) => {
        const next = e.target.value;
        setSortOption(next);
        applyFilters({ sort: next });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        applyFilters({ search: searchTerm || undefined });
    };

    const resetFilters = () => {
        setSelectedCategory('');
        setSearchTerm('');
        setSelectedColor('');
        setSortOption('latest');
        router.get(route('catalog.index'));
    };

    return (
        <MainLayout title="Katalog Produk — HijabStyle">
            <div className="bg-brand-cream/30 py-8 border-b border-brand-cream-dark/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-1.5 text-xs text-brand-text/60 mb-2">
                        <Link href="/" className="hover:text-brand-pink-hover transition-colors">Beranda</Link>
                        <ChevronRight size={12} />
                        <span className="text-brand-text font-semibold">Katalog Produk</span>
                    </nav>

                    <h1 className="font-playfair text-3xl font-bold italic text-brand-text">
                        Koleksi Lengkap Hijab
                    </h1>
                    <p className="text-xs sm:text-sm text-brand-text/70 mt-1">
                        Pilih gaya hijab favoritmu dari ragam material premium dan pilihan warna memikat.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filter Sidebar - Desktop */}
                    <aside className="hidden lg:block w-64 shrink-0 space-y-6">
                        {/* Search in Catalog */}
                        <div className="p-5 rounded-2xl bg-white border border-brand-cream-dark/60 shadow-sm space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-text/80">
                                Cari Produk
                            </h3>
                            <form onSubmit={handleSearchSubmit} className="relative">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Ketik nama hijab..."
                                    className="w-full pl-3 pr-8 py-2 text-xs rounded-xl border border-brand-cream-dark focus:border-brand-pink focus:ring-1 focus:ring-brand-pink bg-brand-cream/30"
                                />
                                <button type="submit" className="absolute right-2.5 top-2.5 text-brand-text/60 hover:text-brand-text">
                                    <Search size={14} />
                                </button>
                            </form>
                        </div>

                        {/* Category Filter */}
                        <div className="p-5 rounded-2xl bg-white border border-brand-cream-dark/60 shadow-sm space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-text/80">
                                Kategori
                            </h3>
                            <div className="space-y-1.5">
                                <button
                                    type="button"
                                    onClick={() => handleCategoryClick('')}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                                        selectedCategory === ''
                                            ? 'bg-brand-pink/20 text-brand-text font-bold'
                                            : 'text-brand-text/80 hover:bg-brand-cream/60'
                                    }`}
                                >
                                    <span>Semua Kategori</span>
                                </button>

                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => handleCategoryClick(cat.slug)}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                                            selectedCategory === cat.slug
                                                ? 'bg-brand-pink/20 text-brand-text font-bold'
                                                : 'text-brand-text/80 hover:bg-brand-cream/60'
                                        }`}
                                    >
                                        <span>{cat.name}</span>
                                        <span className="text-[11px] text-brand-text/50">({cat.products_count})</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Color Swatch Filter */}
                        <div className="p-5 rounded-2xl bg-white border border-brand-cream-dark/60 shadow-sm space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-text/80">
                                Warna Favorit
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {colorsList.map((col) => {
                                    const isSelected = selectedColor === col;
                                    return (
                                        <button
                                            key={col}
                                            type="button"
                                            onClick={() => handleColorClick(col)}
                                            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                                                isSelected
                                                    ? 'bg-brand-pink text-brand-text border-brand-pink font-bold shadow-sm'
                                                    : 'bg-white text-brand-text/80 border-brand-cream-dark hover:border-brand-pink/50'
                                            }`}
                                        >
                                            {col}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Reset Filter Button */}
                        {(selectedCategory || searchTerm || selectedColor || sortOption !== 'latest') && (
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="w-full py-2 px-4 rounded-xl border border-brand-cream-dark hover:bg-white text-brand-text/70 hover:text-brand-text text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                            >
                                <RotateCcw size={13} />
                                <span>Reset Semua Filter</span>
                            </button>
                        )}
                    </aside>

                    {/* Main Products Grid */}
                    <div className="flex-1 space-y-6">
                        {/* Top Bar (Results count, mobile filter button, sort dropdown) */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-brand-cream-dark/60 shadow-sm">
                            <div className="text-xs text-brand-text/70">
                                Menampilkan <span className="font-bold text-brand-text">{products.data?.length ?? 0}</span> dari total <span className="font-bold text-brand-text">{products.total ?? 0}</span> hijab
                            </div>

                            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                                {/* Mobile filter trigger */}
                                <button
                                    type="button"
                                    onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                                    className="lg:hidden flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-brand-cream-dark bg-brand-cream/40 text-xs font-medium text-brand-text"
                                >
                                    <Filter size={14} />
                                    <span>Filter</span>
                                </button>

                                {/* Sort Options */}
                                <div className="flex items-center gap-2">
                                    <label htmlFor="sort" className="text-xs text-brand-text/70 hidden sm:inline">Urutkan:</label>
                                    <select
                                        id="sort"
                                        value={sortOption}
                                        onChange={handleSortChange}
                                        className="text-xs rounded-xl border-brand-cream-dark focus:border-brand-pink focus:ring-1 focus:ring-brand-pink bg-brand-cream/20 py-1.5 pl-3 pr-8"
                                    >
                                        <option value="latest">Terbaru</option>
                                        <option value="price_low">Harga: Termurah</option>
                                        <option value="price_high">Harga: Tertinggi</option>
                                        <option value="rating">Rating Tertinggi</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Filters Dropdown */}
                        {mobileFilterOpen && (
                            <div className="lg:hidden p-4 rounded-2xl bg-white border border-brand-cream-dark space-y-4">
                                <div>
                                    <span className="text-xs font-bold text-brand-text block mb-2">Kategori</span>
                                    <div className="flex flex-wrap gap-1.5">
                                        <button
                                            onClick={() => handleCategoryClick('')}
                                            className={`px-3 py-1 rounded-full text-xs ${selectedCategory === '' ? 'bg-brand-pink font-bold' : 'bg-brand-cream'}`}
                                        >
                                            Semua
                                        </button>
                                        {categories.map((cat) => (
                                            <button
                                                key={cat.id}
                                                onClick={() => handleCategoryClick(cat.slug)}
                                                className={`px-3 py-1 rounded-full text-xs ${selectedCategory === cat.slug ? 'bg-brand-pink font-bold' : 'bg-brand-cream'}`}
                                            >
                                                {cat.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <span className="text-xs font-bold text-brand-text block mb-2">Warna</span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {colorsList.map((col) => (
                                            <button
                                                key={col}
                                                onClick={() => handleColorClick(col)}
                                                className={`px-3 py-1 rounded-full text-xs ${selectedColor === col ? 'bg-brand-pink font-bold' : 'bg-brand-cream'}`}
                                            >
                                                {col}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Products Grid */}
                        {products.data?.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                                {products.data.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        isWishlisted={wishlistSet.has(product.id)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-white rounded-3xl border border-brand-cream-dark p-8 space-y-3">
                                <div className="w-16 h-16 mx-auto rounded-full bg-brand-cream flex items-center justify-center text-3xl">
                                    🔍
                                </div>
                                <h3 className="font-semibold text-base text-brand-text">Tidak ada hijab yang cocok</h3>
                                <p className="text-xs text-brand-text/60 max-w-sm mx-auto">
                                    Coba ubah kata kunci pencarian atau reset filter untuk melihat koleksi hijab lainnya.
                                </p>
                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="mt-2 px-5 py-2 rounded-full bg-brand-pink text-brand-text text-xs font-semibold hover:bg-brand-pink-hover shadow-sm"
                                >
                                    Tampilkan Semua Hijab
                                </button>
                            </div>
                        )}

                        {/* Pagination */}
                        {products.links && products.links.length > 3 && (
                            <div className="flex justify-center pt-8">
                                <nav className="inline-flex rounded-2xl bg-white border border-brand-cream-dark p-1.5 gap-1 shadow-sm">
                                    {products.links.map((link, idx) => {
                                        if (!link.url) {
                                            return (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-1.5 text-xs text-brand-text/40 rounded-xl cursor-not-allowed"
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            );
                                        }

                                        return (
                                            <Link
                                                key={idx}
                                                href={link.url}
                                                className={`px-3.5 py-1.5 text-xs rounded-xl font-medium transition-all ${
                                                    link.active
                                                        ? 'bg-brand-pink text-brand-text font-bold shadow-sm'
                                                        : 'text-brand-text hover:bg-brand-cream'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                preserveScroll
                                            />
                                        );
                                    })}
                                </nav>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
