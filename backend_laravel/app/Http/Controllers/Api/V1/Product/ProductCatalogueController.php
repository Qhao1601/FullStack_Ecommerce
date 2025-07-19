<?php

namespace App\Http\Controllers\Api\V1\Product;

use App\Enums\Config\Common;
use App\Http\Requests\Product\ProductCatalogue\StoreRequest;
use App\Http\Requests\Product\ProductCatalogue\UpdateRequest;
use App\Http\Requests\Product\ProductCatalogue\DeleteBulkRequest;
use App\Traits\Loggable;
use App\Services\Interfaces\Product\ProductCatalogueServiceInterface as ProductCatalogueService;
use App\Http\Resources\Product\ProductCatalogueResource;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Api\V1\BaseController;
use App\Http\Resources\ApiResource;
use Illuminate\Http\Request;

class ProductCatalogueController extends BaseController
{

    protected $service;
    use Loggable;

    public function __construct(ProductCatalogueService $service)
    {
        $this->service = $service;
        parent::__construct(
            $service,
            ProductCatalogueResource::class
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

    public function getCategoryHome(Request $request)
    {
        $response = $this->service->getCategoryHome();
        return ApiResource::ok($response, Common::SUCCESS);
    }
}
