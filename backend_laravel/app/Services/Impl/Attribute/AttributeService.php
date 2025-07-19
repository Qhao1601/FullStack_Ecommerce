<?php

namespace App\Services\Impl\Attribute;

use App\Services\Interfaces\Attribute\AttributeServiceInterface;
use App\Services\Impl\BaseService;
use App\Repositories\Attribute\AttributeReponsitory;
use Nette\Utils\Arrays;
use App\Traits\HasCache;
use Illuminate\Http\Request;
use App\Http\Resources\Attribute\AttributeResource;
use Illuminate\Support\Str;

class AttributeService extends BaseService implements AttributeServiceInterface
{

  use HasCache;
  protected $reponsitory;
  protected $modelData;


  private const CACHE_KEY = 'attributes';
  protected $with = ['attribute_catalogues', 'users'];


  public function __construct(AttributeReponsitory $reponsitory)
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
    return $type === 'collection' ? AttributeResource::collection($resource) : new AttributeResource($resource);
  }


  protected function simpleFilter(): array
  {
    return ['publish', 'attribute_catalogue_id'];
  }
}
