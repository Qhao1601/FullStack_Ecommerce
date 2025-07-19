<?php

namespace App\Http\Resources\User;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserCatalogueResource extends JsonResource
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
            'publish' => (int)$this->publish,
            'user_id' => $this->user_id,
            'users' => UserResource::collection($this->whenLoaded('users')),
            'users_count' => $this->users_count,
            'permissions' => $this->whenLoaded('permissions', function () {
                return $this->permissions->pluck('id')->toArray();
            }, [])
        ];
    }
}
