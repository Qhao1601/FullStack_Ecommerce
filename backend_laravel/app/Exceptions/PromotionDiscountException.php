<?php

namespace App\Exceptions;

use Exception;

class PromotionDiscountException extends Exception
{
    /**
     * Render the exception into an HTTP response.
     *
     * @param \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function render($request)
    {
        return response()->json([
            'message' => 'Giảm giá không được lớn hơn giá trị giảm giá tối đa.'
        ], 400); // Trả về lỗi 400 (Bad Request)
    }
}
