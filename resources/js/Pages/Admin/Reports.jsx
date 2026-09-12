import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    TrendingUp,
    ShoppingBag,
    Package,
    BarChart3,
    Award,
    ChevronRight,
    DollarSign,
} from 'lucide-react';

export default function Reports({ summary = {}, topProducts = [], transactions = {} }) {
    const [activeTab, setActiveTab] = useState('overview');

    const formatRupiah = (val) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(val || 0);

    const getStatusBadge = (status) => {
        const map = {
            menunggu_pembayaran: { label: 'Menunggu Bayar', cls: 'bg-amber-100 text-amber-800' },
            dibayar: { label: 'Dibayar', cls: 'bg-blue-100 text-blue-800' },
            diproses: { label: 'Diproses', cls: 'bg-purple-100 text-purple-800' },
            dikirim: { label: 'Dikirim', cls: 'bg-teal-100 text-teal-800' },
            selesai: { label: 'Selesai', cls: 'bg-emerald-100 text-emerald-800' },
            dibatalkan: { label: 'Dibatalkan', cls: 'bg-red-100 text-red-800' },
        };
        const s = map[status] || { label: status, cls: 'bg-gray-100 text-gray-800' };
        return (
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${s.cls}`}>
                {s.label}
            </span>
        );
    };

    const paginationLinks = transactions?.links || [];
    const txData = transactions?.data || [];

    // Simple percentage bar for top products
    const maxQty = topProducts.length > 0 ? Math.max(...topProducts.map((p) => Number(p.total_qty))) : 1;

    return (
        <AdminLayout title="Laporan Penjualan — HijabStyle">
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="font-playfair text-2xl sm:text-3xl font-bold italic text-brand-text">
                        Laporan Penjualan
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        Ringkasan performa penjualan keseluruhan toko HijabStyle.
                    </p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {/* Total Omzet */}
                    <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-sm flex items-center justify-between">
                        <div className="space-y-1">
                            <span className="text-xs font-semibold text-gray-500">Total Omzet</span>
                            <h3 className="font-playfair text-2xl font-bold text-brand-text">
                                {formatRupiah(summary.total_omzet)}
                            </h3>
                            <span className="text-[10px] text-emerald-600 font-medium">
                                Seluruh transaksi berhasil
                            </span>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            <DollarSign size={24} />
                        </div>
                    </div>

                    {/* Total Transaksi */}
                    <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-sm flex items-center justify-between">
                        <div className="space-y-1">
                            <span className="text-xs font-semibold text-gray-500">Total Transaksi</span>
                            <h3 className="font-playfair text-2xl font-bold text-brand-text">
                                {summary.total_transactions?.toLocaleString('id-ID')}
                            </h3>
                            <span className="text-[10px] text-blue-600 font-medium">
                                Pesanan terbayar &amp; selesai
                            </span>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <ShoppingBag size={24} />
                        </div>
                    </div>

                    {/* Total Item Terjual */}
                    <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-sm flex items-center justify-between">
                        <div className="space-y-1">
                            <span className="text-xs font-semibold text-gray-500">Item Terjual</span>
                            <h3 className="font-playfair text-2xl font-bold text-brand-text">
                                {summary.total_items_sold?.toLocaleString('id-ID')}
                            </h3>
                            <span className="text-[10px] text-brand-pink-hover font-medium">
                                Total unit hijab terjual
                            </span>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-brand-pink/30 text-brand-pink-hover flex items-center justify-center shrink-0">
                            <Package size={24} />
                        </div>
                    </div>
                </div>

                {/* Two column: Top Products + Transactions Table */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Top Products (4 cols) */}
                    <div className="lg:col-span-4 p-6 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                            <h3 className="font-playfair text-lg font-bold italic text-brand-text flex items-center gap-2">
                                <Award size={18} className="text-amber-500" />
                                Produk Terlaris
                            </h3>
                        </div>

                        {topProducts.length > 0 ? (
                            <div className="space-y-4">
                                {topProducts.map((p, idx) => {
                                    const pct = Math.round((Number(p.total_qty) / maxQty) * 100);
                                    return (
                                        <div key={idx} className="space-y-1.5">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="font-semibold text-brand-text line-clamp-1 max-w-[60%]">
                                                    {p.product_name}
                                                </span>
                                                <span className="text-gray-500 shrink-0">
                                                    {p.total_qty} terjual
                                                </span>
                                            </div>
                                            {/* Progress bar */}
                                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full bg-brand-pink"
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                            <p className="text-[10px] text-emerald-700 font-medium">
                                                {formatRupiah(p.total_sales)}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="py-10 text-center text-xs text-gray-400">
                                Belum ada data penjualan.
                            </div>
                        )}
                    </div>

                    {/* Transactions Table (8 cols) */}
                    <div className="lg:col-span-8 p-6 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                            <h3 className="font-playfair text-lg font-bold italic text-brand-text flex items-center gap-2">
                                <BarChart3 size={18} className="text-brand-pink-hover" />
                                Riwayat Transaksi
                            </h3>
                            <span className="text-[10px] text-gray-400">
                                {transactions?.total || 0} total transaksi
                            </span>
                        </div>

                        {txData.length > 0 ? (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs">
                                        <thead>
                                            <tr className="text-gray-400 uppercase tracking-wider text-[10px] border-b border-gray-100">
                                                <th className="pb-3 font-semibold">No. Pesanan</th>
                                                <th className="pb-3 font-semibold">Pelanggan</th>
                                                <th className="pb-3 font-semibold">Total</th>
                                                <th className="pb-3 font-semibold">Status</th>
                                                <th className="pb-3 font-semibold text-right">Detail</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {txData.map((tx) => (
                                                <tr key={tx.id} className="hover:bg-gray-50/80 transition-colors">
                                                    <td className="py-3 font-mono font-bold text-brand-text">
                                                        {tx.order_number}
                                                    </td>
                                                    <td className="py-3 text-gray-700">
                                                        {tx.user?.name || 'Customer'}
                                                    </td>
                                                    <td className="py-3 font-semibold text-brand-text">
                                                        {formatRupiah(tx.total)}
                                                    </td>
                                                    <td className="py-3">
                                                        {getStatusBadge(tx.status)}
                                                    </td>
                                                    <td className="py-3 text-right">
                                                        <Link
                                                            href={route('admin.orders.show', tx.id)}
                                                            className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-brand-pink-hover hover:underline"
                                                        >
                                                            Lihat <ChevronRight size={12} />
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {paginationLinks.length > 3 && (
                                    <div className="flex items-center justify-end gap-1 pt-2">
                                        {paginationLinks.map((link, i) => (
                                            <Link
                                                key={i}
                                                href={link.url || '#'}
                                                preserveScroll
                                                className={`px-3 py-1 rounded-xl text-[11px] font-semibold transition-colors ${
                                                    link.active
                                                        ? 'bg-brand-pink text-brand-text shadow-sm'
                                                        : link.url
                                                        ? 'text-gray-500 hover:bg-gray-100'
                                                        : 'text-gray-300 cursor-not-allowed'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="py-10 text-center text-xs text-gray-400">
                                Belum ada transaksi tercatat.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
