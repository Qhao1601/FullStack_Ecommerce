<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class BaseRepository
{
    protected $model;

    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    public function getModel()
    {
        return $this->model;
    }


    public function create(array $payload = []): Model
    {
        return $this->model->create($payload)->fresh();
    }

    public function insert(array $payload = [])
    {
        return $this->model->insert();
    }

    public function update(int $id, array $payload = []): Model
    {
        $model = $this->findById($id);
        $model->fill($payload);
        $model->save();
        $model->fresh();
        return $model;
    }

    public function findById(int $id = 0, array $relations = [])
    {
        return $this->model->with($relations)->find($id);
    }

    public function findByIds(array $ids = [])
    {
        return $this->model->whereIn('id', $ids)->get();
    }

    // thêm findbyIds để xử lý tên phiên bảng (Sử dụng hàm trên vẫn được mà dag test nên dùng hàm này . nếu sử dụng hàm trên thêm with vào)
    public function findByIdss(array $ids = [], array $relations = [], $orderBy = ['id', 'DESC']): mixed
    {
        return $this->model->whereIn('id', $ids)->with($relations)->orderBy($orderBy[0], $orderBy[1])->get();
    }

    public function delete(Model $model)
    {
        return $model->delete();
    }

    public function getRelations(): array
    {
        return $this->model->getRelations();
    }
    public function getFillable()
    {
        return $this->model->getFillable();
    }

    public function bulkDelete(array $ids = [])
    {
        return $this->model->whereIn('id', $ids)->delete();
    }

    // public function paginate(bool $recordType = false, array $specifications = [])
    // {
    //     return $this->model
    //         ->keyword($specifications['keyword'] ?? [])
    //         ->simpleFilter($specifications['filters']['simple'] ?? [])
    //         ->complexFilter($specifications['filters']['complex'] ?? [])
    //         ->dateFilter($specifications['filters']['date'] ?? [])
    //         ->catalogueFilter($specifications['filters']['category'])
    //         // ->relation($specifications['with'] ?? [])
    //         // tạm thời để như này
    //         ->with($specifications['with'] ?? [])
    //         ->orderBy($specifications['sortBy'][0], $specifications['sortBy'][1])
    //         ->when(
    //             $specifications['type'],
    //             // nếu muốn xem câu truy vấn thì thay get bằng toSql()
    //             fn($q) => $q->get(),
    //             fn($q) => $q->paginate($specifications['perpage'])
    //         );
    // }

    public function paginate(array $specifications = [])
    {
        return $this->model
            ->keyword($specifications['keyword'] ?? [])
            ->simpleFilter($specifications['filters']['simple'] ?? [])
            ->complexFilter($specifications['filters']['complex'] ?? [])
            ->dateFilter($specifications['filters']['date'] ?? [])
            ->catalogueFilter($specifications['filters']['category'] ?? [])
            // ->relation($specifications['with'] ?? [])
            // tạm thời để như này
            ->with($specifications['with'] ?? [])
            // ->with(['users', 'attributes'])
            ->orderBy($specifications['sortBy'][0], $specifications['sortBy'][1])
            ->when(
                $specifications['type'],
                // nếu muốn xem câu truy vấn thì thay get bằng toSql()
                fn($q) => $q->get(),
                fn($q) => $q->paginate($specifications['perpage'])
            );
    }



    // public function paginate(array $specifications = [])
    // {
    //     // Truyền trực tiếp các quan hệ vào with()
    //     $query = $this->model
    //         ->keyword($specifications['keyword'] ?? [])
    //         ->simpleFilter($specifications['filters']['simple'] ?? [])
    //         ->complexFilter($specifications['filters']['complex'] ?? [])
    //         ->dateFilter($specifications['filters']['date'] ?? [])
    //         ->catalogueFilter($specifications['filters']['category'] ?? [])
    //         ->with($specifications['with'] ?? []) // Truyền trực tiếp quan hệ
    //         ->orderBy($specifications['sortBy'][0], $specifications['sortBy'][1]);

    //     dd($query->toSql());  // Kiểm tra câu truy vấn SQL

    //     return $query->paginate($specifications['perpage']);
    // }


    public function countRelation(array $ids = [], string $relationName = '', string $relationField = '', int $modelId = 0)
    {

        return ($this->model->where('id', $modelId)
            ->whereHas($relationName, function ($query) use ($ids, $relationField) {
                $query->whereIn($relationField, $ids);
            })
            ->withCount([$relationName => function ($query) use ($ids, $relationField) {
                $query->whereIn($relationField, $ids);
            }])
            ->first()->{$relationName . '_count'});
    }

    // hàm này ngoại lệ nếu gọi responsitory không có phương thức nào tên gọi thì sẽ nhảy vào phương thức này 
    //(vd đang xử lý product_variant đang sử dụng pthuc này)
    public function __call($name, $arguments)
    {
        // $field = Str::snake(str_replace('findBy', '', $name));
        // $value = $arguments[0];
        // return $this->model->where($field, $value)->first();

        // mới 
        // Kiểm tra xem $arguments có chứa ít nhất một phần tử không
        if (isset($arguments[0])) {
            $field = Str::snake(str_replace('findBy', '', $name));
            $value = $arguments[0];
            return $this->model->where($field, $value)->first();
        }

        // Trường hợp không có arguments[0], trả về null hoặc xử lý tùy ý
        return null;
    }

    // test slide 
    // Trong SlidesReponsitory.php
    public function findNoCache($id)
    {
        return $this->model->withoutGlobalScopes()->findOrFail($id);
    }

    // xử lý giỏ hàng(cart) từ cartService
    public function firstOrCreate(array $attributes, array $value = [])
    {
        return $this->model->firstOrCreate($attributes, $value);
    }
}
