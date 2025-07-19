<?php 
namespace App\Http\Controllers\Api\V1\Order;

use App\Http\Requests\Order\Order\StoreRequest;
use App\Http\Requests\Order\Order\UpdateRequest;
use App\Http\Requests\Order\Order\DeleteBulkRequest;
use App\Traits\Loggable;
use App\Services\Interfaces\Order\OrderServiceInterface as OrderService;
use App\Http\Resources\Order\OrderResource;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Api\V1\BaseController;
use Illuminate\Http\Request;

class OrderController extends BaseController{

    protected $service;
    use Loggable;

    public function __construct(OrderService $service)
    {
        $this->service = $service;
        parent::__construct(
            $service,
            OrderResource::class
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