<?php

namespace App\Services\Interfaces;

use Illuminate\Http\Request;

interface BaseServiceInterface
{
    public function save(Request $request);
    public function findByIds(array $attribute = []);
    public function paginate(Request $request);
    public function read(int $id);
}
