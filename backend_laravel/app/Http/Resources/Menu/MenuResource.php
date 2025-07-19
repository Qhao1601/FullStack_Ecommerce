<?php

namespace App\Http\Resources\Menu;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MenuResource extends JsonResource
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
            'parentId' => $this->parent_id,
            'canonical' => $this->canonical !== '/' ? config('app.url') . '/' . $this->canonical . '.html' : '.',
            'children' => $this->when(
                $this->children && $this->children->count() > 0,
                MenuResource::collection($this->children)
            ),

        ];
    }
}
