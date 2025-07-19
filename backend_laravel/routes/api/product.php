<?php

use  App\Http\Controllers\Api\V1\Product\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\UserCatalogue;
use App\Http\Controllers\Api\V1\Product\ProductVariantController;



Route::group(['prefix' => 'v1'], function () {
    Route::middleware(['jwt:api', 'convertRequestKey', 'checkApiPermission'])->group(function () {
        Route::delete('products/bulk', [ProductController::class, 'bulkDelete']);
        Route::delete('products/{products}/permissions/{permission}', [ProductController::class, 'detachPermission']);
        Route::delete('products/{products}/permissions', [ProductController::class, 'bulkDetachPermission']);
        Route::post('products/{products}/permissions/{permission}', [ProductController::class, 'attachPermission']);
        Route::resource('products', ProductController::class)->except(['create', 'edit']);
    });
});


Route::group(['prefix' => 'v1'], function () {
    Route::middleware(['jwt:api', 'convertRequestKey', 'checkApiPermission'])->group(function () {
        Route::delete('product_variants/bulk', [ProductVariantController::class, 'bulkDelete']);
        Route::delete('product_variants/{product_variants}/permissions/{permission}', [ProductVariantController::class, 'detachPermission']);
        Route::delete('product_variants/{product_variants}/permissions', [ProductVariantController::class, 'bulkDetachPermission']);
        Route::post('product_variants/{product_variants}/permissions/{permission}', [ProductVariantController::class, 'attachPermission']);
        Route::resource('product_variants', ProductVariantController::class)->except(['create', 'edit']);
    });
});
