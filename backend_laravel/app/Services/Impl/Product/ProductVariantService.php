<?php

namespace App\Services\Impl\Product;

use App\Services\Interfaces\Product\ProductVariantServiceInterface;
use App\Services\Impl\BaseService;
use App\Repositories\Product\ProductVariantReponsitory;
use Nette\Utils\Arrays;
use App\Traits\HasCache;
use Illuminate\Http\Request;
use App\Http\Requests\Product\ProductVariant\DetachPermissionRequest;
use App\Http\Resources\Product\ProductVariantResource;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;
use App\Services\Interfaces\Attribute\AttributeServiceInterface as AttributeService;

class ProductVariantService extends BaseService implements ProductVariantServiceInterface
{

  use HasCache;
  protected $reponsitory;
  protected $modelData;
  protected $attributeService;


  private const CACHE_KEY = 'product_variants';

  public function __construct(ProductVariantReponsitory $reponsitory, AttributeService $attributeService)
  {
    parent::__construct($reponsitory);
    $this->cacheKeyPrefix = self::CACHE_KEY;
    $this->attributeService = $attributeService;
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
    $this->modelData['name'] = $this->generateVariantName($request->variant_attributes);

    return $this;
  }

  // xử lý khi lấy tên của từng phiên bản dựa vào thuộc tính (xử lý thêm phiên bản)
  private function generateVariantName($attributes)
  {
    $attributes  = $this->attributeService->findByIds($attributes)->pluck('name')->toArray();

    $attributeName = implode(' - ', $attributes);
    return $attributeName;
  }


  public function getResource($resource, $type = 'model')
  {
    return $type === 'collection' ? ProductVariantResource::collection($resource) : new ProductVariantResource($resource);
  }

  protected function beforeSave(Request $request): self
  {
    $id = $request->route('product_variant');
    if ($this->reponsitory->checkUnique($request->code, $id, $request->product_id)) {
      throw new ConflictHttpException("Đã có phiên bản vui lòng tạo phiên bản khác");
    }
    return $this;
  }
}
