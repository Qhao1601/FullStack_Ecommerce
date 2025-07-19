<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\Image\ImageController;
use App\Http\Controllers\Api\V1\Menu\MenuController;

use App\Http\Controllers\Api\V1\User\UserCatalogueController;
use App\Http\Controllers\Api\V1\User\UserController;
use App\Http\Controllers\Api\V1\User\PermissionController;
use App\Http\Controllers\Api\V1\Post\PostController;

use App\Http\Controllers\Api\V1\Product\ProductCatalogueController;
use App\Http\Controllers\Api\V1\Post\PostCatalogueController;
use App\Http\Controllers\Api\V1\Public\ProductController as PublicProductController;
use App\Http\Controllers\Api\V1\Public\PostController as PublicPostController;

Route::group(['prefix' => 'v1/auth'], function () {
    Route::post('authenticate', [AuthController::class, 'authenticate']);
    Route::post('refresh-token', [AuthController::class, 'refresh']);

    Route::middleware(['jwt:api'])->group(function () {
        Route::get('me', [AuthController::class, 'me']);
        Route::post('logout', [AuthController::class, 'logout']);
    });
});


Route::group(['prefix' => 'v1'], function () {
    Route::middleware(['jwt:api', 'convertRequestKey', 'checkApiPermission'])->group(function () {
        Route::delete('user_catalogues/bulk', [UserCatalogueController::class, 'bulkDelete']);
        Route::delete('user_catalogues/{user_catalogue}/permissions/{permission}', [UserCatalogueController::class, 'detachPermission']);
        Route::delete('user_catalogues/{user_catalogue}/permissions', [UserCatalogueController::class, 'bulkDetachPermission']);
        Route::post('user_catalogues/{user_catalogue}/permissions/{permission}', [UserCatalogueController::class, 'attachPermission']);

        Route::resource('user_catalogues', UserCatalogueController::class)->except(['create', 'edit']);


        //route USER
        Route::delete('users/bulk', [UserController::class, 'bulkDelete']);
        Route::delete('users/{user}/user_catalogues/{user_catalogue}', [UserController::class, 'detachUserCatalogues']);
        Route::resource('users', UserController::class)->except(['create', 'edit']);

        //route permisstions
        Route::delete('permissions/bulk', [PermissionController::class, 'bulkDelete']);

        Route::resource('permissions', PermissionController::class)->except(['create', 'edit']);

        route::post('upload_temp', [ImageController::class, 'uploadTemp']);
    });
});


Route::group(
    ['prefix' => 'v1/public'],
    function () {
        Route::get('product_catalogues', [ProductCatalogueController::class, 'index']);
        Route::get('product_catalogues/get_category_home', [ProductCatalogueController::class, 'getCategoryHome']);
        Route::get('product_catalogues/{id}', [ProductCatalogueController::class, 'show']);

        Route::get('menus', [MenuController::class, 'index']);
        // lọc sản phẩm theo nhóm danh mục và phân trang
        Route::get('products', [PublicProductController::class, 'index']);
        // lấy dữ liệu chi tiết sản phẩm 
        Route::get('products/{id}', [PublicProductController::class, 'show']);


        Route::get('post_catalogues/get_post_home', [PostCatalogueController::class, 'getPostHome']);
        Route::get('post_catalogues/{id}', [PostCatalogueController::class, 'show']);
        Route::get('posts/{id}', [PostController::class, 'show']);
        Route::get('posts', [PublicPostController::class, 'index']);
    }
);
// Route::group(['prefix' => 'v1'], function () {
//     Route::middleware(['jwt:api', 'convertRequestKey', 'checkApiPermission'])->group(function () {
//         Route::delete('posts/bulk', [PostController::class, 'bulkDelete']);
//         Route::delete('posts/{posts}/permissions/{permission}', [PostController::class, 'detachPermission']);
//         Route::delete('posts/{posts}/permissions', [PostController::class, 'bulkDetachPermission']);
//         Route::post('posts/{posts}/permissions/{permission}', [PostController::class, 'attachPermission']);
//         Route::resource('posts', PostController::class)->except(['create', 'edit']);
//     });
// });



/**
 * 1 GET /user_catalogues index đọc dữ liệu
 * 2 POST /user_catalogues store:
 * 3 GET /user_catalogues/{id} - show đọc dữ liệu của 1 bản ghi  dựa vào id 
 * 4 PUT /user_catalogues/{id} - update cập nhật
 * 5 DELETE /user_catalogues/{id} -destroy
 */
