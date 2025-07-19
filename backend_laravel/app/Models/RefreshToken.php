<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;


class RefreshToken extends Model
{
 

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'refresh_token',
        'expires_at',
        'user_id',
        'was_used',
        'is_revoked'
    ];

    protected $table = 'refresh_tokens';

}
