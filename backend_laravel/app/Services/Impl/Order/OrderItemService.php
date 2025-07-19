<?php

namespace App\Services\Impl\Order;

use App\Services\Interfaces\Order\OrderItemServiceInterface;
use App\Services\Impl\BaseService;
use App\Repositories\Order\OrderItemReponsitory;
use Nette\Utils\Arrays;
use App\Traits\HasCache;
use Illuminate\Http\Request;
use App\Http\Resources\Order\OrderItemResource;


class OrderItemService extends BaseService implements OrderItemServiceInterface
{

  use HasCache;
  protected $reponsitory;
  protected $modelData;


  private const CACHE_KEY = 'order_items';

  public function __construct(OrderItemReponsitory $reponsitory)
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




  public function getResource($resource, $type = 'model')
  {
    return $type === 'collection' ? OrderItemResource::collection($resource) : new OrderItemResource($resource);
  }
}
