<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Query;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ProductCatalogue extends Model
{
    use Query;
    protected $fillable = [
        'name',
        'canonical',
        'description',
        'content',
        'meta_title',
        'meta_keyword',
        'meta_description',
        'image',
        'icon',
        'album',
        'parent_id',
        'lft',
        'rgt',
        'level',
        'publish',
        'user_id',
    ];

    protected $casts = [
        'album' => 'json'
    ];

    public function getRelations(): array
    {
        return [''];
    }

    public function users(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'product_catalogue_product');
    }
}
