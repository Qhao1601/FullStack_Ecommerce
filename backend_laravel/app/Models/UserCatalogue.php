<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Query;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class UserCatalogue extends Model
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

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_catalogue_user')->withTimestamps();
    }


    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class, 'user_catalogue_permission')->withTimestamps();
    }


    // public function getRelations(): array
    // {
    //     return ['permissions'];
    // }

    public function getRelations(): array
    {
        return ['users', 'permissions'];
    }
}
