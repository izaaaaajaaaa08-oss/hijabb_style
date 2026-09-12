import React from 'react';
import { Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import ProductCard from '@/Components/ProductCard';
import { Heart, ArrowRight } from 'lucide-react';

export default function Wishlist({ wishlists = [] }) {
    return (
        <MainLayout title="Wishlist Favorit — HijabStyle">
            <div className="bg-brand-cream/30 py-6 border-b border-brand-cream-dark/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="font-playfair text-3xl font-bold italic text-brand-text">
                        Wishlist Favorit Saya
                    </h1>
                    <p className="text-xs sm:text-sm text-brand-text/70 mt-1">
                        Daftar koleksi hijab pilihan yang Anda simpan untuk dipesan nanti.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {wishlists.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {wishlists.map((w) => (
                            <ProductCard
                                key={w.id}
                                product={w.product}
                                isWishlisted={true}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="max-w-md mx-auto text-center py-16 px-4 bg-white rounded-3xl border border-brand-cream-dark/60 shadow-sm space-y-4">
                        <div className="w-20 h-20 mx-auto rounded-full bg-red-50 flex items-center justify-center text-red-400">
                            <Heart size={36} />
                        </div>
                        <h3 className="font-playfair text-2xl font-bold italic text-brand-text">
                            Belum Ada Produk di Wishlist
                        </h3>
                        <p className="text-xs text-brand-text/70 leading-relaxed">
                            Simpan hijab yang Anda sukai dengan menekan ikon hati di kartu produk agar mudah ditemukan kembali.
                        </p>
                        <div className="pt-2">
                            <Link
                                href={route('catalog.index')}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-pink hover:bg-brand-pink-hover text-brand-text text-xs font-semibold shadow-md transition-all"
                            >
                                <span>Cari Hijab Pilihan</span>
                                <ArrowRight size={15} />
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
