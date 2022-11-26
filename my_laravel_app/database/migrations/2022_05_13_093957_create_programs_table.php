
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProgramsTable extends Migration
{
    public function up()
    {
        Schema::create('programs', function (Blueprint $table) {
            $table->id();
            $table->string('day');
            $table->integer('time_id');
            $table->integer('hall_id');
            $table->integer('group_id');
            $table->integer('subject_id');
            $table->text('notice')->nullable();
            $table->integer('swap_with')->nullable();
            $table->text('swap_notice')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('programs');
    }
}