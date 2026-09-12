import React from 'react';
import { Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { DollarSign, ShoppingBag, Package, AlertTriangle, ArrowRight, CheckCircle2, Clock, ChevronRight } from 'lucide-react';

export default function Dashboard({
    stats = {},
    recentOrders = [],
    lowStockVariants = []
}) {
    const formatRupiah = (val) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(val || 0);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'menunggu_pembayaran':
                return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">Menunggu Pembayaran</span>;
            case 'dibayar':
                return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-800">Dibayar</span>;
            case 'diproses':
                return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100 text-purple-800">Diproses</span>;
            case 'dikirim':
                return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-teal-100 text-teal-800">Dikirim</span>;
            case 'selesai':
                return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">Selesai</span>;
            case 'dibatalkan':
                return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-800">Dibatalkan</span>;
            default:
                return <span>{status}</span>;
        }
    };

    return (
        <AdminLayout title="Dashboard Administrator — HijabStyle">
            <div className="space-y-8">
                {/* Header Welcome */}
                <div>
                    <h1 className="font-playfair text-2xl sm:text-3xl font-bold italic text-brand-text">
                        Ringkasan Bisnis HijabStyle
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        Pantau performa penjualan, pesanan yang perlu diproses, dan stok produk secara real-time.
                    </p>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {/* Total Revenue */}
                    <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-sm flex items-center justify-between">
                        <div className="space-y-1">
                            <span className="text-xs font-semibold text-gray-500">Total Omzet Penjualan</span>
                            <h3 className="font-playfair text-2xl font-bold text-brand-text">
                                {formatRupiah(stats.total_revenue)}
                            </h3>
                            <span className="text-[10px] text-emerald-600 font-medium">Transaksi terbayar & selesai</span>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            <DollarSign size={24} />
                        </div>
                    </div>

                    {/* Pesanan Baru (Perlu Diproses) */}
                    <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-sm flex items-center justify-between">
                        <div className="space-y-1">
                            <span className="text-xs font-semibold text-gray-500">Pesanan Masuk</span>
                            <h3 className="font-playfair text-2xl font-bold text-brand-text">
                                {stats.new_orders}
                            </h3>
                            <span className="text-[10px] text-blue-600 font-medium">Perlu segera diproses</span>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <Package size={24} />
                        </div>
                    </div>

                    {/* Total Produk */}
                    <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-sm flex items-center justify-between">
                        <div className="space-y-1">
                            <span className="text-xs font-semibold text-gray-500">Total Katalog Hijab</span>
                            <h3 className="font-playfair text-2xl font-bold text-brand-text">
                                {stats.total_products}
                            </h3>
                            <span className="text-[10px] text-gray-500 font-medium">Produk aktif terdaftar</span>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-brand-pink/30 text-brand-pink-hover flex items-center justify-center shrink-0">
                            <ShoppingBag size={24} />
                        </div>
                    </div>

                    {/* Stok Menipis */}
                    <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-sm flex items-center justify-between">
                        <div className="space-y-1">
                            <span className="text-xs font-semibold text-gray-500">Varian Stok Menipis</span>
                            <h3 className="font-playfair text-2xl font-bold text-red-600">
                                {stats.low_stock_count}
                            </h3>
                            <span className="text-[10px] text-amber-700 font-medium">Stok &lt; 5 pcs</span>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                            <AlertTriangle size={24} />
                        </div>
                    </div>
                </div>

                {/* Two Column Layout: Recent Orders & Low Stock Alert */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Recent Orders (8 cols) */}
                    <div className="lg:col-span-8 p-6 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                            <h3 className="font-playfair text-lg font-bold italic text-brand-text">
                                Pesanan Terbaru Masuk
                            </h3>
                            <Link
                                href={route('admin.orders.index')}
                                className="text-xs font-semibold text-brand-pink-hover hover:text-brand-text flex items-center gap-1"
                            >
                                <span>Lihat Semua</span>
                                <ArrowRight size={13} />
                            </Link>
                        </div>

                        {recentOrders.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead>
                                        <tr className="text-gray-400 uppercase tracking-wider text-[10px] border-b border-gray-100">
                                            <th className="pb-3 font-semibold">No. Pesanan</th>
                                            <th className="pb-3 font-semibold">Pelanggan</th>
                                            <th className="pb-3 font-semibold">Total</th>
                                            <th className="pb-3 font-semibold">Status</th>
                                            <th className="pb-3 font-semibold text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {recentOrders.map((ord) => (
                                            <tr key={ord.id} className="hover:bg-gray-50/80">
                                                <td className="py-3 font-mono font-bold text-brand-text">
                                                    {ord.order_number}
                                                </td>
                                                <td className="py-3 text-gray-700">
                                                    {ord.user?.name || 'Customer'}
                                                </td>
                                                <td className="py-3 font-semibold text-brand-text">
                                                    {formatRupiah(ord.total)}
                                                </td>
                                                <td className="py-3">
                                                    {getStatusBadge(ord.status)}
                                                </td>
                                                <td className="py-3 text-right">
                                                    <Link
                                                        href={route('admin.orders.show', ord.id)}
                                                        className="px-3 py-1 rounded-full bg-gray-100 hover:bg-brand-pink/20 text-brand-text font-semibold text-[11px] transition-colors"
                                                    >
                                                        Proses
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-xs text-gray-400">
                                Belum ada pesanan masuk.
                            </div>
                        )}
                    </div>

                    {/* Low Stock Alerts (4 cols) */}
                    <div className="lg:col-span-4 p-6 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                            <h3 className="font-playfair text-lg font-bold italic text-brand-text">
                                Peringatan Stok
                            </h3>
                            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
                                {lowStockVariants.length} Varian
                            </span>
                        </div>

                        {lowStockVariants.length > 0 ? (
                            <div className="space-y-3">
                                {lowStockVariants.map((v) => (
                                    <div key={v.id} className="p-3 rounded-2xl bg-amber-50/50 border border-amber-200/50 flex items-center justify-between gap-3 text-xs">
                                        <div className="space-y-0.5">
                                            <p className="font-semibold text-brand-text line-clamp-1">{v.product?.name}</p>
                                            <p className="text-[11px] text-gray-600">Warna: {v.color}</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <span className="font-bold text-red-600 block">
                                                {v.stock} pcs
                                            </span>
                                            <Link
                                                href={route('admin.products.edit', v.product_id)}
                                                className="text-[10px] text-brand-pink-hover hover:underline"
                                            >
                                                Tambah Stok
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-xs text-emerald-600 flex flex-col items-center gap-1.5">
                                <CheckCircle2 size={24} />
                                <span>Seluruh stok varian hijab aman.</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
