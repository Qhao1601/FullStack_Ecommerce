<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Query;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Promotion extends Model
{
    use Query;
    protected $fillable = [
        'promotion_catalogue_id',
        'name',
        'code',
        'priority',
        'combo_price',
        'description',
        'default_discount_value',
        'default_discount_type',
        'default_min_quantity',
        'default_max_discount_value',
        'is_default',
        'start_date',
        'end_date',
        'publish',
        'user_id'
    ];

    protected $attributes = [
        'publish' => 2
    ];

    public function getRelations(): array
    {
        return [];
    }

    public function promotion_product_quantity()
    {
        return $this->belongsToMany(Product::class, 'promotion_product_quantity')->withPivot([
            'min_quantity',
            'max_discount',
            'discount_value',
            'discount_type',
        ]);
    }

    public function promotion_product_quantity_variant()
    {
        return $this->belongsToMany(ProductVariant::class, 'promotion_product_quantity')->withPivot([
            'min_quantity',
            'max_discount',
            'discount_value',
            'discount_type',
        ]);
    }

    public function promotion_product_quantity_catalogue()
    {
        return $this->belongsToMany(ProductCatalogue::class, 'promotion_product_quantity')->withPivot([
            'min_quantity',
            'max_discount',
            'discount_value',
            'discount_type'
        ]);
    }

    public function promotion_product_combo()
    {
        return $this->belongsToMany(Product::class, 'promotion_product_combo');
    }

    public function promotion_product_combo_variant()
    {
        return $this->belongsToMany(ProductVariant::class, 'promotion_product_combo');
    }

    public function promotion_product_buy_take_gift_buy()
    {
        return $this->belongsToMany(product::class, 'promotion_product_buy_take_gift',  'promotion_id', 'buy_product_id');
    }

    public function promotion_product_buy_take_gift_buy_variant()
    {
        return $this->belongsToMany(ProductVariant::class, 'promotion_product_buy_take_gift',  'promotion_id', 'buy_product_variant_id');
    }

    public function promotion_product_buy_take_gift_take()
    {
        return $this->belongsToMany(product::class, 'promotion_product_buy_take_gift',  'promotion_id', 'take_product_id');
    }

    public function promotion_product_buy_take_gift_take_variant()
    {
        return $this->belongsToMany(ProductVariant::class, 'promotion_product_buy_take_gift',  'promotion_id', 'take_product_variant_id');
    }


    public function promotion_catalogue()
    {
        return $this->belongsTo(PromotionCatalogue::class, 'promotion_catalogue_id', 'id');
    }

    public function users()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function promotion_order_amount_range()
    {
        return $this->hasMany(PromotionOrderAmountRange::class, 'promotion_id', 'id');
    }
}
