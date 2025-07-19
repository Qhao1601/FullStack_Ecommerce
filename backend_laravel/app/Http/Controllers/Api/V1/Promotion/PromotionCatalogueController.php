<?php 
namespace App\Http\Controllers\Api\V1\Promotion;

use App\Http\Requests\Promotion\PromotionCatalogue\StoreRequest;
use App\Http\Requests\Promotion\PromotionCatalogue\UpdateRequest;
use App\Http\Requests\Promotion\PromotionCatalogue\DeleteBulkRequest;
use App\Traits\Loggable;
use App\Services\Interfaces\Promotion\PromotionCatalogueServiceInterface as PromotionCatalogueService;
use App\Http\Resources\Promotion\PromotionCatalogueResource;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Api\V1\BaseController;
use Illuminate\Http\Request;

class PromotionCatalogueController extends BaseController{

    protected $service;
    use Loggable;

    public function __construct(PromotionCatalogueService $service)
    {
        $this->service = $service;
        parent::__construct(
            $service,
            PromotionCatalogueResource::class
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