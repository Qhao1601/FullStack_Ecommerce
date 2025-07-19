<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Query;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AttributeCatalogue extends Model
{
    use Query;
    protected $fillable = [
        'name',
        'publish',
        'data_type',
        'unit',
        'user_id'
    ];

    protected $attributes = [
        'publish' => 2
    ];

    public function attributes(): HasMany
    {
        return $this->hasMany(Attribute::class, 'attribute_catalogue_id', 'id');
    }

    public function users(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }


    public function getRelations(): array
    {
        return [''];
    }
}
