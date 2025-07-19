<?php 
namespace App\Http\Controllers\Api\V1\Brand;

use App\Http\Requests\Brand\Brand\StoreRequest;
use App\Http\Requests\Brand\Brand\UpdateRequest;
use App\Http\Requests\Brand\Brand\DeleteBulkRequest;
use App\Traits\Loggable;
use App\Services\Interfaces\Brand\BrandServiceInterface as BrandService;
use App\Http\Resources\Brand\BrandResource;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Api\V1\BaseController;
use Illuminate\Http\Request;

class BrandController extends BaseController{

    protected $service;
    use Loggable;

    public function __construct(BrandService $service)
    {
        $this->service = $service;
        parent::__construct(
            $service,
            BrandResource::class
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