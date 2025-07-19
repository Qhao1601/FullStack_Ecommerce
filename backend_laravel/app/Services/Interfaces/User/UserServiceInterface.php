<?php

namespace App\Services\Interfaces\User;
use App\Services\Interfaces\BaseServiceInterface;

interface UserServiceInterface extends BaseServiceInterface  {
    public function detactUserCatalogueFromUser(int $user_id = 0, int $user_catalogue_id = 0): void;
}