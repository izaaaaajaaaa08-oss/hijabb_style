# Modul 1 — Database & Model (HijabStyle)

## Isi paket ini
```
database/migrations/   → 12 file migration (users update, categories, products,
                          product_variants, product_images, addresses, carts,
                          cart_items, orders, order_items, wishlists, reviews)
database/seeders/       → AdminUserSeeder, CategorySeeder, ProductSeeder, DatabaseSeeder
app/Models/              → 12 model Eloquent lengkap dengan relasi
```

## Cara pakai
1. Pastikan kamu sudah menyelesaikan Modul 0 (Laravel 13 + Breeze react + Inertia + Tailwind sudah terpasang).
2. Copy folder `database/migrations`, `database/seeders`, dan `app/Models` ini ke project Laravel kamu.
   - Boleh langsung timpa (replace) `database/seeders/DatabaseSeeder.php` bawaan Laravel.
   - Model `User.php` bawaan Breeze juga ditimpa (sudah saya tambahkan field `role`, `phone`, dan relasi).
3. Jalankan:
   ```
   php artisan migrate:fresh --seed
   ```
4. Cek data:
   - Login admin: `admin@hijabstyle.test` / `password123`
   - Login customer: `customer@hijabstyle.test` / `password123`
   - 4 kategori, masing-masing 2 produk, tiap produk 3 varian warna.

## Catatan
- Field `image_path` di `product_images` masih placeholder (`products/placeholder.jpg`).
  Nanti di Modul 7 (upload gambar admin) akan diganti dengan upload asli.
- Urutan migration sudah diatur agar foreign key tidak error (categories → products →
  variants/images → addresses → carts → orders → order_items → wishlists/reviews).
- Kolom `role` di tabel users default-nya `customer`, jadi user baru yang daftar lewat
  form register otomatis jadi customer.

## Selanjutnya
Modul 2: Autentikasi & Role (middleware `IsAdmin`, proteksi checkout untuk guest).
Bilang saja kalau mau lanjut ke situ.
