<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\Customer\AuthController;

Route::group(['prefix' => 'v1/customer/auth'], function () {
    Route::post('authenticate', [AuthController::class, 'authenticate']);
    Route::post('register', [AuthController::class, 'register']);

    Route::middleware(['jwt:customers'])->group(function () {
        // Route::get('me', [AuthController::class, 'me']);
        Route::post('logout', [AuthController::class, 'logout']);
    });
});
