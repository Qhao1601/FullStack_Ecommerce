<?php

namespace App\Http\Requests\Brand\Brand;

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
        $patchRules = $this->getMethod() === 'PATCH' ? 'sometimes' : '';

        return [
            // 'id' => 'string|exists:brands|' . $patchRules,
            // 'name' => 'string|required' . $patchRules,
            // 'publish' => 'integer|required' . $patchRules,
            // 'user_id' => 'required|exists:users,id' . $patchRules,
        ];
    }

    protected function perpareForValidation()
    {
        $this->merge([
            'id' => $this->route('brand')
        ]);
    }
}
