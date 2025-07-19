<?php

namespace App\Http\Requests\User\UserCatalogue;

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
            'id' => 'sometimes|required|exists:user_catalogues,id',
            'name' => 'sometimes|string|required',
            'canonical' => [
                'sometimes',
                'string',
                'required',
                Rule::unique('user_catalogues')->ignore($this->route('user_catalogue'))
            ],
            'publish' => 'sometimes|required',
            'user_id' => 'sometimes|required|exists:users,id'
        ];
    }

    public function messages()
    {
        return [
            'id.exists' => ':attribute không hợp lệ',
            'name.string' => 'Kiểu dữ liệu của ::attribute không hợp lệ',
            'name.required' => ':attribute không được để trống',
            'canonical.string' => 'Kiểu dữ liệu của :attribute không hợp lệ',
            'canonical.required' => ':attribute không được để trống',
            'canonical.unique' => ':attribute không được trùng',
            'publish.required' => ':attribute không hợp lệ',
            'user_id.required' => ':attribute không hợp lệ',
            'user_id.exists' => ':attribute không tồn tại trong hệ thống'

        ];
    }

    public function attributes()
    {
        return [
            'id' => 'Mã nhóm',
            'name' => 'Tên nhóm',
            'canonical' => 'Canonical',
            'publish' => 'Trạng thái',
            'user_id' => 'Mã bản ghi'
        ];
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'id' => $this->route('user_catalogue')
        ]);
    }
}
