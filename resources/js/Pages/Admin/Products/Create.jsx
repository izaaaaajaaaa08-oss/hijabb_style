import React, { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft, Plus, Trash2, Upload } from 'lucide-react';

export default function Create({ categories = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        category_id: categories[0]?.id || '',
        name: '',
        description: '',
        base_price: '',
        is_active: true,
        image: null,
        variants: [
            { color: 'Hitam', size: 'All Size', stock: 10, price_override: '' },
            { color: 'Dusty Pink', size: 'All Size', stock: 10, price_override: '' },
        ],
    });

    const handleAddVariant = () => {
        setData('variants', [
            ...data.variants,
            { color: '', size: 'All Size', stock: 5, price_override: '' },
        ]);
    };

    const handleRemoveVariant = (index) => {
        if (data.variants.length <= 1) {
            alert('Minimal produk memiliki 1 varian warna!');
            return;
        }
        setData('variants', data.variants.filter((_, idx) => idx !== index));
    };

    const handleVariantChange = (index, field, value) => {
        const updated = [...data.variants];
        updated[index][field] = value;
        setData('variants', updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.products.store'));
    };

    return (
        <AdminLayout title="Tambah Hijab Baru — HijabStyle Admin">
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <Link
                        href={route('admin.products.index')}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-brand-text mb-2 transition-colors"
                    >
                        <ArrowLeft size={14} />
                        <span>Kembali ke Daftar Produk</span>
                    </Link>
                    <h1 className="font-playfair text-2xl sm:text-3xl font-bold italic text-brand-text">
                        Tambah Produk Hijab Baru
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="p-6 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-4">
                        <h3 className="font-playfair text-lg font-bold italic text-brand-text pb-2 border-b border-gray-100">
                            Informasi Produk
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-brand-text mb-1">
                                    Kategori Hijab *
                                </label>
                                <select
                                    value={data.category_id}
                                    onChange={e => setData('category_id', e.target.value)}
                                    className="w-full text-xs rounded-xl border-gray-300 focus:border-brand-pink focus:ring-brand-pink"
                                >
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                {errors.category_id && <p className="text-xs text-red-600 mt-1">{errors.category_id}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-brand-text mb-1">
                                    Harga Dasar (Rp) *
                                </label>
                                <input
                                    type="number"
                                    value={data.base_price}
                                    onChange={e => setData('base_price', e.target.value)}
                                    placeholder="Contoh: 55000"
                                    className="w-full text-xs rounded-xl border-gray-300 focus:border-brand-pink focus:ring-brand-pink"
                                />
                                {errors.base_price && <p className="text-xs text-red-600 mt-1">{errors.base_price}</p>}
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-xs font-semibold text-brand-text mb-1">
                                    Nama Produk Hijab *
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="Contoh: Pashmina Silk Premium"
                                    className="w-full text-xs rounded-xl border-gray-300 focus:border-brand-pink focus:ring-brand-pink"
                                />
                                {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-xs font-semibold text-brand-text mb-1">
                                    Deskripsi Produk *
                                </label>
                                <textarea
                                    rows={4}
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    placeholder="Jelaskan karakteristik bahan, keunggulan, kenyamanan pakai, dan instruksi cuci..."
                                    className="w-full text-xs rounded-xl border-gray-300 focus:border-brand-pink focus:ring-brand-pink"
                                />
                                {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description}</p>}
                            </div>

                            <div className="sm:col-span-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={e => setData('is_active', e.target.checked)}
                                        className="rounded text-brand-pink focus:ring-brand-pink"
                                    />
                                    <span className="text-xs font-medium text-brand-text">
                                        Aktifkan produk ini di katalog toko (Customer & Guest dapat melihat)
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Varian Warna & Stok */}
                    <div className="p-6 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                            <div>
                                <h3 className="font-playfair text-lg font-bold italic text-brand-text">
                                    Varian Warna & Stok
                                </h3>
                                <p className="text-[11px] text-gray-500">Tentukan warna, ukuran, dan jumlah stok awal untuk tiap varian.</p>
                            </div>
                            <button
                                type="button"
                                onClick={handleAddVariant}
                                className="px-3.5 py-1.5 rounded-full bg-brand-cream hover:bg-brand-pink/20 text-brand-text text-xs font-semibold border border-brand-cream-dark flex items-center gap-1"
                            >
                                <Plus size={14} />
                                <span>+ Tambah Varian</span>
                            </button>
                        </div>

                        <div className="space-y-3">
                            {data.variants.map((variant, index) => (
                                <div key={index} className="flex flex-col sm:flex-row items-center gap-3 p-3.5 rounded-2xl bg-gray-50 border border-gray-200">
                                    <div className="flex-1 w-full sm:w-auto">
                                        <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">
                                            Warna *
                                        </label>
                                        <input
                                            type="text"
                                            value={variant.color}
                                            onChange={e => handleVariantChange(index, 'color', e.target.value)}
                                            placeholder="Hitam / Sage / Maroon"
                                            className="w-full text-xs rounded-xl border-gray-300 focus:border-brand-pink focus:ring-brand-pink bg-white"
                                        />
                                    </div>

                                    <div className="w-full sm:w-28">
                                        <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">
                                            Ukuran
                                        </label>
                                        <input
                                            type="text"
                                            value={variant.size}
                                            onChange={e => handleVariantChange(index, 'size', e.target.value)}
                                            placeholder="All Size"
                                            className="w-full text-xs rounded-xl border-gray-300 focus:border-brand-pink focus:ring-brand-pink bg-white"
                                        />
                                    </div>

                                    <div className="w-full sm:w-28">
                                        <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">
                                            Stok Awal *
                                        </label>
                                        <input
                                            type="number"
                                            value={variant.stock}
                                            onChange={e => handleVariantChange(index, 'stock', parseInt(e.target.value) || 0)}
                                            className="w-full text-xs rounded-xl border-gray-300 focus:border-brand-pink focus:ring-brand-pink bg-white"
                                        />
                                    </div>

                                    <div className="w-full sm:w-36">
                                        <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">
                                            Harga Beda (Opsional)
                                        </label>
                                        <input
                                            type="number"
                                            value={variant.price_override}
                                            onChange={e => handleVariantChange(index, 'price_override', e.target.value)}
                                            placeholder="Sesuai dasar"
                                            className="w-full text-xs rounded-xl border-gray-300 focus:border-brand-pink focus:ring-brand-pink bg-white"
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleRemoveVariant(index)}
                                        className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 sm:self-end mb-0.5"
                                        title="Hapus Varian"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Foto Produk */}
                    <div className="p-6 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-4">
                        <h3 className="font-playfair text-lg font-bold italic text-brand-text pb-2 border-b border-gray-100">
                            Foto Produk
                        </h3>

                        <div className="space-y-2">
                            <label className="block text-xs font-semibold text-brand-text">
                                Upload Gambar Utama Produk (Maks 2MB)
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={e => setData('image', e.target.files[0])}
                                className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-brand-pink/30 file:text-brand-text hover:file:bg-brand-pink/50 cursor-pointer"
                            />
                            <p className="text-[11px] text-gray-400">
                                Jika tidak mengupload gambar, sistem akan menggunakan placeholder hijab estetis.
                            </p>
                            {errors.image && <p className="text-xs text-red-600 mt-1">{errors.image}</p>}
                        </div>
                    </div>

                    {/* Submit Actions */}
                    <div className="flex items-center justify-end gap-3">
                        <Link
                            href={route('admin.products.index')}
                            className="px-6 py-2.5 rounded-full border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-8 py-2.5 rounded-full bg-brand-pink hover:bg-brand-pink-hover text-brand-text text-xs font-semibold shadow-md transition-all disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan Produk...' : 'Simpan Produk'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
