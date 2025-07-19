<?php

namespace App\Services\Impl\Brand;

use App\Services\Interfaces\Brand\BrandServiceInterface;
use App\Services\Impl\BaseService;
use App\Repositories\Brand\BrandReponsitory;
use App\Traits\HasCache;
use Illuminate\Http\Request;
use App\Http\Resources\Brand\BrandResource;
use Illuminate\Support\Str;

class BrandService extends BaseService implements BrandServiceInterface
{

  use HasCache;
  protected $reponsitory;
  protected $modelData;


  private const CACHE_KEY = 'brands';

  protected  $with = ['users', 'products'];

  public function __construct(BrandReponsitory $reponsitory)
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
    return $this;
  }

  protected function beforeDelete($id): self
  {
    if (empty($id)) {
      throw new \Exception("Bạn không có id");
    }

    $this->modelData['id'] = $id;

    if (is_null($this->model)) {
      $this->model = $this->reponsitory->findById($this->modelData['id']);
    }

    $hasProducts = $this->model->products()->count();

    if ($hasProducts) {
      throw new \Exception('Thương hiệu đã có sản phẩm không thể xóa');
    }

    return $this;
  }


  public function getResource($resource, $type = 'model')
  {
    return $type === 'collection' ? BrandResource::collection($resource) : new BrandResource($resource);
  }
}
