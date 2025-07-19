<?php

namespace App\Traits;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;


trait HasCache
{
    // cacheKeyprefix là một thuộc tình của lớp và tiền tố để gọi . vd truyền vào user thì gọi this->$cacheKeyPrefix(thức là gọi tới user)
    protected string $cacheKeyPrefix = '';
    protected int $cacheTTL = 3600;


    protected function getRandomTTL(): int
    {
        return rand(3600, 4000);
    }

    protected function setCacheTTL(?int $ttl = null): self
    {
        $this->cacheTTL = $ttl ?? $this->getRandomTTL();
        return $this;
    }


    // truyền vào 1 biến requestParams . sau đó lấy từ dữ liệu URL hoặc cliet .
    // rồi sắp xếp lại theo thứ tự . tránh bị thay đổi vị trí trên url
    // băm mảng tra về ra 1 tham số . 
    //{$this->cacheKeyPrefix} đây đặt cho một lớp lấy tên từ class mình gọi tới . 
    // colection là một chuỗi cố định cho biến trả về 1 danh sách , bản ghi...
    public function getPaginateCacheKey(array $requestParams = []): string
    {
        ksort($requestParams);
        $hash = md5(serialize($requestParams));
        return "{$this->cacheKeyPrefix}:colection:{$hash}";
    }

    // pthuc này để xóa tất cả dữ liệu trong cache mà gắng tag (cacheKeyprefix(đây là class mà mình định nghĩa))
    // vì thay vì mình xóa từng key của cache từng cái
    // thì pthuc này giúp ta xem ai gọi tags thì có thể xóa tất cả rồi lấy từ database lưu lại cache 
    protected function flushCache(): self
    {
        Cache::tags([$this->cacheKeyPrefix])->flush();
        return $this;
    }



    //tag là một nhóm gọi tới lớp user . collection là định nghĩa 1 danh sách . flush xóa khi gắn tag vào cache
    // tức là khi mình muốn xóa , thêm một bản ghi hoặc thay đổi . thì mình dùng collection xóa 1 nhóm sau đó lấy dữ liệu từ database làm mới lại
    // và lưu lại cache . 
    protected function clearCollectionRecordCache(): self
    {
        try {
            Cache::tags(["{$this->cacheKeyPrefix}:collection"])->flush();
            return $this;
        } catch (\Exception $e) {
            throw $e;
        }
    }

    // khi tạo data sẽ được lưu vào trong cache
    // phương thức là lưu vào cache với giá trị key dc gọi từ pthuc dưới và value của model . và thời gian sống của cache
    protected function cacheSingleRecord(): self
    {
        $cacheKey = $this->getSingleRecordCacheKey();
        $cacheData = $this->getResult();
        Cache::put($cacheKey, $cacheData, $this->cacheTTL);
        return $this;
    }

    // lấy ra key dựa trên model hoặc request Url .
    // sử dụng toán tử 3 ngôi để lấy ra id của bản ghi đó . sau đó lưu vào cache
    // protected function getSingleRecordCacheKey(): string
    // {
    //     $id = ($this->model) ? $this->model->getKey() : request()->route(substr($this->cacheKeyPrefix, 0, -1));
    //     return "{$this->cacheKeyPrefix}:single:{$id}";
    // }

    protected function getSingleRecordCacheKey(): string
    {
        $id = $this->model ? $this->model->getKey() : request()->route(substr($this->cacheKeyPrefix, 0, -1));
        return "{$this->cacheKeyPrefix}:single:{$id}";
    }

    // lấy key từ lớp truyền vào dựa vào id . sau đó
    protected function getCacheKeyById(int $id = 0)
    {
        return "{$this->cacheKeyPrefix}:single:{$id}";
    }

    // phương thức nafyy dùng để xóa 1 bản ghi đơn lẻ . dựa vào id .
    // protected function clearSingleRecordCache(?int $id = null): self
    // {
    //     if (!is_null($id)) {
    //         Cache::forget($this->getCacheKeyById($id));
    //     }
    //     return $this;
    // }

    protected function clearSingleRecordCache(): self
    {
        $cacheKey = $this->getCacheKeyById($this->model->id);
        Cache::forget($cacheKey);
        return $this;
    }

    protected function clearBulkDeleteCache(array $ids = []): self
    {
        if (count($ids)) {
            foreach ($ids as $id) {
                $cacheKey = $this->getCacheKeyById($id);
                Cache::forget($cacheKey);
            }
        }
        return $this;
    }

    protected function clearCacheByTag(): self
    {
        Cache::flush();
        return $this;
    }
}
