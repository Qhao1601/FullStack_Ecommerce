<?php

namespace App\Http\Requests\User\UserCatalogue;

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
            'canonical' =>  'string|required|unique:user_catalogues',
            'user_id' => 'required|exists:users,id',
            // 'permissions' => 'required|array',
            // 'permissions.*' => 'required|integer|exists:permissions,id'
        ];
    }


    public function attributes()
    {
        return [
            'name' => 'Tên nhóm',
            'canonical' => 'Canonical',
            'user_id' => 'Mã user'
        ];
    }
}
