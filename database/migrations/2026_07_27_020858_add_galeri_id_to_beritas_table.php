<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
       // Schema::table('beritas', function (Blueprint $table) {
       //     $table->date('tanggal')->nullable()->after('slug');

       //     $table->foreignId('galeri_id')
         //       ->nullable()
         //       ->after('tanggal')
        //        ->constrained('galeris')
        //        ->nullOnDelete();
    //    });
    }

    public function down(): void
    {
    //    Schema::table('beritas', function (Blueprint $table) {
    //        $table->dropForeign(['galeri_id']);
    //        $table->dropColumn(['galeri_id', 'tanggal']);
    //    });
    }
};