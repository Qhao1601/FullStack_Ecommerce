<?php
namespace App\Repositories\User;
use App\Repositories\BaseRepository;
use App\Models\Permission;

class PermissionReponsitory extends BaseRepository{
    protected $model;

    public function __construct(Permission $model)
    {
        $this->model = $model;
        parent::__construct($model);
    }

    public function findByName(string $name = ''){
        return $this->model->where('name', $name)->first();
    }
   
}