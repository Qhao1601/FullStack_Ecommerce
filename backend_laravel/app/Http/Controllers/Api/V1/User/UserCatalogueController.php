<?php 
namespace App\Http\Controllers\Api\V1\User;
use App\Http\Requests\User\UserCatalogue\StoreRequest;
use App\Http\Requests\User\UserCatalogue\UpdateRequest;
use App\Http\Requests\User\UserCatalogue\DeleteBulkRequest;
use App\Http\Requests\User\UserCatalogue\DetachPermissionRequest;
use App\Http\Requests\User\UserCatalogue\BulkDetachPermissionRequest;
use App\Http\Requests\User\UserCatalogue\AttachPermissionRequest;
use App\Traits\Loggable;
use App\Services\Interfaces\User\UserCatalogueServiceInterface as UserCatalogueService;
use App\Http\Resources\User\UserCatalogueResource;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Api\V1\BaseController;
use Illuminate\Http\Request;
use App\Enums\Config\Relation;


class UserCatalogueController extends BaseController{

    private $userCatalogueService;
    use Loggable;

    public function __construct(UserCatalogueService $userCatalogueService)
    {
        $this->userCatalogueService = $userCatalogueService;
        parent::__construct(
            $userCatalogueService,
            UserCatalogueResource::class
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

    public function detachPermission(DetachPermissionRequest $request){
        return $this->baseDetachRelation($request,Relation::PERMISSIONS,$modelKey = 'user_catalogue', $relationKey ='permission');

    }

    public function bulkDetachPermission(BulkDetachPermissionRequest $request){
        return $this->baseBulkDetachRelation($request,Relation::PERMISSIONS, $modelKey = 'user_catalogue');
    } 

    public function attachPermission(AttachPermissionRequest $request){
        return $this->baseAttachRelation($request, Relation::PERMISSIONS, $modelKey = 'user_catalogue', $relationKey = 'permission');
    }
}