<?php
namespace App\Repositories\Menu;
use App\Repositories\BaseRepository;
use App\Models\MenuCatalogue;

class MenuCatalogueReponsitory extends BaseRepository{
    protected $model;

    public function __construct(MenuCatalogue $model)
    {
        $this->model = $model;
        parent::__construct($model);
    }
   
}