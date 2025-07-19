<?php

namespace App\Services\Interfaces\Auth;

interface AuthServiceInterface
{
    public function auth($request): array;
    public function me();
    public function singout();
    public function refreshToken();
    public function register($request);
}
