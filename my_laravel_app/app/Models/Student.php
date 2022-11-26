<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Student extends Authenticatable
{
   use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        "first_name",
        "middle_name",
        "last_name",
        "email",
        "password",
        "group_id",
    ];

    protected $hidden = [
        "password"
    ];

    public function group() {
        return $this->belongsTo(Group::class,'group_id');
    }
}