import React, { useState } from 'react';
import { Link, router, useForm } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import RatingStars from '@/Components/RatingStars';
import { Package, MapPin, CheckCircle2, Clock, Truck, XCircle, ArrowLeft, Star, MessageSquare, CreditCard, Sparkles } from 'lucide-react';

export default function OrderDetail({
    order,
    snapToken = null,
    userReviewedItemIds = []
}) {
    const [reviewModalItem, setReviewModalItem] = useState(null);
    const reviewedSet = new Set(userReviewedItemIds);

    const { data, setData, post, processing, reset, errors } = useForm({
        order_item_id: '',
        rating: 5,
        comment: '',
    });

    const formatRupiah = (val) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(val);
    };

    const handleOpenReview = (item) => {
        setReviewModalItem(item);
        setData({
            order_item_id: item.id,
            rating: 5,
            comment: '',
        });
    };

    const handleCloseReview = () => {
        setReviewModalItem(null);
        reset();
    };

    const handleSubmitReview = (e) => {
        e.preventDefault();
        post(route('customer.reviews.store'), {
            onSuccess: () => handleCloseReview(),
        });
    };

    const handleSimulatePayment = () => {
        if (confirm('Simulasikan pembayaran sukses (Transfer Bank)?')) {
            router.post(route('customer.orders.simulate-payment', order.id));
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'menunggu_pembayaran':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                        <Clock size={13} />
                        <span>Menunggu Pembayaran</span>
                    </span>
                );
            case 'dibayar':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                        <CheckCircle2 size={13} />
                        <span>Pembayaran Diterima</span>
                    </span>
                );
            case 'diproses':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200">
                        <Package size={13} />
                        <span>Sedang Diproses Toko</span>
                    </span>
                );
            case 'dikirim':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">
                        <Truck size={13} />
                        <span>Dalam Pengiriman</span>
                    </span>
                );
            case 'selesai':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 size={13} />
                        <span>Pesanan Selesai</span>
                    </span>
                );
            case 'dibatalkan':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-800 border border-red-200">
                        <XCircle size={13} />
                        <span>Dibatalkan</span>
                    </span>
                );
            default:
                return <span>{status}</span>;
        }
    };

    return (
        <MainLayout title={`Pesanan ${order.order_number} — HijabStyle`}>
            <div className="bg-brand-cream/30 py-6 border-b border-brand-cream-dark/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link
                        href={route('customer.orders.index')}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-text/70 hover:text-brand-pink-hover transition-colors mb-2"
                    >
                        <ArrowLeft size={14} />
                        <span>Kembali ke Riwayat Pesanan</span>
                    </Link>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <h1 className="font-playfair text-2xl sm:text-3xl font-bold italic text-brand-text">
                            Detail Pesanan #{order.order_number}
                        </h1>
                        <div>{getStatusBadge(order.status)}</div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Details (8 cols) */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Menunggu Pembayaran Action Card */}
                        {order.status === 'menunggu_pembayaran' && (
                            <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 shadow-sm space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0">
                                        <CreditCard size={20} />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-semibold text-sm text-amber-900">
                                            Menunggu Penyelesaian Pembayaran
                                        </h3>
                                        <p className="text-xs text-amber-800/80 leading-relaxed">
                                            Silakan selesaikan pembayaran pesanan Anda via Transfer Bank ke rekening BCA 1234567890 a.n HijabStyle. Untuk demonstrasi lingkungan lokal, Anda dapat menekan tombol simulasi di bawah.
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-2 flex flex-wrap gap-3">
                                    <button
                                        type="button"
                                        onClick={handleSimulatePayment}
                                        className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
                                    >
                                        <Sparkles size={14} />
                                        <span>Simulasikan Pembayaran Berhasil (Demo)</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Items List */}
                        <div className="p-6 rounded-3xl bg-white border border-brand-cream-dark/60 shadow-sm space-y-4">
                            <h3 className="font-playfair text-lg font-bold italic text-brand-text pb-3 border-b border-brand-cream">
                                Produk yang Dipesan
                            </h3>

                            <div className="divide-y divide-brand-cream">
                                {order.items?.map((item) => {
                                    const isReviewed = reviewedSet.has(item.id);
                                    return (
                                        <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-brand-cream shrink-0 border border-brand-cream-dark/40">
                                                    <img
                                                        src={`/${item.variant?.product?.primary_image?.image_path || 'products/placeholder.jpg'}`}
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = '/products/placeholder.jpg';
                                                        }}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <h4 className="text-sm font-semibold text-brand-text">{item.product_name}</h4>
                                                    <p className="text-xs text-brand-text/60">{item.variant_info}</p>
                                                    <p className="text-xs font-medium text-brand-text">
                                                        {formatRupiah(item.price)} x {item.quantity}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                                                <span className="font-bold text-sm text-brand-text">
                                                    {formatRupiah(item.subtotal)}
                                                </span>

                                                {/* Review action button if order is finished */}
                                                {order.status === 'selesai' && (
                                                    <div>
                                                        {isReviewed ? (
                                                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                                                                <CheckCircle2 size={12} />
                                                                <span>Sudah Diulas</span>
                                                            </span>
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleOpenReview(item)}
                                                                className="px-3.5 py-1.5 rounded-full bg-brand-pink/30 hover:bg-brand-pink text-brand-text text-xs font-semibold transition-colors flex items-center gap-1"
                                                            >
                                                                <Star size={13} className="fill-amber-400 text-amber-400" />
                                                                <span>Beri Ulasan</span>
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="p-6 rounded-3xl bg-white border border-brand-cream-dark/60 shadow-sm space-y-3">
                            <div className="flex items-center gap-2 pb-3 border-b border-brand-cream">
                                <MapPin size={18} className="text-brand-pink-hover" />
                                <h3 className="font-playfair text-lg font-bold italic text-brand-text">
                                    Alamat Pengiriman
                                </h3>
                            </div>

                            {order.address ? (
                                <div className="text-xs text-brand-text/80 space-y-1 leading-relaxed">
                                    <p className="font-bold text-sm text-brand-text">
                                        {order.address.recipient_name} ({order.address.phone})
                                    </p>
                                    <p>{order.address.full_address}</p>
                                    <p>{order.address.city}, {order.address.postal_code}</p>
                                </div>
                            ) : (
                                <p className="text-xs text-brand-text/60">Data alamat tidak tersedia.</p>
                            )}
                        </div>
                    </div>

                    {/* Right Summary (4 cols) */}
                    <div className="lg:col-span-4 bg-white rounded-3xl border border-brand-cream-dark/60 p-6 shadow-sm space-y-4 sticky top-28">
                        <h3 className="font-playfair text-lg font-bold italic text-brand-text pb-3 border-b border-brand-cream">
                            Rincian Pembayaran
                        </h3>

                        <div className="space-y-2.5 text-xs text-brand-text/80">
                            <div className="flex justify-between">
                                <span>Metode Pembayaran:</span>
                                <span className="font-semibold text-brand-text uppercase">{order.payment_method || 'Midtrans'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Subtotal Produk:</span>
                                <span className="font-semibold text-brand-text">{formatRupiah(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Ongkos Kirim:</span>
                                <span className="font-semibold text-brand-text">{formatRupiah(order.shipping_cost)}</span>
                            </div>
                            <div className="flex justify-between pt-3 border-t border-brand-cream items-baseline">
                                <span className="font-bold text-sm text-brand-text">Total Bayar:</span>
                                <span className="font-playfair text-xl font-bold text-brand-text">
                                    {formatRupiah(order.total)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Review Modal */}
            {reviewModalItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-brand-cream-dark/60 space-y-4 animate-scale-in">
                        <div className="flex items-center justify-between pb-3 border-b border-brand-cream">
                            <h3 className="font-playfair text-lg font-bold italic text-brand-text">
                                Beri Ulasan & Rating
                            </h3>
                            <button
                                type="button"
                                onClick={handleCloseReview}
                                className="text-brand-text/50 hover:text-brand-text text-sm"
                            >
                                ✕
                            </button>
                        </div>

                        <div>
                            <p className="text-xs font-semibold text-brand-text">{reviewModalItem.product_name}</p>
                            <p className="text-[11px] text-brand-text/60">Varian: {reviewModalItem.variant_info}</p>
                        </div>

                        <form onSubmit={handleSubmitReview} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-brand-text mb-1">
                                    Pilih Rating Bintang:
                                </label>
                                <div className="flex items-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setData('rating', star)}
                                            className="p-1 text-2xl transition-transform hover:scale-110"
                                        >
                                            <Star
                                                size={28}
                                                className={
                                                    star <= data.rating
                                                        ? 'fill-amber-400 text-amber-400'
                                                        : 'fill-gray-200 text-gray-200'
                                                }
                                            />
                                        </button>
                                    ))}
                                    <span className="text-xs font-bold text-brand-text ml-2">
                                        {data.rating} dari 5
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-brand-text mb-1">
                                    Ulasan Anda:
                                </label>
                                <textarea
                                    rows={3}
                                    value={data.comment}
                                    onChange={e => setData('comment', e.target.value)}
                                    placeholder="Ceritakan pengalaman Anda memakai hijab ini (kualitas bahan, warna, jahitan)..."
                                    className="w-full text-xs rounded-xl border-brand-cream-dark focus:border-brand-pink focus:ring-brand-pink bg-brand-cream/20"
                                />
                                {errors.comment && <p className="text-xs text-red-600 mt-1">{errors.comment}</p>}
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={handleCloseReview}
                                    className="px-4 py-2 rounded-full border border-brand-cream-dark text-xs font-semibold text-brand-text hover:bg-brand-cream"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 rounded-full bg-brand-pink hover:bg-brand-pink-hover text-brand-text text-xs font-semibold shadow-sm transition-all"
                                >
                                    {processing ? 'Mengirim...' : 'Kirim Ulasan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}
