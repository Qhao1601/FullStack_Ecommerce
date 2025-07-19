<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Http\Resources\ApiResource;
use App\Enums\Config\ApiResponseKey;
use App\Enums\Config\Common;
use App\Traits\Loggable;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Illuminate\Support\Facades\Lang;
use Tymon\JWTAuth\Facades\JWTAuth;

class Jwt
{
    use Loggable;
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $guard): Response
    {
        try {
            if (!$request->hasHeader('Authorization')) {
                return ApiResource::message(Lang::get('auth.authorization_notfound'), Response::HTTP_NOT_FOUND);
            }
            $payload = JWTAuth::parseToken()->getPayload();
            if ($payload->get('guard') !== $guard) {
                return ApiResource::message(Lang::get('auth.token_invalid'), Response::HTTP_UNAUTHORIZED);
            }
            $user = JWTAuth::parseToken()->authenticate();
            // token hết hạn
        } catch (TokenExpiredException $e) {
            return ApiResource::message(Lang::get('auth.token_expired'), Response::HTTP_UNAUTHORIZED);
        }
        // validate token k hợp lệ
        catch (TokenInvalidException $e) {
            return ApiResource::message(Lang::get('auth.token_invalid'), Response::HTTP_UNAUTHORIZED);
        } catch (\Exception $e) {
            $this->logError($e);
            return ApiResource::message(Common::NETWORK_ERROR, Response::HTTP_INTERNAL_SERVER_ERROR);
        }
        return $next($request);
    }
}
