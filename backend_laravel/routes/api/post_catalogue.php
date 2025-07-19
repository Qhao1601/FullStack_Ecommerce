<?php

use App\Http\Controllers\Api\V1\Post\PostCatalogueController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\UserCatalogue;



Route::group(['prefix' => 'v1'], function () {
    Route::middleware(['jwt:api', 'convertRequestKey', 'checkApiPermission'])->group(function () {
        Route::delete('post_catalogues/bulk', [PostCatalogueController::class, 'bulkDelete']);
        Route::delete('post_catalogues/{post_catalogue}/permissions/{permission}', [PostCatalogueController::class, 'detachPermission']);
        Route::delete('post_catalogues/{post_catalogue}/permissions', [PostCatalogueController::class, 'bulkDetachPermission']);
        Route::post('post_catalogues/{post_catalogue}/permissions/{permission}', [PostCatalogueController::class, 'attachPermission']);
        Route::resource('post_catalogues', PostCatalogueController::class)->except(['create', 'edit']);
    });
});
