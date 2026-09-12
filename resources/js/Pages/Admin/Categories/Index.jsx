import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Layers, Plus, Edit2, Trash2, X, Check } from 'lucide-react';

export default function Index({ categories = [] }) {
    const [editingCategory, setEditingCategory] = useState(null);

    const createForm = useForm({
        name: '',
        description: '',
    });

    const editForm = useForm({
        name: '',
        description: '',
    });

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        createForm.post(route('admin.categories.store'), {
            onSuccess: () => createForm.reset(),
        });
    };

    const handleStartEdit = (cat) => {
        setEditingCategory(cat);
        editForm.setData({
            name: cat.name,
            description: cat.description || '',
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        editForm.put(route('admin.categories.update', editingCategory.id), {
            onSuccess: () => setEditingCategory(null),
        });
    };

    const handleDelete = (cat) => {
        if (confirm(`Yakin ingin menghapus kategori "${cat.name}"?`)) {
            router.delete(route('admin.categories.destroy', cat.id));
        }
    };

    return (
        <AdminLayout title="Kelola Kategori Hijab — HijabStyle Admin">
            <div className="space-y-8">
                <div>
                    <h1 className="font-playfair text-2xl sm:text-3xl font-bold italic text-brand-text">
                        Kelola Kategori Hijab
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        Atur pengelompokan produk hijab (Segi Empat, Pashmina, Bergo, Instan, dll).
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Form Tambah Kategori (4 cols) */}
                    <div className="lg:col-span-4 p-6 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                            <Plus size={18} className="text-brand-pink-hover" />
                            <h3 className="font-playfair text-lg font-bold italic text-brand-text">
                                Tambah Kategori Baru
                            </h3>
                        </div>

                        <form onSubmit={handleCreateSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-brand-text mb-1">
                                    Nama Kategori *
                                </label>
                                <input
                                    type="text"
                                    value={createForm.data.name}
                                    onChange={e => createForm.setData('name', e.target.value)}
                                    placeholder="Misal: Pashmina Inner"
                                    className="w-full text-xs rounded-xl border-gray-300 focus:border-brand-pink focus:ring-1 focus:ring-brand-pink"
                                />
                                {createForm.errors.name && <p className="text-xs text-red-600 mt-1">{createForm.errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-brand-text mb-1">
                                    Deskripsi (Opsional)
                                </label>
                                <textarea
                                    rows={3}
                                    value={createForm.data.description}
                                    onChange={e => createForm.setData('description', e.target.value)}
                                    placeholder="Penjelasan singkat karakteristik hijab pada kategori ini..."
                                    className="w-full text-xs rounded-xl border-gray-300 focus:border-brand-pink focus:ring-1 focus:ring-brand-pink"
                                />
                                {createForm.errors.description && <p className="text-xs text-red-600 mt-1">{createForm.errors.description}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={createForm.processing}
                                className="w-full py-2.5 px-4 rounded-full bg-brand-pink hover:bg-brand-pink-hover text-brand-text text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5"
                            >
                                <Plus size={15} />
                                <span>{createForm.processing ? 'Menyimpan...' : 'Simpan Kategori'}</span>
                            </button>
                        </form>
                    </div>

                    {/* Daftar Kategori (8 cols) */}
                    <div className="lg:col-span-8 p-6 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                            <h3 className="font-playfair text-lg font-bold italic text-brand-text">
                                Daftar Kategori Aktif
                            </h3>
                            <span className="text-xs text-gray-500 font-medium">
                                Total: {categories.length} Kategori
                            </span>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {categories.map((cat) => (
                                <div key={cat.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    {editingCategory?.id === cat.id ? (
                                        /* Inline Edit Form */
                                        <form onSubmit={handleEditSubmit} className="flex-1 space-y-2">
                                            <input
                                                type="text"
                                                value={editForm.data.name}
                                                onChange={e => editForm.setData('name', e.target.value)}
                                                className="w-full text-xs rounded-xl border-brand-pink focus:ring-brand-pink"
                                            />
                                            <textarea
                                                rows={2}
                                                value={editForm.data.description}
                                                onChange={e => editForm.setData('description', e.target.value)}
                                                className="w-full text-xs rounded-xl border-gray-300 focus:ring-brand-pink"
                                            />
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="submit"
                                                    disabled={editForm.processing}
                                                    className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1"
                                                >
                                                    <Check size={12} />
                                                    <span>Simpan</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setEditingCategory(null)}
                                                    className="px-3 py-1 rounded-full bg-gray-200 text-gray-700 text-xs font-semibold flex items-center gap-1"
                                                >
                                                    <X size={12} />
                                                    <span>Batal</span>
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-sm font-semibold text-brand-text">{cat.name}</h4>
                                                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-[10px] font-mono text-gray-500">
                                                        /{cat.slug}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500">{cat.description || 'Tidak ada deskripsi.'}</p>
                                                <span className="inline-block text-[11px] text-brand-sage-dark font-medium">
                                                    {cat.products_count} Produk terdaftar
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleStartEdit(cat)}
                                                    className="p-2 rounded-xl text-gray-500 hover:text-brand-text hover:bg-gray-100 transition-colors"
                                                    title="Edit Kategori"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(cat)}
                                                    className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                    title="Hapus Kategori"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
