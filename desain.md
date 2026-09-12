# Dokumen Desain (UI/UX)
## HijabStyle - Website E-Commerce Toko Hijab

---

## 1. Konsep Desain

Tema visual: **Pastel/Soft & Feminin** — mencerminkan kesan lembut, bersih, dan modern yang sesuai dengan target pasar produk hijab.

## 2. Palet Warna

| Warna | Kode Hex | Penggunaan |
|---|---|---|
| Dusty Pink | `#E8B4B8` | Warna primer — tombol utama, aksen, highlight |
| Cream | `#FDF6EC` | Warna latar belakang utama |
| Sage Green | `#A8BBA3` | Warna sekunder — badge, ikon, aksen kategori |
| Coklat Tua (teks) | `#4A3F35` | Warna teks utama agar kontras terbaca |
| Putih | `#FFFFFF` | Latar kartu produk, form |
| Merah Soft (error/diskon) | `#D98880` | Notifikasi error, label diskon |
| Hijau Soft (sukses) | `#8FBC94` | Notifikasi sukses, status "selesai" |

## 3. Tipografi

| Elemen | Font | Keterangan |
|---|---|---|
| Judul/Heading | Poppins (SemiBold) | Untuk nama produk, judul halaman |
| Body Text | Inter / Nunito Sans (Regular) | Untuk deskripsi, paragraf |
| Aksen/Logo | Playfair Display (Italic) | Untuk logo "HijabStyle" agar terasa elegan |

## 4. Komponen UI Utama

### 4.1 Navbar
- Logo di kiri, menu kategori di tengah (Beranda, Katalog, Tentang, Kontak)
- Ikon: pencarian, wishlist (hati), keranjang, akun — di kanan
- Versi mobile: hamburger menu dengan bottom navigation untuk ikon utama

### 4.2 Product Card
- Gambar produk (rasio 1:1), badge kategori di pojok
- Nama produk, rentang harga (jika ada varian dengan harga berbeda)
- Rating bintang (rata-rata dari review)
- Ikon wishlist (hati) di pojok kanan atas gambar
- Hover effect: tampilkan tombol "Lihat Detail" (desktop)

### 4.3 Halaman Detail Produk
- Galeri gambar (thumbnail + gambar utama, bisa multi-gambar)
- Pilihan varian: swatch warna (bulat berwarna) + dropdown/tombol ukuran
- Info stok per varian (jika stok < 5, tampilkan "Stok terbatas")
- Tombol "Tambah ke Keranjang" (dusty pink) dan ikon wishlist
- Tab: Deskripsi | Ulasan (rating & komentar customer)

### 4.4 Keranjang & Checkout
- List item keranjang dengan thumbnail, varian, qty (+/-), subtotal
- Ringkasan: subtotal, ongkir (manual, ditentukan admin), total
- Form alamat pengiriman (pilih tersimpan atau tambah baru)
- Tombol "Lanjut ke Pembayaran" → redirect Midtrans Snap

### 4.5 Dashboard Admin
- Sidebar kiri: Dashboard, Produk, Kategori, Pesanan, Laporan, Ulasan
- Layout tabel untuk data (produk, pesanan) dengan search & filter
- Card ringkasan di dashboard: Total Penjualan Bulan Ini, Pesanan Baru, Produk Stok Menipis
- Warna admin panel tetap konsisten dengan tema pastel tapi lebih netral (banyak putih/cream agar fokus ke data)

## 5. Prinsip Responsive Design

| Breakpoint | Layout |
|---|---|
| Mobile (< 768px) | 1 kolom produk (atau 2 kolom grid kecil), navbar hamburger, bottom nav untuk keranjang/wishlist/akun |
| Tablet (768–1024px) | 2-3 kolom grid produk |
| Desktop (> 1024px) | 4 kolom grid produk, navbar penuh, sidebar filter kategori di kiri halaman katalog |

Menggunakan **Tailwind CSS** dengan pendekatan **mobile-first** (`sm:`, `md:`, `lg:` breakpoints).

## 6. Wireframe Konsep (Deskripsi Tekstual)

### Beranda
```
[ Navbar ]
[ Hero Banner - promo/produk unggulan ]
[ Kategori shortcut (ikon bulat: Pashmina, Segi Empat, Bergo, Instan) ]
[ Produk Terbaru - grid ]
[ Produk Terlaris - grid ]
[ Footer - info toko, alamat, kontak ]
```

### Katalog Produk
```
[ Navbar ]
[ Sidebar Filter (kategori, harga, warna) ] [ Grid Produk + Sorting ]
[ Pagination ]
[ Footer ]
```

### Detail Produk
```
[ Navbar ]
[ Galeri Gambar ]      [ Nama Produk, Harga, Rating ]
                        [ Pilihan Varian: Warna/Ukuran ]
                        [ Qty + Tombol Tambah Keranjang ]
[ Tab: Deskripsi / Ulasan ]
[ Produk Terkait ]
[ Footer ]
```

## 7. Ikon & Asset

- Menggunakan icon set **Lucide** (konsisten dengan style modern, garis tipis)
- Ilustrasi kosong (empty state) untuk keranjang/wishlist kosong bergaya flat pastel
