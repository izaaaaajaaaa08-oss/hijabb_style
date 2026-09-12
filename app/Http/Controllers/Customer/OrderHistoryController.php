<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderHistoryController extends Controller
{
    public function index(Request $request): Response
    {
        $orders = $request->user()->orders()
            ->with(['items.variant.product.primaryImage', 'address'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Customer/OrderHistory', [
            'orders' => $orders,
        ]);
    }

    public function show(Request $request, Order $order): Response
    {
        if ($order->user_id !== $request->user()->id) {
            abort(403);
        }

        $order->load(['items.variant.product.primaryImage', 'address']);

        // Check if items have been reviewed by user
        $userReviews = $request->user()->reviews()->pluck('order_item_id')->toArray();

        return Inertia::render('Customer/OrderDetail', [
            'order' => $order,
            'userReviewedItemIds' => $userReviews,
        ]);
    }

    public function simulatePayment(Request $request, Order $order): RedirectResponse
    {
        if ($order->user_id !== $request->user()->id && ! $request->user()->isAdmin()) {
            abort(403);
        }

        if ($order->status !== Order::STATUS_MENUNGGU_PEMBAYARAN) {
            return back()->with('error', 'Status pesanan saat ini tidak dalam status menunggu pembayaran.');
        }

        $order->update([
            'status' => Order::STATUS_DIBAYAR,
            'midtrans_transaction_id' => 'SIMULATED-' . time(),
        ]);

        return back()->with('success', 'Pembayaran berhasil disimulasikan! Status pesanan kini: DIBAYAR.');
    }
}
