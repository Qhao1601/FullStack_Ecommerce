<?php

namespace App\Repositories\Cart;

use App\Repositories\BaseRepository;
use App\Models\Cart;


class CartRepository extends BaseRepository
{
    protected $model;
    public function __construct(Cart $model)
    {
        $this->model = $model;
        parent::__construct($model);
    }
}
