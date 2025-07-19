<?php

namespace App\Http\Requests\User\UserCatalogue;

use Illuminate\Foundation\Http\FormRequest;
use App\Http\Requests\BaseRequest;

class DeleteBulkRequest extends BaseRequest
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
            'ids' => 'required|array|min:1',
            'ids.*' => 'required|integer|exists:user_catalogues,id',
        ];
    }

    public function messages(){
        return [
            'ids.required' => 'Danh sách :attribute là bắt buộc',
            'ids.array' => 'Danh sách :attribute phải là mảng',
            'ids.min' => 'Phải chọn ít nhất :min bản ghi',
            'ids.*.required' => 'ID trong danh sách không được để trống',
            'ids.*.integer' => 'ID trong danh sách phải là số nguyên',
            'ids.*.exists' => 'Một số bản ghi không tồn tại trong hệ thống'
        ];
    }

    public function attributes(){
        return [
            'ids' => 'Bản ghi',
            'ids.*' => 'Bản ghi',
        ];
    }
}
