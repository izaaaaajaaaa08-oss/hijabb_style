# Dokumen Arsitektur Sistem
## HijabStyle - Website E-Commerce Toko Hijab

---

## 1. Arsitektur Umum

Aplikasi menggunakan pola **Monolithic dengan Inertia.js** — Laravel bertindak sebagai backend (routing, controller, business logic) sementara React menjadi rendering layer di sisi client, tanpa perlu membuat REST API terpisah.

```
┌─────────────────────────────────────────────┐
│                   Browser                     │
│         (React Components via Inertia)        │
└───────────────────┬───────────────────────────┘
                     │  Inertia Requests (XHR, bukan full reload)
┌───────────────────▼───────────────────────────┐
│                Laravel 13 (Backend)            │
│  ┌───────────┐ ┌────────────┐ ┌─────────────┐  │
│  │  Routes   │→│ Controllers│→│   Models    │  │
│  └───────────┘ └────────────┘ └──────┬──────┘  │
│  ┌────────────────────┐              │         │
│  │  Middleware (Auth,  │              │         │
│  │  Role Admin/Cust.)  │              │         │
│  └────────────────────┘              │         │
└────────────────────────────────────────┼─────────┘
                                          │
                     ┌────────────────────▼───────┐
                     │      MySQL Database         │
                     └──────────────────────────────┘

     Eksternal: Midtrans Payment Gateway (via Webhook/Callback)
```

## 2. Struktur Folder Proyek (Laravel + Inertia + React)

```
hijabstyle/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Admin/
│   │   │   │   ├── DashboardController.php
│   │   │   │   ├── ProductController.php
│   │   │   │   ├── CategoryController.php
│   │   │   │   ├── VariantController.php
│   │   │   │   ├── OrderController.php
│   │   │   │   └── ReportController.php
│   │   │   ├── Customer/
│   │   │   │   ├── CartController.php
│   │   │   │   ├── CheckoutController.php
│   │   │   │   ├── WishlistController.php
│   │   │   │   ├── ReviewController.php
│   │   │   │   └── OrderHistoryController.php
│   │   │   ├── ProductCatalogController.php   (guest & customer)
│   │   │   ├── Auth/ (bawaan Breeze)
│   │   │   └── MidtransWebhookController.php
│   │   ├── Middleware/
│   │   │   ├── IsAdmin.php
│   │   │   └── EnsureCustomerLoggedIn.php (untuk proteksi checkout)
│   │   └── Requests/
│   │       ├── StoreProductRequest.php
│   │       └── StoreOrderRequest.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── Category.php
│   │   ├── Product.php
│   │   ├── ProductVariant.php
│   │   ├── ProductImage.php
│   │   ├── Cart.php
│   │   ├── CartItem.php
│   │   ├── Order.php
│   │   ├── OrderItem.php
│   │   ├── Wishlist.php
│   │   ├── Review.php
│   │   └── Address.php
│   └── Services/
│       ├── MidtransService.php
│       └── ShippingCostService.php (manual/flat rate)
├── database/
│   ├── migrations/
│   └── seeders/
│       ├── CategorySeeder.php
│       ├── ProductSeeder.php
│       └── AdminUserSeeder.php
├── resources/
│   ├── js/
│   │   ├── Pages/
│   │   │   ├── Guest/
│   │   │   │   ├── Home.jsx
│   │   │   │   ├── ProductList.jsx
│   │   │   │   └── ProductDetail.jsx
│   │   │   ├── Customer/
│   │   │   │   ├── Cart.jsx
│   │   │   │   ├── Checkout.jsx
│   │   │   │   ├── Wishlist.jsx
│   │   │   │   ├── OrderHistory.jsx
│   │   │   │   └── Profile.jsx
│   │   │   ├── Admin/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Products/
│   │   │   │   ├── Orders/
│   │   │   │   └── Reports.jsx
│   │   │   └── Auth/ (Login.jsx, Register.jsx)
│   │   ├── Components/
│   │   │   ├── ProductCard.jsx
│   │   │   ├── VariantSelector.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── RatingStars.jsx
│   │   ├── Layouts/
│   │   │   ├── MainLayout.jsx (untuk guest/customer)
│   │   │   └── AdminLayout.jsx
│   │   └── app.jsx
│   └── css/
│       └── app.css (Tailwind)
└── routes/
    ├── web.php
    └── admin.php
```

## 3. Entity Relationship Diagram (ERD)

### Daftar Tabel Utama

**users**
- id (PK)
- name
- email (unique)
- password
- role (enum: 'admin', 'customer')
- phone
- created_at, updated_at

**addresses**
- id (PK)
- user_id (FK → users)
- recipient_name
- phone
- full_address
- city
- postal_code
- is_default (boolean)

**categories**
- id (PK)
- name (mis. "Pashmina", "Segi Empat", "Bergo", "Instan")
- slug
- description

**products**
- id (PK)
- category_id (FK → categories)
- name
- slug
- description
- base_price
- is_active (boolean)
- created_at, updated_at

**product_variants**
- id (PK)
- product_id (FK → products)
- color
- size (nullable, jika ada ukuran)
- stock
- price_override (nullable, jika harga berbeda per varian)
- sku

**product_images**
- id (PK)
- product_id (FK → products)
- image_path
- is_primary (boolean)

**carts**
- id (PK)
- user_id (FK → users)

**cart_items**
- id (PK)
- cart_id (FK → carts)
- product_variant_id (FK → product_variants)
- quantity

**orders**
- id (PK)
- user_id (FK → users)
- address_id (FK → addresses)
- order_number (unique)
- subtotal
- shipping_cost
- total
- status (enum: 'menunggu_pembayaran', 'dibayar', 'diproses', 'dikirim', 'selesai', 'dibatalkan')
- midtrans_transaction_id (nullable)
- payment_method
- created_at, updated_at

**order_items**
- id (PK)
- order_id (FK → orders)
- product_variant_id (FK → product_variants)
- product_name (snapshot)
- variant_info (snapshot, mis. "Merah - All Size")
- price (snapshot harga saat transaksi)
- quantity
- subtotal

**wishlists**
- id (PK)
- user_id (FK → users)
- product_id (FK → products)

**reviews**
- id (PK)
- user_id (FK → users)
- product_id (FK → products)
- order_item_id (FK → order_items, untuk validasi hanya yang sudah beli)
- rating (1-5)
- comment
- created_at

### Relasi Utama
- `users` 1—N `orders`, `addresses`, `wishlists`, `reviews`
- `categories` 1—N `products`
- `products` 1—N `product_variants`, `product_images`, `reviews`, `wishlists`
- `orders` 1—N `order_items`
- `product_variants` 1—N `cart_items`, `order_items`

## 4. Integrasi Midtrans

1. Saat checkout, sistem membuat record `orders` dengan status `menunggu_pembayaran`
2. Laravel memanggil Midtrans Snap API untuk membuat transaksi, mendapatkan `snap_token`
3. Customer diarahkan ke halaman pembayaran Midtrans (Snap popup/redirect)
4. Midtrans mengirim callback/webhook ke `MidtransWebhookController`
5. Sistem memverifikasi signature key, lalu update status `orders` sesuai notifikasi (`settlement` → `dibayar`, `expire`/`cancel` → `dibatalkan`)

## 5. Keamanan

- Autentikasi menggunakan Laravel Breeze (session-based, cocok untuk Inertia)
- Middleware `IsAdmin` melindungi seluruh route `/admin/*`
- Middleware memastikan hanya customer yang login yang bisa mengakses checkout; guest diarahkan ke halaman login
- Validasi request menggunakan Form Request class Laravel
- CSRF protection otomatis dari Laravel + Inertia
- Signature key Midtrans diverifikasi di setiap webhook untuk mencegah pemalsuan notifikasi pembayaran
