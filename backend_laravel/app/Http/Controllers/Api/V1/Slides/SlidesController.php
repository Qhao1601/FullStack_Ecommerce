<?php

namespace App\Http\Controllers\Api\V1\Slides;

use App\Http\Requests\Slides\Slides\StoreRequest;
use App\Http\Requests\Slides\Slides\UpdateRequest;
use App\Http\Requests\Slides\Slides\DeleteBulkRequest;
use App\Traits\Loggable;
use App\Services\Interfaces\Slides\SlidesServiceInterface as SlidesService;
use App\Http\Resources\Slides\SlidesResource;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Api\V1\BaseController;
use Illuminate\Http\Request;

class SlidesController extends BaseController
{

    protected $service;
    use Loggable;

    public function __construct(SlidesService $service)
    {
        $this->service = $service;
        parent::__construct(
            $service,
            SlidesResource::class
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
