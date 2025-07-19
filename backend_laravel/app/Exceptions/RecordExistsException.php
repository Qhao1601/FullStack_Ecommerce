<?php

namespace App\Exceptions;

use Exception;

class RecordExistsException extends Exception
{
    public function __construct(string $message = "", $code = 403)
    {
        parent::__construct($message, $code);
    }
}
