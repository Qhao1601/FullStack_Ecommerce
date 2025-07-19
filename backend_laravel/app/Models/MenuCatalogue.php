<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Query;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class MenuCatalogue extends Model
{
    use Query;
    protected $fillable = [
        'name',
        'keyword',
        'publish',

    ];



    public function getRelations(): array
    {
        return [''];
    }
}
