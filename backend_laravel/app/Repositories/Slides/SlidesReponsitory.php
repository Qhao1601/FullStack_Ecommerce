<?php
namespace App\Repositories\Slides;
use App\Repositories\BaseRepository;
use App\Models\Slides;

class SlidesReponsitory extends BaseRepository{
    protected $model;

    public function __construct(Slides $model)
    {
        $this->model = $model;
        parent::__construct($model);
    }
   
}