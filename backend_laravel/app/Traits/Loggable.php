<?php

namespace App\Traits;

use App\Enums\Config\Common;
use App\Http\Resources\ApiResource;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Response;

trait loggable {
    protected function logError(\Exception $e, string $message = 'Error message: '){
        Log::error($message, [
            'message' => $e->getMessage(),
            'line' => $e->getLine(),
            'file' => $e->getLine()
        ]);
    }

    protected function handleLogException(\Exception $e, string $message = 'Error message: '){
        $this->logError($e, $message);
        return ApiResource::message(Common::NETWORK_ERROR, Response::HTTP_INTERNAL_SERVER_ERROR);
    }
}