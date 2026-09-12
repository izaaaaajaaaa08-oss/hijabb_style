# Product Requirements Document (PRD)
## HijabStyle - Website E-Commerce Toko Hijab

**Versi:** 1.0
**Tanggal:** 11 September 2026
**Status:** Draft

---

## 1. Latar Belakang

HijabStyle adalah toko hijab fisik yang berlokasi di Jl. Kemiri, depan SMP 3 Kamonji, Kec. Palu Barat, Kota Palu, Sulawesi Tengah 94111. Toko ini membutuhkan platform digital agar produk dapat dijangkau pelanggan secara lebih luas, tidak terbatas pada pelanggan yang datang langsung ke toko.

## 2. Tujuan Produk

- Menyediakan katalog produk hijab secara online yang bisa diakses lewat desktop maupun mobile (responsive web).
- Memungkinkan pelanggan melakukan pemesanan dan pembayaran secara online.
- Mempermudah admin toko dalam mengelola stok, pesanan, dan laporan penjualan.
- Meningkatkan jangkauan pasar toko HijabStyle di luar wilayah Palu.

## 3. Target Pengguna

| Peran | Deskripsi |
|---|---|
| **Guest (Pengunjung)** | Bisa melihat katalog, detail produk, kategori, tanpa perlu login. Tidak bisa checkout. |
| **Customer** | Wajib login/registrasi untuk checkout. Bisa belanja, wishlist, memberi rating & ulasan, melihat riwayat pesanan. |
| **Admin** | Mengelola produk, kategori, varian, stok, pesanan, laporan penjualan, dan konten website. |

## 4. Ruang Lingkup (Scope)

### 4.1 Fitur untuk Guest & Customer
- Melihat beranda dengan produk unggulan/terbaru
- Melihat katalog produk berdasarkan kategori (Segi Empat, Pashmina, Bergo, Instan, dll)
- Melihat detail produk beserta varian (warna/ukuran) dan stok masing-masing varian
- Pencarian & filter produk (kategori, harga, warna)
- **(Customer)** Registrasi & login
- **(Customer)** Keranjang belanja
- **(Customer)** Checkout dengan alamat pengiriman
- **(Customer)** Pembayaran online via Midtrans
- **(Customer)** Riwayat pesanan & status pesanan (menunggu pembayaran, diproses, dikirim, selesai)
- **(Customer)** Wishlist produk
- **(Customer)** Rating & ulasan produk (hanya untuk produk yang sudah dibeli)
- **(Customer)** Edit profil & alamat

### 4.2 Fitur untuk Admin
- Login admin (terpisah dari customer)
- Dashboard ringkasan (total penjualan, pesanan masuk, produk stok rendah)
- CRUD kategori produk
- CRUD produk beserta varian (warna/ukuran) dan stok per varian
- Upload multi-gambar produk
- Kelola pesanan (verifikasi pembayaran otomatis via webhook Midtrans, update status pengiriman)
- Kelola ongkos kirim (flat rate/manual per area atau per pesanan)
- Laporan penjualan (harian/bulanan, per produk, per kategori) dengan opsi export
- Kelola ulasan produk (moderasi jika diperlukan)

### 4.3 Di Luar Ruang Lingkup (Out of Scope) — versi awal
- Aplikasi mobile native (Android/iOS)
- PWA (Progressive Web App)
- Integrasi API ongkir otomatis (JNE/JNT API) — ongkir diinput manual
- Live chat / integrasi WhatsApp otomatis
- Multi-bahasa

## 5. Persyaratan Non-Fungsional

| Aspek | Requirement |
|---|---|
| Responsivitas | Tampilan harus optimal di desktop dan mobile (mobile-first responsive design) |
| Keamanan | Password di-hash (bcrypt), validasi input, proteksi CSRF (bawaan Laravel), sanitasi upload file |
| Performa | Lazy loading gambar produk, pagination pada katalog |
| Kompatibilitas Browser | Chrome, Firefox, Edge (versi terbaru) |
| Lingkungan Deploy | Localhost (Laragon/XAMPP) untuk keperluan demo tugas kuliah |

## 6. Tech Stack

| Layer | Teknologi |
|---|---|
| Backend Framework | Laravel 13 |
| Frontend Library | React (via Inertia.js) |
| Database | MySQL |
| Payment Gateway | Midtrans (Sandbox untuk development) |
| Styling | Tailwind CSS |
| Autentikasi | Laravel Breeze/Fortify + Inertia |

## 7. Alur Bisnis Utama

1. Customer melihat katalog → pilih produk & varian → tambah ke keranjang
2. Checkout → isi/pilih alamat → sistem hitung total (harga + ongkir manual admin) → redirect ke Midtrans
3. Midtrans mengirim notifikasi pembayaran (webhook) → status pesanan otomatis berubah
4. Admin memproses pesanan yang sudah dibayar → update status pengiriman
5. Customer menerima pesanan → bisa memberi rating & ulasan produk

## 8. Kriteria Sukses (Definition of Done)

- Semua modul CRUD (produk, kategori, varian, pesanan) berjalan tanpa error
- Alur pembayaran Midtrans sandbox berhasil diuji end-to-end
- Tampilan responsif teruji di minimal 2 ukuran layar (desktop & mobile)
- Laporan penjualan dapat menampilkan data yang akurat sesuai transaksi
- Dokumentasi (PRD, arsitektur, desain, todo, workflow) lengkap sebagai bagian dari tugas

## 9. Risiko & Asumsi

- **Asumsi:** Midtrans sandbox digunakan untuk demo (bukan transaksi nyata)
- **Asumsi:** Ongkos kirim dihitung manual/flat rate oleh admin, bukan real-time
- **Risiko:** Timeline pengerjaan belum pasti, sehingga fitur akan dikerjakan bertahap sesuai prioritas di `todo.md`
