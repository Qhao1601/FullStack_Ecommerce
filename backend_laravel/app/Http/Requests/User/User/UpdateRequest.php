<?php

namespace App\Http\Requests\User\User;

use Illuminate\Foundation\Http\FormRequest;
use App\Http\Requests\BaseRequest;
use Illuminate\Validation\Rule;

class UpdateRequest extends BaseRequest
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
            'id' => 'sometimes|required|exists:users,id',
            'name' => 'sometimes|string|required',
            'email' => [
                'sometimes',
                'string',
                'required',
                Rule::unique('users')->ignore($this->route('user'))
            ],
            'phone' => [
                'sometimes',
                'string',
                'required',
                Rule::unique('users')->ignore($this->route('user'))
            ],
            'publish' => 'sometimes|required',
            'user_id' => 'sometimes|required|exists:users,id',
            'user_catalogues' => 'sometimes|required|array',
            'user_catalogues.*' => 'sometimes|required|integer|exists:user_catalogues,id'
        ];
    }


    protected function prepareForValidation()
    {
        $this->merge([
            'id' => $this->route('user')
        ]);
    }
}
