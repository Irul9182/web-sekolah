<?php

namespace Database\Seeders;

use App\Models\StrukturOrganisasi;
use Illuminate\Database\Seeder;

class StrukturOrganisasiSeeder extends Seeder
{
    public function run(): void
    {
        // Tabel ini cuma butuh 1 baris (id=1) karena strukturnya fixed -- bukan banyak baris per posisi.
        StrukturOrganisasi::updateOrCreate(['id' => 1], [
            'ketua_yayasan' => 'Dr. H. A. Baidowi, S.Ag., M.Pd',
            'kepala_sekolah' => 'Ahmad Jajuli, SE., M.Pd',
            'komite_sekolah' => 'Karsita, S.Pd',
            'wakasek_kurikulum' => 'Mulyadi, M.Pd',
            'wakasek_kesiswaan' => 'Marisa Maulidya, S.Pd / Madhensia Putri Pratiwi, S.Pd',
            'kaprodi_akuntansi' => 'Indras Susilowati, SE., M.Pd',
            'kaprodi_manajemen_perkantoran' => 'Siti Rofiah, SE',
            'kaprodi_tjkt' => 'Rajikh Burhanuddin Fath A.J., S.Kom',
            'kaprodi_dkv' => 'Arief Fadilah Siregar, S.I.Kom',
            'badan_konseling' => 'Azra Rara Tazkia, S.Psi',
            'operator_sekolah' => 'Saepulloh, S.Pd',
        ]);
    }
}