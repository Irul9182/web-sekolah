<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('struktur_organisasi', function (Blueprint $table) {
            $table->id();
            $table->string('ketua_yayasan')->nullable();
            $table->string('kepala_sekolah')->nullable();
            $table->string('komite_sekolah')->nullable();
            $table->string('wakasek_kurikulum')->nullable();
            $table->string('wakasek_kesiswaan')->nullable();
            $table->string('kaprodi_akuntansi')->nullable();
            $table->string('kaprodi_manajemen_perkantoran')->nullable();
            $table->string('kaprodi_tjkt')->nullable();
            $table->string('kaprodi_dkv')->nullable();
            $table->string('badan_konseling')->nullable();
            $table->string('operator_sekolah')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('struktur_organisasi');
    }
};