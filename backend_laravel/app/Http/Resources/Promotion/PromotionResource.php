<?php

namespace App\Http\Resources\Promotion;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;
use App\Http\Resources\Product\ProductCatalogueIdNameResource;

use function PHPSTORM_META\map;

class PromotionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'code' => $this->code,
            'comboPrice' => $this->combo_price,
            'description' => $this->description,
            'priority' => $this->priority,
            'isDefault' => $this->is_default,
            'defaultDiscountValue' => $this->default_discount_value,
            'defaultDiscountType' => $this->default_discount_type,
            'defaultMinQuantity' => $this->default_min_quantity,
            'usageCount' => $this->usageCount,
            'publish' => $this->publish,
            'startDate' => Carbon::parse($this->start_date)->format('d-m-Y'),
            'endDate' => !is_null($this->end_date) ? Carbon::parse($this->end_date)->format('d-m-Y') : 'Không hết hạn',
            'users' => $this->whenLoaded('users', function () {
                return $this->users->name;
            }),
            'promotionCatalogues' => $this->whenLoaded('promotion_catalogue', function () {
                return new PromotionCatalogueResource($this->promotion_catalogue);
            }),
            'promotionCatalogueId' => $this->promotion_catalogue_id,

            'promotionCondition' => $this->promotionConditions($this->promotion_catalogue_id, $this)
        ];
    }

    private function promotionConditions($promotionCatalogueId = null, $promotion = null)
    {
        return match ($promotionCatalogueId) {
            2 => $this->getPromotionProductQuantityConditions($promotion),
            3 => $this->getPromotionProductCombo($promotion),
            4 => $this->getPromotionOrderAmountRange($promotion)
        };
    }


    private  function getPromotionProductQuantityConditions($promotion)
    {
        $data = [];
        $products = $promotion->promotion_product_quantity ?? collect();
        foreach ($products as $product) {
            $data[] = [
                'productId' => $product->id,
                'productVariantId' => null,
                'productCatalogueId' => null,
                'minQuantity' => $product->pivot->min_quantity,
                'maxDiscount' => $product->pivot->max_discount,
                'discountValue' => $product->pivot->discountValue,
                'discountType' => $product->pivot->discountType,
                'item' => [
                    'id' => $product->id,
                    'name' => $product->name,
                    'type' => 'product',
                    'price' => $product->price,
                    'code' => $product->code
                ]
            ];
        }
        $variants = $promotion->promotion_product_quantity_variant ?? collect();
        foreach ($variants as $variant) {
            $data[] = [
                'productId' => null,
                'productVariantId' => $variant->id,
                'productCatalogue' => null,
                'minQuantity' => $variant->pivot->min_quantity,
                'maxDiscount' => $variant->pivot->max_discount,
                'discountValue' => $variant->pivot->discount_value,
                'discountType' => $variant->pivot->discount_type,
                'item' => [
                    'id' => $variant->id,
                    'name' => $variant->products->name . ' - ' . $variant->name,
                    'type' => 'variant',
                    'price' => $variant->price,
                    'code' => $variant->code
                ]
            ];
        }

        // $productCatalogues = $promotion->promotion_product_quantity_catalogue ?? collect();
        // foreach ($productCatalogues as $Productcatalogue) {
        //     $data[] = [
        //         'productId' => null,
        //         'productVariantId' => null,
        //         'productCatalogue' => $Productcatalogue->id,
        //         'minQuantity' => $Productcatalogue->pivot->min_quantity,
        //         'maxDiscount' => $Productcatalogue->pivot->max_discount,
        //         'discountValue' => $Productcatalogue->pivot->discount_value,
        //         'discountType' => $Productcatalogue->pivot->discount_type,
        //     ];
        // }
        return $data;
    }


    private function getPromotionProductCombo($promotion)
    {
        $data = [];
        $products = $promotion->promotion_product_combo ?? collect();
        foreach ($products as $product) {
            $data[] = [
                'productId' => $product->id,
                'productVariantId' =>  null,
                'item' => [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => $product->price,
                    'type' => 'product',
                    'code' => $product->code
                ]
            ];
        }

        $variants = $promotion->promotion_product_combo_variant ?? collect();
        foreach ($variants as $variant) {
            $data[] = [
                'productId' => null,
                'productVariantId' =>  $variant->id,
                'item' => [
                    'id' => $variant->id,
                    'name' => $variant->products->name . ' - ' . $variant->name,
                    'price' => $variant->price,
                    'type' => 'variant',
                    'code' => $variant->code
                ]
            ];
        }
        return $data;
    }

    private function getPromotionOrderAmountRange($promotion)
    {
        $ranges = $promotion->promotion_order_amount_range ?? collect();
        $data = $ranges->map(function ($range) {
            return [
                'minValue' => $range->min_value,
                'maxValue' => $range->max_value,
                'discountValue' => $range->discount_value,
                'discountType' => $range->discount_type
            ];
        });
        return $data;
    }
}
