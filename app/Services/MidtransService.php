<?php

namespace App\Services;

use App\Models\Order;
use Exception;
use Illuminate\Support\Facades\Log;
use Midtrans\Config;
use Midtrans\Snap;

class MidtransService
{
    public function __construct()
    {
        Config::$serverKey = config('services.midtrans.server_key') ?: 'SB-Mid-server-TESTKEY-PLACEHOLDER';
        Config::$isProduction = config('services.midtrans.is_production', false);
        Config::$isSanitized = config('services.midtrans.is_sanitized', true);
        Config::$is3ds = config('services.midtrans.is_3ds', true);
    }

    public function createSnapToken(Order $order): string
    {
        $serverKey = config('services.midtrans.server_key');

        if (empty($serverKey) || str_contains($serverKey, 'PLACEHOLDER')) {
            return 'MOCK-SNAP-' . md5($order->order_number . time());
        }

        try {
            $items = $order->items->map(function ($item) {
                return [
                    'id' => (string) $item->product_variant_id,
                    'price' => (int) round($item->price),
                    'quantity' => (int) $item->quantity,
                    'name' => mb_substr($item->product_name . ' (' . $item->variant_info . ')', 0, 50),
                ];
            })->toArray();

            if ($order->shipping_cost > 0) {
                $items[] = [
                    'id' => 'SHIPPING',
                    'price' => (int) round($order->shipping_cost),
                    'quantity' => 1,
                    'name' => 'Ongkos Kirim',
                ];
            }

            $params = [
                'transaction_details' => [
                    'order_id' => $order->order_number,
                    'gross_amount' => (int) round($order->total),
                ],
                'item_details' => $items,
                'customer_details' => [
                    'first_name' => $order->user->name,
                    'email' => $order->user->email,
                    'phone' => $order->address?->phone ?? $order->user->phone ?? '08123456789',
                    'billing_address' => [
                        'first_name' => $order->address?->recipient_name ?? $order->user->name,
                        'address' => $order->address?->full_address ?? '',
                        'city' => $order->address?->city ?? 'Palu',
                        'postal_code' => $order->address?->postal_code ?? '94111',
                    ],
                    'shipping_address' => [
                        'first_name' => $order->address?->recipient_name ?? $order->user->name,
                        'address' => $order->address?->full_address ?? '',
                        'city' => $order->address?->city ?? 'Palu',
                        'postal_code' => $order->address?->postal_code ?? '94111',
                    ],
                ],
            ];

            return Snap::getSnapToken($params);
        } catch (Exception $e) {
            Log::warning('Midtrans Snap Notice: ' . $e->getMessage() . ' - using fallback token.');
            return 'MOCK-SNAP-' . md5($order->order_number . time());
        }
    }
}
