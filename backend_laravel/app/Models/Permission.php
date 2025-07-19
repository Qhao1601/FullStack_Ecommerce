<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Query;


class Permission extends Model
{
    use Query;
    protected $attributes = [
        'publish' => 2
    ];

    protected $fillable = [
        'name',
        'module',
        'value',
        'title',
        'publish',
        'description',
        'user_id'
    ];
    public function getRelations(): array
    {
        return [];
    }
}
