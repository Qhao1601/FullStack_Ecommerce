<?php

namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use App\Http\Resources\ApiResource;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Http;

// use App\Http\Resources\ApiResource;
// use Illuminate\Http\Response;


class BaseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function failedValidation(Validator $validator){
        $apiResource = ApiResource::error($validator->errors(), 'Validate dữ liệu không thành công', Response::HTTP_UNPROCESSABLE_ENTITY);
        throw new HttpResponseException($apiResource);
    }
 

}
