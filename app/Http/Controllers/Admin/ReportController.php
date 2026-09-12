<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function index(Request $request): Response
    {
        $paidOrdersQuery = Order::whereIn('status', [
            Order::STATUS_DIBAYAR,
            Order::STATUS_DIPROSES,
            Order::STATUS_DIKIRIM,
            Order::STATUS_SELESAI,
        ]);

        $totalOmzet = (float) (clone $paidOrdersQuery)->sum('total');
        $totalTransactions = (clone $paidOrdersQuery)->count();
        $totalItemsSold = OrderItem::whereHas('order', function ($q) {
            $q->whereIn('status', [
                Order::STATUS_DIBAYAR,
                Order::STATUS_DIPROSES,
                Order::STATUS_DIKIRIM,
                Order::STATUS_SELESAI,
            ]);
        })->sum('quantity');

        // Top selling products
        $topProducts = OrderItem::select('product_name', DB::raw('SUM(quantity) as total_qty'), DB::raw('SUM(subtotal) as total_sales'))
            ->whereHas('order', function ($q) {
                $q->whereIn('status', [
                    Order::STATUS_DIBAYAR,
                    Order::STATUS_DIPROSES,
                    Order::STATUS_DIKIRIM,
                    Order::STATUS_SELESAI,
                ]);
            })
            ->groupBy('product_name')
            ->orderByDesc('total_qty')
            ->take(5)
            ->get();

        // Recent completed transactions
        $transactions = Order::with(['user', 'items'])
            ->whereIn('status', [
                Order::STATUS_DIBAYAR,
                Order::STATUS_DIPROSES,
                Order::STATUS_DIKIRIM,
                Order::STATUS_SELESAI,
            ])
            ->latest()
            ->paginate(15);

        return Inertia::render('Admin/Reports', [
            'summary' => [
                'total_omzet' => $totalOmzet,
                'total_transactions' => $totalTransactions,
                'total_items_sold' => (int) $totalItemsSold,
            ],
            'topProducts' => $topProducts,
            'transactions' => $transactions,
        ]);
    }
}
