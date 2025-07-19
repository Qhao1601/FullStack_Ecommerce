<?php

namespace App\Http\Controllers\Api\V1\Cart;

use App\Http\Resources\ApiResource;
use Illuminate\Http\Request;
use App\Services\Public\CartService;
use Illuminate\Http\JsonResponse;

class CartController
{
    protected $service;

    public function __construct(CartService $service)
    {
        $this->service = $service;
    }

    public function addItem(Request $request)
    {
        $response = $this->service->addItem($request);
        return ApiResource::ok($response, 'success');
    }

    public function syncCart(Request $request): JsonResponse
    {
        $response = $this->service->sync($request);
        return ApiResource::ok($response, 'success');
    }

    public function getCart(Request $request): JsonResponse
    {
        $response = $this->service->getCart($request);
        return ApiResource::ok($response, 'success');
    }

    public function updateItem(Request $request): JsonResponse
    {
        $response = $this->service->updateItem($request);
        return ApiResource::ok($response, 'success');
    }

    public function removeItem(Request $request): JsonResponse
    {
        $response = $this->service->removeItem($request);
        return ApiResource::ok($response, 'success');
    }

    public function checkout(Request $request): JsonResponse
    {
        $response = $this->service->checkout($request);
        return ApiResource::ok($response, 'success');
    }
}
