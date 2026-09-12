import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import VariantSelector from '@/Components/VariantSelector';
import RatingStars from '@/Components/RatingStars';
import ProductCard from '@/Components/ProductCard';
import { Heart, ShoppingBag, Truck, ShieldCheck, ChevronRight, Minus, Plus, MessageSquare, Check, ArrowLeft } from 'lucide-react';

export default function ProductDetail({
    product,
    relatedProducts = [],
    isWishlisted = false
}) {
    const { auth } = usePage().props;

    const variants = product.variants || [];
    const [selectedVariant, setSelectedVariant] = useState(variants[0] || null);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const images = product.images && product.images.length > 0
        ? product.images
        : [{ image_path: 'products/placeholder.jpg', is_primary: true }];

    const activeImage = images[selectedImageIndex]?.image_path || 'products/placeholder.jpg';

    // Calculate current price
    const currentPrice = selectedVariant?.price_override
        ? Number(selectedVariant.price_override)
        : Number(product.base_price);

    const formatRupiah = (val) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(val);
    };

    const handleQuantityChange = (type) => {
        if (!selectedVariant) return;
        if (type === 'dec' && quantity > 1) {
            setQuantity(quantity - 1);
        } else if (type === 'inc' && quantity < selectedVariant.stock) {
            setQuantity(quantity + 1);
        }
    };

    const handleAddToCart = (isBuyNow = false) => {
        if (!auth.user) {
            router.get(route('login'));
            return;
        }

        if (!selectedVariant || selectedVariant.stock <= 0) return;

        router.post(route('customer.cart.store'), {
            product_variant_id: selectedVariant.id,
            quantity: quantity,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                if (isBuyNow) {
                    router.get(route('customer.cart.index'));
                }
            }
        });
    };

    const handleWishlistToggle = () => {
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
        <MainLayout title={`${product.name} — HijabStyle`}>
            {/* Breadcrumbs */}
            <div className="bg-brand-cream/30 py-4 border-b border-brand-cream-dark/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex items-center gap-1.5 text-xs text-brand-text/60">
                        <Link href="/" className="hover:text-brand-pink-hover transition-colors">Beranda</Link>
                        <ChevronRight size={12} />
                        <Link href={route('catalog.index')} className="hover:text-brand-pink-hover transition-colors">Katalog</Link>
                        {product.category && (
                            <>
                                <ChevronRight size={12} />
                                <Link
                                    href={route('catalog.index', { category: product.category.slug })}
                                    className="hover:text-brand-pink-hover transition-colors"
                                >
                                    {product.category.name}
                                </Link>
                            </>
                        )}
                        <ChevronRight size={12} />
                        <span className="text-brand-text font-semibold truncate max-w-[200px] sm:max-w-none">
                            {product.name}
                        </span>
                    </nav>
                </div>
            </div>

            {/* Product Overview Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Left: Image Gallery (5 cols) */}
                    <div className="lg:col-span-6 space-y-4">
                        <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-brand-cream/40 border border-brand-cream-dark/60 shadow-sm">
                            <img
                                src={`/${activeImage}`}
                                alt={product.name}
                                className="w-full h-full object-cover object-center"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/products/placeholder.jpg';
                                }}
                            />

                            {/* Category Label */}
                            {product.category && (
                                <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-brand-text shadow-sm">
                                    {product.category.name}
                                </span>
                            )}
                        </div>

                        {/* Image Thumbnails if multi-image */}
                        {images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setSelectedImageIndex(idx)}
                                        className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                                            selectedImageIndex === idx
                                                ? 'border-brand-pink ring-2 ring-brand-pink/40 shadow-sm'
                                                : 'border-transparent opacity-70 hover:opacity-100'
                                        }`}
                                    >
                                        <img
                                            src={`/${img.image_path}`}
                                            alt=""
                                            className="w-full h-full object-cover object-center"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/products/placeholder.jpg';
                                            }}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Product Details & Purchase Form (7 cols) */}
                    <div className="lg:col-span-6 space-y-6">
                        {/* Title & Rating */}
                        <div>
                            <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-brand-text leading-snug">
                                {product.name}
                            </h1>

                            <div className="mt-2.5 flex items-center gap-4 text-xs">
                                <RatingStars
                                    rating={product.avg_rating || product.reviews_avg_rating || 0}
                                    size={16}
                                    showNumber
                                />
                                <span className="text-brand-text/30">|</span>
                                <span className="text-brand-text/70">
                                    {product.reviews_count || 0} Ulasan Pelanggan
                                </span>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="p-4 rounded-2xl bg-brand-cream/40 border border-brand-cream-dark/60 flex items-baseline gap-3">
                            <span className="font-playfair text-3xl font-bold text-brand-text">
                                {formatRupiah(currentPrice)}
                            </span>
                            <span className="text-xs text-brand-text/60">
                                Harga per pcs
                            </span>
                        </div>

                        {/* Variant Selection */}
                        <VariantSelector
                            variants={variants}
                            selectedVariant={selectedVariant}
                            onSelectVariant={(v) => {
                                setSelectedVariant(v);
                                setQuantity(1);
                            }}
                        />

                        {/* Quantity Selector */}
                        {selectedVariant && selectedVariant.stock > 0 && (
                            <div className="flex items-center gap-4 pt-2">
                                <span className="text-sm font-semibold text-brand-text">Jumlah:</span>
                                <div className="flex items-center rounded-2xl border border-brand-cream-dark bg-white overflow-hidden shadow-sm">
                                    <button
                                        type="button"
                                        onClick={() => handleQuantityChange('dec')}
                                        disabled={quantity <= 1}
                                        className="p-2.5 hover:bg-brand-cream text-brand-text disabled:opacity-40 transition-colors"
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span className="w-12 text-center text-xs font-bold text-brand-text">
                                        {quantity}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleQuantityChange('inc')}
                                        disabled={quantity >= selectedVariant.stock}
                                        className="p-2.5 hover:bg-brand-cream text-brand-text disabled:opacity-40 transition-colors"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                                <span className="text-xs text-brand-text/60">
                                    Subtotal: <span className="font-bold text-brand-text">{formatRupiah(currentPrice * quantity)}</span>
                                </span>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => handleAddToCart(false)}
                                disabled={!selectedVariant || selectedVariant.stock <= 0}
                                className="flex-1 py-3.5 px-6 rounded-full bg-brand-pink hover:bg-brand-pink-hover text-brand-text font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ShoppingBag size={18} />
                                <span>+ Keranjang Belanja</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => handleAddToCart(true)}
                                disabled={!selectedVariant || selectedVariant.stock <= 0}
                                className="py-3.5 px-6 rounded-full bg-brand-text hover:bg-brand-text/90 text-white font-semibold text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Beli Sekarang
                            </button>

                            <button
                                type="button"
                                onClick={handleWishlistToggle}
                                className={`p-3.5 rounded-full border border-brand-cream-dark transition-all shadow-sm ${
                                    isWishlisted
                                        ? 'bg-red-50 text-red-500 border-red-200'
                                        : 'bg-white text-gray-400 hover:text-brand-pink-hover hover:border-brand-pink'
                                }`}
                                title={isWishlisted ? 'Hapus dari Wishlist' : 'Simpan ke Wishlist'}
                            >
                                <Heart size={20} className={isWishlisted ? 'fill-red-500 text-red-500' : ''} />
                            </button>
                        </div>

                        {/* Value reassurance */}
                        <div className="pt-4 border-t border-brand-cream space-y-2 text-xs text-brand-text/70">
                            <div className="flex items-center gap-2">
                                <Truck size={15} className="text-brand-pink-hover" />
                                <span>Pengiriman aman dan cepat dari butik Palu Barat</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck size={15} className="text-brand-sage-dark" />
                                <span>Jaminan 100% bahan adem, nyaman dipakai seharian</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs: Description & Reviews */}
                <div className="mt-16 pt-8 border-t border-brand-cream-dark/60">
                    <div className="flex items-center gap-6 border-b border-brand-cream pb-3">
                        <button
                            type="button"
                            onClick={() => setActiveTab('description')}
                            className={`font-semibold text-sm pb-3 relative transition-colors ${
                                activeTab === 'description'
                                    ? 'text-brand-text font-bold'
                                    : 'text-brand-text/50 hover:text-brand-text'
                            }`}
                        >
                            <span>Deskripsi Produk</span>
                            {activeTab === 'description' && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-pink rounded-full" />
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('reviews')}
                            className={`font-semibold text-sm pb-3 relative transition-colors flex items-center gap-1.5 ${
                                activeTab === 'reviews'
                                    ? 'text-brand-text font-bold'
                                    : 'text-brand-text/50 hover:text-brand-text'
                            }`}
                        >
                            <span>Ulasan Pembeli</span>
                            <span className="px-2 py-0.5 rounded-full bg-brand-cream text-[10px] font-bold text-brand-text">
                                {product.reviews?.length || 0}
                            </span>
                            {activeTab === 'reviews' && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-pink rounded-full" />
                            )}
                        </button>
                    </div>

                    {/* Tab Contents */}
                    <div className="py-6">
                        {activeTab === 'description' ? (
                            <div className="max-w-3xl text-sm text-brand-text/80 leading-relaxed space-y-4">
                                <p>{product.description}</p>
                                <div className="p-4 rounded-2xl bg-white border border-brand-cream-dark/60 space-y-2">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-brand-text">
                                        Petunjuk Perawatan:
                                    </h4>
                                    <ul className="list-disc list-inside text-xs text-brand-text/70 space-y-1">
                                        <li>Cuci dengan tangan menggunakan deterjen lembut</li>
                                        <li>Hindari memeras terlalu kuat untuk menjaga serat kain</li>
                                        <li>Setrika dengan suhu rendah atau gunakan setrika uap</li>
                                        <li>Jemur di tempat teduh terhindar dari paparan sinar matahari langsung</li>
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6 max-w-3xl">
                                {product.reviews && product.reviews.length > 0 ? (
                                    <div className="space-y-4">
                                        {product.reviews.map((rev) => (
                                            <div key={rev.id} className="p-4 rounded-2xl bg-white border border-brand-cream-dark/60 shadow-sm space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-brand-pink/30 flex items-center justify-center text-xs font-bold text-brand-text">
                                                            {rev.user?.name?.charAt(0) || 'U'}
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-semibold text-brand-text">{rev.user?.name || 'Customer'}</p>
                                                            <p className="text-[10px] text-brand-text/50">
                                                                {new Date(rev.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <RatingStars rating={rev.rating} size={14} />
                                                </div>
                                                <p className="text-xs text-brand-text/80 leading-relaxed pl-10">
                                                    {rev.comment}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-10 bg-white rounded-2xl border border-brand-cream-dark p-6">
                                        <MessageSquare size={32} className="mx-auto text-brand-text/30 mb-2" />
                                        <p className="text-xs text-brand-text/70">Belum ada ulasan untuk produk ini.</p>
                                        <p className="text-[11px] text-brand-text/50 mt-1">Ulasan dapat diberikan setelah menyelesaikan pesanan.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <div className="mt-16 pt-10 border-t border-brand-cream-dark/60">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="font-playfair text-2xl font-bold italic text-brand-text">
                                Produk Serupa
                            </h2>
                            <Link
                                href={route('catalog.index', { category: product.category?.slug })}
                                className="text-xs font-semibold text-brand-pink-hover hover:text-brand-text transition-colors"
                            >
                                Lihat Semua
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                            {relatedProducts.map((rel) => (
                                <ProductCard key={rel.id} product={rel} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
