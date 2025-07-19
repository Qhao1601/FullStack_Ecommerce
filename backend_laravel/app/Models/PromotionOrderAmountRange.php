<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Query;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class PromotionOrderAmountRange extends Model
{
    use Query;
    protected $fillable = [
        'promotion_id',
        'min_value',
        'max_value',
        'discount_value',
        'discount_type'
    ];

    protected $attributes = [
        'publish' => 2
    ];

    protected $table = 'promotion_order_amount_range';
}
