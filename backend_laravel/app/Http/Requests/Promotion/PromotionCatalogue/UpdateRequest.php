<?php

namespace App\Http\Requests\Promotion\PromotionCatalogue;

use Illuminate\Foundation\Http\FormRequest;
use App\Http\Requests\BaseRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

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


     // sometimes này dùng để kiểm tra những dữ liệu gửi lên (phù hợp với updat PATH ) chỉ update 1 trường
    public function rules(): array
    {
        return [
            
         
            'user_id' => 'sometimes|required|exists:users,id',
        ];
    }


    protected function prepareForValidation(){
        $this->merge([
            'id' => $this->route('')
        ]);
    }

}
