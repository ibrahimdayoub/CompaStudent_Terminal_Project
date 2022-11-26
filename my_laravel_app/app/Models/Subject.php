<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use HasFactory;
    protected $table='subjects';
    protected $fillable=[
        'name',
        'teacher_id',
        'year_id',
        'type',
        'description',
    ];

    public function teacher() {
        return $this->belongsTo(Teacher::class,'teacher_id');
    }

    public function year() {
        return $this->belongsTo(Year::class,'year_id');
    }

    public function programs() {
        return $this->hasMany(Program::class);
    }
}