<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Query;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CartItem extends Model
{
    use Query;
    protected $fillable = [
        'cart_id',
        'client_id',
        'product_id',
        'product_variant_id',
        'product_name',
        'product_image',
        'product_code',
        'variant_sku',
        'selected_attributes',
        'original_price',
        'final_price',
        'discount',
        'quantity',
        'total_price',
    ];

    protected $casts = [
        'selected_attributes' => 'json'
    ];
}
