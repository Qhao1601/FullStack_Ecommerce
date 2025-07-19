<?php

namespace App\Services\Impl\Promotion;

use App\Services\Interfaces\Promotion\PromotionServiceInterface;
use App\Services\Impl\BaseService;
use App\Repositories\Promotion\PromotionReponsitory;
use Nette\Utils\Arrays;
use App\Traits\HasCache;
use Illuminate\Http\Request;
use App\Http\Requests\Promotion\Promotion\DetachPermissionRequest;
use App\Http\Resources\Promotion\PromotionResource;
use Illuminate\Support\Carbon;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Illuminate\Support\Facades\DB;
use App\Models\Product;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;


class PromotionService extends BaseService implements PromotionServiceInterface
{

  use HasCache;
  protected $reponsitory;
  protected $modelData;

  protected $with = ['promotion_catalogue', 'users'];

  private const CACHE_KEY = 'promotions';

  public function __construct(PromotionReponsitory $reponsitory)
  {
    parent::__construct($reponsitory);
    $this->cacheKeyPrefix = self::CACHE_KEY;
  }


  // thêm mới dữ liệu .
  protected function prepareModelData(Request $request, ?int $id = null): self
  {

    $fillable = $this->reponsitory->getFillable();
    return $this->initilizeBasicData($request, $fillable);
  }


  protected function initilizeBasicData(request $request, array $fillable = []): self
  {
    $this->modelData = $request->only($fillable);
    $this->modelData['canonical'] = Str::slug($request->canonical);
    if (isset($this->modelData['start_date'])) {
      $this->modelData['start_date'] = Carbon::createFromFormat('d/m/Y', $this->modelData['start_date'])->format('y-m-d');
    }
    if (isset($this->modelData['end_date'])) {
      $this->modelData['end_date'] = Carbon::createFromFormat('d/m/Y', $this->modelData['end_date'])->format('y-m-d');
    }
    Log::info('promotion', $this->modelData);

    return $this;
  }

  public function getResource($resource, $type = 'model')
  {
    return $type === 'collection' ? PromotionResource::collection($resource) : new PromotionResource($resource);
  }

  public function handleRelations(Request $request): self
  {

    $promotionKey = $request->promotion_condition['key'];
    match ($promotionKey) {
      'promotionProductQuantity' => $this->handlePromotion($request, 'promotion_product_quantity', $this->mapRequest('promotionProductQuantity')),
      'promotionProductBuyTakeGift' => $this->handlePromotion($request, 'promotion_product_buy_take_gift', $this->mapRequest('promotionProductBuyTakeGift')),
      'promotionProductCombo' => $this->handlePromotion($request, 'promotion_product_combo', $this->mapRequest('promotionProductCombo')),
      'promotionOrderAmountRange' => $this->handlePromotion($request, 'promotion_order_amount_range', $this->mapRequest('promotionOrderAmountRange')),
    };
    return $this;
  }


  public function mapRequest(string $key = '')
  {
    $map = [
      'promotionProductQuantity' => [
        'product_id' => 'productId',
        'product_variant_id' => 'productVariantId',
        'product_catalogue_id' => 'productCatalogueId',
        'min_quantity' => 'minQuantity',
        'max_discount' => 'maxDiscount',
        'discount_value' => 'discountValue',
        'discount_type' => 'discountType',
      ],
      'promotionProductBuyTakeGift' => [
        'buy_product_id' => 'buyProductId',
        'buy_product_variant_id' => 'buyProductVariantId',
        'take_product_id' => 'takeProductId',
        'take_product_variant_id' => 'takeProductVariantId',
        'buy_quantity' => 'buyQuantity',
      ],
      'promotionProductCombo' => [
        'product_id' => 'productId',
        'product_variant_id' => 'productVariantId',
      ],
      'promotionOrderAmountRange' => [
        'min_value' => 'minValue',
        'max_value' => 'maxValue',
        'discount_value' => 'discountValue',
        'discount_type' => 'discountType'
      ]
    ];
    return $map[$key] ?? [];
  }

  public function handlePromotion(Request $request, $table = '', array $map = [])
  {
    if (!$request->promotion_condition['data'] && !is_array($request->promotion_condition['data'])) {
      throw new BadRequestException("Dữ liệu không đủ điều kiện để khuyến mãi");
    }
    $data = $request->promotion_condition['data'];


    // mới update (xử lý không giá giảm giá discountValue giảm bé hơn giá giảm giá cao nhất Maxdiscount)
    foreach ($data as $key => $val) {
      $maxDiscount = $val['maxDiscount'] ?? null;
      $discountValue = $val['discountValue'] ?? null;
      // Kiểm tra discount_value không được lớn hơn max_discount
      if ($discountValue > $maxDiscount) {
        throw new \App\Exceptions\PromotionDiscountException();
      }
    }
    // tới đây


    DB::table($table)->where('promotion_id', $this->model->id)->delete();

    $payload = [];
    foreach ($data as $key => $val) {
      $payload[] =  $this->handleMapRequest($val, $map);
    }

    // dd($payload);
    if (!empty($payload)) {
      DB::table($table)->insert($payload);
    }
  }

  public function handleMapRequest($value, array $map = [])
  {
    $payload = [
      'promotion_id' => $this->model->id,
      'created_at' => now(),
      'updated_at' => now()
    ];
    foreach ($map as $dbField => $requestField) {
      $payload[$dbField] = $value[$requestField] ?? null;
    }
    return $payload;
  }




  // private function handlePromotionProductQuantity(Request $request)
  // {
  //   if (!$request->promotion_condition['data'] && !is_array($request->promotion_condition['data'])) {
  //     throw new BadRequestException("Dữ liệu không đủ điều kiện để khuyến mãi");
  //   }
  //   $data = $request->promotion_condition['data'];
  //   DB::table('promotion_product_quantity')->where('promotion_id', $this->model->id)->delete();

  //   $payload = [];
  //   foreach ($data as $key => $val) {
  //     $payload[] = [
  //       'promotion_id' => $this->model->id,
  //       'product_id' => $val['productId'] ?? null,
  //       'product_variant_id' => $val['productVariantId'] ?? null,
  //       'product_catalogue_id' => $val['productCatalogueId'] ?? null,
  //       'min_quantity' => $val['minQuantity'] ?? $request->default_min_quantity ?? null,
  //       'max_discount' => $val['maxDiscount'] ?? $request->default_max_discount ??  null,
  //       'discount_value' => $val['discountValue'] ?? $request->default_discount_value ?? null,
  //       'discount_type' => $val['discountType'] ?? $request->default_discount_type ?? null,
  //       'created_at' => now(),
  //       'updated_at' => now()
  //     ];
  //   }
  //   if (!empty($payload)) {
  //     DB::table('promotion_product_quantity')->insert($payload);
  //   }
  // }


  // bỏ 
  // public function combinePromotiontoProduct(Product $product)
  // {
  //   $productVariant = $product->product_variants() && $product->product_variants()->count() > 0;
  //   if ($productVariant) {
  //     $this->combineVariantToPromotion($product);
  //     // dd($this->combineVariantToPromotion($product));
  //   } else {
  //     $this->combineProductToPromotion($product);
  //     // dd($this->combineProductToPromotion($product));
  //   }
  // }

  // // xly khuyến mãi có phiên bản
  // private function combineVariantToPromotion(Product $product)
  // {
  //   $productId = $product->id;
  //   $variantId = $product->product_variants->pluck('id')->toArray();
  //   // dd($variantId);
  //   $catalogueId = $product->product_catalogues->pluck('id')->toArray();
  //   $promotions = $this->getAllPromotions($productId, $catalogueId, $variantId);
  //   foreach ($product->product_variants as $variant) {
  //     $variantPromotion = $this->combinePromotionForVariant($variant, $promotions, $catalogueId);
  //     // tắt này cho trả về productService xử lý
  //     // dd($variantPromotion);
  //     $variant->promotions = $variantPromotion;
  //   }

  //   $product->promotions = [
  //     'discount' => [],
  //     'combos' => [],
  //     'gifts' =>  []
  //   ];
  // }

  // // xử lý sản phẩm khuyến mãi k có phiên bản
  // private function combineProductToPromotion(Product $product)
  // {
  //   $productId = $product->id;
  //   $catalogueId = $product->product_catalogues->pluck('id')->toArray();
  //   $promotions = $this->getAllPromotions($productId, $catalogueId);
  //   $product->promotions = $promotions;
  //   // dd($promotions);
  //   // có dữ liệu nhưng trả về hàm trên thì không  ??? trả về null
  //   // tắt này cho về productService
  //   // dd($product->promotions);
  // }

  // private function getAllPromotions(int $productId = 0, array $catalogueId = [], array $variantId = [])
  // {
  //   return [
  //     'discount' => $this->reponsitory->getProductQuantityPromotion($productId, $catalogueId, $variantId),
  //     'combos' => $this->reponsitory->getPrmotionProductCombo($productId, $variantId),
  //     'gift' => $this->reponsitory->getPrmotionProductBuyTakeGift($productId, $variantId)
  //   ];
  // }

  // // đính promotion và xử lý khuyến mãi có phiên bảng
  // private function combinePromotionForVariant($variant, array $promotions = [], array $catalogueIds = [])
  // {
  //   $variantId = $variant->id;
  //   $result = [
  //     'discount' => [],
  //     'combos' => [],
  //     'gift' => []
  //   ];

  //   if (count($promotions['discount'])) {
  //     foreach ($promotions['discount'] as $discount) {
  //       if ($discount->product_variant_id === $variantId || in_array($discount->product_catalogue_id, $catalogueIds)) {
  //         $result['discount'][] = $discount;
  //       }
  //     }
  //   }

  //   if (count($promotions['combos'])) {
  //     foreach ($promotions['combos'] as $combo) {
  //       if ($combo->product_variant_id === $variantId) {
  //         $result['combos'][] = $combo;
  //       }
  //     }
  //   }

  //   if (count($promotions['gift'])) {
  //     foreach ($promotions['gift'] as $gift) {
  //       if ($gift->product_variant_id === $variantId) {
  //         $result['gift'][] = $gift;
  //       }
  //     }
  //   }
  //   return $result;
  // }
}
