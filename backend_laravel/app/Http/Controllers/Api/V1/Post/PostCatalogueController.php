<?php

namespace App\Http\Controllers\Api\V1\Post;

use App\Http\Requests\Post\PostCatalogue\StoreRequest;
use App\Http\Requests\Post\PostCatalogue\UpdateRequest;
use App\Http\Requests\Post\PostCatalogue\DeleteBulkRequest;
use App\Traits\Loggable;
use App\Services\Interfaces\Post\PostCatalogueServiceInterface as PostCatalogueService;
use App\Http\Resources\Post\PostCatalogueResource;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Api\V1\BaseController;
use App\Http\Resources\ApiResource;
use Illuminate\Http\Request;

class PostCatalogueController extends BaseController
{

    protected $service;
    use Loggable;

    public function __construct(PostCatalogueService $service)
    {
        $this->service = $service;
        parent::__construct(
            $service,
            PostCatalogueResource::class
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

    public function getPostHome(Request $request)
    {
        $response = $this->service->getPostHome();
        return ApiResource::ok($response, 'Succes');
    }
}
