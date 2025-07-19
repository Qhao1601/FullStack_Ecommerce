<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\AuthRequest;
use App\Http\Resources\ApiResource;
use App\Http\Resources\User\UserResource;
use Illuminate\Http\Request;
use App\Services\Interfaces\Auth\AuthServiceInterface as AuthService;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Response;
use App\Enums\Config\Common;
use App\Enums\Config\ApiResponseKey;
use App\Traits\Loggable;

use Illuminate\Http\JsonResponse;
use App\Exceptions\SecurityException;

class AuthController extends Controller
{

    use Loggable;
    private $authService;

    private const AUTH_COOKIE = 'refresh_token';


    public function __construct(
        AuthService $authService,
    ) {
        $this->authService = $authService;
    }

    public function authenticate(AuthRequest $request): JsonResponse
    {
        try {
            $response = $this->authService->auth($request);
            return ApiResource::ok($response['data'], Common::SUCCESS)->withCookie($response['authCookie']);
        } catch (AuthenticationException $e) {
            return ApiResource::message($e->getMessage(), Response::HTTP_UNAUTHORIZED);
        } catch (\Exception $e) {
            return $this->handleLogException($e);
        }
    }

    public function me(): JsonResponse
    {
        try {
            $auth = $this->authService->me();
            $userResource = new UserResource($auth);

            return ApiResource::ok([ApiResponseKey::USER => $userResource], Common::SUCCESS);
        } catch (AuthenticationException $e) {
            return ApiResource::message($e->getMessage(), Response::HTTP_NOT_FOUND);
        } catch (\Exception $e) {
            return $this->handleLogException($e);
        }
    }

    public function logout(): JsonResponse
    {
        try {
            $this->authService->singout();
            return ApiResource::message(Common::SUCCESS, Response::HTTP_OK);
        } catch (\Exception $e) {
            return $this->handleLogException($e);
        }
    }
    public function refresh(Request $request): JsonResponse
    {
        try {
            $refreshToken = $request->cookie(self::AUTH_COOKIE) ?? '';
            $response = $this->authService->refreshToken($refreshToken);
            return ApiResource::ok($response['data'], Common::SUCCESS)->withCookie($response['authCookie']);
        } catch (SecurityException $e) {
            return ApiResource::message($e->getMessage(), Response::HTTP_FORBIDDEN);
        } catch (AuthenticationException $e) {
            return ApiResource::message($e->getMessage(), Response::HTTP_FORBIDDEN);
        } catch (\Exception $e) {
            return $this->handleLogException($e);
        }
    }
}
