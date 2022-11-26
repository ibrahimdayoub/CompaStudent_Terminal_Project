<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEventsTable extends Migration
{
     /**
     * Event Such As:
     * One: Create, Update And Delete Program By Admin (Three Reseivers Admins, Teacher, Group)
     * Two: Update Program By Teacher (Three Reseivers Admins, Teacher, Group)
     * Three: Swap Between Two Teachers Programs (Five Reseivers Admins, Teacher1, Group1, Teacher2, Group2)
    */
    public function up()
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('event'); // One, Two Or Three Above | String 
            $table->string('sender'); // Admin, Teacher Or Two Teachers | Json
            $table->longText('message');
            $table->longText('info');
            $table->string('receiver'); // Admins, Teacher Or Two Teachers And Group | Json
            $table->string('shown'); // Admins, Teacher Or Two Teachers And Group | Json
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('events');
    }
}