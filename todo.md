# Todo List / Checklist Pengerjaan
## HijabStyle - Website E-Commerce Toko Hijab

> Dikerjakan bertahap per modul. Centang `[x]` jika sudah selesai.

---

## Modul 0: Persiapan Proyek
- [x] Install Laravel 13 (`composer create-project laravel/laravel hijabstyle`)
- [x] Setup Inertia.js + React (`php artisan install:react` atau breeze dengan stack `react`)
- [x] Setup Tailwind CSS (disesuaikan palet warna pastel & Google Fonts)
- [x] Buat database MySQL `hijabstyle_db` di Laragon/XAMPP
- [x] Konfigurasi `.env` (DB, APP_URL, Midtrans key sandbox)
- [x] Install package Midtrans (`composer require midtrans/midtrans-php`)
- [x] Setup Laravel Breeze untuk autentikasi (login/register)

## Modul 1: Database & Model
- [x] Migration: `users` (tambah kolom `role`, `phone`)
- [x] Migration: `addresses`
- [x] Migration: `categories`
- [x] Migration: `products`
- [x] Migration: `product_variants`
- [x] Migration: `product_images`
- [x] Migration: `carts` & `cart_items`
- [x] Migration: `orders` & `order_items`
- [x] Migration: `wishlists`
- [x] Migration: `reviews`
- [x] Buat Model beserta relasi (hasMany, belongsTo) untuk semua tabel
- [x] Buat Seeder: AdminUserSeeder, CategorySeeder, ProductSeeder (data dummy)
- [x] Jalankan `php artisan migrate --seed` dan verifikasi data

## Modul 2: Autentikasi & Role
- [x] Setup login/register customer (Breeze default)
- [x] Tambah middleware `IsAdmin` untuk proteksi route admin
- [x] Tambah middleware proteksi checkout (guest harus login dulu)
- [x] Buat sistem login dengan redirect sesuai role (admin ke `/admin/dashboard`, customer ke beranda/katalog)
- [x] Test: guest bisa browse tapi ditolak saat akses checkout tanpa login

## Modul 3: Katalog Produk (Guest & Customer)
- [x] Halaman Beranda (hero, kategori shortcut, produk terbaru/terlaris)
- [x] Halaman Katalog dengan filter kategori, harga, warna
- [x] Search produk
- [x] Halaman Detail Produk (galeri gambar, pilihan varian, stok, tab deskripsi/ulasan)
- [x] Component `ProductCard.jsx` & `VariantSelector.jsx`
- [x] Pagination katalog

## Modul 4: Keranjang & Wishlist (Customer)
- [x] Tambah ke keranjang (per varian)
- [x] Halaman keranjang: update qty, hapus item, lihat subtotal
- [x] Fitur wishlist: tambah/hapus, halaman wishlist
- [x] Validasi stok saat tambah ke keranjang

## Modul 5: Checkout & Pembayaran
- [x] Form alamat pengiriman (pilih tersimpan / tambah baru)
- [x] Input/pilih ongkos kirim manual oleh sistem (berdasarkan setting admin)
- [x] Kalkulasi subtotal + ongkir = total
- [x] Integrasi Midtrans Snap (buat transaksi, tampilkan popup pembayaran & mode simulasi demo)
- [x] Webhook/callback Midtrans (`MidtransWebhookController`) untuk update status pesanan
- [x] Halaman riwayat pesanan customer beserta status

## Modul 6: Rating & Ulasan
- [x] Form beri rating & ulasan (hanya untuk produk yang sudah dibeli & status "selesai")
- [x] Tampilkan rata-rata rating & daftar ulasan di halaman detail produk
- [x] Validasi 1 ulasan per pembelian

## Modul 7: Dashboard Admin
- [x] Layout Admin (`AdminLayout.jsx`) dengan sidebar
- [x] Dashboard ringkasan (total penjualan, pesanan baru, stok menipis)
- [x] CRUD Kategori
- [x] CRUD Produk (+ upload multi-gambar)
- [x] CRUD Varian Produk (warna, ukuran, stok, harga override)
- [x] Kelola Pesanan (lihat detail, update status pengiriman)
- [x] Route admin terhubung (`routes/web.php` lengkap dengan semua 54 routes)
- [ ] Setting ongkos kirim (flat rate/manual per area) — opsional
- [ ] Moderasi ulasan (opsional: hapus ulasan tidak pantas)

## Modul 8: Laporan
- [x] Laporan penjualan (ringkasan omzet, transaksi, item terjual)
- [x] Produk terlaris (bar chart + tabel)
- [x] Riwayat transaksi (paginated table)
- [ ] Export laporan (PDF/Excel) — opsional jika waktu memungkinkan

## Modul 9: Testing & Finalisasi
- [ ] Test end-to-end alur pembelian (browse → cart → checkout → bayar sandbox → status update)
- [ ] Test responsive di berbagai ukuran layar (mobile, tablet, desktop)
- [ ] Perbaikan bug dari testing
- [ ] Siapkan data dummy realistis untuk demo/presentasi
- [ ] Siapkan dokumentasi tambahan (screenshot, video demo jika diperlukan untuk laporan tugas)

## Modul 10: Dokumentasi Tugas
- [ ] Lengkapi laporan tugas (BAB pendahuluan, tinjauan pustaka, dll sesuai format kampus)
- [ ] Sertakan PRD, arsitektur, desain sebagai lampiran
- [ ] Siapkan slide presentasi (jika ada sidang/demo)
