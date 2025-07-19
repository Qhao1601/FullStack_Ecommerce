<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\Config\Common;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\UserCatalogue\DeleteBulkRequest;
use Symfony\Component\HttpFoundation\Request;
use App\Http\Resources\ApiResource;
use App\Traits\loggable;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Lang;
use Illuminate\Database\RecordNotFoundException;
use Illuminate\Database\Eloquent\RelationNotFoundException;
use App\Exceptions\RecordExistsException;


abstract class BaseController extends Controller
{

    use loggable;

    protected $service;

    protected $resource;

    public function __construct($service, $resource)
    {
        $this->service = $service;
        $this->resource = $resource;
    }

    public function basePaginate(Request $request): JsonResponse
    {
        $response = $this->service->paginate($request);
        return ApiResource::ok($response, Common::SUCCESS);
    }

    public function baseSave(Request $request, ?int $id = null): JsonResponse
    {

        $response = $this->service->save($request, $id);
        $resource = new $this->resource($response);
        return ApiResource::ok($resource, Common::SUCCESS);
    }

    public function baseShow($id)
    {
        $response = $this->service->read($id);
        $resource  = new $this->resource($response);
        return ApiResource::ok($resource, Common::SUCCESS);
    }

    public function baseDestroy(int $id)
    {
        $reponse = $this->service->destroy($id);
        return ApiResource::message(lang::get('messages.delete_success'));
    }

    public function baseDeleteBulk(Request $request)
    {
        $response = $this->service->bulkDelete($request);
        return ApiResource::message(lang::get('messages.delete_success'));
    }
    // . '('.count($request->ids).')'



    public function baseDetachRelation(Request $request, string $relationName = '', string $modelKey = '', string $relationKey = '')
    {
        $response = $this->service->detachSingleRelation($request, $relationName, $modelKey, $relationKey);
        return ApiResource::message(Common::SUCCESS);
    }


    public function baseBulkDetachRelation(Request $request, string $relationName = '', string $modelKey = '')
    {
        $reponse = $this->service->detachMultipleRelation($request, $relationName, $modelKey);
        return ApiResource::message(Common::SUCCESS);
    }

    public function baseAttachRelation(Request $request, string $relationName = '', string $modelKey = '', string $relationKey = '')
    {
        $reponse = $this->service->attachSingleRelation($request, $relationName, $modelKey, $relationKey);
        return ApiResource::message(Common::SUCCESS);
    }
}
