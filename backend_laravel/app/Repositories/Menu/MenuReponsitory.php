<?php
namespace App\Repositories\Menu;
use App\Repositories\BaseRepository;
use App\Models\Menu;

class MenuReponsitory extends BaseRepository{
    protected $model;

    public function __construct(Menu $model)
    {
        $this->model = $model;
        parent::__construct($model);
    }
   
}