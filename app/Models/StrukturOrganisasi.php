<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StrukturOrganisasi extends Model
{
    // Nama tabel di migration singular ('struktur_organisasi'), bukan hasil guess default Eloquent
    // ('struktur_organisasis'), jadi harus di-set manual.
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