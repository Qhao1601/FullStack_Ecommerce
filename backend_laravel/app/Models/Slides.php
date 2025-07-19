<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Query;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Slides extends Model
{
    use Query;
    protected $fillable = [
        'name',
        'keyword',
        'description',
        'item',
        'setting',
        'short_code',
        'publish'
    ];
    protected $casts = [
        'item' => 'array',
    ];


    public function getRelations(): array
    {
        return [''];
    }
}
