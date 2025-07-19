<?php
namespace App\Repositories\Attribute;
use App\Repositories\BaseRepository;
use App\Models\Attribute;

class AttributeReponsitory extends BaseRepository{
    protected $model;

    public function __construct(Attribute $model)
    {
        $this->model = $model;
        parent::__construct($model);
    }
   
}