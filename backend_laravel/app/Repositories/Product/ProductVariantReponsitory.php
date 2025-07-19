<?php

namespace App\Repositories\Product;

use App\Repositories\BaseRepository;
use App\Models\ProductVariant;
use Illuminate\Support\Facades\Log;

class ProductVariantReponsitory extends BaseRepository
{
    protected $model;

    public function __construct(ProductVariant $model)
    {
        $this->model = $model;
        parent::__construct($model);
    }

    // public function checkUnique(string $code = '', ?int $id = null)
    // {
    //     return $this->model->where('code', $code)->when($id !== null, function ($query) use ($id) {
    //         return $query->where('id', '<>', $id);
    //     })->exists();
    // }
    public function checkUnique(string $code = '', ?int $id = null, int $productId = 0)
    {
        $query = $this->model->where('code', $code)->where('product_id', $productId);

        if ($id !== null) {
            $query->when($id !== null, function ($query) use ($id) {
                return $query->where('id', '<>', $id);
            });
        }

        $sql = $query->toSql();
        $bindings = $query->getBindings();

        $fullQuery = vsprintf(str_replace('?', '%s', $sql), array_map('addslashes', $bindings));

        // Ghi log
        Log::info('Check Unique Query: ' . $fullQuery);

        return $query->exists();
    }
}
