<?php

namespace App\Services\Impl\Product;

use App\Enums\Config\Common;
use App\Services\Interfaces\Product\ProductServiceInterface;
use App\Services\Impl\BaseService;
use App\Repositories\Product\ProductReponsitory;
use App\Traits\HasCache;
use Illuminate\Http\Request;
use App\Http\Resources\Product\ProductResource;
use App\Services\Impl\Upload\ImageService;
use Illuminate\Support\Str;
use App\Classes\Nested;
use App\Models\Product;
use App\Services\Impl\Attribute\AttributeService as AttributeAttributeService;
use App\Traits\HasUpload;
use App\Services\Interfaces\Promotion\PromotionServiceInterface as PromotionService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use App\Services\Interfaces\Attribute\AttributeServiceInterface as AttributeService;

class ProductService extends BaseService implements ProductServiceInterface
{

  use HasCache;
  use HasUpload;
  protected $reponsitory;
  protected $modelData;
  protected $imageService;
  protected  $existingImage = [];
  protected $nested;
  protected $basePath;

  protected $attributeService;
  protected $promotionService;

  // chưa fix được earge loading của product_variant
  protected $with =
  [
    'product_catalogues',
    'users',
    'product_variants.variant_attributes',
    'product_variants.promotion_product_quantity',
    'product_variants.promotion_product_combo',
    'promotion_product_quantity',
    'promotion_product_combo',
  ];


  private const CACHE_KEY = 'products';


  public function __construct(
    ProductReponsitory $reponsitory,
    ImageService $imageService,
    PromotionService $promotionService,
    AttributeService $attributeService
  ) {
    parent::__construct($reponsitory);
    $this->cacheKeyPrefix = self::CACHE_KEY;
    $this->auth = auth(Common::API);
    $this->basePath = Str::before($this->auth->user()->email, '@') . '/products/' . now()->format('Ymd');
    $this->imageService = $imageService;
    $this->promotionService = $promotionService;
    $this->attributeService = $attributeService;
  }

  // thêm mới dữ liệu .
  protected function prepareModelData(Request $request, ?int $id = null): self
  {
    $fillable = $this->reponsitory->getFillable();
    return $this->initilizeBasicData($request, $fillable)
      ->convertPrice(['price'])
      ->uploadImage($request, 'image', 'default');
  }


  protected function initilizeBasicData(request $request, array $fillable = []): self
  {

    $this->modelData = $request->only($fillable);
    $this->modelData['canonical'] = Str::slug($request->canonical);
    return $this;
  }

  protected function handleRelations(Request $request): self
  {
    // đây phương thức dc định nghĩa model user và return trả về ... (vd user_catalogue ...) 
    $pivotRelations = $this->model->getRelations();

    if (count($pivotRelations)) {
      foreach ($pivotRelations as $relation) {

        if (isset($request->{$relation})) {

          $this->model->{$relation}()->sync($request->{$relation});
        }
      }
    }
    $this->commit();
    $this->handleProductVariantRelation($request);
    return $this;
  }

  // xử lý khi sản phẩm có biến thể
  protected function handleProductVariantRelation(Request $request)
  {
    if (!$request->has('product_variants') || !is_array($request->input('product_variants'))) {
      return $this;
    }

    $variants = [];
    $now = now();

    foreach ($request->product_variants as $variantData) {
      $variant = $this->model->product_variants()->create([
        ...$variantData,
        'name' => $this->generateVariantName($variantData['attributes']),
        'price' => str_replace('.', '', (int)$variantData['price']),
        'user_id' => $this->auth->user()->id,
        'created_at' => now(),
        'updated_at' => now(),
      ]);
      if (isset($variantData['attributes']) && is_array($variantData['attributes']) && count($variantData['attributes'])) {
        $variant->variant_attributes()->attach($variantData['attributes']);
      }
    }
    if (isset($variants) && is_array($variants) && count($variants)) {
      $this->model->product_variants()->insert($variants);
    }
  }


  // xử lý khi lấy tên của từng phiên bản dựa vào thuộc tính (xử lý lấy ra ở khuyến mãi)
  private function generateVariantName(array $attributes = [])
  {
    $attributes  = $this->attributeService->findByIds($attributes)->pluck('name')->toArray();

    $attributeName = implode(' - ', $attributes);

    return $attributeName;
  }



  public function convertPrice(array $field = []): self
  {
    foreach ($field as $val) {
      if (isset($this->modelData[$val])) {
        $this->modelData[$val] = (int) str_replace(['.', ','], ['', ''], $this->modelData[$val]);
      }
    }
    return $this;
  }


  /*
  + orveride lại phương thức afterSave vì sản phẩm phải được lưu thành công thì mới move hình ảnh vào folder đích
  + đang để ở phần prepareModelData dẫn đến việc khi chuẩn bị dữ liệu thì đã move ảnh vào -> nên nếu sản phẩm khởi tạo không
  thành công thì hình ảnh sẽ bị mất trong folder đích
  */
  protected function afterSave(Request $request): self
  {
    $this->moveImages($request);
    return  $this->clearSingleRecordCache()->cacheSingleRecord()->clearCollectionRecordCache();
  }

  public function getResource($resource, $type = 'model')
  {
    return $type === 'collection' ? ProductResource::collection($resource) : new ProductResource($resource);
  }

  // public function read(int $id = 0): mixed
  // {
  //   // $product = Product::find($id);
  //   parent::read($id);
  //   $product = $this->model;
  //   if (!$product) {
  //     throw new ModelNotFoundException("Không tìm thấy sản phẩm hợp lệ");
  //   }
  //   // $this->promotionService->combinePromotionToProduct($product);
  //   // $this->result = $product;
  //   // dd($product);
  //   return $this->getResult();
  // }
}
