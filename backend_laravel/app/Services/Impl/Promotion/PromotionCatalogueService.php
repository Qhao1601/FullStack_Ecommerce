<?php

namespace App\Services\Impl\Promotion;

use App\Services\Interfaces\Promotion\PromotionCatalogueServiceInterface;
use App\Services\Impl\BaseService;
use App\Repositories\Promotion\PromotionCatalogueReponsitory;
use Nette\Utils\Arrays;
use App\Traits\HasCache;
use Illuminate\Http\Request;
use App\Http\Requests\Promotion\PromotionCatalogue\DetachPermissionRequest;
use App\Http\Resources\Promotion\PromotionCatalogueResource;
use Illuminate\Support\Str;

class PromotionCatalogueService extends BaseService implements PromotionCatalogueServiceInterface
{

  use HasCache;
  protected $reponsitory;
  protected $modelData;


  private const CACHE_KEY = 'promotion_catalogues';

  public function __construct(PromotionCatalogueReponsitory $reponsitory)
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

  public function getResource($resource, $type = 'model')
  {
    return $type === 'collection' ? PromotionCatalogueResource::collection($resource) : new PromotionCatalogueResource($resource);
  }
}
