<?php

namespace App\Http\Requests\User\User;

use Illuminate\Foundation\Http\FormRequest;
use App\Http\Requests\BaseRequest;

class StoreRequest extends BaseRequest
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
            'name' => 'string|required',
            'email' =>  'string|required|email',
            'password' => 'string|required|min:6',
            'phone' => 'string|required|unique:users,phone',
            'image' => 'sometimes|file|max:' . config('upload.image.max_size') . '|mimes:' . implode(',', config('upload.image.allowed_mime_types')),
            // 'publish' => 'required',
            'user_id' => 'required|exists:users,id',
            // xử lý nếu thêm vào user_catalogue_user mà id không có trong db thì sẽ báo lổi
            'user_catalogues' => 'required|array',
            'user_catalogues.*' => 'required|integer|exists:user_catalogues,id'
        ];
    }
}
