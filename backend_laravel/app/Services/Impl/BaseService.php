<?php

namespace App\Services\Impl;

use Illuminate\Support\Facades\Log;
use App\Enums\Config\Common;
use App\Http\Requests\User\UserCatalogue\DeleteBulkRequest;
use App\Services\Interfaces\BaseServiceInterface;
use Illuminate\Http\Request;
use App\Traits\HasTransaction;
use App\Traits\HasHook;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Lang;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HasCache;
use App\Traits\HasRelation;
use Illuminate\Support\Facades\Cache;



abstract class BaseService implements BaseServiceInterface
{

    use HasTransaction;
    use HasHook;
    use HasCache;
    use HasRelation;
    protected $reponsitory;
    protected $modelData;
    protected $model;
    protected $result;
    protected $auth;
    protected $with = [];
    protected $sort = ['id', 'desc'];
    protected $filterCatalogue = null;

    private const RECORD_TYPE = 'all';
    private const PERPAGE = 50;


    // đây lớp cha gọi phương thức con tái sử dụng 
    // vì abstract là lớp cha nó gọi lớp con xử lý . giúp lớp cha khi gọi prepareModelData không cần viết hàm lại 
    // nó giúp đồng bộ dữ liệu . khi mình xử lý save lớp baseService . thì trước hết nó chạy prepareModelData để cbi data.
    // rồi mới thực thi save . (không chỉ save bất kì hàm nào mình viết thì đều chạy prepareModelData để cbi trc dữ liệu rồi mới 
    // xử lý tiếp theo bên trong phương thức đó)
    abstract protected function prepareModelData(Request $request, ?int $id = null): self;
    abstract protected function getResource($resource, $type = 'model');


    public function __construct($reponsitory)
    {
        $this->reponsitory = $reponsitory;
        $this->setCacheTTL();
        $this->auth = auth(Common::API);
    }


    private function buildFilters(Request $request, array $filters = []): array
    {
        $conditions = [];
        if (count($filters)) {
            foreach ($filters as $filter) {
                if ($request->has($filter)) {
                    $conditions[$filter] = $request->input($filter);
                }
            }
        }
        return $conditions;
    }


    protected function specifications(Request $request)
    {
        return [
            'keyword' => [
                'q' => $request->input('keyword'),
                'fields' => $this->searchFields()
            ],
            'sortBy' => ($request->input('sort_by')) ? explode(',', $request->input('sort_by')) : $this->sort,
            'perpage' => ($request->input('perpage')) ? $request->input('perpage') : self::PERPAGE,
            'filters' => [
                'simple' => $this->buildFilters($request, $this->simpleFilter()),
                'complex' => $this->buildFilters($request, $this->complexFilter()),
                'date' => $this->buildFilters($request, $this->dateFilter()),
            ],
            'with' => $this->with,
            'type' => $request->type === 'all',
        ];
    }


    // public function paginate(Request $request)
    // {

    //     try {
    //         // xác định mình phân trang với bản ghi nào
    //         $recordType = $request->type === self::RECORD_TYPE;
    //         // lấy những dữ liệu request gửi lên phân trang gồm những nội dung nào
    //         $specifications = $this->specifications($request);

    //         // tạo ra key duy nhất cho yêu cầu phân trang
    //         $cacheKey = $this->getPaginateCacheKey($request->all());
    //         // và đặt cho khóa lock
    //         $lockKey = "lock:{$cacheKey}";
    //         // thời gian lock này 10s phải đợi dữ liệu xử lý xong mới tới dữ liệu khác tránh trường hợp xử lý nhiều việc trong 1 lúc
    //         // block để ngăn các yêu câu khác 5s nếu khóa lock đang giữ
    //         return Cache::lock($lockKey, 10)->block(5, function () use ($recordType, $specifications, $cacheKey) {
    //             // remember kiểm tra xem có tồn tại cacheKey hay chưa (tức là lock trên) . nếu chưa thì thực thi hàm bên trong lấy dữ liệu mới 
    //             //nếu có sẽ trả về từ dữ liệu cache
    //             return Cache::tags(["{$this->cacheKeyPrefix}:collection"])->remember(
    //                 $cacheKey,
    //                 $this->cacheTTL,
    //                 function () use ($recordType, $specifications) {
    //                     $this->result = $this->reponsitory->paginate($recordType, $specifications);
    //                     return $this->getResult();
    //                 }
    //             );
    //         });
    //     } catch (\Exception $e) {
    //         throw $e;
    //     }
    // }

    public function paginate(Request $request)
    {
        try {
            $specifications = $this->specifications($request);
            $this->result = $this->reponsitory->paginate($specifications);
            return $this->getResult();
        } catch (\Exception $e) {
            throw $e;
        }
    }


    public function save(Request $request, ?int $id = null): mixed
    {
        try {
            return $this->beginTransaction()
                ->prepareModelData($request, $id)
                ->beforeSave($request)
                ->saveModel($id)
                ->handleRelations($request)
                ->afterSave($request)
                ->commit()
                ->getResult();
        } catch (\Exception $e) {
            $this->rollback();
            throw $e;
        }
    }

    protected function saveModel(?int $id): self
    {
        if ($id) {
            $this->model = $this->reponsitory->update($id, $this->modelData);
        } else {
            $this->model = $this->reponsitory->create($this->modelData);
        }
        $this->result = $this->model;
        return $this;
    }


    public function read(int $id): mixed
    {
        if (is_null($id)) {
            throw new \InvalidArgumentException("ID không được để trống");
        }
        $lockKey = "lock:{$this->getCacheKeyById($id)}";
        $this->result =  Cache::lock($lockKey, 10)->block(5, function () use ($id) {
            return $this->model = Cache::remember(
                $this->getCacheKeyById($id),
                $this->cacheTTL,
                function () use ($id) {
                    return  $this->reponsitory->findById($id, $this->with);
                }
            );
        });
        return $this->getResult();
    }


    public function destroy(int $id)
    {
        try {
            return $this->beginTransaction()
                ->beforeDelete($id)
                ->deleteModel($id)
                ->afterDelete()
                ->commit()
                ->getResult();
        } catch (\Exception $e) {
            $this->rollback();
            throw $e;
        }
    }


    public function deleteModel(int $id): self
    {
        $model = $this->reponsitory->findById($id);
        if (!$model) {
            throw new ModelNotFoundException(lang::get('messages.record_not_found'));
        };
        $this->model = $model;
        $this->result = $this->reponsitory->delete($model);
        return $this;
    }


    public function bulkDelete(Request $request)
    {

        try {
            return $this->beginTransaction()
                ->beforeBulkDelete($request)
                ->bulkDeleteModel($request)
                ->afterBulkDelete($request)
                ->commit()
                ->getResult();
        } catch (\Exception $e) {
            $this->rollback();
            throw $e;
        }
    }

    public function bulkDeleteModel(Request $request): self
    {
        $ids = $request->ids;
        $models = $this->reponsitory->findByIds($ids);

        if ($models->count() !== count($ids)) {
            throw new ModelNotFoundException("messages.some_records_not_found");
        }
        $this->result = $this->reponsitory->bulkDelete($ids);
        return $this;
    }


    public function detachSingleRelation(Request $request, string $relationName = '', string $modelKey = '', string $relationKey)
    {
        try {
            return $this->beginTransaction()
                // xử lý HasRelation
                ->detachModelRelation($request, $relationName, $modelKey, $relationKey)
                ->afterDelete()
                ->commit()
                ->getResult();
        } catch (\Exception $e) {
            throw $e;
        }
    }

    public function detachMultipleRelation(Request $request, string $relationName = '', string $modelKey = '')
    {
        try {
            return $this->beginTransaction()
                ->detachMultipleModelRelation($request, $relationName, $modelKey)
                ->afterDelete()
                ->commit()
                ->getResult();
        } catch (\Exception $e) {
            throw $e;
        }
    }

    public function attachSingleRelation(Request $request, string $relationName = '', string $modelKey = '', string $relationKey = '')
    {
        try {
            return $this->beginTransaction()
                ->attachSingleModelRelation($request, $relationName, $modelKey, $relationKey)
                ->afterSave($request)
                ->commit()
                ->getResult();
        } catch (\Exception $e) {
            throw $e;
        }
    }

    public function findByIds(array $ids = [])
    {
        $idString = implode(',', $ids);
        $cacheKey = "{$this->cacheKeyPrefix}:ids:{$idString}";
        $lockKey =  "lock:{$cacheKey}";

        return Cache::lock($lockKey, 10)->block(5, function () use ($cacheKey, $ids) {
            // remember kiểm tra xem có tồn tại cacheKey hay chưa (tức là lock trên) . nếu chưa thì thực thi hàm bên trong lấy dữ liệu mới 
            //nếu có sẽ trả về từ dữ liệu cache
            return Cache::tags(["{$this->cacheKeyPrefix}:collection"])->remember(
                $cacheKey,
                $this->cacheTTL,
                function () use ($ids) {
                    $this->result = $this->reponsitory->findByIdss($ids, $this->with, orderBy: ['id', 'asc']);
                    return $this->getResult();
                }
            );
        });
    }
}
