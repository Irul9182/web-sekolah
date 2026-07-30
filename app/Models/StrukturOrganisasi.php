<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StrukturOrganisasi extends Model
{
    protected $table = 'struktur_organisasi';

    protected $fillable = [
        'ketua_yayasan',
        'kepala_sekolah',
        'komite_sekolah',
        'wakasek_kurikulum',
        'wakasek_kesiswaan',
        'kaprodi_akuntansi',
        'kaprodi_manajemen_perkantoran',
        'kaprodi_tjkt',
        'kaprodi_dkv',
        'badan_konseling',
        'operator_sekolah',
    ];
}