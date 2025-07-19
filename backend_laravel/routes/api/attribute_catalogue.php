<?php

use App\Http\Controllers\Api\V1\Attribute\AttributeCatalogueController;

use Illuminate\Support\Facades\Route;




Route::group(['prefix' => 'v1'], function () {
    Route::middleware(['jwt:api', 'convertRequestKey', 'checkApiPermission'])->group(function () {
        Route::delete('attribute_catalogues/bulk', [AttributeCatalogueController::class, 'bulkDelete']);
        Route::delete('attribute_catalogues/{attribute_catalogue}/permissions/{permission}', [AttributeCatalogueController::class, 'detachPermission']);
        Route::delete('attribute_catalogues/{attribute_catalogue}/permissions', [AttributeCatalogueController::class, 'bulkDetachPermission']);
        Route::post('attribute_catalogues/{attribute_catalogue}/permissions/{permission}', [AttributeCatalogueController::class, 'attachPermission']);
        Route::resource('attribute_catalogues', AttributeCatalogueController::class)->except(['create', 'edit']);
    });
});
