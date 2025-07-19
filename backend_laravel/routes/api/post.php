<?php

use  App\Http\Controllers\Api\V1\Post\PostController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\UserCatalogue;



Route::group(['prefix' => 'v1'], function () {
    Route::middleware(['jwt:api', 'convertRequestKey', 'checkApiPermission'])->group(function () {
        Route::delete('posts/bulk', [PostController::class, 'bulkDelete']);
        Route::delete('posts/{posts}/permissions/{permission}', [PostController::class, 'detachPermission']);
        Route::delete('posts/{posts}/permissions', [PostController::class, 'bulkDetachPermission']);
        Route::post('posts/{posts}/permissions/{permission}', [PostController::class, 'attachPermission']);
        Route::resource('posts', PostController::class)->except(['create', 'edit']);
    });
});
