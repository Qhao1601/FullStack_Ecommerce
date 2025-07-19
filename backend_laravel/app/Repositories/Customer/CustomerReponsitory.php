<?php

namespace App\Repositories\Customer;

use App\Repositories\BaseRepository;
use App\Models\Customer;

class CustomerReponsitory extends BaseRepository
{
    protected $model;

    public function __construct(Customer $model)
    {
        $this->model = $model;
        parent::__construct($model);
    }
}
