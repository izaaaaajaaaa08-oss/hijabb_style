<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProductCatalogController;
use App\Http\Controllers\Customer\CartController;
use App\Http\Controllers\Customer\CheckoutController;
use App\Http\Controllers\Customer\OrderHistoryController;
use App\Http\Controllers\Customer\WishlistController;
use App\Http\Controllers\Customer\ReviewController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\MidtransWebhookController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes — HijabStyle
|--------------------------------------------------------------------------
*/

// ─── Guest / Public Routes ───────────────────────────────────────────────────
Route::get('/', [ProductCatalogController::class, 'home'])->name('home');
Route::get('/products', [ProductCatalogController::class, 'index'])->name('products.index');
Route::get('/products/{product:slug}', [ProductCatalogController::class, 'show'])->name('products.show');

// Alias routes agar nama 'catalog.index' dan 'catalog.show' dari frontend bisa berjalan
Route::get('/catalog', [ProductCatalogController::class, 'index'])->name('catalog.index');
Route::get('/catalog/{product:slug}', [ProductCatalogController::class, 'show'])->name('catalog.show');

// ─── Midtrans Webhook (no auth/CSRF) ─────────────────────────────────────────
Route::post('/webhook/midtrans', [MidtransWebhookController::class, 'handle'])
    ->name('midtrans.webhook')
    ->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class]);

// ─── Authenticated Customer Routes ───────────────────────────────────────────
Route::middleware(['auth', 'verified'])->group(function () {

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Cart
    Route::get('/cart', [CartController::class, 'index'])->name('customer.cart.index');
    Route::post('/cart', [CartController::class, 'add'])->name('customer.cart.store');
    Route::patch('/cart/{cartItem}', [CartController::class, 'update'])->name('customer.cart.update');
    Route::delete('/cart/{cartItem}', [CartController::class, 'remove'])->name('customer.cart.destroy');

    // Wishlist
    Route::get('/wishlist', [WishlistController::class, 'index'])->name('customer.wishlist.index');
    Route::post('/wishlist/{product}', [WishlistController::class, 'toggle'])->name('customer.wishlist.toggle');

    // Checkout
    Route::middleware('customer')->group(function () {
        Route::get('/checkout', [CheckoutController::class, 'index'])->name('customer.checkout.index');
        Route::post('/checkout', [CheckoutController::class, 'store'])->name('customer.checkout.store');
    });

    // Orders
    Route::get('/orders', [OrderHistoryController::class, 'index'])->name('customer.orders.index');
    Route::get('/orders/{order}', [OrderHistoryController::class, 'show'])->name('customer.orders.show');
    Route::post('/orders/{order}/simulate-payment', [OrderHistoryController::class, 'simulatePayment'])->name('customer.orders.simulate-payment');

    // Reviews
    Route::post('/reviews', [ReviewController::class, 'store'])->name('customer.reviews.store');
});

// ─── Admin Routes ─────────────────────────────────────────────────────────────
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Categories — CRUD (no dedicated show/edit page, handled inline in Index)
    Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
    Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::patch('/categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');

    // Products — full CRUD
    Route::get('/products', [ProductController::class, 'index'])->name('products.index');
    Route::get('/products/create', [ProductController::class, 'create'])->name('products.create');
    Route::post('/products', [ProductController::class, 'store'])->name('products.store');
    Route::get('/products/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');
    Route::patch('/products/{product}', [ProductController::class, 'update'])->name('products.update');
    Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');

    // Orders — view + update status
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus'])->name('orders.update-status');

    // Reports
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
});

require __DIR__.'/auth.php';
