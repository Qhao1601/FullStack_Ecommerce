<?php

use App\Exceptions\RecordExistsException;
use App\Http\Middleware\CheckApiPermission;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\Jwt;
use App\Http\Middleware\ConvertCamelCaseToSnackeCase;
use App\Http\Resources\ApiResource;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\RecordNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: [
            __DIR__ . '/../routes/api.php',
            __DIR__ . '/../routes/api/post_catalogue.php',
            __DIR__ . '/../routes/api/post.php',
            __DIR__ . '/../routes/api/brand.php',
            __DIR__ . '/../routes/api/attribute_catalogue.php',
            __DIR__ . '/../routes/api/attribute.php',
            __DIR__ . '/../routes/api/product_catalogue.php',
            __DIR__ . '/../routes/api/product.php',
            __DIR__ . '/../routes/api/slides.php',
            __DIR__ . '/../routes/api/promotion.php',
            __DIR__ . '/../routes/api/menu_catalogue.php',
            __DIR__ . '/../routes/api/order.php',
            __DIR__ . '/../routes/client/customer.php',
            __DIR__ . '/../routes/client/cart.php',

        ],
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'jwt' => Jwt::class,
            'convertRequestKey' => ConvertCamelCaseToSnackeCase::class,
            'checkApiPermission' => CheckApiPermission::class
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // xử lý trường hợp khi code sai lổi sai và sẽ rơi những trường hợp này 


        $exceptions->render(function (ConflictHttpException $e, Request $request) {
            return ApiResource::message($e->getMessage(), Response::HTTP_CONFLICT);
        });

        $exceptions->render(function (RecordExistsException $e, Request $request) {
            return ApiResource::message($e->getMessage(), Response::HTTP_BAD_REQUEST);
        });

        $exceptions->render(function (NotFoundHttpException $e, Request $request) {
            return ApiResource::message($e->getMessage(), Response::HTTP_NOT_FOUND);
        });

        $exceptions->render(function (\Throwable $th, Request $request) {
            return ApiResource::message($th->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        });
    })->create();
