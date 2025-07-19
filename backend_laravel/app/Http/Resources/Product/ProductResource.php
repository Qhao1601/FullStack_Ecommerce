<?php

namespace App\Http\Resources\Product;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $priceInfo = $this->getDiscountPrice(1);


        return [
            'id' => $this->id,
            'name' => $this->name,
            'canonical' => $this->canonical,
            'description' => $this->description,
            'content' => $this->content,
            'code' => $this->code,
            'metaTitle' => $this->meta_title,
            'metaKeyword' => $this->meta_keyword,
            'metaDescription' => $this->meta_description,
            'user_id' => $this->user_id,
            'publish' => $this->publish,
            'image' => asset("storage/{$this->image}"),
            'price' => $this->price,
            'made_in' => $this->made_in,
            'brand_id' => $this->brand_id,
            'price_discount' => $this->price_discount,
            'album' => (is_array($this->album) && count($this->album)) ?  array_map(function ($item) {
                return [
                    'path' => $item['path'],
                    'fullPath' => asset("storage/{$item['path']}")
                ];
            }, $this->album)   : [],
            'productCatalogueId' => $this->product_catalogue_id,
            'productCatalogues' => $this->whenLoaded('product_catalogues', function () {
                return $this->product_catalogues->pluck('id')->toArray();
            }, []),
            'productCatalogue' => $this->whenLoaded('product_catalogues', function () {
                return new ProductCatalogueIdNameResource($this->product_catalogues->where('id', $this->product_catalogue_id)->first());
            }, []),
            'creator' => $this->whenLoaded('users', function () {
                return $this->users->name;
            }),
            // 'productVariants' => ProductVariantResource::collection($this->whenLoaded('product_variants')),
            'productVariants' => ProductVariantResource::collection($this->product_variants),

            // lấy ra biến thể sản phẩm đó xử lý client
            'availableAttributes' => $this->getAvaiableAttributes(),

            // xử lý lấy ra khuyến mãi của discoiunt và combo
            'promotions' => [
                'discount' => $this->getPromotionAttribute()['discount']->map(function ($promotion) {
                    return [
                        'id' => $promotion->id,
                        'code' => $promotion->code,
                        'isDefault' => $promotion->is_default,
                        'priority' => $promotion->priority,
                        'defaultDiscountValue' => $promotion->default_discount_value,
                        'defaultDiscountType' => $promotion->default_discount_type,
                        'defaultMinQuantity' => $promotion->default_min_quantity,
                        'usageCount' => $promotion->usage_count,
                        'detail' => [
                            'productId' => $promotion->pivot->product_id,
                            'productVariantId' => $promotion->pivot->product_variant_id,
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
            'pricing' => $priceInfo
        ];
    }
}
