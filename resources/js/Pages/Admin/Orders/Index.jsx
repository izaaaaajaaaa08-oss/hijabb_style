import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Search, Package, Clock, CheckCircle2, Truck, XCircle, ArrowRight } from 'lucide-react';

export default function Index({
    orders = { data: [], links: [] },
    filters = {}
}) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');

    const formatRupiah = (val) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(val || 0);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.orders.index'), {
            search: search || undefined,
            status: selectedStatus || undefined,
        }, {
            preserveState: true,
        });
    };

    const handleStatusFilter = (status) => {
        setSelectedStatus(status);
        router.get(route('admin.orders.index'), {
            search: search || undefined,
            status: status || undefined,
        }, {
            preserveState: true,
        });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'menunggu_pembayaran':
                return <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">Menunggu Pembayaran</span>;
            case 'dibayar':
                return <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">Dibayar</span>;
            case 'diproses':
                return <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-800 border border-purple-200">Diproses</span>;
            case 'dikirim':
                return <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-teal-50 text-teal-800 border border-teal-200">Dikirim</span>;
            case 'selesai':
                return <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">Selesai</span>;
            case 'dibatalkan':
                return <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-50 text-red-800 border border-red-200">Dibatalkan</span>;
            default:
                return <span>{status}</span>;
        }
    };

    const statusTabs = [
        { label: 'Semua Status', value: '' },
        { label: 'Menunggu Bayar', value: 'menunggu_pembayaran' },
        { label: 'Dibayar', value: 'dibayar' },
        { label: 'Diproses', value: 'diproses' },
        { label: 'Dikirim', value: 'dikirim' },
        { label: 'Selesai', value: 'selesai' },
        { label: 'Dibatalkan', value: 'dibatalkan' },
    ];

    return (
        <AdminLayout title="Kelola Pesanan Pelanggan — HijabStyle Admin">
            <div className="space-y-6">
                <div>
                    <h1 className="font-playfair text-2xl sm:text-3xl font-bold italic text-brand-text">
                        Kelola Pesanan Masuk
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        Pantau pembayaran, ubah status pemrosesan pesanan, dan input nomor resi pengiriman.
                    </p>
                </div>

                {/* Filter Status Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {statusTabs.map((tab) => (
                        <button
                            key={tab.value}
                            type="button"
                            onClick={() => handleStatusFilter(tab.value)}
                            className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all border ${
                                selectedStatus === tab.value
                                    ? 'bg-brand-pink text-brand-text border-brand-pink shadow-xs'
                                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-between">
                    <form onSubmit={handleSearch} className="relative w-full sm:w-80">
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Cari no pesanan / nama customer..."
                            className="w-full pl-3 pr-8 py-2 text-xs rounded-xl border-gray-300 focus:border-brand-pink focus:ring-brand-pink"
                        />
                        <button type="submit" className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-700">
                            <Search size={14} />
                        </button>
                    </form>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[10px] border-b border-gray-200">
                                    <th className="py-3.5 px-4 font-semibold">No. Pesanan</th>
                                    <th className="py-3.5 px-4 font-semibold">Tanggal</th>
                                    <th className="py-3.5 px-4 font-semibold">Pelanggan</th>
                                    <th className="py-3.5 px-4 font-semibold">Item Dipesan</th>
                                    <th className="py-3.5 px-4 font-semibold">Total</th>
                                    <th className="py-3.5 px-4 font-semibold">Status</th>
                                    <th className="py-3.5 px-4 font-semibold text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.data && orders.data.length > 0 ? (
                                    orders.data.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50/60 transition-colors">
                                            <td className="py-3.5 px-4 font-mono font-bold text-brand-text">
                                                {order.order_number}
                                            </td>
                                            <td className="py-3.5 px-4 text-gray-500">
                                                {new Date(order.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <p className="font-semibold text-brand-text">{order.user?.name}</p>
                                                <p className="text-[10px] text-gray-400">{order.user?.email}</p>
                                            </td>
                                            <td className="py-3.5 px-4 text-gray-600">
                                                {order.items?.length || 0} macam produk
                                            </td>
                                            <td className="py-3.5 px-4 font-bold text-brand-text">
                                                {formatRupiah(order.total)}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                {getStatusBadge(order.status)}
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <Link
                                                    href={route('admin.orders.show', order.id)}
                                                    className="px-3.5 py-1.5 rounded-full bg-brand-pink/20 hover:bg-brand-pink text-brand-text font-semibold text-xs transition-colors inline-flex items-center gap-1"
                                                >
                                                    <span>Proses</span>
                                                    <ArrowRight size={13} />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="text-center py-12 text-gray-400">
                                            Tidak ada pesanan yang sesuai filter.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {orders.links && orders.links.length > 3 && (
                        <div className="p-4 border-t border-gray-100 flex justify-center">
                            <nav className="inline-flex rounded-xl bg-gray-50 p-1 gap-1">
                                {orders.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        className={`px-3 py-1 text-xs rounded-lg font-medium ${
                                            link.active ? 'bg-white shadow-xs font-bold text-brand-text' : 'text-gray-600 hover:bg-white'
                                        } ${!link.url ? 'opacity-40 cursor-not-allowed' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </nav>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
