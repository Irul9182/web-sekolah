<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Proyek;

class ProyekSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Proyek::create([
            'nama_proyek' => 'Pembangunan Jalan Desa A',
            'tipe_proyek' => 'papping',
            'pagu_total' => 150000000,
            'tanggal_mulai' => '2025-01-10',
            'tanggal_selesai' => '2025-03-15',
            'pajak_persen' => 11.00,
            'uang_bahan_persen' => 40.00,
            'jasa_tukang_persen' => 30.00,
            'biaya_tak_terduga_persen' => 25.00,
            'biaya_staff_perpajakan' => 5000000,
            'biaya_staff_entry_data' => 3000000,
            'nama_klien' => 'PT Maju Jaya',
            'status' => 'sedang_berjalan',
            'deskripsi_proyek' => 'Proyek pembangunan jalan desa dengan paving block.'
        ]);

        Proyek::create([
            'nama_proyek' => 'Drainase U-Ditch Kota B',
            'tipe_proyek' => 'u_ditch',
            'pagu_total' => 250000000,
            'tanggal_mulai' => '2025-02-01',
            'tanggal_selesai' => '2025-05-30',
            'pajak_persen' => 11.00,
            'uang_bahan_persen' => 50.00,
            'jasa_tukang_persen' => 25.00,
            'biaya_tak_terduga_persen' => 20.00,
            'biaya_staff_perpajakan' => 7000000,
            'biaya_staff_entry_data' => 3500000,
            'nama_klien' => 'CV Sumber Rejeki',
            'status' => 'sedang_berjalan',
            'deskripsi_proyek' => 'Pembangunan saluran drainase menggunakan U-Ditch.'
        ]);

        Proyek::create([
            'nama_proyek' => 'Perbaikan Beton Jalan Raya',
            'tipe_proyek' => 'beton',
            'pagu_total' => 500000000,
            'tanggal_mulai' => '2024-11-01',
            'tanggal_selesai' => '2025-01-20',
            'pajak_persen' => 11.00,
            'uang_bahan_persen' => 45.00,
            'jasa_tukang_persen' => 35.00,
            'biaya_tak_terduga_persen' => 10.00,
            'biaya_staff_perpajakan' => 10000000,
            'biaya_staff_entry_data' => 5000000,
            'nama_klien' => 'Dinas PUPR',
            'status' => 'selesai',
            'deskripsi_proyek' => 'Perbaikan jalan beton utama kota.'
        ]);
    }
}
