<?php 

namespace App\Exceptions;
use Exception;

class SecurityException extends Exception{
    public function __construct(string $message = "Phát hiện vấn đề về bảo mật", $code = 403)
    {
        parent::__construct($message,$code);
    }
}