<?php

namespace App\Services\Impl\Customer;

use App\Enums\Config\Common;
use App\Services\Impl\BaseService;
use App\Repositories\Customer\CustomerReponsitory;
use App\Traits\HasCache;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\RecordNotFoundException;
use Illuminate\Support\Facades\Lang;
use App\Services\Impl\Upload\ImageService;
use Illuminate\Support\Str;
use App\Services\Interfaces\Customer\CustomerServiceInterface;
use App\Http\Resources\Customer\CustomerResource;


class CustomerService extends BaseService implements CustomerServiceInterface
{

    use HasCache;
    protected $reponsitory;
    protected $modelData;
    protected $imageService;
    protected $with = [];


    public function __construct(CustomerReponsitory $reponsitory, ImageService $imageService)
    {
        $this->auth = auth(Common::API);
        $this->cacheKeyPrefix = 'customers';
        $this->imageService = $imageService;
        parent::__construct($reponsitory);
    }

    // thêm mới dữ liệu .
    protected function prepareModelData(Request $request, ?int $id = null): self
    {
        $fillable = $this->reponsitory->getFillable();
        return $this->initilizeBasicData($request, $fillable);
    }

    protected function initilizeBasicData(Request $request, array $fillable = []): self
    {
        $this->modelData = $request->only($fillable);
        $this->modelData['canonical'] = Str::slug($request->canonical);
        return $this;
    }

    // xử lý upImage 
    // protected function uploadUserImage(Request $request): self
    // {
    //     try {
    //         if ($request->hasFile('image')) {
    //             $config = [
    //                 'files' => $request->file('image'),
    //                 'folder' => Str::before($this->auth->user()->email, '@') . '/avatar/' . now()->format('Ymd'),
    //                 'pipelineKey' => 'default',
    //                 'overrideOptions' => [
    //                     'optimize' => [
    //                         'quality' => 100
    //                     ]
    //                 ]
    //             ];
    //             $uploadImage = $this->imageService->upload(...$config);
    //             $this->modelData['image'] = $uploadImage['files']['path'];
    //         }
    //         return $this;
    //     } catch (\Exception $e) {
    //         throw $e;
    //     }
    // }



    public function getResource($resource, $type = 'model')
    {

        return $type === 'collection' ? CustomerResource::collection($resource) : new CustomerResource($resource);
    }
}
