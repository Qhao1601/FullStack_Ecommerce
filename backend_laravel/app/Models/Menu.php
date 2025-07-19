<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Query;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Menu extends Model
{
    use Query;
    protected $fillable = [
        'name',
        'canonical',
        'icon',
        'parent_id',
        'publish',
        'menu_catalogue_id'
    ];

    public function getRelations(): array
    {
        return [''];
    }

    public function children()
    {
        return $this->hasMany(Menu::class, 'parent_id')->where('publish', 2);
    }

    public function parent()
    {
        return $this->hasMany(Menu::class, 'parent_id');
    }

    public function menuCatalogues()
    {
        return $this->belongsTo(MenuCatalogue::class, 'menu_catalogue_id');
    }
}
