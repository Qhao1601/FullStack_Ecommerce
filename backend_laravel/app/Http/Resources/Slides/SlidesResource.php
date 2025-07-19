<?php

namespace App\Http\Resources\Slides;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SlidesResource extends JsonResource
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
            'keyword' => $this->keyword,
            'description' => $this->description,
            'item' => (is_array($this->item) && count($this->item)) ?  array_map(function ($item) {
                return [
                    'image' => $item['image'],
                    'description' => $item['description'],
                    'fullPath' => asset("storage/{$item['image']}") // trả về link đầy đủ

                ];
            }, $this->item) : [],
            'setting' => $this->setting,
            'short_code' => $this->short_code,
            'publish' => $this->publish
        ];
    }
}
