<?php

namespace App\Services\Impl\Order;

use App\Services\Interfaces\Order\OrderServiceInterface;
use App\Services\Impl\BaseService;
use App\Repositories\Order\OrderReponsitory;
use Nette\Utils\Arrays;
use App\Traits\HasCache;
use Illuminate\Http\Request;
use App\Http\Requests\Order\Order\DetachPermissionRequest;
use App\Http\Resources\Order\OrderResource;


class OrderService extends BaseService implements OrderServiceInterface
{

  use HasCache;
  protected $reponsitory;
  protected $modelData;

  protected $with = ['items'];

  private const CACHE_KEY = 'orders';

  public function __construct(OrderReponsitory $reponsitory)
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
    return $this;
  }

  protected function searchFields(): array
  {
    return ['fullname', 'phone', 'address', 'code'];
  }


  public function getResource($resource, $type = 'model')
  {
    return $type === 'collection' ? OrderResource::collection($resource) : new OrderResource($resource);
  }
}
