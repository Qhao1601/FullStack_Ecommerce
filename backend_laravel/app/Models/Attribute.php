<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Query;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Attribute extends Model
{
    use Query;
    protected $fillable = [
        'name',
        'order',
        'publish',
        'attribute_catalogue_id',
        'user_id'
    ];

    protected $attributes = [
        'publish' => 2
    ];

    public function attribute_catalogues(): BelongsTo
    {
        return $this->belongsTo(AttributeCatalogue::class, 'attribute_catalogue_id', 'id');
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
