<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    use HasFactory;
    protected $table='groups';
    protected $fillable=[
        'name',
        'year_id',
        'capacity',
        'order',
        'description'
    ];

    public function year() {

        return $this->belongsTo(Year::class,'year_id');
    }

    public function students() {

        return $this->hasMany(Student::class);
    }

    public function programs() {

        return $this->hasMany(Program::class);
    }
}