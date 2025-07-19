<?php

namespace App\Http\Requests\User\UserCatalogue;

use Illuminate\Foundation\Http\FormRequest;
use App\Http\Requests\BaseRequest;


class BulkDetachPermissionRequest extends BaseRequest
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

            'user_catalogue_id' => 'required|exists:user_catalogues,id',
            'ids' => 'required|array|min:1',
            'ids.*' => 'required|integer|exists:permissions,id',
        ];
    }
    protected function prepareForValidation(){
        $this->merge([
            'user_catalogue_id' => $this->route('user_catalogue'),
            
        ]);
    }
}
