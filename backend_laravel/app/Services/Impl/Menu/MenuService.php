<?php

namespace App\Services\Impl\Menu;

use App\Services\Interfaces\Menu\MenuServiceInterface;
use App\Services\Impl\BaseService;
use App\Repositories\Menu\MenuReponsitory;
use Nette\Utils\Arrays;
use App\Traits\HasCache;
use Illuminate\Http\Request;
use App\Http\Requests\Menu\Menu\DetachPermissionRequest;
use App\Http\Resources\Menu\MenuResource;
use Illuminate\Support\Str;


class MenuService extends BaseService implements MenuServiceInterface
{

  use HasCache;
  protected $reponsitory;
  protected $modelData;


  private const CACHE_KEY = 'menus';

  public function __construct(MenuReponsitory $reponsitory)
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
    return $type === 'collection' ? MenuResource::collection($resource) : new MenuResource($resource);
  }



  protected function simpleFilter(): array
  {
    return ['publish', 'menu_catalogue_id', 'parent_id'];
  }
}
