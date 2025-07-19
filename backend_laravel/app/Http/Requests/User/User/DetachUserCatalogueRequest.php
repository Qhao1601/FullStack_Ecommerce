<?php

namespace App\Http\Requests\User\User;
use App\Http\Requests\BaseRequest;
use Illuminate\Foundation\Http\FormRequest;

class DetachUserCatalogueRequest extends BaseRequest
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
            'user_id' => 'required|exists:users,id',
            'user_catalogue_id' => 'required|exists:user_catalogues,id'
        ];
    }


    protected function prepareForValidation(){
        $this->merge([
            'user_id' => $this->route('user'),
            'user_catalogue_id' => $this->route('user_catalogue')
        ]);
    }
}
