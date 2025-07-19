<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Query;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ProductVariant extends Model
{
    use Query;
    protected $fillable = [
        'name',
        'product_id',
        'user_id',
        'code',
        'stock',
        'sku',
        'price',
        'barcode',
        'album',
        'publish'
    ];

    public function products(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id', 'id');
    }

    public function users(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function variant_attributes(): BelongsToMany
    {
        return $this->belongsToMany(Attribute::class, 'product_variant_attribute', 'product_variant_id', 'attribute_id');
    }

    public function getRelations(): array
    {
        return ['variant_attributes'];
    }

    public function promotion_product_quantity()
    {
        return $this->belongsToMany(Promotion::class, 'promotion_product_quantity', 'product_variant_id', 'promotion_id')->withPivot([
            'min_quantity',
            'max_discount',
            'discount_value',
            'discount_type',
        ]);
    }

    public function promotion_product_combo()
    {
        return $this->belongsToMany(Promotion::class, 'promotion_product_combo', 'product_variant_id', 'promotion_id');
    }

    // lấy dữ liệu khuyến mãi discount combo dựa vào quan hệ nhiêu nhiều đã khai báo
    public function getPromotionAttribute()
    {
        $promotions = [
            'discount' => collect(),
            'combo' => collect(),
        ];
        // load dữ liệu xử lý eag_load thông qua khai báo quan hệ nhiều nhiều
        $discountPromotions = $this->promotion_product_quantity ?? collect();
        $promotions['discount'] = $discountPromotions->filter(function ($promotion) {
            return $promotion->publish === 2;
            // && now()->gte($promotion->start_date) //Thời gian hiện tại phải lớn hơn hoặc bằng ngày bắt đầu khuyến mãi.
            // && ($promotion->end_date === null || now()->lte($promotion->end_date));
            // nếu ngày kết thúc null thì không có ngày kết thúc . ngàybđ thỏa mãn là khuyến mãi được hiển thị
            // điều kiện ngày kết thúc là thời gian hiện tại phải nhỏ hơn hoặc bằng ngày kết
        })->values();

        $comboPromotions = $this->promotion_product_combo ?? collect();

        $promotions['combo'] = $comboPromotions->filter(function ($promotion) {
            return $promotion->publish === 2
                && now()->gte($promotion->start_date)
                && ($promotion->end_date === null || now()->lte($promotion->end_date));
        })->values();
        return $promotions;
    }

    // lấy ra giá khuyến mãi từng sản phẩm và giá gốc ...
    public function getDiscountPrice($quantity = 1)
    {
        $basePrice = $this->price;
        $discountPromotions = $this->getPromotionAttribute()['discount'];
        if ($discountPromotions->isEmpty()) {
            return [
                'originalPrice' => $this->price,
                'promotionDiscount' => 0,
                'finalPrice' => $basePrice,
                'hasPromotion' => false,
            ];
        }
        // lấy priority cao nhất
        $highesPriority = $discountPromotions->max('priority');
        // và gán lại 
        $highesPriorityPromotions = $discountPromotions->filter(function ($promotion) use ($highesPriority) {
            return $promotion->priority === $highesPriority;
        });


        $bestDiscountAmount = 0;
        $bestPromotion = null;
        foreach ($highesPriorityPromotions as $promotion) {
            $isDefault = $promotion->is_default;
            if ($isDefault === 1) {
                $discountValue = $promotion->default_discount_value;
                $discountType = $promotion->default_discount_type;
                $maxDiscount = null;
            } else {
                $discountValue = $promotion->pivot->discount_value;
                $discountType = $promotion->pivot->discount_type;
                $maxDiscount = $promotion->pivot->max_discount;
            }

            if ($discountType === 'percent') {
                $discountAmount = ($basePrice * $discountValue) / 100;
                if (!$isDefault && $maxDiscount && $discountAmount) {
                    $discountAmount = $maxDiscount;
                }
            } else {
                $discountAmount = $discountValue;
            }

            if ($discountAmount > $bestDiscountAmount) {
                $bestDiscountAmount = $discountAmount;
                $bestPromotion = $promotion;
            }
        }

        $finalPrice = max(0, $basePrice - $bestDiscountAmount);
        $discountPercent = $basePrice > 0 ? round(($bestDiscountAmount / $basePrice) * 100, 2) : 0;

        return [
            'originalPrice' => $this->price, // giá gốc     
            'basePrice' => $basePrice, // giá cơ bản  
            'promotionDiscount' => $bestDiscountAmount,  // giá trị được giảm  
            'finalPrice' => $finalPrice, // giá cuối cùng
            'discountPercent' => $discountPercent, // phần trăm giảm
            'hasPromotion' => true, // cắm cờ xem có discount giảm giá k ? 
        ];
    }
}
