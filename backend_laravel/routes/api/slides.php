<?php

use  App\Http\Controllers\Api\V1\Slides\SlidesController;

use Illuminate\Support\Facades\Route;


Route::group(['prefix' => 'v1'], function () {
    Route::middleware(['jwt:api', 'convertRequestKey', 'checkApiPermission'])->group(function () {
        Route::delete('slides/bulk', [SlidesController::class, 'bulkDelete']);
        Route::delete('slides/{slides}/permissions/{permission}', [SlidesController::class, 'detachPermission']);
        Route::delete('slides/{slides}/permissions', [SlidesController::class, 'bulkDetachPermission']);
        Route::post('slides/{slides}/permissions/{permission}', [SlidesController::class, 'attachPermission']);
        Route::resource('slides', SlidesController::class)->except(['create', 'edit']);
    });
});
