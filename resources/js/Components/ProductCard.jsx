import React from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { Heart, Eye } from 'lucide-react';
import RatingStars from './RatingStars';

export default function ProductCard({ product, isWishlisted = false }) {
    const { auth } = usePage().props;

    // Calculate price display
    const variants = product.variants || [];
    let minPrice = product.base_price;
    let maxPrice = product.base_price;

    if (variants.length > 0) {
        const prices = variants.map(v => v.price_override ? Number(v.price_override) : Number(product.base_price));
        minPrice = Math.min(...prices);
        maxPrice = Math.max(...prices);
    }

    const formatRupiah = (val) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(val);
    };

    const primaryImage = product.primary_image?.image_path ||
        (product.images && product.images[0]?.image_path) ||
        'products/placeholder.jpg';

    const handleWishlistToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!auth.user) {
            router.get(route('login'));
            return;
        }

        router.post(route('customer.wishlist.toggle'), {
            product_id: product.id,
        }, {
            preserveScroll: true,
        });
    };

    return (
        <div className="group relative flex flex-col rounded-2xl bg-white border border-brand-cream-dark/60 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            {/* Image Container */}
            <div className="relative aspect-square w-full overflow-hidden bg-brand-cream/50">
                <img
                    src={`/${primaryImage}`}
                    alt={product.name}
                    className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/products/placeholder.jpg';
                    }}
                />

                {/* Category Badge */}
                {product.category && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/90 backdrop-blur-sm text-brand-text shadow-sm">
                        {product.category.name}
                    </span>
                )}

                {/* Wishlist Button */}
                <button
                    type="button"
                    onClick={handleWishlistToggle}
                    title={isWishlisted ? 'Hapus dari Wishlist' : 'Tambah ke Wishlist'}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all shadow-sm ${
                        isWishlisted
                            ? 'bg-red-50 text-red-500 hover:bg-red-100'
                            : 'bg-white/80 text-gray-400 hover:text-brand-pink-hover hover:bg-white'
                    }`}
                >
                    <Heart
                        size={18}
                        className={isWishlisted ? 'fill-red-500 text-red-500' : ''}
                    />
                </button>

                {/* Hover overlay quick action */}
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Link
                        href={route('catalog.show', product.slug)}
                        className="w-full py-2 px-3 rounded-xl bg-white/95 hover:bg-white text-brand-text text-xs font-semibold text-center flex items-center justify-center gap-1.5 shadow-md backdrop-blur-sm transition-transform active:scale-95"
                    >
                        <Eye size={14} />
                        <span>Lihat Detail</span>
                    </Link>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-4">
                <Link href={route('catalog.show', product.slug)} className="group/title">
                    <h3 className="text-sm font-semibold text-brand-text group-hover/title:text-brand-pink-hover line-clamp-2 transition-colors">
                        {product.name}
                    </h3>
                </Link>

                <div className="mt-2 flex items-center justify-between">
                    <div className="text-sm font-bold text-brand-text">
                        {minPrice === maxPrice
                            ? formatRupiah(minPrice)
                            : `${formatRupiah(minPrice)} - ${formatRupiah(maxPrice)}`}
                    </div>
                </div>

                <div className="mt-2.5 pt-2.5 border-t border-brand-cream flex items-center justify-between text-xs text-brand-text/70">
                    <RatingStars
                        rating={product.avg_rating || product.reviews_avg_rating || 0}
                        count={product.reviews_count || 0}
                        size={13}
                    />
                    {variants.length > 0 && (
                        <span className="text-[11px] text-brand-text/60">
                            {variants.length} warna
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
