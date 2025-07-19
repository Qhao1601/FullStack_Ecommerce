<?php

namespace App\Services\Impl\User;

use App\Http\Resources\User\PermissionResource;
use App\Services\Interfaces\User\PermissionServiceInterface;
use App\Services\Impl\BaseService;
use App\Repositories\User\PermissionReponsitory;
use Nette\Utils\Arrays;
use App\Traits\HasCache;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PermissionService extends BaseService implements PermissionServiceInterface
{

  use HasCache;
  protected $reponsitory;
  protected $modelData;

  public function __construct(PermissionReponsitory $reponsitory)
  {
    parent::__construct($reponsitory);
    $this->cacheKeyPrefix = 'permissions';
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
    return $type === 'collection' ? PermissionResource::collection($resource) : new PermissionResource($resource);
  }
}
