<?php 
namespace App\Http\Controllers\Api\V1\Product;

use App\Http\Requests\Product\ProductVariant\StoreRequest;
use App\Http\Requests\Product\ProductVariant\UpdateRequest;
use App\Http\Requests\Product\ProductVariant\DeleteBulkRequest;
use App\Traits\Loggable;
use App\Services\Interfaces\Product\ProductVariantServiceInterface as ProductVariantService;
use App\Http\Resources\Product\ProductVariantResource;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Api\V1\BaseController;
use Illuminate\Http\Request;

class ProductVariantController extends BaseController{

    protected $service;
    use Loggable;

    public function __construct(ProductVariantService $service)
    {
        $this->service = $service;
        parent::__construct(
            $service,
            ProductVariantResource::class
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