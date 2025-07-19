<?php
namespace App\Repositories\Product;
use App\Repositories\BaseRepository;
use App\Models\Product;

class ProductReponsitory extends BaseRepository{
    protected $model;

    public function __construct(Product $model)
    {
        $this->model = $model;
        parent::__construct($model);
    }
   
}