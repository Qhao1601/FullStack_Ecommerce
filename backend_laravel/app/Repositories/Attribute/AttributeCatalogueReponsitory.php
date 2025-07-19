<?php
namespace App\Repositories\Attribute;
use App\Repositories\BaseRepository;
use App\Models\AttributeCatalogue;

class AttributeCatalogueReponsitory extends BaseRepository{
    protected $model;

    public function __construct(AttributeCatalogue $model)
    {
        $this->model = $model;
        parent::__construct($model);
    }
   
}