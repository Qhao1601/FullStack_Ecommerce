<?php

namespace App\Http\Resources\Brand;

use App\Http\Resources\User\UserOnlyIdAndNameResource;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BrandResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'publish' => $this->publish,
            'user_id' => new UserOnlyIdAndNameResource($this->users),
            'createdAt' => Carbon::parse($this->created_at)->format('d-m-y'),
        ];
    }
}
