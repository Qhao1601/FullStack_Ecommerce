<?php

namespace App\Http\Controllers\Api\V1\Payment;

use App\Http\Controllers\Api\V1\BaseController;
use App\Http\Resources\ApiResource;
use Illuminate\Http\Request;
use App\Services\Public\PayPalService;


class PaypalController extends BaseController
{

    protected $service;
    public function __construct(PayPalService $service)
    {
        $this->service = $service;
    }


    public function execute(Request $request)
    {
        $response = $this->service->captureOrder($request);
        return ApiResource::ok($response, 'success');
    }

    public function cancel() {}
}
