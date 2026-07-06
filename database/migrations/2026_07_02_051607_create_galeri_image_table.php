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
        Schema::create('galeri_image', function (Blueprint $table) {
            $table->id();

            $table->foreignId('berita_id')
                ->constrained('beritas')
                ->cascadeOnDelete();

            $table->string('image_url');
            $table->string('public_id')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('galeri_image');
    }
};
