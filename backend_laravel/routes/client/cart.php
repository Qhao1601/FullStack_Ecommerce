<?php

use Illuminate\Support\Facades\Route;
use  App\Http\Controllers\Api\V1\Cart\CartController;
use App\Http\Controllers\Api\V1\Payment\PaypalController;



Route::group(['prefix' => 'v1/cart'], function () {
    Route::middleware(['jwt:customers', 'convertRequestKey'])->group(function () {
        Route::get('/', [CartController::class, 'getCart'])->name('get');
        Route::post('/sync', [CartController::class, 'syncCart'])->name('sync');
        Route::post('/item', [CartController::class, 'addItem'])->name('add'); // thêm vào giỏ hàng (create)
        Route::put('/item/{clientId}', [CartController::class, 'updateItem'])->name('update');
        Route::delete('/item/{clientId}', [CartController::class, 'removeItem'])->name('remove');
        Route::delete('/clear}', [CartController::class, 'clear'])->name('clear');
        Route::post('/checkout', [CartController::class, 'checkout'])->name('checkout');
    });
});
Route::post('/paypal/execute', [PaypalController::class, 'execute'])->name('paypal.execute');
// Route::post('/paypal/cancel', [PaypalController::class, 'cancel'])->name('paypal.cancel');
