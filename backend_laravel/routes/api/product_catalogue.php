<?php

use App\Http\Controllers\Api\V1\Product\ProductCatalogueController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\UserCatalogue;



Route::group(['prefix' => 'v1'], function () {
    Route::middleware(['jwt:api', 'convertRequestKey', 'checkApiPermission'])->group(function () {
        Route::delete('product_catalogues/bulk', [ProductCatalogueController::class, 'bulkDelete']);
        Route::delete('product_catalogues/{product_catalogue}/permissions/{permission}', [ProductCatalogueController::class, 'detachPermission']);
        Route::delete('product_catalogues/{product_catalogue}/permissions', [ProductCatalogueController::class, 'bulkDetachPermission']);
        Route::post('product_catalogues/{product_catalogue}/permissions/{permission}', [ProductCatalogueController::class, 'attachPermission']);
        Route::resource('product_catalogues', ProductCatalogueController::class)->except(['create', 'edit']);
    });
});
