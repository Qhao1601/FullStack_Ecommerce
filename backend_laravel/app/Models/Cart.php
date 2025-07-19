<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Query;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cart extends Model
{
    use Query;
    protected $fillable = [
        'customer_id',
        'total_items',
        'total_quantity',
        'sub_total',
        'total_discount',
        'total_amount',
        'last_sync_at',
    ];

    public function items()
    {
        return $this->hasMany(CartItem::class);
    }
}
