<?php

namespace App\Enums\Config;

enum ApiResponseKey: string
{
    public const STATUS = 'status';
    public const CODE = 'code';
    public const DATA = 'data';
    public const MESSAGE = 'message';
    public const ERRORS = 'errors';
    public const TIMESTAMP = 'timestamp';
    public const TOKEN = 'accessToken';
    public const REFRESH_TOKEN = 'refreshToken';
    public const TOKEN_TYPE = 'tokenType';
    public const EXPIRE_IN = 'expiresAt';
    public const REFRESH_EXPIRE_IN = 'expiresAt';
    public const USER = 'user';
    public const USER_ID = 'user_id';
}
