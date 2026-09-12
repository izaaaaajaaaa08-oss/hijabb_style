import React from 'react';
import { Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft, MapPin, User, Package, Clock, CheckCircle2, Truck, XCircle, RefreshCw } from 'lucide-react';

export default function Show({ order }) {
    const { data, setData, patch, processing } = useForm({
        status: order.status,
    });

    const formatRupiah = (val) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(val || 0);
    };

    const handleUpdateStatus = (e) => {
        e.preventDefault();
        patch(route('admin.orders.update-status', order.id));
    };

    const handleQuickStatus = (newStatus) => {
        if (confirm(`Ubah status pesanan #${order.order_number} menjadi ${newStatus.toUpperCase()}?`)) {
            setData('status', newStatus);
            patch(route('admin.orders.update-status', order.id));
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'menunggu_pembayaran':
                return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">Menunggu Pembayaran</span>;
            case 'dibayar':
                return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">Dibayar</span>;
            case 'diproses':
                return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200">Diproses</span>;
            case 'dikirim':
                return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">Dikirim</span>;
            case 'selesai':
                return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">Selesai</span>;
            case 'dibatalkan':
                return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-800 border border-red-200">Dibatalkan</span>;
            default:
                return <span>{status}</span>;
        }
    };

    return (
        <AdminLayout title={`Detail Pesanan #${order.order_number} — HijabStyle Admin`}>
            <div className="space-y-6">
                <div>
                    <Link
                        href={route('admin.orders.index')}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-brand-text mb-2 transition-colors"
                    >
                        <ArrowLeft size={14} />
                        <span>Kembali ke Daftar Pesanan</span>
                    </Link>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <h1 className="font-playfair text-2xl sm:text-3xl font-bold italic text-brand-text">
                            Pesanan #{order.order_number}
                        </h1>
                        <div>{getStatusBadge(order.status)}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Details (8 cols) */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Status Updater Card */}
                        <div className="p-6 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-4">
                            <h3 className="font-playfair text-lg font-bold italic text-brand-text pb-2 border-b border-gray-100">
                                Perbarui Status Pesanan
                            </h3>

                            <form onSubmit={handleUpdateStatus} className="flex flex-col sm:flex-row items-center gap-3">
                                <select
                                    value={data.status}
                                    onChange={e => setData('status', e.target.value)}
                                    className="w-full sm:w-64 text-xs rounded-xl border-gray-300 focus:border-brand-pink focus:ring-brand-pink"
                                >
                                    <option value="menunggu_pembayaran">Menunggu Pembayaran</option>
                                    <option value="dibayar">Dibayar (Siap Diproses)</option>
                                    <option value="diproses">Sedang Diproses Toko</option>
                                    <option value="dikirim">Dalam Pengiriman</option>
                                    <option value="selesai">Selesai Diterima Customer</option>
                                    <option value="dibatalkan">Batalkan Pesanan</option>
                                </select>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-brand-pink hover:bg-brand-pink-hover text-brand-text text-xs font-semibold shadow-sm transition-all"
                                >
                                    {processing ? 'Menyimpan...' : 'Update Status'}
                                </button>
                            </form>

                            {/* Quick Action Shortcuts */}
                            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100 text-xs">
                                <span className="text-gray-400 py-1">Aksi Cepat:</span>
                                {order.status === 'dibayar' && (
                                    <button
                                        type="button"
                                        onClick={() => handleQuickStatus('diproses')}
                                        className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 font-semibold hover:bg-purple-100"
                                    >
                                        → Set Diproses
                                    </button>
                                )}
                                {order.status === 'diproses' && (
                                    <button
                                        type="button"
                                        onClick={() => handleQuickStatus('dikirim')}
                                        className="px-3 py-1 rounded-full bg-teal-50 text-teal-700 font-semibold hover:bg-teal-100"
                                    >
                                        → Set Dikirim
                                    </button>
                                )}
                                {order.status === 'dikirim' && (
                                    <button
                                        type="button"
                                        onClick={() => handleQuickStatus('selesai')}
                                        className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold hover:bg-emerald-100"
                                    >
                                        → Set Selesai
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Items List */}
                        <div className="p-6 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-4">
                            <h3 className="font-playfair text-lg font-bold italic text-brand-text pb-2 border-b border-gray-100">
                                Daftar Produk yang Dipesan
                            </h3>

                            <div className="divide-y divide-gray-100">
                                {order.items?.map((item) => (
                                    <div key={item.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4 text-xs">
                                        <div className="flex items-center gap-3">
                                            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-brand-cream border border-gray-100 shrink-0">
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
                                                <p className="font-semibold text-brand-text">{item.product_name}</p>
                                                <p className="text-[11px] text-gray-500">{item.variant_info}</p>
                                                <p className="text-[11px] text-gray-400 font-mono">
                                                    {formatRupiah(item.price)} x {item.quantity}
                                                </p>
                                            </div>
                                        </div>

                                        <span className="font-bold text-brand-text">
                                            {formatRupiah(item.subtotal)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Customer & Shipping Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="p-6 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-3">
                                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                                    <User size={16} className="text-brand-pink-hover" />
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-brand-text">
                                        Data Akun Pelanggan
                                    </h4>
                                </div>
                                <div className="text-xs space-y-1 text-gray-700">
                                    <p className="font-semibold text-brand-text">{order.user?.name}</p>
                                    <p>{order.user?.email}</p>
                                    <p>{order.user?.phone || 'Tidak ada no telepon'}</p>
                                </div>
                            </div>

                            <div className="p-6 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-3">
                                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                                    <MapPin size={16} className="text-brand-pink-hover" />
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-brand-text">
                                        Tujuan Pengiriman
                                    </h4>
                                </div>
                                {order.address ? (
                                    <div className="text-xs space-y-1 text-gray-700">
                                        <p className="font-semibold text-brand-text">
                                            {order.address.recipient_name} ({order.address.phone})
                                        </p>
                                        <p>{order.address.full_address}</p>
                                        <p>{order.address.city}, {order.address.postal_code}</p>
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-400">Tidak ada data alamat.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Summary (4 cols) */}
                    <div className="lg:col-span-4 bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4 sticky top-20">
                        <h3 className="font-playfair text-lg font-bold italic text-brand-text pb-2 border-b border-gray-100">
                            Ringkasan Keuangan
                        </h3>

                        <div className="space-y-2.5 text-xs text-gray-600">
                            <div className="flex justify-between">
                                <span>Metode Bayar:</span>
                                <span className="font-bold text-brand-text uppercase">{order.payment_method || 'Midtrans'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>ID Transaksi Midtrans:</span>
                                <span className="font-mono text-[10px] text-gray-500 truncate max-w-[130px]">
                                    {order.midtrans_transaction_id || '-'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span className="font-semibold text-brand-text">{formatRupiah(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Ongkir:</span>
                                <span className="font-semibold text-brand-text">{formatRupiah(order.shipping_cost)}</span>
                            </div>
                            <div className="flex justify-between pt-3 border-t border-gray-100 items-baseline">
                                <span className="font-bold text-sm text-brand-text">Total Diterima:</span>
                                <span className="font-playfair text-xl font-bold text-brand-text">
                                    {formatRupiah(order.total)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
