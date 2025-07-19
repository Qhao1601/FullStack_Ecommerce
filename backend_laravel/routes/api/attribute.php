<?php

use App\Http\Controllers\Api\V1\Attribute\AttributeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\UserCatalogue;



Route::group(['prefix' => 'v1'], function () {
    Route::middleware(['jwt:api', 'convertRequestKey', 'checkApiPermission'])->group(function () {
        Route::delete('attributes/bulk', [AttributeController::class, 'bulkDelete']);
        Route::delete('attributes/{attribute}/permissions/{permission}', [AttributeController::class, 'detachPermission']);
        Route::delete('attributes/{attribute}/permissions', [AttributeController::class, 'bulkDetachPermission']);
        Route::post('attributes/{attribute}/permissions/{permission}', [AttributeController::class, 'attachPermission']);
        Route::resource('attributes', AttributeController::class)->except(['create', 'edit']);
    });
});
