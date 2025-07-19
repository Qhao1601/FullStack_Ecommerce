<?php

namespace App\Traits;

use App\Exceptions\RecordExistsException;
use Illuminate\Database\RecordNotFoundException;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Lang;
use Illuminate\Database\RecordsNotFoundException;
use Illuminate\Database\Eloquent\RelationNotFoundException;

trait HasRelation
{
    protected function handleRelations(Request $request): self
    {

        // đây phương thức dc định nghĩa model user và return trả về ... (vd user_catalogue ...) 
        $pivotRelations = $this->model->getRelations();

        // tức là kiểm tra xem user có mối quan hệ với bảng return trả về model không
        // nếu có duyệt vòng lặp .  và kiểm tra xem request gửi lên là user_catalogue thì kiểm tra có trường user_catalogue không
        if (count($pivotRelations)) {
            foreach ($pivotRelations as $relation) {
                // request xem trong dữ liệu gửi lên có trường user_catalogue không . ở request sẽ xuly kiểm tra
                if (isset($request->{$relation})) {
                    // nếu có trường gửi lên truy cập vào model và cập nhật đồng bộ vào bảng trung giang
                    $this->model->{$relation}()->sync($request->{$relation});
                }
            }
        }
        return $this;
    }


    protected function detachModelRelation(Request $request, string $relationName = '', string $modelKey = '', string $relationKey = ''): self
    {
        $modelId = $request->route($modelKey);
        $relationId = $request->route($relationKey);

        $model = $this->reponsitory->findById($modelId);
        $this->model = $model;

        $relationFieldId = substr($relationName, 0, -1) . '_id';
        $hasRelation = $this->model->{$relationName}()->where($relationFieldId, $relationId)->exists();
        if (!$hasRelation) {
            throw new RecordNotFoundException(Lang::get('messages.record_relation_miss_match'));
        }
        $this->model->{$relationName}()->detach($relationId);
        $this->result = $this->model;
        return $this;
    }

    protected function detachMultipleModelRelation(Request $request, string $relationName = '', string $modelKey = '')
    {
        $modelId = $request->route($modelKey);
        $ids = $request->ids;

        $this->model = $this->reponsitory->findById($modelId);
        $relationFieldId = substr($relationName, 0, -1) . '_id';
        $countRelationMath = $this->reponsitory->countRelation($ids, $relationName, $relationFieldId, $this->model->id);

        if ($countRelationMath < count($ids)) {
            throw new RelationNotFoundException(lang::get('messages.relation_not_found'));
        }

        $this->model->{$relationName}()->detach($ids);
        $this->result = $this->model;
        return $this;
    }

    protected function attachSingleModelRelation(Request $request, string $relationName = '', string $modelKey = '', string $relationKey = '')
    {
        $modelId = $request->route($modelKey);
        $relationId = $request->route($relationKey);

        $this->model = $this->reponsitory->findById($modelId);
        $relationFieldId = substr($relationName, 0, -1) . '_id';
        $hasRelation = $this->model->{$relationName}()->where($relationFieldId, $relationId)->exists();

        if ($hasRelation) {
            throw new RecordExistsException(Lang::get('messages.relation_exists'));
        }
        $this->model->{$relationName}()->attach($relationId);
        $this->result = $this->model;
        return $this;
    }
}
