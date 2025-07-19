<?php

namespace App\pipelines\image\pipes;

 abstract class AbtractPipeLine{
    protected $options;

    public function __construct(array $options = [])
    {
        $this->options = $options;
    }
}