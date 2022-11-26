<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Year extends Model
{
    use HasFactory;
    protected $table='years';
    protected $fillable=[
        'name',
        'order',
        'description'
    ];

    public function groups() {
        return $this->hasMany(Group::class);
    }

    public function subjects() {
        return $this->hasMany(Subject::class);
    }
}
