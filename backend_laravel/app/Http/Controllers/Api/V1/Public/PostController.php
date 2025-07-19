<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Resources\ApiResource;
use App\Traits\Loggable;
use Illuminate\Http\Request;
use App\Services\Public\PostService;

class PostController
{

    protected $service;
    use Loggable;

    public function __construct(PostService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $response = $this->service->paginate($request);
        return ApiResource::ok($response, 'success');
    }

    // public function show(Request $request, ?int $id)
    // {
    //     return $this->baseShow($id);
    // }


}
