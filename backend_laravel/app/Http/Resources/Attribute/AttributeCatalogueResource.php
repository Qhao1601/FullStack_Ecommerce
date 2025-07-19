<?php

namespace App\Http\Resources\Attribute;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\User\UserOnlyIdAndNameResource;
use App\Http\Resources\Attribute\AttributeResource;

class AttributeCatalogueResource extends JsonResource
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
            'dataType' => $this->data_type,
            'unit' => $this->unit,
            'publish' => $this->publish,
            'user_id' => new UserOnlyIdAndNameResource($this->users),
            'attribute' => AttributeResource::collection($this->whenLoaded('attributes'))
        ];
    }
}
