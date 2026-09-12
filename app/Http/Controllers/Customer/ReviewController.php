<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\OrderItem;
use App\Models\Review;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'order_item_id' => 'required|exists:order_items,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|min:3|max:1000',
        ]);

        $user = $request->user();
        $orderItem = OrderItem::with('order.user')->findOrFail($request->order_item_id);

        if ($orderItem->order->user_id !== $user->id) {
            abort(403);
        }

        if ($orderItem->order->status !== 'selesai') {
            return back()->with('error', 'Ulasan hanya dapat diberikan jika pesanan telah selesai.');
        }

        $existing = Review::where('user_id', $user->id)
            ->where('order_item_id', $orderItem->id)
            ->first();

        if ($existing) {
            return back()->with('error', 'Anda sudah memberikan ulasan untuk produk pada pesanan ini.');
        }

        Review::create([
            'user_id' => $user->id,
            'product_id' => $orderItem->variant?->product_id,
            'order_item_id' => $orderItem->id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        return back()->with('success', 'Terima kasih! Ulasan dan rating Anda telah berhasil dikirim.');
    }
}
