<?php

namespace App\Http\Requests\Promotion\Promotion;

use Illuminate\Foundation\Http\FormRequest;
use App\Http\Requests\BaseRequest;
use Illuminate\Validation\Rule;


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
        // return [

        //     'user_id' => 'required|exists:users,id',
        // ];
        return [
            'name' => 'required|string|min:1',
            'code' => [
                'required',
                'string',
                'min:1', // Bạn có thể thay đổi điều kiện này tùy vào yêu cầu
                Rule::unique('promotions')->ignore($this->route('promotion')) // Kiểm tra trùng mã khuyến mãi
            ],
            'description' => 'nullable|string',
            'promotion_catalogue_id' => 'required|integer',


        ];
    }
}
