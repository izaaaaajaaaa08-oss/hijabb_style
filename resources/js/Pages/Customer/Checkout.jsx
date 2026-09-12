import React, { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { MapPin, Truck, ShieldCheck, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function Checkout({
    items = [],
    subtotal = 0,
    addresses = [],
    shippingOptions = []
}) {
    const hasAddresses = addresses.length > 0;
    const defaultAddress = addresses.find(a => a.is_default) || addresses[0] || null;

    const [addressOption, setAddressOption] = useState(hasAddresses ? 'existing' : 'new');
    const [selectedAddressId, setSelectedAddressId] = useState(defaultAddress?.id || '');
    const [selectedShipping, setSelectedShipping] = useState(shippingOptions[0]?.id || 'kurir_toko');

    const selectedShippingData = shippingOptions.find(s => s.id === selectedShipping) || shippingOptions[0];
    const shippingCost = selectedShippingData ? selectedShippingData.cost : 10000;
    const grandTotal = Number(subtotal) + shippingCost;

    const { data, setData, post, processing, errors } = useForm({
        address_option: addressOption,
        address_id: selectedAddressId,
        recipient_name: '',
        phone: '',
        full_address: '',
        city: 'Palu',
        postal_code: '94111',
        shipping_option_id: selectedShipping,
    });

    const formatRupiah = (val) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(val);
    };

    const handleAddressOptionChange = (opt) => {
        setAddressOption(opt);
        setData('address_option', opt);
    };

    const handleShippingChange = (shippingId) => {
        setSelectedShipping(shippingId);
        setData('shipping_option_id', shippingId);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('customer.checkout.store'));
    };

    return (
        <MainLayout title="Checkout Pesanan — HijabStyle">
            <div className="bg-brand-cream/30 py-6 border-b border-brand-cream-dark/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="font-playfair text-3xl font-bold italic text-brand-text">
                        Checkout & Pembayaran
                    </h1>
                    <p className="text-xs sm:text-sm text-brand-text/70 mt-1">
                        Selesaikan pengisian alamat dan pilih metode pengiriman untuk pesanan hijab Anda.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Left: Address and Shipping Section (8 cols) */}
                        <div className="lg:col-span-8 space-y-6">
                            {/* Alamat Pengiriman */}
                            <div className="p-6 rounded-3xl bg-white border border-brand-cream-dark/60 shadow-sm space-y-5">
                                <div className="flex items-center gap-2.5 pb-3 border-b border-brand-cream">
                                    <div className="w-8 h-8 rounded-full bg-brand-pink/30 flex items-center justify-center text-brand-pink-hover">
                                        <MapPin size={18} />
                                    </div>
                                    <h3 className="font-playfair text-lg font-bold italic text-brand-text">
                                        Alamat Pengiriman
                                    </h3>
                                </div>

                                {hasAddresses && (
                                    <div className="flex gap-4">
                                        <label className={`flex-1 p-3 rounded-2xl border cursor-pointer text-xs font-medium transition-all ${
                                            addressOption === 'existing'
                                                ? 'border-brand-pink bg-brand-pink/15 text-brand-text font-bold'
                                                : 'border-brand-cream-dark bg-brand-cream/20 text-brand-text/70'
                                        }`}>
                                            <input
                                                type="radio"
                                                name="address_option"
                                                value="existing"
                                                checked={addressOption === 'existing'}
                                                onChange={() => handleAddressOptionChange('existing')}
                                                className="hidden"
                                            />
                                            <span>Pilih Alamat Tersimpan</span>
                                        </label>

                                        <label className={`flex-1 p-3 rounded-2xl border cursor-pointer text-xs font-medium transition-all ${
                                            addressOption === 'new'
                                                ? 'border-brand-pink bg-brand-pink/15 text-brand-text font-bold'
                                                : 'border-brand-cream-dark bg-brand-cream/20 text-brand-text/70'
                                        }`}>
                                            <input
                                                type="radio"
                                                name="address_option"
                                                value="new"
                                                checked={addressOption === 'new'}
                                                onChange={() => handleAddressOptionChange('new')}
                                                className="hidden"
                                            />
                                            <span>+ Gunakan Alamat Baru</span>
                                        </label>
                                    </div>
                                )}

                                {/* Existing addresses picker */}
                                {addressOption === 'existing' && hasAddresses ? (
                                    <div className="space-y-3">
                                        {addresses.map((addr) => (
                                            <label
                                                key={addr.id}
                                                className={`block p-4 rounded-2xl border cursor-pointer transition-all ${
                                                    selectedAddressId === addr.id
                                                        ? 'border-brand-pink bg-brand-cream/40 ring-1 ring-brand-pink'
                                                        : 'border-brand-cream-dark/60 hover:bg-brand-cream/20'
                                                }`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="radio"
                                                                name="selected_address"
                                                                value={addr.id}
                                                                checked={selectedAddressId === addr.id}
                                                                onChange={() => {
                                                                    setSelectedAddressId(addr.id);
                                                                    setData('address_id', addr.id);
                                                                }}
                                                                className="text-brand-pink focus:ring-brand-pink"
                                                            />
                                                            <span className="text-xs font-bold text-brand-text">
                                                                {addr.recipient_name}
                                                            </span>
                                                            <span className="text-xs text-brand-text/70">
                                                                ({addr.phone})
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-brand-text/80 pl-6 leading-relaxed">
                                                            {addr.full_address}, {addr.city} {addr.postal_code}
                                                        </p>
                                                    </div>
                                                    {addr.is_default && (
                                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-sage/20 text-brand-sage-dark">
                                                            Utama
                                                        </span>
                                                    )}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                ) : (
                                    /* New Address Form */
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-brand-text mb-1">
                                                Nama Penerima *
                                            </label>
                                            <input
                                                type="text"
                                                value={data.recipient_name}
                                                onChange={e => setData('recipient_name', e.target.value)}
                                                placeholder="Contoh: Siti Aisyah"
                                                className="w-full text-xs rounded-xl border-brand-cream-dark focus:border-brand-pink focus:ring-brand-pink bg-brand-cream/20"
                                            />
                                            {errors.recipient_name && <p className="text-xs text-red-600 mt-1">{errors.recipient_name}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-brand-text mb-1">
                                                No. Handphone / WhatsApp *
                                            </label>
                                            <input
                                                type="text"
                                                value={data.phone}
                                                onChange={e => setData('phone', e.target.value)}
                                                placeholder="Contoh: 081234567890"
                                                className="w-full text-xs rounded-xl border-brand-cream-dark focus:border-brand-pink focus:ring-brand-pink bg-brand-cream/20"
                                            />
                                            {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
                                        </div>

                                        <div className="sm:col-span-2">
                                            <label className="block text-xs font-semibold text-brand-text mb-1">
                                                Alamat Lengkap *
                                            </label>
                                            <textarea
                                                rows={2}
                                                value={data.full_address}
                                                onChange={e => setData('full_address', e.target.value)}
                                                placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan"
                                                className="w-full text-xs rounded-xl border-brand-cream-dark focus:border-brand-pink focus:ring-brand-pink bg-brand-cream/20"
                                            />
                                            {errors.full_address && <p className="text-xs text-red-600 mt-1">{errors.full_address}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-brand-text mb-1">
                                                Kota / Kabupaten *
                                            </label>
                                            <input
                                                type="text"
                                                value={data.city}
                                                onChange={e => setData('city', e.target.value)}
                                                placeholder="Kota Palu"
                                                className="w-full text-xs rounded-xl border-brand-cream-dark focus:border-brand-pink focus:ring-brand-pink bg-brand-cream/20"
                                            />
                                            {errors.city && <p className="text-xs text-red-600 mt-1">{errors.city}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-brand-text mb-1">
                                                Kode Pos *
                                            </label>
                                            <input
                                                type="text"
                                                value={data.postal_code}
                                                onChange={e => setData('postal_code', e.target.value)}
                                                placeholder="94111"
                                                className="w-full text-xs rounded-xl border-brand-cream-dark focus:border-brand-pink focus:ring-brand-pink bg-brand-cream/20"
                                            />
                                            {errors.postal_code && <p className="text-xs text-red-600 mt-1">{errors.postal_code}</p>}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Opsi Pengiriman */}
                            <div className="p-6 rounded-3xl bg-white border border-brand-cream-dark/60 shadow-sm space-y-4">
                                <div className="flex items-center gap-2.5 pb-3 border-b border-brand-cream">
                                    <div className="w-8 h-8 rounded-full bg-brand-sage/30 flex items-center justify-center text-brand-sage-dark">
                                        <Truck size={18} />
                                    </div>
                                    <h3 className="font-playfair text-lg font-bold italic text-brand-text">
                                        Pilihan Ekspedisi Pengiriman
                                    </h3>
                                </div>

                                <div className="space-y-3">
                                    {shippingOptions.map((opt) => (
                                        <label
                                            key={opt.id}
                                            className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                                                selectedShipping === opt.id
                                                    ? 'border-brand-pink bg-brand-cream/40 ring-1 ring-brand-pink'
                                                    : 'border-brand-cream-dark/60 hover:bg-brand-cream/20'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="radio"
                                                    name="shipping_option"
                                                    value={opt.id}
                                                    checked={selectedShipping === opt.id}
                                                    onChange={() => handleShippingChange(opt.id)}
                                                    className="text-brand-pink focus:ring-brand-pink"
                                                />
                                                <div>
                                                    <p className="text-xs font-bold text-brand-text">{opt.name}</p>
                                                    <p className="text-[11px] text-brand-text/60">Estimasi tiba: {opt.estimate}</p>
                                                </div>
                                            </div>
                                            <span className="text-xs font-bold text-brand-text">
                                                {formatRupiah(opt.cost)}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right: Order Summary (4 cols) */}
                        <div className="lg:col-span-4 bg-white rounded-3xl border border-brand-cream-dark/60 p-6 shadow-sm space-y-5 sticky top-28">
                            <h3 className="font-playfair text-lg font-bold italic text-brand-text pb-3 border-b border-brand-cream">
                                Pesanan Anda
                            </h3>

                            {/* Items Mini List */}
                            <div className="max-h-60 overflow-y-auto space-y-3 pr-1 divide-y divide-brand-cream/50">
                                {items.map((item) => (
                                    <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-brand-cream shrink-0 border border-brand-cream-dark/40">
                                                <img
                                                    src={`/${item.variant.product.image}`}
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = '/products/placeholder.jpg';
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-brand-text line-clamp-1">{item.variant.product.name}</p>
                                                <p className="text-[11px] text-brand-text/60">{item.variant.color} x {item.quantity}</p>
                                            </div>
                                        </div>
                                        <span className="font-semibold text-brand-text shrink-0">
                                            {formatRupiah(item.subtotal)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Cost Breakdown */}
                            <div className="pt-4 border-t border-brand-cream space-y-2.5 text-xs text-brand-text/80">
                                <div className="flex justify-between">
                                    <span>Subtotal Produk:</span>
                                    <span className="font-semibold text-brand-text">{formatRupiah(subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Ongkos Kirim:</span>
                                    <span className="font-semibold text-brand-text">{formatRupiah(shippingCost)}</span>
                                </div>
                                <div className="flex justify-between pt-3 border-t border-brand-cream items-baseline">
                                    <span className="font-bold text-sm text-brand-text">Total Tagihan:</span>
                                    <span className="font-playfair text-xl font-bold text-brand-text">
                                        {formatRupiah(grandTotal)}
                                    </span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-4 px-6 rounded-full bg-brand-pink hover:bg-brand-pink-hover text-brand-text font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                            >
                                <span>{processing ? 'Memproses Pesanan...' : 'Bayar Sekarang'}</span>
                                <ArrowRight size={16} />
                            </button>

                            <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-brand-text/60">
                                <ShieldCheck size={14} className="text-brand-sage-dark" />
                                <span>Pembayaran Aman Didukung Midtrans</span>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </MainLayout>
    );
}
