<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\OrderItem;
use App\Traits\Query;

class Order extends Model
{
    use Query;
    protected $fillable =  [
        'customer_id',
        'code',
        'fullname',
        'phone',
        'email',
        'address',
        'description',
        'payment_method',
        'status',
        'sub_total',
        'total_discount',
        'total_amount',
        'total_quantity',
        'total_items',
        'paid_at',
        'paypal_data'
    ];

    protected $casts  = [
        'paypal_data' => 'json'
    ];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
