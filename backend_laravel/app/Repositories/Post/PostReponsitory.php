<?php

namespace App\Repositories\Post;

use App\Repositories\BaseRepository;
use App\Models\Post;

class PostReponsitory extends BaseRepository
{
    protected $model;

    public function __construct(Post $model)
    {
        $this->model = $model;
        parent::__construct($model);
    }
}
