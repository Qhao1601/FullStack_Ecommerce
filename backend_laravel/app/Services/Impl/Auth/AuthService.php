<?php

namespace App\Services\Impl\Auth;

use App\Enums\Config\Common;
use App\Enums\Config\ApiResponseKey;
use Illuminate\Auth\AuthenticationException;
use App\Services\Interfaces\Auth\AuthServiceInterface;
use Illuminate\Support\Facades\Lang;
use Tymon\JWTAuth\Exceptions\UserNotDefinedException;
use Illuminate\Support\Str;
use App\Repositories\Auth\RefreshTokenRepository;
use RuntimeException;
use Illuminate\Support\Facades\Cookie;
use App\Repositories\User\UserReponsitory;
use Illuminate\Support\Facades\DB;
use App\Exceptions\SecurityException;
use App\Models\RefreshToken;
use Illuminate\Support\Facades\Log;
use App\Http\Resources\User\UserResource;
use App\Http\Resources\Customer\CustomerResource;
use App\Services\Interfaces\Customer\CustomerServiceInterface as CustomerService;


class AuthService implements AuthServiceInterface
{
    protected $auth;
    protected $refreshTokenRepository;
    protected $userReponsitory;
    protected $customerService;

    // set thời gian token
    private const TOKEN_TTL = 60;
    private const ACCSESS_TOKEN_AFTER_REFRESH_TIME_TO_LIVE = 60;
    private const REFRESH_TOKEN_TTL = 7;
    public function __construct(
        RefreshTokenRepository $refreshTokenRepository,
        UserReponsitory $userReponsitory,
        CustomerService $customerService
    ) {
        /**
         * @var \Tymon\JWTAuth\JWTGuard
         */
        $this->auth = auth(Common::API);
        $this->refreshTokenRepository = $refreshTokenRepository;
        $this->userReponsitory = $userReponsitory;
        $this->customerService = $customerService;
    }

    private function switchAuth(string $guard = '')
    {
        //Guard rỗng mặc định lấy guard = web
        if (!empty($guard)) {
            $this->auth = auth($guard);
        }
    }

    public function auth($request, ?string $guard = Common::API): array
    {
        // dd($guard);
        $this->switchAuth($guard);

        $token = $this->attemplogin($request, $guard);
        if ($guard === Common::API) {
            $refresh = $this->createRefreshToken();
        }
        return $guard === Common::API ? $this->authResponse($token, $refresh) : $this->authCustomerResponse($token);
    }

    private function attemplogin($request, string $guard = ''): string
    {

        $credentials = [
            'email' => $request->string('email'),
            'password' => $request->string('password')
        ];
        $this->auth->setTTL(self::TOKEN_TTL);
        // sử dụng thư viện tymon/jwt-auth khi email password đúng thì trả JWT token 
        $this->auth->claims(['guard' => $guard]);
        if (!$token = $this->auth->attempt($credentials)) {
            throw new AuthenticationException(Lang::get('auth.failed'));
        }
        return $token;
    }
    // đồng thời tạo accesstoken thì cũng tạo refreshtoken lun
    private function createRefreshToken(): string
    {
        $payload = [
            'refresh_token' => Str::uuid(),
            'expires_at' => now()->addDay(self::REFRESH_TOKEN_TTL),
            'user_id' => $this->auth->user()->id,
        ];
        if (!$result = $this->refreshTokenRepository->create($payload)) {
            throw new RuntimeException(Lang::get('auth.refresh_token_failed'));
        }
        return $result->refresh_token;
    }

    private function authCustomerResponse(string $token = '')
    {
        return [
            'data' => [
                ApiResponseKey::TOKEN => $token,
                ApiResponseKey::TOKEN_TYPE => Common::BEARER,
                ApiResponseKey::EXPIRE_IN => $this->auth->factory()->getTTL() * 60,
                ApiResponseKey::USER => new CustomerResource($this->auth->user())
            ],
        ];
    }


    // sau đó lưu tất cả token và refreshtoken vào cookie
    private function authResponse(string $token = '', string $refreshToken = ''): array
    {
        $user = $this->userReponsitory->findById($this->auth->user()->id, ['user_catalogues.permissions']);
        return [
            'data' => [
                ApiResponseKey::TOKEN => $token,
                ApiResponseKey::TOKEN_TYPE => Common::BEARER,
                ApiResponseKey::EXPIRE_IN => $this->auth->factory()->getTTL() * 60,
                ApiResponseKey::USER => new UserResource($user)
            ],
            'authCookie' => Cookie::make('refresh_token', $refreshToken, self::REFRESH_TOKEN_TTL * 24 * 60, '/', null, false, true, false, 'Lax'),
        ];
    }

    public function me()
    {
        $user = $this->auth->user();
        if (!$user) {
            throw new UserNotDefinedException(Lang::get('auth.notfound'));
        }
        return $user;
    }

    public function singout(string $guard = '')
    {
        $this->switchAuth($guard);
        $this->auth->invalidate(true);
        $this->auth->logout();
        Log::info('lổi đăng xuất');
    }

    public function refreshToken(string $refreshToken = '')
    {
        DB::beginTransaction();
        try {
            $refreshTokenRecord = $this->refreshTokenRepository->findValidRefreshToken($refreshToken);
            if (!$refreshTokenRecord) {
                throw new AuthenticationException("Refresh Token không hợp lệ");
            }

            if ($this->checkTokenReuse($refreshTokenRecord)) {
                $this->refreshTokenRepository->revokeAllUserRefreshToken($refreshTokenRecord->user_id);
                DB::commit();
                throw new SecurityException("Phát hiện token đang được sử dụng lại");
            }

            $refreshTokenRecord->update(['was_used' => true]);
            $user = $this->userReponsitory->findById($refreshTokenRecord->user_id);

            $this->auth->setTTL(self::ACCSESS_TOKEN_AFTER_REFRESH_TIME_TO_LIVE);
            $this->auth->claims(['guard' => Common::API]);
            $token = $this->auth->login($user);
            $newRefresh = $this->createRefreshToken();
            DB::commit();
            return $this->authResponse($token, $newRefresh);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    private function checkTokenReuse(RefreshToken $refreshTokenRecord)
    {
        if ($refreshTokenRecord->was_used || $refreshTokenRecord->is_revoked) {
            Log::warning('Phát hiện token đang sử dụng lại', [
                'token' => $refreshTokenRecord->refresh_token,
                'user_id' => $refreshTokenRecord->user_id,
                'ip' => request()->id()
            ]);
            return true;
        }
        return false;
    }

    public function register($request)
    {
        $reponse = $this->customerService->save($request);
        return $reponse;
    }
}
