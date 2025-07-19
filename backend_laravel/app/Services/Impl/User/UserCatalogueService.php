<?php

namespace App\Services\Impl\User;

use App\Services\Interfaces\User\UserCatalogueServiceInterface;
use App\Services\Impl\BaseService;
use App\Repositories\User\UserCatalogueReponsitory;
use App\Traits\HasCache;
use Illuminate\Http\Request;
use App\Http\Requests\User\UserCatalogue\DetachPermissionRequest;
use App\Http\Resources\User\UserCatalogueResource;
use Illuminate\Support\Str;

class UserCatalogueService extends BaseService implements UserCatalogueServiceInterface
{

  use HasCache;
  protected $reponsitory;
  protected $modelData;

  private const PERMISSION = 'permissions';
  private const USER_CATALOGUES = 'user_catalogues';
  protected  $with = ['users', 'permissions'];


  public function __construct(UserCatalogueReponsitory $reponsitory)
  {
    parent::__construct($reponsitory);
    $this->cacheKeyPrefix = self::USER_CATALOGUES;
  }


  // thêm mới dữ liệu .
  protected function prepareModelData(Request $request, ?int $id = null): self
  {
    $fillable = $this->reponsitory->getFillable();
    return $this->initilizeBasicData($request, $fillable);
  }

  protected function initilizeBasicData(Request $request, array $fillable = []): self
  {
    $this->modelData = $request->only($fillable);
    $this->modelData['canonical'] = Str::slug($request->canonical);
    return $this;
  }

  public function getResource($resource, $type = 'model')
  {
    return $type === 'collection' ? UserCatalogueResource::collection($resource) : new UserCatalogueResource($resource);
  }
}
