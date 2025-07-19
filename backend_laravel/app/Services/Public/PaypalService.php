<?php

namespace App\Services\Public;

use App\Models\Cart;
use Srmklive\PayPal\Services\PayPal as PayPalClient;
use Illuminate\Http\Request;
use App\Models\Order;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Srmklive\PayPal\Facades\PayPal;
use Illuminate\Support\Facades\DB;

class PayPalService
{
    protected $provider;
    protected $auth;

    public function __construct()
    {
        $this->provider = new PayPalClient();
        $this->provider->setApiCredentials(config('paypal'));
        $this->provider->getAccessToken();
        $this->auth = auth('customers');
    }

    public function createOrder(Order $order): string
    {
        $usd = 25700;
        $paypalValue = number_format($order->total_amount / $usd, 2, '.', '');



        $response = $this->provider->createOrder([
            'intent' => 'CAPTURE',
            'application_context' => [
                'return_url' => "http://localhost:5173/paypal/success?orderId={$order->id}",
                'cancel_url' => "http://localhost:5173/paypal/cancel?orderId={$order->id}"
            ],
            'purchase_units' => [
                [
                    'amount' => [
                        'currency_code' => config('paypal.currency', 'USD'),
                        'value' => $paypalValue,
                    ],
                    'description' => "Thanh toán cho đơn hàng mã #{$order->code}"
                ]
            ]
        ]);

        if (isset($response['links'])) {
            foreach ($response['links'] as $link) {
                if ($link['rel'] === 'approve') {
                    return $link['href'];
                }
            }
        }
        throw new \Exception('Không thể tạo liên kết thanh toán paypal');
    }

    public function captureOrder(Request $request)
    {
        DB::beginTransaction();
        try {
            $token = $request->input('token');
            $payerId = $request->input('payerId');
            $orderId = $request->input('orderId');
            $response = $this->provider->capturePaymentOrder($token);
            $order = Order::find($orderId);
            if (!$order) {
                throw new ModelNotFoundException('không tìm thấy sản phẩm hợp lệ');
            }
            if (!empty($response['status']) && $response['status'] === 'COMPLETED') {
                $order->status = 'paid';
                $order->paypal_data = $response;
                $order->save();

                $cart = Cart::where('customer_id', $this->auth->user()->id)->delete();


                DB::commit();
                return true;
            }
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }
}
