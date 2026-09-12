import React from 'react';
import { Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { Package, ChevronRight, Clock, CheckCircle2, Truck, XCircle, ShoppingBag } from 'lucide-react';

export default function OrderHistory({ orders = { data: [], links: [] } }) {
    const formatRupiah = (val) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(val);
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
                        <span>Sedang Diproses</span>
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
        <MainLayout title="Riwayat Pesanan — HijabStyle">
            <div className="bg-brand-cream/30 py-6 border-b border-brand-cream-dark/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="font-playfair text-3xl font-bold italic text-brand-text">
                        Riwayat Pesanan Saya
                    </h1>
                    <p className="text-xs sm:text-sm text-brand-text/70 mt-1">
                        Pantau status pengiriman dan riwayat pembelian hijab Anda di HijabStyle.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {orders.data && orders.data.length > 0 ? (
                    <div className="space-y-4">
                        {orders.data.map((order) => (
                            <div
                                key={order.id}
                                className="p-6 rounded-3xl bg-white border border-brand-cream-dark/60 shadow-sm space-y-4 hover:border-brand-pink/50 transition-colors"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-brand-cream gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-brand-pink/20 flex items-center justify-center text-brand-pink-hover shrink-0">
                                            <Package size={20} />
                                        </div>
                                        <div>
                                            <span className="font-mono text-xs font-bold text-brand-text">{order.order_number}</span>
                                            <p className="text-[11px] text-brand-text/60">
                                                {new Date(order.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div>{getStatusBadge(order.status)}</div>
                                </div>

                                {/* Items Snapshot Preview */}
                                <div className="space-y-3">
                                    {order.items?.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between gap-4 text-xs">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-xl overflow-hidden bg-brand-cream shrink-0 border border-brand-cream-dark/40">
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
                                                <div>
                                                    <p className="font-semibold text-brand-text line-clamp-1">{item.product_name}</p>
                                                    <p className="text-[11px] text-brand-text/60">{item.variant_info} x {item.quantity}</p>
                                                </div>
                                            </div>
                                            <span className="font-semibold text-brand-text shrink-0">
                                                {formatRupiah(item.subtotal)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Footer info and actions */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-brand-cream gap-4">
                                    <div>
                                        <span className="text-xs text-brand-text/60">Total Pembayaran:</span>
                                        <span className="font-playfair text-lg font-bold text-brand-text ml-2">
                                            {formatRupiah(order.total)}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Link
                                            href={route('customer.orders.show', order.id)}
                                            className="px-5 py-2.5 rounded-full bg-brand-cream hover:bg-brand-pink/20 text-brand-text text-xs font-semibold border border-brand-cream-dark/60 transition-colors flex items-center gap-1.5"
                                        >
                                            <span>Detail Pesanan</span>
                                            <ChevronRight size={14} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Pagination */}
                        {orders.links && orders.links.length > 3 && (
                            <div className="flex justify-center pt-6">
                                <nav className="inline-flex rounded-2xl bg-white border border-brand-cream-dark p-1.5 gap-1 shadow-sm">
                                    {orders.links.map((link, idx) => (
                                        <Link
                                            key={idx}
                                            href={link.url || '#'}
                                            className={`px-3.5 py-1.5 text-xs rounded-xl font-medium transition-all ${
                                                link.active
                                                    ? 'bg-brand-pink text-brand-text font-bold shadow-sm'
                                                    : 'text-brand-text hover:bg-brand-cream'
                                            } ${!link.url ? 'opacity-40 cursor-not-allowed' : ''}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </nav>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="max-w-md mx-auto text-center py-16 px-4 bg-white rounded-3xl border border-brand-cream-dark/60 shadow-sm space-y-4">
                        <div className="w-20 h-20 mx-auto rounded-full bg-brand-cream flex items-center justify-center text-brand-pink-hover">
                            <Package size={36} />
                        </div>
                        <h3 className="font-playfair text-2xl font-bold italic text-brand-text">
                            Belum Ada Riwayat Pesanan
                        </h3>
                        <p className="text-xs text-brand-text/70 leading-relaxed">
                            Anda belum memiliki riwayat pembelian. Pesanan yang Anda buat akan tercatat dan dapat dipantau di halaman ini.
                        </p>
                        <div className="pt-2">
                            <Link
                                href={route('catalog.index')}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-pink hover:bg-brand-pink-hover text-brand-text text-xs font-semibold shadow-md transition-all"
                            >
                                <span>Mulai Belanja</span>
                                <ShoppingBag size={15} />
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
