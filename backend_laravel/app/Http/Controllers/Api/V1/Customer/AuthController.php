<?php

namespace App\Http\Controllers\Api\V1\Customer;

use App\Enums\Config\Common;
use App\Http\Controllers\Controller;
use App\Services\Interfaces\Auth\AuthServiceInterface as AuthService;
use App\Http\Requests\Auth\AuthRequest;
use App\Http\Resources\ApiResource;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\Customer\StoreRequest;


class AuthController extends Controller
{
    protected $authService;
    private const GUARD = 'customers';

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function authenticate(AuthRequest $request): JsonResponse
    {
        $response  = $this->authService->auth($request, self::GUARD);
        return ApiResource::ok($response['data'], Common::SUCCESS);
    }


    public function logout()
    {
        $response = $this->authService->singout(self::GUARD);
        return ApiResource::ok("Đăng xuất thành công");
    }

    public function register(StoreRequest $request)
    {
        $response = $this->authService->register($request);
        return ApiResource::ok($response, Common::SUCCESS);
    }
}
