<?php 
namespace App\Http\Controllers\Api\V1\Promotion;

use App\Http\Requests\Promotion\Promotion\StoreRequest;
use App\Http\Requests\Promotion\Promotion\UpdateRequest;
use App\Http\Requests\Promotion\Promotion\DeleteBulkRequest;
use App\Traits\Loggable;
use App\Services\Interfaces\Promotion\PromotionServiceInterface as PromotionService;
use App\Http\Resources\Promotion\PromotionResource;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Api\V1\BaseController;
use Illuminate\Http\Request;

class PromotionController extends BaseController{

    protected $service;
    use Loggable;

    public function __construct(PromotionService $service)
    {
        $this->service = $service;
        parent::__construct(
            $service,
            PromotionResource::class
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