<?php

namespace App\Http\Resources\Order;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'productId' => $this->product_id,
            'productVariant' => $this->product_variant_id,
            'productName' => $this->product_name,
            'productImage' => asset("storage/{$this->product_image}"),
            'productCode' => $this->product_code,
            'variantSku' => $this->variant_sku,
            'quantity' => $this->quantity,
            'originalPrice' => $this->original_price,
            'finalPrice' => $this->final_price,
            'totalPrice' => $this->total_price,
            'discount' => $this->discount,
            'selectedAttributes' => $this->selected_attributes,
        ];
    }
}
