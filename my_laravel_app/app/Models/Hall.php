<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hall extends Model
{
    use HasFactory;
    protected $table='halls';
    protected $fillable=[
        'name',
        'floor',
        'build',
        'capacity',
        'description'
    ];

    public function programs() {
        return $this->hasMany(Program::class);
    }
}