<?php 
namespace App\Http\Controllers\Api\V1\Menu;

use App\Http\Requests\Menu\Menu\StoreRequest;
use App\Http\Requests\Menu\Menu\UpdateRequest;
use App\Http\Requests\Menu\Menu\DeleteBulkRequest;
use App\Traits\Loggable;
use App\Services\Interfaces\Menu\MenuServiceInterface as MenuService;
use App\Http\Resources\Menu\MenuResource;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Api\V1\BaseController;
use Illuminate\Http\Request;

class MenuController extends BaseController{

    protected $service;
    use Loggable;

    public function __construct(MenuService $service)
    {
        $this->service = $service;
        parent::__construct(
            $service,
            MenuResource::class
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