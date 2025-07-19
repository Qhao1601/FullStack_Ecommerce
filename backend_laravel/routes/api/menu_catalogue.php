<?php

use App\Http\Controllers\Api\V1\Menu\MenuCatalogueController;
use App\Http\Controllers\Api\V1\Menu\MenuController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\UserCatalogue;



Route::group(['prefix' => 'v1'], function () {
    Route::middleware(['jwt:api', 'convertRequestKey', 'checkApiPermission'])->group(function () {
        Route::delete('menu_catalogues/bulk', [MenuCatalogueController::class, 'bulkDelete']);
        Route::delete('menu_catalogues/{menu_catalogue}/permissions/{permission}', [MenuCatalogueController::class, 'detachPermission']);
        Route::delete('menu_catalogues/{menu_catalogue}/permissions', [MenuCatalogueController::class, 'bulkDetachPermission']);
        Route::post('menu_catalogues/{menu_catalogue}/permissions/{permission}', [MenuCatalogueController::class, 'attachPermission']);
        Route::resource('menu_catalogues', MenuCatalogueController::class)->except(['create', 'edit']);
    });
});


Route::group(['prefix' => 'v1'], function () {
    Route::middleware(['jwt:api', 'convertRequestKey', 'checkApiPermission'])->group(function () {
        Route::delete('menus/bulk', [MenuController::class, 'bulkDelete']);
        Route::delete('menus/{menu}/permissions/{permission}', [MenuController::class, 'detachPermission']);
        Route::delete('menus/{menu}/permissions', [MenuController::class, 'bulkDetachPermission']);
        Route::post('menus/{menu}/permissions/{permission}', [MenuController::class, 'attachPermission']);
        Route::resource('menus', MenuController::class)->except(['create', 'edit']);
    });
});
