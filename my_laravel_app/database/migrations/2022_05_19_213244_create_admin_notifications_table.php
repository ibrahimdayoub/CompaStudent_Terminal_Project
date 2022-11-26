<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAdminNotificationsTable extends Migration
{
    public function up()
    {
        Schema::create('admin_notifications', function (Blueprint $table) {
            $table->id();
            $table->string('how_send');
            $table->integer('sender_id');
            $table->longText('title');
            $table->longText('message');
            $table->string('accepted'); // 1=>accepted, -1=>not, 0=>unknown
            $table->string('shown'); // 1=>shown, 0=>not
            $table->longText('admin_answer')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('admin_notifications');
    }
}
