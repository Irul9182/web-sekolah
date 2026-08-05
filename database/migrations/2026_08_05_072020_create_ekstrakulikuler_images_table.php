<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up(): void
    {
        Schema::create('ekstrakulikuler_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ekstrakulikuler_id')->constrained()->cascadeOnDelete();
            $table->string('image_url');
            $table->string('public_id');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ekstrakulikuler_images');
    }
};
