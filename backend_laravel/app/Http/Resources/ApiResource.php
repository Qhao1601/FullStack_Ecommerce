<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use App\Enums\Config\ApiResponseKey;


class ApiResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return parent::toArray($request);
    }

    public static function ok(mixed $data = null, string $message = '', int $httpStatus = Response::HTTP_OK): JsonResponse
    {
        return response()->json([
            ApiResponseKey::STATUS => true,
            ApiResponseKey::CODE => $httpStatus,
            ApiResponseKey::DATA => $data,
            ApiResponseKey::MESSAGE => $message,
            ApiResponseKey::TIMESTAMP => now()
        ], Response::HTTP_OK);
    }


    public static function error(mixed $error = null, string $message = '', int $httpStatus = Response::HTTP_INTERNAL_SERVER_ERROR): JsonResponse
    {
        return response()->json([
            ApiResponseKey::STATUS => false,
            ApiResponseKey::CODE => $httpStatus,
            ApiResponseKey::ERRORS => $error,
            ApiResponseKey::MESSAGE => $message,
            ApiResponseKey::TIMESTAMP => now()
        ], $httpStatus);
    }

    public static function message(string $message = '', int $httpStatus = Response::HTTP_OK): JsonResponse
    {
        return response()->json([
            ApiResponseKey::STATUS => $httpStatus === Response::HTTP_OK,
            ApiResponseKey::CODE => $httpStatus,
            ApiResponseKey::MESSAGE => $message,
            ApiResponseKey::TIMESTAMP => now()

        ], $httpStatus);
    }
}
