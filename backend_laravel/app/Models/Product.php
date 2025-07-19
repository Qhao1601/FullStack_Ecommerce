<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Query;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use Query;
    protected $fillable = [
        'name',
        'canonical',
        'description',
        'content',
        'meta_description',
        'meta_title',
        'meta_keyword',
        'image',
        'icon',
        'album',
        'made_in',
        'brand_id',
        'price',
        'price_discount',
        'code',
        'publish',
        'order',
        'product_catalogue_id',
        'user_id',
    ];

    protected $casts = [
        'album' => 'json'
    ];

    public function brands(): BelongsTo
    {
        return $this->belongsTo(Brand::class, 'brand_id', 'id');
    }

    public function users(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function product_catalogues(): BelongsToMany
    {
        return $this->belongsToMany(ProductCatalogue::class, 'product_catalogue_product')->withTimestamps();;
    }

    public function product_variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class, 'product_id');
    }


    public function getRelations(): array
    {
        return ['product_catalogues'];
    }


    public function promotion_product_quantity()
    {
        return $this->belongsToMany(Promotion::class, 'promotion_product_quantity', 'product_id', 'promotion_id')->withPivot([
            'min_quantity',
            'max_discount',
            'discount_value',
            'discount_type',
        ]);
    }

    public function promotion_product_combo()
    {
        return $this->belongsToMany(Promotion::class, 'promotion_product_combo', 'product_id', 'promotion_id');
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
            return $promotion->publish === 2
                && now()->gte($promotion->start_date) //Thời gian hiện tại phải lớn hơn hoặc bằng ngày bắt đầu khuyến mãi.
                && ($promotion->end_date === null || now()->lte($promotion->end_date));
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

    // lấy ra giá khuyến mãi và giá gốc ...
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


    // lấy ra thuộc tính theo nhóm thuộc tính và đổ người dùng
    public function getAvaiableAttributes()
    {
        $attributes = collect();
        $this->load(['product_variants.variant_attributes.attribute_catalogues']);
        // dd($this->product_variants);
        foreach ($this->product_variants as $variant) {
            foreach ($variant->variant_attributes as $attribute) {
                $attributes->push([
                    'id' => $attribute->id,
                    'name' => $attribute->name,
                    'catalogueId' => $attribute->attribute_catalogue_id,
                    'catalogueName' => $attribute->attribute_catalogues->name
                ]);
            }
        }
        return $attributes->groupBy('catalogueId')->map(function ($attrs, $catalogueId) {
            $uniqueAttrs = $attrs->unique('id');
            return [
                'catalogueId' => $catalogueId,
                'catalogueName' => $uniqueAttrs->first()['catalogueName'],
                'attributes' => $uniqueAttrs->map(function ($attr) {
                    return [
                        'id' => $attr['id'],
                        'name' => $attr['name'],
                    ];
                })->values()
            ];
        })->values();
    }
}
