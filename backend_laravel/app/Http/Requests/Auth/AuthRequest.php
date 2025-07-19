<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use App\Http\Resources\ApiResource;
use Illuminate\Http\Response;

// use App\Http\Resources\ApiResource;
// use Illuminate\Http\Response;


class AuthRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email'=> 'required|email',
            'password' => 'required|min:6',
        ];
    }

    public function messages(): array {
        return [
            'email.required' => 'Bạn chưa nhập vào :attribute',
            'email.email' => ':attribute không đúng định dạng. ví dụ: abc@gmail.com',
            'password.min' => ':attribute phải có ít nhất :min ký tự'
        ];
    }
    public function attributes():array {
        return [
            'email' => 'Địa chỉ email',
            'password' => 'Mật khẩu',
        ];
    }

    public function failedValidation(Validator $validator)
    {
       
        $apiresource = ApiResource::error(
            $validator->errors(),
            'Validate dữ liệu không thành công',
            Response::HTTP_UNPROCESSABLE_ENTITY
        );
        
        throw new HttpResponseException($apiresource);
    }
    
}
