import React from 'react';
import { Link, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { ShoppingBag, Trash2, ArrowRight, Minus, Plus, ArrowLeft } from 'lucide-react';

export default function Cart({ cart = { items: [], subtotal: 0 } }) {
    const items = cart.items || [];

    const formatRupiah = (val) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(val);
    };

    const handleUpdateQuantity = (itemId, newQty, maxStock) => {
        if (newQty < 1 || newQty > maxStock) return;

        router.patch(route('customer.cart.update', itemId), {
            quantity: newQty,
        }, {
            preserveScroll: true,
        });
    };

    const handleRemoveItem = (itemId) => {
        if (confirm('Yakin ingin menghapus produk ini dari keranjang?')) {
            router.delete(route('customer.cart.destroy', itemId), {
                preserveScroll: true,
            });
        }
    };

    return (
        <MainLayout title="Keranjang Belanja — HijabStyle">
            <div className="bg-brand-cream/30 py-6 border-b border-brand-cream-dark/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="font-playfair text-3xl font-bold italic text-brand-text">
                        Keranjang Belanja
                    </h1>
                    <p className="text-xs sm:text-sm text-brand-text/70 mt-1">
                        Periksa kembali pilihan hijab dan jumlah pesanan Anda sebelum melanjutkan ke checkout.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {items.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Cart Items Table (8 cols) */}
                        <div className="lg:col-span-8 bg-white rounded-3xl border border-brand-cream-dark/60 p-6 shadow-sm divide-y divide-brand-cream">
                            {items.map((item) => (
                                <div key={item.id} className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <Link href={route('catalog.show', item.variant.product.slug)} className="shrink-0">
                                            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-brand-cream border border-brand-cream-dark/60">
                                                <img
                                                    src={`/${item.variant.product.image}`}
                                                    alt={item.variant.product.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = '/products/placeholder.jpg';
                                                    }}
                                                />
                                            </div>
                                        </Link>

                                        <div className="space-y-1">
                                            <Link
                                                href={route('catalog.show', item.variant.product.slug)}
                                                className="text-sm font-semibold text-brand-text hover:text-brand-pink-hover transition-colors line-clamp-1"
                                            >
                                                {item.variant.product.name}
                                            </Link>
                                            <div className="flex items-center gap-2 text-xs text-brand-text/70">
                                                <span className="px-2 py-0.5 rounded-full bg-brand-cream text-[11px] font-medium text-brand-text">
                                                    Warna: {item.variant.color}
                                                </span>
                                                <span>•</span>
                                                <span className="font-semibold text-brand-text">
                                                    {formatRupiah(item.variant.final_price)}
                                                </span>
                                            </div>
                                            {item.variant.stock <= 5 && (
                                                <p className="text-[10px] font-medium text-amber-700">
                                                    Sisa stok: {item.variant.stock} pcs
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Quantity and Actions */}
                                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                                        {/* Qty control */}
                                        <div className="flex items-center rounded-xl border border-brand-cream-dark bg-white overflow-hidden shadow-xs">
                                            <button
                                                type="button"
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1, item.variant.stock)}
                                                disabled={item.quantity <= 1}
                                                className="p-2 hover:bg-brand-cream text-brand-text disabled:opacity-40 transition-colors"
                                            >
                                                <Minus size={13} />
                                            </button>
                                            <span className="w-9 text-center text-xs font-bold text-brand-text">
                                                {item.quantity}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1, item.variant.stock)}
                                                disabled={item.quantity >= item.variant.stock}
                                                className="p-2 hover:bg-brand-cream text-brand-text disabled:opacity-40 transition-colors"
                                            >
                                                <Plus size={13} />
                                            </button>
                                        </div>

                                        {/* Item Total */}
                                        <div className="text-right min-w-[90px]">
                                            <span className="font-bold text-sm text-brand-text">
                                                {formatRupiah(item.subtotal)}
                                            </span>
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveItem(item.id)}
                                            className="p-2 rounded-xl text-brand-text/40 hover:text-red-600 hover:bg-red-50 transition-colors"
                                            title="Hapus Produk"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary (4 cols) */}
                        <div className="lg:col-span-4 bg-white rounded-3xl border border-brand-cream-dark/60 p-6 shadow-sm space-y-5 sticky top-28">
                            <h3 className="font-playfair text-lg font-bold italic text-brand-text pb-3 border-b border-brand-cream">
                                Ringkasan Belanja
                            </h3>

                            <div className="space-y-3 text-xs text-brand-text/80">
                                <div className="flex justify-between">
                                    <span>Total Item:</span>
                                    <span className="font-semibold text-brand-text">
                                        {items.reduce((acc, i) => acc + i.quantity, 0)} pcs
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Subtotal:</span>
                                    <span className="font-bold text-brand-text text-sm">
                                        {formatRupiah(cart.subtotal)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-brand-text/60">
                                    <span>Ongkos Kirim:</span>
                                    <span>Dihitung di Checkout</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-brand-cream flex justify-between items-baseline">
                                <span className="font-bold text-sm text-brand-text">Total Estimasi:</span>
                                <span className="font-playfair text-xl font-bold text-brand-text">
                                    {formatRupiah(cart.subtotal)}
                                </span>
                            </div>

                            <div className="space-y-2 pt-2">
                                <Link
                                    href={route('customer.checkout.index')}
                                    className="w-full py-3.5 px-6 rounded-full bg-brand-pink hover:bg-brand-pink-hover text-brand-text font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 text-center"
                                >
                                    <span>Lanjut ke Checkout</span>
                                    <ArrowRight size={16} />
                                </Link>

                                <Link
                                    href={route('catalog.index')}
                                    className="w-full py-2.5 px-4 text-center block text-xs font-semibold text-brand-text/70 hover:text-brand-text transition-colors"
                                >
                                    ← Lanjut Pilih Hijab Lain
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Empty Cart State */
                    <div className="max-w-md mx-auto text-center py-16 px-4 bg-white rounded-3xl border border-brand-cream-dark/60 shadow-sm space-y-4">
                        <div className="w-20 h-20 mx-auto rounded-full bg-brand-cream flex items-center justify-center text-brand-pink-hover">
                            <ShoppingBag size={36} />
                        </div>
                        <h3 className="font-playfair text-2xl font-bold italic text-brand-text">
                            Keranjang Belanja Kosong
                        </h3>
                        <p className="text-xs text-brand-text/70 leading-relaxed">
                            Yuk, temukan koleksi hijab cantik favoritmu dan tambahkan ke keranjang untuk melakukan pemesanan.
                        </p>
                        <div className="pt-2">
                            <Link
                                href={route('catalog.index')}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-pink hover:bg-brand-pink-hover text-brand-text text-xs font-semibold shadow-md transition-all"
                            >
                                <span>Lihat Katalog Hijab</span>
                                <ArrowRight size={15} />
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
