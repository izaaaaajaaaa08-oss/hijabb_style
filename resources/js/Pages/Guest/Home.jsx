import React from 'react';
import { Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import ProductCard from '@/Components/ProductCard';
import { Sparkles, ArrowRight, ShieldCheck, Heart, Truck, Award } from 'lucide-react';

export default function Home({ categories = [], featuredProducts = [], userWishlists = [] }) {
    const wishlistSet = new Set(userWishlists);

    const categoryIcons = {
        'segi-empat': '🌸',
        'pashmina': '✨',
        'bergo': '🌿',
        'instan': '⚡',
    };

    return (
        <MainLayout title="HijabStyle — Koleksi Hijab Anggun & Elegan">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-b from-brand-cream/60 via-brand-cream/30 to-white pt-8 pb-16 lg:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        {/* Text Content */}
                        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-pink/20 border border-brand-pink/40 text-brand-text text-xs font-semibold">
                                <Sparkles size={14} className="text-brand-pink-hover" />
                                <span>Koleksi Eksklusif Terbaru 2026</span>
                            </div>

                            <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold italic text-brand-text leading-tight tracking-tight">
                                Sentuhan Keanggunan Muslimah Masa Kini
                            </h1>

                            <p className="text-sm sm:text-base text-brand-text/80 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                                Temukan pilihan hijab premium berbahan adem, jatuh sempurna, dan warna-warna pastel lembut yang dirancang khusus untuk menemani setiap harimu tampil memikat dan santun.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                                <Link
                                    href={route('catalog.index')}
                                    className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-brand-pink hover:bg-brand-pink-hover text-brand-text font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
                                >
                                    <span>Jelajahi Katalog</span>
                                    <ArrowRight size={16} />
                                </Link>

                                <Link
                                    href={route('catalog.index', { category: 'pashmina' })}
                                    className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white hover:bg-brand-cream text-brand-text font-semibold text-sm border border-brand-cream-dark shadow-sm hover:shadow transition-all flex items-center justify-center"
                                >
                                    Pashmina Series
                                </Link>
                            </div>

                            {/* Mini Trust Stats */}
                            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-brand-cream max-w-md mx-auto lg:mx-0 text-left">
                                <div>
                                    <span className="block font-playfair text-2xl font-bold text-brand-text">100%</span>
                                    <span className="text-[11px] text-brand-text/70">Kain Premium</span>
                                </div>
                                <div>
                                    <span className="block font-playfair text-2xl font-bold text-brand-text">24+</span>
                                    <span className="text-[11px] text-brand-text/70">Varian Warna</span>
                                </div>
                                <div>
                                    <span className="block font-playfair text-2xl font-bold text-brand-text">Toko Fisik</span>
                                    <span className="text-[11px] text-brand-text/70">Palu Barat</span>
                                </div>
                            </div>
                        </div>

                        {/* Visual Image / Banner */}
                        <div className="lg:col-span-5 relative">
                            <div className="relative mx-auto max-w-md lg:max-w-none">
                                <div className="absolute -inset-4 bg-gradient-to-tr from-brand-pink/30 to-brand-sage/25 rounded-3xl blur-2xl -z-10" />
                                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 aspect-[4/3] lg:aspect-square bg-brand-cream">
                                    <img
                                        src="/images/hero-banner.jpg"
                                        alt="HijabStyle Boutique Collection"
                                        className="w-full h-full object-cover object-center"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/products/placeholder.jpg';
                                        }}
                                    />
                                </div>

                                {/* Floating Tag Card */}
                                <div className="absolute -bottom-5 -left-5 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-brand-cream-dark/60 shadow-xl flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-brand-pink/30 flex items-center justify-center text-brand-pink-hover">
                                        <Award size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-brand-text">Jahitan Halus Tepi</p>
                                        <p className="text-[10px] text-brand-text/60">Finishing butik rapi & awet</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Shortcut Section */}
            <section className="py-14 bg-white border-y border-brand-cream-dark/40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-xl mx-auto mb-10">
                        <span className="text-xs font-bold tracking-widest text-brand-pink-hover uppercase">Koleksi Pilihan</span>
                        <h2 className="font-playfair text-3xl font-bold italic text-brand-text mt-1">
                            Pilih Berdasarkan Kategori
                        </h2>
                        <p className="text-xs sm:text-sm text-brand-text/70 mt-2">
                            Pilihan model hijab favorit dengan karakteristik bahan dan gaya yang sesuai dengan kenyamananmu.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                        {categories.map((cat) => (
                            <Link
                                key={cat.id}
                                href={route('catalog.index', { category: cat.slug })}
                                className="group relative rounded-2xl bg-brand-cream/30 hover:bg-brand-pink/15 border border-brand-cream-dark/60 hover:border-brand-pink/60 p-6 text-center transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md"
                            >
                                <div className="w-14 h-14 mx-auto rounded-2xl bg-white group-hover:bg-brand-pink/30 flex items-center justify-center text-2xl shadow-sm border border-brand-cream-dark/40 transition-colors mb-4">
                                    {categoryIcons[cat.slug] || '✨'}
                                </div>
                                <h3 className="font-semibold text-sm text-brand-text group-hover:text-brand-pink-hover transition-colors">
                                    {cat.name}
                                </h3>
                                <p className="text-xs text-brand-text/60 mt-1">
                                    {cat.products_count ?? 0} Produk
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured / Latest Products Section */}
            <section className="py-16 bg-brand-cream/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
                        <div>
                            <span className="text-xs font-bold tracking-widest text-brand-pink-hover uppercase">Produk Unggulan</span>
                            <h2 className="font-playfair text-3xl font-bold italic text-brand-text mt-1">
                                Koleksi Terkini & Terfavorit
                            </h2>
                        </div>
                        <Link
                            href={route('catalog.index')}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-pink-hover hover:text-brand-text transition-colors group"
                        >
                            <span>Lihat Semua Koleksi</span>
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {featuredProducts.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                            {featuredProducts.map((prod) => (
                                <ProductCard
                                    key={prod.id}
                                    product={prod}
                                    isWishlisted={wishlistSet.has(prod.id)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-2xl border border-brand-cream-dark p-8">
                            <p className="text-sm text-brand-text/60">Belum ada produk yang ditampilkan.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Store Information & About Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="rounded-3xl bg-gradient-to-r from-brand-cream to-brand-pink/20 p-8 sm:p-12 border border-brand-cream-dark/60 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-8">
                        <div className="space-y-4 max-w-2xl text-center lg:text-left">
                            <span className="text-xs font-bold uppercase tracking-wider text-brand-pink-hover">
                                Toko Fisik HijabStyle Palu
                            </span>
                            <h3 className="font-playfair text-2xl sm:text-3xl font-bold italic text-brand-text">
                                Hadir Lebih Dekat, Belanja Lebih Nyaman
                            </h3>
                            <p className="text-xs sm:text-sm text-brand-text/80 leading-relaxed">
                                Selain pemesanan online, Anda juga dapat berkunjung langsung ke butik kami di Palu Barat untuk merasakan langsung kelembutan bahan dan mencoba ragam warna hijab yang pas dengan selera Anda.
                            </p>
                        </div>
                        <div className="shrink-0">
                            <Link
                                href={route('catalog.index')}
                                className="px-8 py-3.5 rounded-full bg-brand-text hover:bg-brand-text/90 text-white font-semibold text-xs shadow-md transition-all active:scale-95"
                            >
                                Mulai Belanja Sekarang
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
