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
        Schema::table('beritas', function (Blueprint $table) {
            $table->foreignId('galeri_id')
                ->nullable()
                ->after('id') // sesuaikan posisi kalau perlu
                ->constrained('galeris')
                ->nullOnDelete(); // kalau album galeri dihapus, berita tidak ikut terhapus, cuma link-nya hilang
        });
    }

    public function down(): void
    {
        Schema::table('beritas', function (Blueprint $table) {
            $table->dropForeign(['galeri_id']);
            $table->dropColumn('galeri_id');
        });
    }
};
