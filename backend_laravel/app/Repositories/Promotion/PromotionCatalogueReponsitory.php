<?php
namespace App\Repositories\Promotion;
use App\Repositories\BaseRepository;
use App\Models\PromotionCatalogue;

class PromotionCatalogueReponsitory extends BaseRepository{
    protected $model;

    public function __construct(PromotionCatalogue $model)
    {
        $this->model = $model;
        parent::__construct($model);
    }
   
}