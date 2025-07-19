<?php

namespace App\Services\Impl\Attribute;

use App\Services\Interfaces\Attribute\AttributeCatalogueServiceInterface;
use App\Services\Impl\BaseService;
use App\Repositories\Attribute\AttributeCatalogueReponsitory;
use Nette\Utils\Arrays;
use App\Traits\HasCache;
use Illuminate\Http\Request;
use App\Http\Resources\Attribute\AttributeCatalogueResource;
use Illuminate\Support\Str;

class AttributeCatalogueService extends BaseService implements AttributeCatalogueServiceInterface
{

  use HasCache;
  protected $reponsitory;
  protected $modelData;

  protected $with = (['users', 'attributes']);

  private const CACHE_KEY = 'attribute_catalogues';


  public function __construct(AttributeCatalogueReponsitory $reponsitory)
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
    return $type === 'collection' ? AttributeCatalogueResource::collection($resource) : new AttributeCatalogueResource($resource);
  }

  protected function beforeDelete($id): self
  {

    if (empty($id)) {
      throw new \Exception("Không có id vui lòng thử lại");
    }
    $this->modelData['id'] = $id;

    if (is_null($this->model)) {
      $this->model = $this->reponsitory->findById($this->modelData['id']);
    }

    $hasProduct =  $this->model->attributes()->count();

    if ($hasProduct) {
      throw new \Exception("Đã có thuộc tính bên trong nhóm thuộc tính");
    }
    return $this;
  }
}
