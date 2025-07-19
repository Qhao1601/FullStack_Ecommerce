<?php

namespace App\Http\Requests\User\Permission;

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
            'name' => 'string|required|regex:/^[a-z_]+:[a-zA-Z]+$/|unique:permissions,id',
            'module' =>  'string|required',
            'value' => 'required',
            'title' => 'string|required',
            'user_id' => 'required|exists:users,id',
        ];
    }
}
