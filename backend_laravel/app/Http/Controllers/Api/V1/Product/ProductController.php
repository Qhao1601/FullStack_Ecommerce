<?php 
namespace App\Http\Controllers\Api\V1\Product;

use App\Http\Requests\Product\Product\StoreRequest;
use App\Http\Requests\Product\Product\UpdateRequest;
use App\Http\Requests\Product\Product\DeleteBulkRequest;
use App\Traits\Loggable;
use App\Services\Interfaces\Product\ProductServiceInterface as ProductService;
use App\Http\Resources\Product\ProductResource;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Api\V1\BaseController;
use Illuminate\Http\Request;

class ProductController extends BaseController{

    protected $service;
    use Loggable;

    public function __construct(ProductService $service)
    {
        $this->service = $service;
        parent::__construct(
            $service,
            ProductResource::class
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