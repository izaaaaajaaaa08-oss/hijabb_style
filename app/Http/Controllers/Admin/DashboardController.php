<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $totalRevenue = Order::whereIn('status', [
            Order::STATUS_DIBAYAR,
            Order::STATUS_DIPROSES,
            Order::STATUS_DIKIRIM,
            Order::STATUS_SELESAI,
        ])->sum('total');

        $newOrdersCount = Order::where('status', Order::STATUS_DIBAYAR)->count();
        $pendingPaymentCount = Order::where('status', Order::STATUS_MENUNGGU_PEMBAYARAN)->count();
        $totalProductsCount = Product::where('is_active', true)->count();
        $lowStockVariants = ProductVariant::with('product')
            ->where('stock', '<', 5)
            ->take(5)
            ->get();

        $recentOrders = Order::with(['user', 'items'])
            ->latest()
            ->take(6)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_revenue' => (float) $totalRevenue,
                'new_orders' => $newOrdersCount,
                'pending_payment' => $pendingPaymentCount,
                'total_products' => $totalProductsCount,
                'low_stock_count' => ProductVariant::where('stock', '<', 5)->count(),
            ],
            'recentOrders' => $recentOrders,
            'lowStockVariants' => $lowStockVariants,
        ]);
    }
}
