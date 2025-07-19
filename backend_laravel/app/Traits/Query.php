<?php

namespace App\Traits;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;



trait Query
{
    public function scopeKeyword($query, array $keyword = [])
    {
        if (!empty($keyword['q'])) {
            if (count($keyword['fields'])) {
                foreach ($keyword['fields'] as $field) {
                    $query->orWhere($field, 'LIKE', '%' . $keyword['q'] . '%');
                }
            } else {
                $query->orWhere('name', 'LIKE', '%' . $keyword['q'] . '%');
            }
        }
        return $query;
    }

    // tìm kiếm publish
    public function scopeSimpleFilter($query, array $filters = [])
    {
        if (isset($filters) && count($filters)) {
            foreach ($filters as $key => $val) {
                if (($val !== 0 && !empty($val) && !is_null($val)) || $key == 'parent_id') {
                    $query->where($key, $val);
                }
            }
        }
        return $query;
    }

    // tìm kiếm theo khoảng 
    public function scopeComplexFilter($query, array $complexFilters)
    {
        if (count($complexFilters)) {
            foreach ($complexFilters as $field => $condition) {
                foreach ($condition as $operator => $val) {
                    switch ($operator) {
                        case 'gt':
                            $query->where($field, '>', $val);
                            break;
                        case 'gte':
                            $query->where($field, '>=', $val);
                            break;
                        case 'lt':
                            $query->where($field, '<', $val);
                            break;
                        case 'lte':
                            $query->where($field, '<=', $val);
                            break;
                        case 'eq':
                            $query->where($field, '=', $val);
                            break;
                    }
                }
            }
        }
        return $query;
    }

    // tìm kiếm theo ngày 
    public function scopedateFilter($query, array $dateFilters = [])
    {
        if (count($dateFilters)) {
            foreach ($dateFilters as $field => $condition) {
                foreach ($condition as $operator => $date) {
                    switch ($operator) {
                        case 'gt':
                            $query->whereDate($field, '>', Carbon::parse($date)->startofDay());
                            break;
                        case 'gte':
                            $query->whereDate($field, '>=', Carbon::parse($date)->startOfDay());
                            break;
                        case 'lt':
                            $query->whereDate($field, '<', Carbon::parse($date)->startofDay());
                            break;
                        case 'lte':
                            $query->whereDate($field, '<=', Carbon::parse($date)->startOfDay());
                        case 'between':
                            list($startDate, $endDate) = explode(',', $date);
                            $query->whereBetween($field, [
                                Carbon::parse($startDate)->startOfDay(),
                                Carbon::parse($endDate)->endOfDay()
                            ]);
                            break;
                    }
                }
            }
        }
        return $query;
    }

    // public function scoperelation($query, array $relations = [])
    // {
    //     if (count($relations)) {
    //         $query->with($relations);
    //         $query->withCount($relations);
    //     }
    //     return $query;
    // }

    // xử lý public . lấy ra thông sản phẩm thuộc danh mục mà mình chọn
    public function scopecatalogueFilter($query, $category)
    {
        if (isset($category) && is_array($category) && count($category)) {
            $query->whereHas($category['relation'], function ($subQuery) use ($category) {
                $subQuery->whereIn($category['field'], $category['children']);
            });
        }
        return $query;
    }
}
