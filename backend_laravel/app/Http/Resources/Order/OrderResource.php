<?php

namespace App\Http\Resources\Order;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

class OrderResource extends JsonResource
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
            'code' => $this->code,
            'customerId' => $this->customer_id,
            'fullname' => $this->fullname,
            'phone' => $this->phone,
            'email' => $this->email,
            'address' => $this->address,
            'description' => $this->description,
            'paymentMethod' => $this->payment_method,
            'status' => $this->status,
            'subTotal' => $this->sub_total,
            'totalDiscount' => $this->total_discount,
            'totalAmount' => $this->total_amount,
            'totalQuantity' => $this->total_quantity,
            'totalItems' => $this->total_items,
            'paidAt' => Carbon::parse($this->paid_at)->format('d-m-Y'),
            'items' => OrderItemResource::collection($this->whenLoaded('items'))
        ];
    }
}
