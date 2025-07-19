<?php 
namespace App\Http\Controllers\Api\V1\User;

use App\Http\Requests\User\Permission\StoreRequest;
use App\Http\Requests\User\Permission\UpdateRequest;
use App\Http\Requests\User\Permission\DeleteBulkRequest;
use App\Traits\Loggable;
use App\Services\Interfaces\User\PermissionServiceInterface as PermissionService;
use App\Http\Resources\User\PermissionResource;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Api\V1\BaseController;
use Illuminate\Http\Request;

class PermissionController extends BaseController{

    private $permissionService;
    use Loggable;

    public function __construct(PermissionService $permissionService)
    {
        $this->permissionService = $permissionService;
        parent::__construct(
            $permissionService,
            PermissionResource::class
        );
    }

    public function index(Request $request){
        return $this->basePaginate($request);
    }

    public function store(StoreRequest $request): JsonResponse{
        return $this->baseSave($request);
    }
   
    public function update(UpdateRequest $request,int $id): JsonResponse{
        return $this->baseSave($request,$id);
    }

    public function show(Request $request, ?int $id){
        return $this->baseShow($id);
    }

    public function destroy(int $id){
        return $this->baseDestroy($id);
    }

    public function bulkDelete(DeleteBulkRequest $request){
        return $this->baseDeleteBulk($request);
    }


 
}