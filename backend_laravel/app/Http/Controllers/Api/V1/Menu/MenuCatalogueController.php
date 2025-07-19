<?php 
namespace App\Http\Controllers\Api\V1\Menu;

use App\Http\Requests\Menu\MenuCatalogue\StoreRequest;
use App\Http\Requests\Menu\MenuCatalogue\UpdateRequest;
use App\Http\Requests\Menu\MenuCatalogue\DeleteBulkRequest;
use App\Traits\Loggable;
use App\Services\Interfaces\Menu\MenuCatalogueServiceInterface as MenuCatalogueService;
use App\Http\Resources\Menu\MenuCatalogueResource;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Api\V1\BaseController;
use Illuminate\Http\Request;

class MenuCatalogueController extends BaseController{

    protected $service;
    use Loggable;

    public function __construct(MenuCatalogueService $service)
    {
        $this->service = $service;
        parent::__construct(
            $service,
            MenuCatalogueResource::class
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