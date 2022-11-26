<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Teacher extends Authenticatable
{
   use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        "first_name",
        "middle_name",
        "last_name",
        "email",
    ];

    protected $hidden = [
        "password"
    ];

    public function subjects() {
        return $this->hasMany(Subject::class);
    }

    /*
        I don't need this now..

        public function toAdminNotifications() {
            return $this->hasMany(AdminNotification::class);
        }
    */
}