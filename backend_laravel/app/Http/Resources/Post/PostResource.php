<?php

namespace App\Http\Resources\Post;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

class PostResource extends JsonResource
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
            'description' => $this->description,
            'content' => $this->content,
            'metaTitle' => $this->meta_title,
            'metaKeyword' => $this->meta_keyword,
            'metaDescription' => $this->meta_description,
            'user_id' => $this->user_id,
            'image' => asset("storage/{$this->image}"),
            'album' => (is_array($this->album) && count($this->album)) ?  array_map(function ($item) {
                return [
                    'path' => $item['path'],
                    'fullPath' => asset("storage/{$item['path']}")
                ];
            }, $this->album)   : [],
            'postCatalogueId' => $this->post_catalogue_id,
            'postCatalogues' => $this->whenLoaded('post_catalogues', function () { // lấy ra mảng của bài viết thuốc nhóm bài viết đó 
                return $this->post_catalogues->pluck('id')->toArray();
            }, []),
            // trả ra danh sách postCatalogue
            'postCatalogue' => $this->whenLoaded('post_catalogues', function () {
                return new PostCatalogueResource($this->post_catalogues->where('id', $this->post_catalogue_id)->first());
            }, []),
            'creator' => $this->whenLoaded('users', function () {
                return $this->users->name;
            }),
            'publish' => $this->publish,
            'creatAt' => Carbon::parse($this->created_at)->format('d-m-Y'),
        ];
    }
}
