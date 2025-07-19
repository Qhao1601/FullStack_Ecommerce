<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Order;
use App\Traits\Query;

class OrderItem extends Model
{
    use Query;
    protected $fillable = [
        'order_id',
        'product_id',
        'product_variant_id',
        'product_name',
        'product_image',
        'product_code',
        'variant_sku',
        'quantity',
        'original_price',
        'final_price',
        'total_price',
        'discount',
        'selected_attributes',
    ];

    protected $casts = [
        'selected_attributes' => 'json'
    ];

    protected function orders()
    {
        return $this->belongsTo(Order::class);
    }
}
