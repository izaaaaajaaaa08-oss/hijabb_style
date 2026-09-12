# Dokumen Workflow & User Journey
## HijabStyle - Website E-Commerce Toko Hijab

---

## 1. Alur Kerja Pengembangan (Development Workflow)

Urutan pengerjaan mengikuti dependensi teknis — modul database harus selesai dulu sebelum modul fitur yang bergantung padanya.

```
1. Persiapan Proyek (setup Laravel, Inertia, React, Tailwind, Midtrans)
        │
2. Database & Model (migration seluruh tabel + seeder)
        │
3. Autentikasi & Role (login, register, middleware admin/customer)
        │
        ├──► 4. Katalog Produk (guest & customer bisa lihat produk)
        │
        ├──► 5. Keranjang & Wishlist (customer)
        │
        ├──► 6. Checkout & Pembayaran (Midtrans)
        │
        ├──► 7. Rating & Ulasan
        │
        └──► 8. Dashboard Admin (kelola produk, pesanan, laporan)
                    │
9. Testing & Finalisasi (end-to-end test, responsive check)
        │
10. Dokumentasi Tugas
```

Rekomendasi: kerjakan modul 4–8 secara paralel per fitur kecil (misal: selesai "tampilkan katalog" dulu, baru lanjut "detail produk", dst) agar progres terasa dan mudah didemokan bertahap ke dosen.

## 2. User Journey — Customer (Alur Pembelian)

```
[Guest membuka website]
        │
        ▼
[Browsing katalog / cari produk] ──(tertarik produk)──► [Buka detail produk]
        │                                                        │
        │                                                        ▼
        │                                          [Pilih varian: warna/ukuran]
        │                                                        │
        │                                          ┌─────────────┴─────────────┐
        │                                          ▼                           ▼
        │                                  [Tambah ke Wishlist]      [Tambah ke Keranjang]
        │                                          │                           │
        │                                          │                           ▼
        │                                          │                 [Lanjut ke Checkout]
        │                                          │                           │
        │                                          │                           ▼
        │                                          │                 {Sudah login?}
        │                                          │                    │           │
        │                                          │                  Belum        Sudah
        │                                          │                    │           │
        │                                          │                    ▼           │
        │                                          │           [Redirect ke Login/  │
        │                                          │            Register]           │
        │                                          │                    │           │
        │                                          │                    └─────┬─────┘
        │                                          │                          ▼
        │                                          │              [Isi/Pilih Alamat Pengiriman]
        │                                          │                          │
        │                                          │                          ▼
        │                                          │              [Lihat Ringkasan: Subtotal +
        │                                          │               Ongkir (manual) = Total]
        │                                          │                          │
        │                                          │                          ▼
        │                                          │              [Bayar via Midtrans Snap]
        │                                          │                          │
        │                                          │                ┌─────────┴─────────┐
        │                                          │                ▼                   ▼
        │                                          │          [Pembayaran           [Pembayaran
        │                                          │           Berhasil]              Gagal/Batal]
        │                                          │                │                   │
        │                                          │                ▼                   ▼
        │                                          │      [Status: Dibayar]     [Status: Dibatalkan]
        │                                          │                │
        │                                          │                ▼
        │                                          │      [Admin proses pesanan]
        │                                          │                │
        │                                          │                ▼
        │                                          │      [Status: Diproses → Dikirim → Selesai]
        │                                          │                │
        │                                          │                ▼
        │                                          │      [Customer beri Rating & Ulasan]
        ▼                                          ▼
[Tetap browsing tanpa checkout]         [Cek wishlist kapan saja dari akun]
```

## 3. User Journey — Admin

```
[Admin Login] → [Dashboard: lihat ringkasan penjualan & pesanan baru]
        │
        ├──► [Kelola Produk] → Tambah/Edit/Hapus produk, kategori, varian & stok
        │
        ├──► [Kelola Pesanan] → Lihat pesanan masuk (status "Dibayar")
        │                              │
        │                              ▼
        │                    Update status → "Diproses"
        │                              │
        │                              ▼
        │                    Input resi/kirim barang → "Dikirim"
        │                              │
        │                              ▼
        │                    Konfirmasi diterima → "Selesai"
        │
        ├──► [Atur Ongkos Kirim] → Set flat rate atau nominal manual per pesanan
        │
        └──► [Lihat Laporan] → Filter per periode/kategori → (opsional) export
```

## 4. Alur Notifikasi Pembayaran (Midtrans Webhook)

```
1. Customer klik "Bayar" di halaman checkout
2. Laravel (MidtransService) request Snap Token ke API Midtrans
3. Frontend (React) tampilkan popup Snap menggunakan token tsb
4. Customer menyelesaikan pembayaran di popup Midtrans
5. Midtrans kirim HTTP POST (webhook) ke endpoint:
   POST /webhook/midtrans
6. MidtransWebhookController:
   a. Verifikasi signature key (mencegah pemalsuan request)
   b. Cek status transaksi ('settlement', 'pending', 'expire', 'cancel')
   c. Update kolom `status` pada tabel `orders` sesuai hasil
7. Customer melihat status pesanan ter-update otomatis di halaman riwayat pesanan
```

## 5. Status Pesanan (State Machine)

```
menunggu_pembayaran ──(bayar sukses)──► dibayar ──(admin proses)──► diproses
        │                                                                │
        │(expire/batal)                                                 ▼
        ▼                                                            dikirim
   dibatalkan                                                            │
                                                                          ▼
                                                                       selesai
```

## 6. Catatan Kolaborasi (jika dikerjakan berkelompok)

- Gunakan Git dengan branch per modul (`feature/katalog-produk`, `feature/checkout`, dll)
- Commit kecil dan sering, dengan pesan commit yang jelas
- Testing manual tiap modul selesai sebelum merge ke branch utama
- Update `todo.md` setiap kali modul selesai untuk tracking progres
