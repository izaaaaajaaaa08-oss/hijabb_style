<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MidtransWebhookController extends Controller
{
    public function handle(Request $request): JsonResponse
    {
        $payload = $request->all();
        Log::info('Midtrans Webhook Received: ', $payload);

        $orderId = $payload['order_id'] ?? null;
        $statusCode = $payload['status_code'] ?? null;
        $grossAmount = $payload['gross_amount'] ?? null;
        $signatureKey = $payload['signature_key'] ?? null;
        $transactionStatus = $payload['transaction_status'] ?? null;
        $paymentType = $payload['payment_type'] ?? null;

        $serverKey = config('services.midtrans.server_key');

        // Verify signature if key is set
        if ($serverKey && ! str_contains($serverKey, 'PLACEHOLDER')) {
            $expectedSignature = hash('sha512', $orderId . $statusCode . $grossAmount . $serverKey);
            if ($signatureKey !== $expectedSignature) {
                Log::warning('Midtrans Webhook: Invalid Signature Key');
                return response()->json(['message' => 'Invalid signature'], 403);
            }
        }

        $order = Order::where('order_number', $orderId)->first();

        if (! $order) {
            Log::warning("Midtrans Webhook: Order {$orderId} not found");
            return response()->json(['message' => 'Order not found'], 404);
        }

        if (in_array($transactionStatus, ['capture', 'settlement'])) {
            $order->update([
                'status' => Order::STATUS_DIBAYAR,
                'payment_method' => $paymentType ?? $order->payment_method,
                'midtrans_transaction_id' => $payload['transaction_id'] ?? null,
            ]);
        } elseif ($transactionStatus === 'pending') {
            $order->update([
                'status' => Order::STATUS_MENUNGGU_PEMBAYARAN,
            ]);
        } elseif (in_array($transactionStatus, ['deny', 'expire', 'cancel'])) {
            // If cancelled/expired, restore stocks if it wasn't cancelled yet
            if ($order->status !== Order::STATUS_DIBATALKAN) {
                foreach ($order->items as $item) {
                    $item->variant?->increment('stock', $item->quantity);
                }
            }

            $order->update([
                'status' => Order::STATUS_DIBATALKAN,
            ]);
        }

        return response()->json(['status' => 'success']);
    }
}
