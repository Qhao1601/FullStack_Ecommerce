<?php 
namespace App\Http\Controllers\Api\V1\Attribute;

use App\Http\Requests\Attribute\Attribute\StoreRequest;
use App\Http\Requests\Attribute\Attribute\UpdateRequest;
use App\Http\Requests\Attribute\Attribute\DeleteBulkRequest;
use App\Traits\Loggable;
use App\Services\Interfaces\Attribute\AttributeServiceInterface as AttributeService;
use App\Http\Resources\Attribute\AttributeResource;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Api\V1\BaseController;
use Illuminate\Http\Request;

class AttributeController extends BaseController{

    protected $service;
    use Loggable;

    public function __construct(AttributeService $service)
    {
        $this->service = $service;
        parent::__construct(
            $service,
            AttributeResource::class
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