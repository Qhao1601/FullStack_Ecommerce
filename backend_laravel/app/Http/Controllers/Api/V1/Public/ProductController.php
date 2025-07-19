<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Resources\ApiResource;
use App\Traits\Loggable;
use App\Http\Resources\Product\ProductResource;
use Illuminate\Http\Request;
use App\Services\Public\ProductService;

class ProductController
{

    protected $service;
    use Loggable;

    public function __construct(ProductService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $response = $this->service->paginate($request);
        return ApiResource::ok($response, 'success');
    }

    public function show(Request $request, ?int $id)
    {
        $response = $this->service->read($id);
        return ApiResource::ok($response, 'success');
    }
}
