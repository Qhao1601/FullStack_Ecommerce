<?php

namespace App\Repositories\Brand;

use App\Repositories\BaseRepository;
use App\Models\Brand;

class BrandReponsitory extends BaseRepository
{
    protected $model;

    public function __construct(Brand $model)
    {
        $this->model = $model;
        parent::__construct($model);
    }
}
