<?php

namespace App\Http\Resources\User;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PermissionResource extends JsonResource
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
            'module' => $this->module,
            'value' => $this->value,
            'title' => $this->title,
            'description' => $this->description ?? "",
            'publish' => $this->publish,
            'createAt' => $this->created_at,
            'userId' => $this->user_id,
        ];
    }
}
