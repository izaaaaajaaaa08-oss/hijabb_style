<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\ProductVariant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $cart = Cart::firstOrCreate(['user_id' => $user->id]);

        $items = $cart->items()
            ->with(['variant.product.primaryImage'])
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'quantity' => $item->quantity,
                    'variant' => [
                        'id' => $item->variant->id,
                        'color' => $item->variant->color,
                        'size' => $item->variant->size,
                        'stock' => $item->variant->stock,
                        'final_price' => $item->variant->final_price,
                        'product' => [
                            'id' => $item->variant->product->id,
                            'name' => $item->variant->product->name,
                            'slug' => $item->variant->product->slug,
                            'image' => $item->variant->product->primaryImage?->image_path ?? 'products/placeholder.jpg',
                        ],
                    ],
                    'subtotal' => $item->variant->final_price * $item->quantity,
                ];
            });

        $subtotal = $items->sum('subtotal');

        return Inertia::render('Customer/Cart', [
            'cart' => [
                'id' => $cart->id,
                'items' => $items,
                'subtotal' => $subtotal,
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'product_variant_id' => 'required|exists:product_variants,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $variant = ProductVariant::findOrFail($request->product_variant_id);

        if ($variant->stock < $request->quantity) {
            return back()->with('error', 'Stok varian ini tidak mencukupi (tersisa ' . $variant->stock . ').');
        }

        $user = $request->user();
        $cart = Cart::firstOrCreate(['user_id' => $user->id]);

        $item = CartItem::where('cart_id', $cart->id)
            ->where('product_variant_id', $variant->id)
            ->first();

        if ($item) {
            $newQuantity = $item->quantity + $request->quantity;
            if ($newQuantity > $variant->stock) {
                return back()->with('error', 'Jumlah total di keranjang melebihi stok yang tersedia.');
            }
            $item->update(['quantity' => $newQuantity]);
        } else {
            CartItem::create([
                'cart_id' => $cart->id,
                'product_variant_id' => $variant->id,
                'quantity' => $request->quantity,
            ]);
        }

        return back()->with('success', 'Hijab berhasil ditambahkan ke keranjang!');
    }

    public function update(Request $request, CartItem $item): RedirectResponse
    {
        if ($item->cart->user_id !== $request->user()->id) {
            abort(403);
        }

        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        if ($request->quantity > $item->variant->stock) {
            return back()->with('error', 'Jumlah melebihi stok yang tersedia (' . $item->variant->stock . ').');
        }

        $item->update(['quantity' => $request->quantity]);

        return back()->with('success', 'Jumlah produk berhasil diperbarui.');
    }

    public function destroy(Request $request, CartItem $item): RedirectResponse
    {
        if ($item->cart->user_id !== $request->user()->id) {
            abort(403);
        }

        $item->delete();

        return back()->with('success', 'Produk dihapus dari keranjang.');
    }
}
