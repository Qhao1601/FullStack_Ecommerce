<?php 
namespace App\Http\Controllers\Api\V1\Attribute;

use App\Http\Requests\Attribute\AttributeCatalogue\StoreRequest;
use App\Http\Requests\Attribute\AttributeCatalogue\UpdateRequest;
use App\Http\Requests\Attribute\AttributeCatalogue\DeleteBulkRequest;
use App\Traits\Loggable;
use App\Services\Interfaces\Attribute\AttributeCatalogueServiceInterface as AttributeCatalogueService;
use App\Http\Resources\Attribute\AttributeCatalogueResource;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Api\V1\BaseController;
use Illuminate\Http\Request;

class AttributeCatalogueController extends BaseController{

    protected $service;
    use Loggable;

    public function __construct(AttributeCatalogueService $service)
    {
        $this->service = $service;
        parent::__construct(
            $service,
            AttributeCatalogueResource::class
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