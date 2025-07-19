<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Query;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Brand extends Model
{
    use Query;
    protected $fillable = [
        'name',
        'user_id',
        'publish',
    ];

    protected $attributes = [
        'publish' => 2
    ];

    public function users(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class, 'brand_id', 'id');
    }

    public function getRelations(): array
    {
        return [''];
    }
}
