<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\User\StoreRequest;
use App\Http\Requests\User\User\UpdateRequest;
use App\Http\Requests\User\User\DeleteBulkRequest;
use App\Traits\Loggable;
use Illuminate\Http\Response;
use App\Enums\Config\Common;
use App\Http\Resources\ApiResource;
use App\Services\Interfaces\User\UserServiceInterface as UserService;
use App\Http\Resources\User\UserResource;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Api\V1\BaseController;
use Illuminate\Http\Request;
use App\Http\Requests\User\User\DetachUserCatalogueRequest;
use Illuminate\Support\Facades\Lang;
use Illuminate\Database\RecordNotFoundException;

class UserController extends BaseController
{

    private $userService;
    use Loggable;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
        parent::__construct(
            $userService,
            UserResource::class
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


    public function detachUserCatalogues(DetachUserCatalogueRequest $request, int $userId = 0, int $userCatalogue = 0)
    {
        try {
            $response = $this->userService->detactUserCatalogueFromUser($userId, $userCatalogue);
            return ApiResource::message(Lang::get('messages.detach_success'));
        } catch (RecordNotFoundException $e) {
            return ApiResource::message($e->getMessage(), Response::HTTP_NOT_FOUND);
        } catch (\Exception $e) {
            return $this->handleLogException($e);
        }
    }
}
