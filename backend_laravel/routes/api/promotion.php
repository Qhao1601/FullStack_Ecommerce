<?php

use  App\Http\Controllers\Api\V1\Promotion\PromotionCatalogueController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\UserCatalogue;
use App\Http\Controllers\Api\V1\Promotion\PromotionController;



Route::group(['prefix' => 'v1'], function () {
    Route::middleware(['jwt:api', 'convertRequestKey', 'checkApiPermission'])->group(function () {
        Route::delete('promotions/bulk', [PromotionController::class, 'bulkDelete']);
        Route::delete('promotions/{promotions}/permissions/{permission}', [PromotionController::class, 'detachPermission']);
        Route::delete('promotions/{promotions}/permissions', [PromotionController::class, 'bulkDetachPermission']);
        Route::post('promotions/{promotions}/permissions/{permission}', [PromotionController::class, 'attachPermission']);
        Route::resource('promotions', PromotionController::class)->except(['create', 'edit']);
    });
});


Route::group(['prefix' => 'v1'], function () {
    Route::middleware(['jwt:api', 'convertRequestKey', 'checkApiPermission'])->group(function () {
        Route::delete('promotion_catalogues/bulk', [PromotionCatalogueController::class, 'bulkDelete']);
        Route::delete('promotion_catalogues/{promotion_catalogues}/permissions/{permission}', [PromotionCatalogueController::class, 'detachPermission']);
        Route::delete('promotion_catalogues/{promotion_catalogues}/permissions', [PromotionCatalogueController::class, 'bulkDetachPermission']);
        Route::post('promotion_catalogues/{promotion_catalogues}/permissions/{permission}', [PromotionCatalogueController::class, 'attachPermission']);
        Route::resource('promotion_catalogues', PromotionCatalogueController::class)->except(['create', 'edit']);
    });
});
