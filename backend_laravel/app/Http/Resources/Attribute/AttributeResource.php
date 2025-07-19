<?php

namespace App\Http\Resources\Attribute;

use App\Http\Resources\User\UserOnlyIdAndNameResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AttributeResource extends JsonResource
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
            'order' => $this->order,
            'publish' => $this->publish,
            'attributeCatalogueId' => $this->attribute_catalogue_id,
            'user_id' => new UserOnlyIdAndNameResource($this->whenLoaded('users')),
            'attributeCatalogue' => new AttributeCatalogueResource($this->whenLoaded('attribute_catalogues')),
        ];
    }
}
