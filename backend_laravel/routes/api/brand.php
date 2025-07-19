<?php

use  App\Http\Controllers\Api\V1\Brand\BrandController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\UserCatalogue;



Route::group(['prefix' => 'v1'], function () {
    Route::middleware(['jwt:api', 'convertRequestKey', 'checkApiPermission'])->group(function () {
        Route::delete('brands/bulk', [BrandController::class, 'bulkDelete']);
        Route::delete('brands/{brand}/permissions/{permission}', [BrandController::class, 'detachPermission']);
        Route::delete('brands/{brand}/permissions', [BrandController::class, 'bulkDetachPermission']);
        Route::post('brands/{brand}/permissions/{permission}', [BrandController::class, 'attachPermission']);
        Route::resource('brands', BrandController::class)->except(['create', 'edit']);
    });
});
