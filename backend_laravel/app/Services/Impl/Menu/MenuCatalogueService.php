<?php

namespace App\Services\Impl\Menu;

use App\Services\Interfaces\Menu\MenuCatalogueServiceInterface;
use App\Services\Impl\BaseService;
use App\Repositories\Menu\MenuCatalogueReponsitory;
use Nette\Utils\Arrays;
use App\Traits\HasCache;
use Illuminate\Http\Request;
use App\Http\Requests\Menu\MenuCatalogue\DetachPermissionRequest;
use App\Http\Resources\Menu\MenuCatalogueResource;
use Illuminate\Support\Str;

class MenuCatalogueService extends BaseService implements MenuCatalogueServiceInterface
{

  use HasCache;
  protected $reponsitory;
  protected $modelData;


  private const CACHE_KEY = 'menu_catalogues';

  public function __construct(MenuCatalogueReponsitory $reponsitory)
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
    return $type === 'collection' ? MenuCatalogueResource::collection($resource) : new MenuCatalogueResource($resource);
  }
}
