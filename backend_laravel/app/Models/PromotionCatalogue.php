<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Query;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class PromotionCatalogue extends Model
{
    use Query;
    protected $fillable = [
        'name',
        'canonical',
        'publish',
        'user_id'
    ];

    protected $attributes = [
        'publish' => 2
    ];

    public function getRelations(): array
    {
        return [''];
    }


    public function users(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
