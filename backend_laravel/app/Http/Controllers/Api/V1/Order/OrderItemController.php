<?php 
namespace App\Http\Controllers\Api\V1\Order;

use App\Http\Requests\Order\OrderItem\StoreRequest;
use App\Http\Requests\Order\OrderItem\UpdateRequest;
use App\Http\Requests\Order\OrderItem\DeleteBulkRequest;
use App\Traits\Loggable;
use App\Services\Interfaces\Order\OrderItemServiceInterface as OrderItemService;
use App\Http\Resources\Order\OrderItemResource;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Api\V1\BaseController;
use Illuminate\Http\Request;

class OrderItemController extends BaseController{

    protected $service;
    use Loggable;

    public function __construct(OrderItemService $service)
    {
        $this->service = $service;
        parent::__construct(
            $service,
            OrderItemResource::class
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