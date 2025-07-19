<?php
namespace App\Repositories\Product;
use App\Repositories\BaseRepository;
use App\Models\ProductCatalogue;

class ProductCatalogueReponsitory extends BaseRepository{
    protected $model;

    public function __construct(ProductCatalogue $model)
    {
        $this->model = $model;
        parent::__construct($model);
    }
   
}