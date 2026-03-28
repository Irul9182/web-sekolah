<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Transaksi;
use App\Models\Proyek;
use Illuminate\Support\Str;

class TransaksiSeeder extends Seeder
{
    public function run(): void
    {
        $proyeks = Proyek::pluck('proyek_id')->toArray();

        for ($i = 1; $i <= 20; $i++) {
            Transaksi::create([
                'transaksi_id' => Str::ulid(),
                'proyek_id' => $proyeks[array_rand($proyeks)],

                // 'tipe' => [Transaksi::TIPE_PEMASUKAN, Transaksi::TIPE_PENGELUARAN][array_rand([
                //     Transaksi::TIPE_PEMASUKAN,
                //     Transaksi::TIPE_PENGELUARAN
                // ])],

                'kategori' => Transaksi::KATEGORI[array_rand(Transaksi::KATEGORI)],

                'jumlah' => rand(500000, 10000000),

                'persen' => rand(5, 20) / 100,

                'tanggal' => now()->subDays(rand(1, 60)),

                'keterangan' => "Transaksi ke-{$i}",
            ]);
        }
    }
}
