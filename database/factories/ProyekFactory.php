<?php

namespace Database\Factories;

use App\Models\KategoriProyek;
use App\Models\JenisProyek;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class ProyekFactory extends Factory
{
    public function definition(): array
    {
        $tanggalMulai   = $this->faker->dateTimeBetween('-30 months', '-1 months');
        $tanggalSelesai = $this->faker->dateTimeBetween($tanggalMulai, 'now');
        $status         = Carbon::parse($tanggalSelesai)->isPast() ? 'selesai' : 'sedang_berjalan';

        return [
            'nama_proyek'        => 'Proyek ' . $this->faker->words(3, true),
            'kategori_proyek_id' => $this->faker->numberBetween(1, 10),
            'jenis_proyek_id'    => $this->faker->numberBetween(1, 10),
            'pagu_total'         => $this->faker->numberBetween(50_000_000, 500_000_000),
            'tanggal_mulai'      => $tanggalMulai,
            'tanggal_selesai'    => $tanggalSelesai,
            'pajak_persen'       => $this->faker->randomElement([10, 11, 12]),
            'nama_klien'         => $this->faker->company(),
            'status'             => $status,
            'deskripsi_proyek'   => $this->faker->sentence(10),
        ];
    }
}
