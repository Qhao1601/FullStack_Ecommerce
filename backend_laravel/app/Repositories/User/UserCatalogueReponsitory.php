<?php
namespace App\Repositories\User;
use App\Repositories\BaseRepository;
use App\Models\UserCatalogue;

class UserCatalogueReponsitory extends BaseRepository{
    protected $model;

    public function __construct(UserCatalogue $model)
    {
        $this->model = $model;
        parent::__construct($model);
    }
   
}