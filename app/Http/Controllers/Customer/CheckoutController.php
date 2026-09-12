<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function index(Request $request): Response|RedirectResponse
    {
        $user = $request->user();
        $cart = Cart::where('user_id', $user->id)->first();

        if (! $cart || $cart->items()->count() === 0) {
            return redirect()->route('customer.cart.index')->with('error', 'Keranjang belanja Anda masih kosong.');
        }

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
                            'name' => $item->variant->product->name,
                            'image' => $item->variant->product->primaryImage?->image_path ?? 'products/placeholder.jpg',
                        ],
                    ],
                    'subtotal' => $item->variant->final_price * $item->quantity,
                ];
            });

        $subtotal = $items->sum('subtotal');
        $addresses = $user->addresses()->latest()->get();

        $shippingOptions = [
            [
                'id' => 'kurir_toko',
                'name' => 'Kurir Toko (Area Palu Barat & Sekitarnya)',
                'cost' => 10000,
                'estimate' => 'Hari yang sama / 1 hari',
            ],
            [
                'id' => 'jne_reg',
                'name' => 'JNE Regular (Luar Kota / Nasional)',
                'cost' => 20000,
                'estimate' => '2-3 hari kerja',
            ],
            [
                'id' => 'jnt_express',
                'name' => 'J&T Express (Pengiriman Cepat)',
                'cost' => 25000,
                'estimate' => '1-2 hari kerja',
            ],
        ];

        return Inertia::render('Customer/Checkout', [
            'items' => $items,
            'subtotal' => $subtotal,
            'addresses' => $addresses,
            'shippingOptions' => $shippingOptions,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();
        $cart = Cart::where('user_id', $user->id)->first();

        if (! $cart || $cart->items()->count() === 0) {
            return redirect()->route('customer.cart.index')->with('error', 'Keranjang belanja Anda kosong.');
        }

        $request->validate([
            'address_option' => 'required|in:existing,new',
            'address_id' => 'required_if:address_option,existing|nullable|exists:addresses,id',
            'recipient_name' => 'required_if:address_option,new|nullable|string|max:255',
            'phone' => 'required_if:address_option,new|nullable|string|max:20',
            'full_address' => 'required_if:address_option,new|nullable|string|max:500',
            'city' => 'required_if:address_option,new|nullable|string|max:100',
            'postal_code' => 'required_if:address_option,new|nullable|string|max:10',
            'shipping_option_id' => 'required|string',
        ]);

        $shippingCosts = [
            'kurir_toko' => 10000,
            'jne_reg' => 20000,
            'jnt_express' => 25000,
        ];
        $shippingCost = $shippingCosts[$request->shipping_option_id] ?? 10000;

        try {
            $order = DB::transaction(function () use ($request, $user, $cart, $shippingCost) {
                if ($request->address_option === 'new') {
                    $address = Address::create([
                        'user_id' => $user->id,
                        'recipient_name' => $request->recipient_name,
                        'phone' => $request->phone,
                        'full_address' => $request->full_address,
                        'city' => $request->city,
                        'postal_code' => $request->postal_code,
                        'is_default' => $user->addresses()->count() === 0,
                    ]);
                } else {
                    $address = Address::where('user_id', $user->id)->findOrFail($request->address_id);
                }

                $cartItems = $cart->items()->with('variant.product')->get();
                $subtotal = 0;

                foreach ($cartItems as $cItem) {
                    if ($cItem->quantity > $cItem->variant->stock) {
                        throw new Exception('Stok untuk produk ' . $cItem->variant->product->name . ' (' . $cItem->variant->color . ') tidak mencukupi.');
                    }
                    $subtotal += ($cItem->variant->final_price * $cItem->quantity);
                }

                $total = $subtotal + $shippingCost;

                $order = Order::create([
                    'user_id' => $user->id,
                    'address_id' => $address->id,
                    'order_number' => 'ORD-' . date('Ymd') . '-' . strtoupper(Str::random(5)),
                    'subtotal' => $subtotal,
                    'shipping_cost' => $shippingCost,
                    'total' => $total,
                    'status' => Order::STATUS_MENUNGGU_PEMBAYARAN,
                    'payment_method' => 'transfer_bank',
                ]);

                foreach ($cartItems as $cItem) {
                    $variant = $cItem->variant;
                    $itemSubtotal = $variant->final_price * $cItem->quantity;

                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_variant_id' => $variant->id,
                        'product_name' => $variant->product->name,
                        'variant_info' => $variant->color . ($variant->size ? ' - ' . $variant->size : ''),
                        'price' => $variant->final_price,
                        'quantity' => $cItem->quantity,
                        'subtotal' => $itemSubtotal,
                    ]);

                    $variant->decrement('stock', $cItem->quantity);
                }

                $cart->items()->delete();

                return $order;
            });

            $order->load(['items', 'user', 'address']);

            return redirect()->route('customer.orders.show', $order->id)->with([
                'success' => 'Pesanan berhasil dibuat! Silakan lakukan pembayaran via Transfer Bank.',
            ]);
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
