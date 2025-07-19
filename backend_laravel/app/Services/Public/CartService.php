<?php

namespace App\Services\Public;

use App\Models\Order;
use App\Repositories\Cart\CartRepository;
use App\Services\Interfaces\Product\ProductVariantServiceInterface as ProductVariantService;
use App\Services\Public\ProductService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use App\Traits\HasTransaction;
use App\Services\Public\PayPalService;
use Illuminate\Http\JsonResponse;

class CartService
{
    use HasTransaction;
    private $auth;
    private $request;
    private $cart;
    private $product;
    private $variant;
    private $order;

    private $productVariantService;
    private $productService;
    private $cartReponsitory;
    public function __construct(ProductVariantService $productVariantService, ProductService $productService, CartRepository $cartReponsitory)
    {
        $this->productService = $productService;
        $this->productVariantService = $productVariantService;
        $this->cartReponsitory = $cartReponsitory;
    }

    private function withUser(): self
    {
        // $user = auth('customers');
        // $this->auth = $user->user();
        // dd($this->auth->name);
        $this->auth = auth('customers')->user();
        return $this;
    }

    private function withRequest(Request $request): self
    {
        $this->request = $request;
        return $this;
    }

    private function resolveCart(): self
    {
        $this->cart = $this->cartReponsitory->firstOrCreate(['customer_id' => $this->auth->id]);
        return $this;
    }

    private function resolveProduct(): self
    {

        $this->product = $this->productService->read((int)$this->request->product_id);
        if (!$this->product) {
            throw new ModelNotFoundException('Không tìm thấy sản phẩm');
        }
        if ($this->request->variant_id) {
            $this->variant = $this->productVariantService->read((int)$this->request->variant_id);
        }
        return $this;
    }

    // củ
    // private function attachItem(): self
    // {
    //     $clientId = $this->variant ? "{$this->product->id}_{$this->variant->id}" : (string)$this->product->id;
    //     $existing = $this->cart->items()->where('client_id', $clientId)->first();
    //     $finalPrice = $this->variant->getDiscountPrice()['finalPrice'] ?? $this->product->getDiscountPrice()['finalPrice'];
    //     $originalPrice = $this->variant->getDiscountPrice()['originalPrice'] ?? $this->product->getDiscountPrice()['originalPrice'];
    //     $discount = $this->variant->getDiscountPrice()['promotionDiscount'] ?? $this->product->getDiscountPrice()['promotionDiscount'];
    //     if ($existing) {
    //         $existing->quantity += $this->request->quantity;
    //         $existing->total_price = $finalPrice * $existing->quantity;
    //         $existing->save();
    //     } else {
    //         $this->cart->items()->create([
    //             'client_id' => $clientId,
    //             'product_id' => $this->product->id,
    //             'product_variant_id' => $this->variant->id,
    //             'product_name' => $this->product->name,
    //             'product_image' => $this->product->image,
    //             'product_code' => $this->product->code,
    //             'variant_sku' => $this->variant->sku,
    //             'selected_attributes' => $this->request->selected_attributes ?? [],
    //             'original_price' =>  $originalPrice,
    //             'final_price' => $finalPrice,
    //             'discount' => $discount,
    //             'quantity' => $this->request->quantity,
    //             'total_price' => $finalPrice * $this->request->quantity,
    //         ]);
    //     }
    //     return $this;
    // }


    // đã sửa update mới
    private function attachItem(): self
    {
        // Kiểm tra nếu $this->product không phải null
        if (!$this->product) {
            throw new ModelNotFoundException('Sản phẩm không tồn tại.');
        }
        // Kiểm tra nếu $this->variant không phải null
        if ($this->variant) {
            $clientId = "{$this->product->id}_{$this->variant->id}";
            $finalPrice = $this->variant->getDiscountPrice()['finalPrice'];
            $originalPrice = $this->variant->getDiscountPrice()['originalPrice'];
            $discount = $this->variant->getDiscountPrice()['promotionDiscount'];
        } else {
            // Nếu variant là null, chỉ lấy thông tin từ sản phẩm
            $clientId = (string)$this->product->id;
            $finalPrice = $this->product->getDiscountPrice()['finalPrice'];
            $originalPrice = $this->product->getDiscountPrice()['originalPrice'];
            $discount = $this->product->getDiscountPrice()['promotionDiscount'];
        }

        // Tiếp tục xử lý thêm item vào giỏ hàng
        $existing = $this->cart->items()->where('client_id', $clientId)->first();

        if ($existing) {
            $existing->quantity += $this->request->quantity;
            $existing->total_price = $finalPrice * $existing->quantity;
            $existing->save();
        } else {
            $this->cart->items()->create([
                'client_id' => $clientId,
                'product_id' => $this->product->id,
                'product_variant_id' => $this->variant->id ?? null,
                'product_name' => $this->product->name,
                'product_image' => $this->product->image,
                'product_code' => $this->product->code,
                'variant_sku' => $this->variant->sku ?? null,
                'selected_attributes' => $this->request->selected_attributes ?? [],
                'original_price' =>  $originalPrice,
                'final_price' => $finalPrice,
                'discount' => $discount,
                'quantity' => $this->request->quantity,
                'total_price' => $finalPrice * $this->request->quantity,
            ]);
        }
        return $this;
    }



    private function reCaculate(): self
    {
        $items = $this->cart->items;
        $this->cart->update([
            'total_items' => $items->count(),
            'total_quantity' => $items->sum('quantity'),
            'sub_total' => $items->sum(fn($i) => $i->final_price * $i->quantity),
            'total_discount' => $items->sum(fn($i) => $i->discount * $i->quantity),
            'total_amount' => $items->sum('total_price'),
            'last_sync_at' => now()
        ]);
        return $this;
    }

    private function getResponse()
    {

        return [
            'items' => $this->cart->items()->get()->map(function ($item) {
                return [
                    'id' => $item->client_id,
                    'productId' => $item->product_id,
                    'variantId' => $item->product_variant_id ?? null,
                    'productName' => $item->product_name,
                    'productCode' => $item->product_code,
                    'productImage' => asset("storage/{$item->product_image}"),
                    'selectedAttributes' => $item->selected_attributes ?? [],
                    'variantSku' => $item->variant_sku ?? null,
                    'originalPrice' => $item->original_price,
                    'finalPrice' => $item->final_price,
                    'quantity' => $item->quantity,
                    'discount' => $item->discount
                ];
            }),
            'summary' => [
                'totalItems' => $this->cart->total_items,
                'totalQuantity' => $this->cart->total_quantity,
                'subTotal' => $this->cart->sub_total,
                'totalDiscount' => $this->cart->total_discount,
                'totalAmount' => $this->cart->total_amount,
            ]
        ];
    }
    // thêm sản phẩm vào giỏ hàng
    public function addItem(Request $request)
    {
        try {
            return  $this->beginTransaction()
                ->withUser()
                ->withRequest($request)
                ->resolveCart()
                ->resolveProduct()
                ->attachItem()
                ->reCaculate()
                ->commit()
                ->getResponse();
        } catch (\Throwable $th) {
            $this->rollback();
            throw $th;
        }
    }

    // đồng bộ dữ liệu từ phía client sang service . 
    // khi chưa đăng nhập thì thêm giỏ hàng vào localstorage . Khi đăng đăng nhập sẽ đồng bộ localStorage vào server(DB)
    public function syncItems(): self
    {
        $items = $this->request->input('items', []);
        if (count($items)) {
            foreach ($items as $item) {
                $existing = $this->cart->items()->where('client_id', $item['id'])->first();
                if ($existing) {
                    $existing->quantity += $item['quantity'];
                    $existing->total_price = $existing->final_price * $existing->quantity;
                    $existing->save();
                } else {
                    $this->cart->items()->create([
                        'client_id' => $item['id'],
                        'product_id' => $item['productId'],
                        'product_variant_id' => $item['variantId'] ?? null,
                        'product_name' => $item['productName'],
                        'product_image' =>  asset($item['productImage']),
                        'product_code' => $item['productCode'],
                        'variant_sku' => $item['variantSku'] ?? null,
                        'selected_attributes' => $item['selectedAttributes'] ?? [],
                        'original_price' => $item['originalPrice'],
                        'final_price' => $item['finalPrice'],
                        'discount' => $item['discount'],
                        'quantity' => $item['quantity'],
                        'total_price' => $item['finalPrice'] * $item['quantity'],
                    ]);
                }
            }
        }

        return $this;
    }

    public function sync(Request $request)
    {
        try {
            return $this->beginTransaction()
                ->withUser()
                ->withRequest($request)
                ->resolveCart()
                ->syncItems()
                ->reCaculate()
                ->commit()
                ->getResponse();
        } catch (\Throwable $th) {
            $this->rollback();
            throw $th;
        }
    }

    // lấy ra cart đang có ở giỏ hàng
    public function getCart(Request $request)
    {
        return $this->withUser()->resolveCart()->getResponse();
    }


    private function updateQuantity(): self
    {
        $this->cart->items()->where('client_id', $this->request->clientId)->update([
            'quantity' => $this->request->quantity
        ]);
        return $this;
    }
    // đồng bộ số lượng khi cập nhật số lượng ở thanh toán
    public function updateItem(Request $request)
    {
        try {
            return $this->beginTransaction()
                ->withUser()
                ->withRequest($request)
                ->resolveCart()
                ->updateQuantity()
                ->reCaculate()
                ->commit()
                ->getResponse();
        } catch (\Throwable $th) {
            $this->rollback();
            throw $th;
        }
    }


    public function removeCartItem(): self
    {
        $this->cart->items()->where('client_id', $this->request->clientId)->delete();
        if (count($this->cart->items->toArray()) === 0) {
            $this->cart->delete();
        }
        return $this;
    }

    // xóa sản phẩm ở thanh toán
    public function removeItem(Request $request)
    {
        try {
            return $this->beginTransaction()
                ->withUser()
                ->withRequest($request)
                ->resolveCart()
                ->removeCartItem()
                ->commit()
                ->reCaculate()
                ->getResponse();
        } catch (\Throwable $th) {
            $this->rollback();
            throw $th;
        }
    }


    // thanh toán giỏ hàng
    public function checkout(Request $request)
    {
        try {
            $this->beginTransaction()
                ->withUser()
                ->withRequest($request)
                ->resolveCart();
            $result = $this->handleCheckout();
            $this->commit();
            if ($result instanceof JsonResponse) {
                return $result;
            }
            return $this->order;
        } catch (\Throwable $th) {
            $this->rollback();
            throw $th;
        }
    }
    // thêm giỏ hàng và chi tiết giỏ hàng
    private function handleCheckout()
    {
        $cart = $this->cart;
        $this->order = Order::create([
            'customer_id' => $this->auth->id,
            'code' => 'ORD' . now()->format('YmdHis') . rand(1000, 9000),
            'fullname' => $this->request->fullname,
            'phone' => $this->request->phone,
            'email' => $this->request->email,
            'address' => $this->request->address,
            'description' => $this->request->description,
            'payment_method' => $this->request->payment_method,
            'status' => 'pending',
            'sub_total' => $cart->sub_total,
            'total_discount' => $cart->total_discount,
            'total_amount' => $cart->total_amount,
            'total_quantity' => $cart->total_quantity
        ]);

        foreach ($cart->items as $item) {
            $this->order->items()->create([
                'product_id' => $item->product_id,
                'product_variant_id' => $item->product_variant_id,
                'product_name' =>  $item->product_name,
                'product_code' => $item->product_code,
                'product_image' => $item->product_image,
                'variant_sku' => $item->variant_sku ?? 'N/A',
                'quantity' => $item->quantity,
                'original_price' => $item->original_price,
                'final_price' => $item->final_price,
                'discount' => $item->discount,
                'total_price' => $item->final_price * $item->quantity,
                'selected_attributes' => $item->selected_attributes ?? 'N/A'
            ]);
        }
        if ($this->request->payment_method === 'cod') {
            $cart->items()->delete();
            $cart->delete();
            return $this;
        }
        if ($this->request->payment_method === 'paypal') {
            $paypalService = new PayPalService();
            $redirectUrl = $paypalService->createOrder($this->order);
            return response()->json(['redirect_url' => $redirectUrl]);
        }
        return $this;
    }
}
