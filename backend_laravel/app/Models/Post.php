<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Query;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Post extends Model
{
    use Query;
    protected $fillable = [
        'name',
        'canonical',
        'description',
        'content',
        'meta_description',
        'meta_title',
        'meta_keyword',
        'image',
        'icon',
        'album',
        'publish',
        'order',
        'post_catalogue_id',
        'user_id',
    ];
    protected $attributes = [
        'publish' => 2
    ];

    protected $casts = [
        'album' => 'json'
    ];

    public function post_catalogues(): BelongsToMany
    {
        return $this->belongsToMany(PostCatalogue::class, 'post_catalogue_post')->withTimestamps();
    }

    public function users(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }


    public function getRelations(): array
    {
        return ['post_catalogues'];
    }
}
