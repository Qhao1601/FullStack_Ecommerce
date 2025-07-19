<?php

namespace App\Traits;

use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Model;


trait HasHook
{
    protected function beforeSave(Request $request): self
    {
        return $this;
    }

    protected function afterSave(Request $request): self
    {
        $this->clearSingleRecordCache()->cacheSingleRecord()->clearCollectionRecordCache()->clearCacheByTag();
        return $this;
    }


    protected function beforeDelete($id): self
    {

        return $this;
    }

    protected function afterDelete(): self
    {
        $this->clearSingleRecordCache($this->model->id)->clearCollectionRecordCache();
        return $this;
    }


    protected function beforeBulkDelete(): self
    {
        return $this;
    }

    protected function afterBulkDelete(Request $request): self
    {
        $this->clearCollectionRecordCache();
        foreach ($request->ids as $id) {
            $this->clearSingleRecordCache($id);
        }
        return $this;
    }

    protected function getResult(): mixed
    {
        if ($this->result instanceof LengthAwarePaginator) {
            $this->result->through(function ($item) {
                return $this->getResource($item);
            });
        } else if ($this->result instanceof Collection) {
            return $this->getResource($this->result, 'collection');
        } else if ($this->result instanceof Model) {
            $this->result->load($this->with);
            return $this->getResource($this->result);
        }
        return $this->result;
    }

    protected function searchFields(): array
    {
        return ['name'];
    }

    protected function simpleFilter(): array
    {
        return ['publish'];
    }

    public function complexFilter(): array
    {
        return ['id'];
    }

    public function dateFilter(): array
    {
        return ['created_at', 'updated_at'];
    }

    protected function callNested($nested)
    {
        $nested->get();
        $nested->recursive(0, $nested->set());
        $nested->action();
    }
}
