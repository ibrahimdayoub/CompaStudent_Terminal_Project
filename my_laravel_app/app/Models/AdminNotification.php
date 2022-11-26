<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdminNotification extends Model
{
    use HasFactory;

    //1=>accepted -1=>rejected 0=>default
    //1=>viewed 0=>not viewed

    protected $table='admin_notifications';
    protected $fillable=[
        'sender_id',
        'how_send',
        'title',
        'message',
        'accepted',
        'shown',
        'admin'
    ];

    public function sender() {

        if(auth()->user()->tokenCan('server:student') || $this->how_send==="Student")
        {
            return $this->belongsTo(Student::class,'sender_id');
        }
        else if(auth()->user()->tokenCan('server:teacher') || $this->how_send==="Teacher")
        {
            return $this->belongsTo(Teacher::class,'sender_id');
        }
    }
}