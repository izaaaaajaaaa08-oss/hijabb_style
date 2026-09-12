import React from 'react';
import { Link } from '@inertiajs/react';
import { MapPin, Phone, Mail, Globe, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-brand-cream border-t border-brand-cream-dark/50 text-brand-text pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Value Propositions / Store perks */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10 border-b border-brand-cream-dark/60">
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/70 border border-brand-cream-dark/40">
                        <div className="w-12 h-12 rounded-xl bg-brand-pink/25 flex items-center justify-center text-brand-pink-hover shrink-0">
                            <Truck size={24} />
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-brand-text">Pengiriman Terpercaya</h4>
                            <p className="text-xs text-brand-text/70">Pengiriman aman langsung dari toko fisik Palu.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/70 border border-brand-cream-dark/40">
                        <div className="w-12 h-12 rounded-xl bg-brand-sage/25 flex items-center justify-center text-brand-sage-dark shrink-0">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-brand-text">Bahan Premium</h4>
                            <p className="text-xs text-brand-text/70">Kain adem, tidak menerawang, jahitan rapi tepi.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/70 border border-brand-cream-dark/40">
                        <div className="w-12 h-12 rounded-xl bg-brand-pink/25 flex items-center justify-center text-brand-pink-hover shrink-0">
                            <RefreshCw size={24} />
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-brand-text">Pembayaran Mudah</h4>
                            <p className="text-xs text-brand-text/70">QRIS, Transfer Bank, dan E-Wallet via Midtrans.</p>
                        </div>
                    </div>
                </div>

                {/* Main Footer Links */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10">
                    {/* Brand Info */}
                    <div className="space-y-3 md:col-span-1">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-brand-pink/30 flex items-center justify-center border border-brand-pink/50">
                                <span className="font-playfair text-base font-bold italic text-brand-text">H</span>
                            </div>
                            <span className="font-playfair text-xl font-bold italic text-brand-text">
                                Hijab<span className="text-brand-pink-hover">Style</span>
                            </span>
                        </div>
                        <p className="text-xs text-brand-text/80 leading-relaxed">
                            Koleksi hijab modern bernuansa lembut & anggun. Menemani setiap langkah muslimah tampil percaya diri dan santun.
                        </p>
                        <div className="flex items-center gap-3 pt-2 text-brand-text/70">
                            <a href="#" className="p-2 rounded-full bg-white hover:bg-brand-pink hover:text-white transition-colors">
                                <Globe size={16} />
                            </a>
                            <a href="#" className="p-2 rounded-full bg-white hover:bg-brand-pink hover:text-white transition-colors">
                                <Phone size={16} />
                            </a>
                            <a href="#" className="p-2 rounded-full bg-white hover:bg-brand-pink hover:text-white transition-colors">
                                <Mail size={16} />
                            </a>
                        </div>
                    </div>

                    {/* Kategori */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-brand-text/70 mb-4">
                            Kategori Hijab
                        </h4>
                        <ul className="space-y-2.5 text-xs">
                            <li>
                                <Link href={route('catalog.index', { category: 'segi-empat' })} className="hover:text-brand-pink-hover transition-colors">
                                    Hijab Segi Empat
                                </Link>
                            </li>
                            <li>
                                <Link href={route('catalog.index', { category: 'pashmina' })} className="hover:text-brand-pink-hover transition-colors">
                                    Pashmina Ceruty & Diamond
                                </Link>
                            </li>
                            <li>
                                <Link href={route('catalog.index', { category: 'bergo' })} className="hover:text-brand-pink-hover transition-colors">
                                    Bergo Instan & Syar'i
                                </Link>
                            </li>
                            <li>
                                <Link href={route('catalog.index', { category: 'instan' })} className="hover:text-brand-pink-hover transition-colors">
                                    Hijab Instan Jersey
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Navigasi Pelanggan */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-brand-text/70 mb-4">
                            Bantuan Pelanggan
                        </h4>
                        <ul className="space-y-2.5 text-xs">
                            <li>
                                <Link href={route('customer.orders.index')} className="hover:text-brand-pink-hover transition-colors">
                                    Lacak Status Pesanan
                                </Link>
                            </li>
                            <li>
                                <Link href={route('customer.cart.index')} className="hover:text-brand-pink-hover transition-colors">
                                    Keranjang Belanja
                                </Link>
                            </li>
                            <li>
                                <Link href={route('customer.wishlist.index')} className="hover:text-brand-pink-hover transition-colors">
                                    Wishlist Favorit
                                </Link>
                            </li>
                            <li>
                                <Link href={route('login')} className="hover:text-brand-pink-hover transition-colors">
                                    Login Akun Customer
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Toko Fisik / Alamat */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-brand-text/70 mb-4">
                            Toko Fisik Kami
                        </h4>
                        <div className="flex items-start gap-2.5 text-xs text-brand-text/80 leading-relaxed">
                            <MapPin size={16} className="text-brand-pink-hover shrink-0 mt-0.5" />
                            <span>Jl. Kemiri, depan SMP 3 Kamonji, Kec. Palu Barat, Kota Palu, Sulawesi Tengah 94111</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs text-brand-text/80">
                            <Phone size={16} className="text-brand-pink-hover shrink-0" />
                            <span>0812-3456-7890</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs text-brand-text/80">
                            <Mail size={16} className="text-brand-pink-hover shrink-0" />
                            <span>kontak@hijabstyle.test</span>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="pt-6 border-t border-brand-cream-dark/50 flex flex-col sm:flex-row items-center justify-between text-[11px] text-brand-text/60 gap-2">
                    <p>&copy; {new Date().getFullYear()} HijabStyle. All rights reserved. E-Commerce Toko Hijab Palu.</p>
                    <p>Designed with Soft & Feminine Aesthetic</p>
                </div>
            </div>
        </footer>
    );
}
