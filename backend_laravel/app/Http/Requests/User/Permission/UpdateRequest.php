<?php

namespace App\Http\Requests\User\Permission;

use Illuminate\Foundation\Http\FormRequest;
use App\Http\Requests\BaseRequest;
use App\Models\Permission;
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
            'id' => 'sometimes|required|exists:permissions,id',
            'name' => [
                'sometimes',
                'required',
                'string',
                'regex:/^[a-z_]+:[a-zA-Z]+$/', // module:action
                Rule::unique('permissions')->ignore($this->route('permission'))
            ],
            'module' => [
                'sometimes',
                'required',
                'string',
            ],
            'value' => [
                'sometimes',
                'required',
                // function ($attribute,$value,$fail){
                //     $exists = Permission::isvalueExists($this->module,$this->value,$this->route('permisson'));
                //     if($exists){
                //         $fail("cặp giá trị module và value không hợp lệ");
                //     }
                // }
                function ($attribute, $value, $fail) {
                    $exists = DB::table('permissions')->where('module', $this->module)->where('value', $this->value)
                        ->where('id', '<>', $this->route('permission'))->exists();
                    if ($exists) {
                        $fail("Cặp giá trị module và value không hợp lệ");
                    }
                }
            ],

            'title' => 'sometimes|string|required',
            'user_id' => 'sometimes|required|exists:users,id',
        ];
    }


    protected function prepareForValidation()
    {
        $this->merge([
            'id' => $this->route('permission')
        ]);
    }


    // này viết trong model luôn(demo)
    // public static function isvalueExists($module,$value,$excludeId){
    //     return self::where('module',$module)
    //     ->where('value',$value)
    //     ->where('id','<>', $excludeId)
    //     ->exists();
    // }
}
