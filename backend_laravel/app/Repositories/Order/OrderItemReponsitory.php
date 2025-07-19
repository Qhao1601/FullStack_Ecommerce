<?php
namespace App\Repositories\Order;
use App\Repositories\BaseRepository;
use App\Models\OrderItem;

class OrderItemReponsitory extends BaseRepository{
    protected $model;

    public function __construct(OrderItem $model)
    {
        $this->model = $model;
        parent::__construct($model);
    }
   
}