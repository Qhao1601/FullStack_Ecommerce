<?php

namespace App\Http\Resources\Product;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductCatalogueResource extends JsonResource
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
            'parentId' => $this->parent_id,
            'publish' => $this->publish,
            'image' => asset("storage/{$this->image}"),
            // 'album' => (is_array($this->album) && count($this->album)) ? array_map(function ($item) {
            //     return [
            //         'path' => $item['path'],
            //         'fullPath' => asset("storage/{$item['path']}"),
            //     ];
            // }, $this->album)  : [],

            'album' => (is_array($this->album) && count($this->album)) ? array_map(function ($item) {
                return [
                    'path' => $item['path'],
                    // 'fullPath' => asset("storage/{$item['path']}"),
                    'fullPath' => asset($item['path']),
                ];
            }, $this->album)  : [],
            'description' => $this->description,
            'content' => $this->content,
            'metaTitle' => $this->meta_title,
            'metaKeyword' => $this->meta_keyword,
            'metaDescription' => $this->meta_description,
            'level' => $this->level,
            'creator' => $this->whenLoaded('users', function () {
                return $this->users->name;
            })


        ];
    }
}
