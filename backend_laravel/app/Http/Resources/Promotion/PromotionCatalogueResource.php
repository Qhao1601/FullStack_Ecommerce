<?php

namespace App\Http\Resources\Promotion;

use App\Http\Resources\User\UserOnlyIdAndNameResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;


class PromotionCatalogueResource extends JsonResource
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
            'canonical' => $this->canonical,
            'publish' => $this->publish,
            'user_id' => new UserOnlyIdAndNameResource($this->users)
        ];
    }
}
