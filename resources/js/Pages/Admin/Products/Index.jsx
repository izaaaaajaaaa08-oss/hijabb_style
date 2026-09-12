import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, Search, Edit2, Trash2, Eye, Filter } from 'lucide-react';

export default function Index({
    products = { data: [], links: [] },
    categories = [],
    filters = {}
}) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');

    const formatRupiah = (val) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(val || 0);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.products.index'), {
            search: search || undefined,
            category: selectedCategory || undefined,
        }, {
            preserveState: true,
        });
    };

    const handleCategoryChange = (catId) => {
        setSelectedCategory(catId);
        router.get(route('admin.products.index'), {
            search: search || undefined,
            category: catId || undefined,
        }, {
            preserveState: true,
        });
    };

    const handleDelete = (product) => {
        if (confirm(`Yakin ingin menghapus produk "${product.name}"? Seluruh varian dan data terkait akan dihapus.`)) {
            router.delete(route('admin.products.destroy', product.id));
        }
    };

    return (
        <AdminLayout title="Kelola Katalog Produk — HijabStyle Admin">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="font-playfair text-2xl sm:text-3xl font-bold italic text-brand-text">
                            Kelola Katalog Hijab
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                            Tambah produk baru, kelola foto produk, pilihan varian warna, dan stok.
                        </p>
                    </div>

                    <Link
                        href={route('admin.products.create')}
                        className="px-5 py-2.5 rounded-full bg-brand-pink hover:bg-brand-pink-hover text-brand-text text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5 self-start sm:self-auto"
                    >
                        <Plus size={16} />
                        <span>+ Tambah Hijab Baru</span>
                    </Link>
                </div>

                {/* Filters & Search */}
                <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                    <form onSubmit={handleSearch} className="relative w-full sm:w-80">
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Cari nama produk..."
                            className="w-full pl-3 pr-8 py-2 text-xs rounded-xl border-gray-300 focus:border-brand-pink focus:ring-brand-pink"
                        />
                        <button type="submit" className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-700">
                            <Search size={14} />
                        </button>
                    </form>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <select
                            value={selectedCategory}
                            onChange={e => handleCategoryChange(e.target.value)}
                            className="text-xs rounded-xl border-gray-300 focus:border-brand-pink focus:ring-brand-pink py-2 pl-3 pr-8 w-full sm:w-auto"
                        >
                            <option value="">Semua Kategori</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Table Products */}
                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[10px] border-b border-gray-200">
                                    <th className="py-3.5 px-4 font-semibold">Produk</th>
                                    <th className="py-3.5 px-4 font-semibold">Kategori</th>
                                    <th className="py-3.5 px-4 font-semibold">Harga Dasar</th>
                                    <th className="py-3.5 px-4 font-semibold">Varian Warna & Stok</th>
                                    <th className="py-3.5 px-4 font-semibold">Status</th>
                                    <th className="py-3.5 px-4 font-semibold text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {products.data && products.data.length > 0 ? (
                                    products.data.map((prod) => {
                                        const totalStock = prod.variants?.reduce((acc, v) => acc + v.stock, 0) || 0;
                                        return (
                                            <tr key={prod.id} className="hover:bg-gray-50/60 transition-colors">
                                                <td className="py-3.5 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-brand-cream shrink-0 border border-gray-100">
                                                            <img
                                                                src={`/${prod.primary_image?.image_path || 'products/placeholder.jpg'}`}
                                                                alt=""
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    e.target.onerror = null;
                                                                    e.target.src = '/products/placeholder.jpg';
                                                                }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-brand-text line-clamp-1">{prod.name}</p>
                                                            <p className="text-[10px] text-gray-400 font-mono">/{prod.slug}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3.5 px-4 text-gray-600 font-medium">
                                                    {prod.category?.name || '-'}
                                                </td>
                                                <td className="py-3.5 px-4 font-bold text-brand-text">
                                                    {formatRupiah(prod.base_price)}
                                                </td>
                                                <td className="py-3.5 px-4">
                                                    <div className="space-y-1">
                                                        <span className="font-semibold text-brand-text">
                                                            Total Stok: {totalStock} pcs
                                                        </span>
                                                        <div className="flex flex-wrap gap-1">
                                                            {prod.variants?.map((v) => (
                                                                <span
                                                                    key={v.id}
                                                                    className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                                                        v.stock < 5 ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-700'
                                                                    }`}
                                                                >
                                                                    {v.color}: {v.stock}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3.5 px-4">
                                                    {prod.is_active ? (
                                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                            Aktif
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-500">
                                                            Nonaktif
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3.5 px-4 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <Link
                                                            href={route('catalog.show', prod.slug)}
                                                            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                                                            title="Pratinjau Toko"
                                                            target="_blank"
                                                        >
                                                            <Eye size={15} />
                                                        </Link>
                                                        <Link
                                                            href={route('admin.products.edit', prod.id)}
                                                            className="p-1.5 rounded-lg text-gray-500 hover:text-brand-text hover:bg-gray-100"
                                                            title="Edit Produk"
                                                        >
                                                            <Edit2 size={15} />
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(prod)}
                                                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50"
                                                            title="Hapus Produk"
                                                        >
                                                            <Trash2 size={15} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="text-center py-10 text-gray-400">
                                            Tidak ada produk yang ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {products.links && products.links.length > 3 && (
                        <div className="p-4 border-t border-gray-100 flex justify-center">
                            <nav className="inline-flex rounded-xl bg-gray-50 p-1 gap-1">
                                {products.links.map((link, idx) => (
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
