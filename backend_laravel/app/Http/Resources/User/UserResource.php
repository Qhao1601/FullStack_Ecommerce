<?php

namespace App\Http\Resources\User;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'email' => $this->email,
            'phone' => $this->phone,
            'birthday' => $this->birthday,
            'image' => asset('storage/' . $this->image),
            'publish' => $this->publish,
            'address' => $this->address,
            'userCatalogues' => $this->whenLoaded('user_catalogues', function () {
                return $this->user_catalogues->pluck('id')->toArray();
            }, []),
            'permissions' => $this->whenLoaded('user_catalogues', function () {
                return $this->user_catalogues->flatmap(function ($userCatalogue) {
                    return $userCatalogue->permissions->pluck('name')->toArray();
                });
            }, [])
        ];
    }
}
