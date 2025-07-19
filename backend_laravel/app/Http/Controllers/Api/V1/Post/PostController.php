<?php

namespace App\Http\Controllers\Api\V1\Post;

use App\Http\Requests\Post\Post\StoreRequest;
use App\Http\Requests\Post\Post\UpdateRequest;
use App\Http\Requests\Post\Post\DeleteBulkRequest;
use App\Traits\Loggable;
use App\Services\Interfaces\Post\PostServiceInterface as PostService;
use App\Http\Resources\Post\PostResource;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Api\V1\BaseController;
use Illuminate\Http\Request;

class PostController extends BaseController
{

    protected $service;
    use Loggable;

    public function __construct(PostService $service)
    {
        $this->service = $service;
        parent::__construct(
            $service,
            PostResource::class
        );
    }

    public function index(Request $request)
    {
        return $this->basePaginate($request);
    }

    public function store(StoreRequest $request): JsonResponse
    {
        return $this->baseSave($request);
    }

    public function update(UpdateRequest $request, int $id): JsonResponse
    {
        return $this->baseSave($request, $id);
    }

    public function show(Request $request, ?int $id)
    {
        return $this->baseShow($id);
    }

    public function destroy(int $id)
    {
        return $this->baseDestroy($id);
    }

    public function bulkDelete(DeleteBulkRequest $request)
    {
        return $this->baseDeleteBulk($request);
    }
}
