<?php

namespace App\Http\Resources\Product;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

use function PHPSTORM_META\map;

class ProductVariantResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $priceInfo = $this->getDiscountPrice(1);

        // dd($this->getPromotionAttribute());
        return [
            'id' => $this->id,
            'userId' => $this->user_id,
            'code' => $this->code,
            'stock' => $this->stock,
            'sku' => $this->sku,
            'price' => $this->price,
            'barcode' => $this->barcode,
            'publish' => $this->publish,
            'promotions' => [
                'discount' => $this->getPromotionAttribute()['discount']->map(function ($promotion) {
                    return [
                        'id' => $promotion->id,
                        'code' => $promotion->code,
                        'defaultDiscountValue' => $promotion->default_discount_value,
                        'defaultDiscountType' => $promotion->default_discount_type,
                        'defaultMinQuantity' => $promotion->default_min_quantity,
                        'usageCount' => $promotion->usage_count,
                        'detail' => [
                            'productId' => $promotion->pivot->product_id,
                            'productVariantId' => $promotion->pivot->product_variant_id,
                            'discountValue' => $promotion->pivot->discount_value,
                            'discountType' => $promotion->pivot->discount_type,
                            'maxDiscount' => $promotion->pivot->max_discount,
                            'minDiscount' => $promotion->pivot->min_quantity,
                        ]
                    ];
                }),
                'combo' => $this->getPromotionAttribute()['combo']->map(function ($promotion) {
                    return [
                        'id' => $promotion->id,
                        'code' => $promotion->code,
                        'comboPrice' => $promotion->combo_price,
                        'usageCount' => $promotion->usage_count,
                        'detail' => [
                            'productId' => $promotion->pivot->product_id,
                            'productVariantId' => $promotion->pivot->product_variant_id,
                        ]
                    ];
                })
            ],

            'pricing' => $priceInfo,

            'attributes' => $this->whenLoaded('variant_attributes', function () {
                return $this->variant_attributes->pluck('id')->toArray();
            }),
            'attributeNames' => $this->whenLoaded('variant_attributes', function () {
                return $this->variant_attributes->pluck('name')->toArray();
            }),
            'attributeCatalogues' => $this->whenLoaded('variant_attributes', function () {
                return $this->variant_attributes->groupBy('attribute_catalogue_id')->map(function ($attrs, $catalogueId) {
                    return [
                        'catalogueId' => $catalogueId,
                        'attributeIds' => $attrs->pluck('id')->toArray(),
                        'attributeName' => $attrs->pluck('name')->toArray()
                    ];
                })->values();
            })

        ];
    }
}
