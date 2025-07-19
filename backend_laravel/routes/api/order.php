<?php

use App\Http\Controllers\Api\V1\Order\OrderController;
use App\Http\Controllers\Api\V1\Order\OrderItemController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\UserCatalogue;



Route::group(['prefix' => 'v1'], function () {
    Route::middleware(['jwt:api', 'convertRequestKey', 'checkApiPermission'])->group(function () {
        Route::delete('orders/bulk', [OrderController::class, 'bulkDelete']);
        Route::delete('orders/{order}/permissions/{permission}', [OrderController::class, 'detachPermission']);
        Route::delete('orders/{order}/permissions', [OrderController::class, 'bulkDetachPermission']);
        Route::post('orders/{order}/permissions/{permission}', [OrderController::class, 'attachPermission']);
        Route::resource('orders', OrderController::class)->except(['create', 'edit']);
    });
});


Route::group(['prefix' => 'v1'], function () {
    Route::middleware(['jwt:api', 'convertRequestKey', 'checkApiPermission'])->group(function () {
        Route::delete('order_items/bulk', [OrderItemController::class, 'bulkDelete']);
        Route::delete('order_items/{order}/permissions/{permission}', [OrderItemController::class, 'detachPermission']);
        Route::delete('order_items/{order}/permissions', [OrderItemController::class, 'bulkDetachPermission']);
        Route::post('order_items/{order}/permissions/{permission}', [OrderItemController::class, 'attachPermission']);
        Route::resource('order_items', OrderItemController::class)->except(['create', 'edit']);
    });
});
