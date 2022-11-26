<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Program extends Model
{
    use HasFactory;
    protected $table='programs';
    protected $fillable=[
        'day',
        'time_id',
        'hall_id',
        'group_id',
        'subject_id',
        'notice',
        'swap_with',
        'swap_notice'
    ];

    public function hall() {
        return $this->belongsTo(Hall::class,'hall_id');
    }

    public function time() {
        return $this->belongsTo(Time::class,'time_id');
    }

    public function group() {
        return $this->belongsTo(Group::class,'group_id');
    }

    public function subject() {
        return $this->belongsTo(Subject::class,'subject_id');
    }
}