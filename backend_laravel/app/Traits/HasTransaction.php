<?php

namespace App\Traits;

use Illuminate\Support\Facades\DB;

trait HasTransaction {
    protected function beginTransaction(): self{
        DB::beginTransaction();
        return $this;
    }

    protected function commit(): self {
        DB::commit();
        return $this;
    }

    protected function rollback(): self{
        DB::rollBack();
        return $this;
    }
}