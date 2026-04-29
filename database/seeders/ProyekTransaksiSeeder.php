<?php

namespace Database\Seeders;

use App\Models\Proyek;
use App\Models\Transaksi;
use App\Models\ItemTransaksi;
use App\Services\FinanceService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use App\Models\KategoriProyek;
use App\Models\JenisProyek;

class ProyekTransaksiSeeder extends Seeder
{
    public function run(): void
    {
        $financeService = new FinanceService();
        $startDate      = Carbon::now()->subMonths(24)->startOfMonth();
        $kategoriIds = \App\Models\KategoriProyek::pluck('id')->toArray();
        $jenisIds    = \App\Models\JenisProyek::pluck('id')->toArray();
        if (empty($kategoriIds) || empty($jenisIds)) {
            $this->command->error('Kategori atau Jenis proyek belum ada. Jalankan seeder-nya dulu.');
            return;
        }
        for ($i = 0; $i < 30; $i++) {
            $tanggalMulai   = $startDate->copy()->addDays(rand(0, 700));
            $durasiHari     = rand(30, 180);
            $tanggalSelesai = $tanggalMulai->copy()->addDays($durasiHari);
            $status         = $tanggalSelesai->isPast() ? 'selesai' : 'sedang_berjalan';
            $pagu           = rand(50, 500) * 1_000_000;

            $proyek = Proyek::create([
                'nama_proyek'        => 'Proyek ' . fake()->words(3, true),
                'kategori_proyek_id' => $kategoriIds[array_rand($kategoriIds)],
                'jenis_proyek_id'    => $jenisIds[array_rand($jenisIds)],
                'pagu_total'         => $pagu,
                'tanggal_mulai'      => $tanggalMulai,
                'tanggal_selesai'    => $tanggalSelesai,
                'pajak_persen'       => fake()->randomElement([10, 11, 12]),
                'nama_klien'         => fake()->company(),
                'status'             => $status,
                'deskripsi_proyek'   => fake()->sentence(10),
            ]);

            $anggaran = $financeService->hitungAnggaranProyek($proyek);
            $dana     = $anggaran['dana_setelah_pajak'];

            // Buat transaksi tersebar dalam durasi proyek
            foreach (Transaksi::KATEGORI as $kategori) {

                // Tanggal transaksi dalam rentang proyek, tidak melebihi endDate
                $maxTanggal = $tanggalSelesai->isPast() ? $tanggalSelesai : Carbon::now();
                $tanggalTransaksi = Carbon::createFromTimestamp(
                    rand($tanggalMulai->timestamp, $maxTanggal->timestamp)
                );

                if (in_array($kategori, Transaksi::KATEGORI_DENGAN_ITEM)) {
                    $transaksi = Transaksi::create([
                        'proyek_id'   => $proyek->proyek_id,
                        'kategori'    => $kategori,
                        'jumlah'      => 0,
                        'persen'      => null,
                        'tanggal'     => $tanggalTransaksi,
                        'keterangan'  => "Transaksi {$kategori}",
                    ]);

                    // 2-5 item per transaksi, tersebar dalam beberapa tanggal
                    $totalJumlah = 0;
                    $jumlahItem  = rand(2, 5);

                    for ($j = 1; $j <= $jumlahItem; $j++) {
                        $tanggalItem = Carbon::createFromTimestamp(
                            rand($tanggalTransaksi->timestamp, $maxTanggal->timestamp)
                        );
                        $qty         = rand(5, 100);
                        $harga       = rand(50_000, 500_000);
                        $subtotal    = $qty * $harga;
                        $totalJumlah += $subtotal;

                        [$namaItem, $satuan] = $this->generateItem($kategori, $j);

                        ItemTransaksi::create([
                            'transaksi_id' => $transaksi->transaksi_id,
                            'tanggal'      => $tanggalItem,
                            'nama_item'    => $namaItem,
                            'satuan'       => $satuan,
                            'qty'          => $qty,
                            'harga_satuan' => $harga,
                            'subtotal'     => $subtotal,
                            'keterangan'   => "Item ke-{$j}",
                        ]);
                    }

                    $persen = $dana > 0 ? round(($totalJumlah / $dana) * 100, 2) : 0;
                    $transaksi->update([
                        'jumlah' => $totalJumlah,
                        'persen' => $persen,
                    ]);
                } else {
                    [$persen, $jumlah] = match ($kategori) {
                        'jasa_tukang'      => [11.0, $dana * 0.11],
                        'mandor'           => [1.5,  $dana * 0.015],
                        'staff_perpajakan' => [null, 300_000],
                        'staff_entry_data' => [null, 1_600_000],
                        default            => [null, 0],
                    };

                    Transaksi::create([
                        'proyek_id'  => $proyek->proyek_id,
                        'kategori'   => $kategori,
                        'jumlah'     => $jumlah,
                        'persen'     => $persen,
                        'tanggal'    => $tanggalTransaksi,
                        'keterangan' => "Transaksi {$kategori}",
                    ]);
                }
            }
        }
    }

    private function generateItem(string $kategori, int $index): array
    {
        $items = [
            'material' => [
                ['Semen Tiga Roda', 'sak'],
                ['Besi 10mm', 'batang'],
                ['Pasir Beton', 'm3'],
                ['Batu Split', 'm3'],
                ['Kayu Bekisting', 'lembar'],
                ['Cat Tembok', 'kaleng'],
                ['Keramik 60x60', 'dus'],
                ['Pipa PVC 4 inch', 'batang'],
            ],
            'operasional' => [
                ['Sewa Excavator', 'hari'],
                ['Sewa Molen Beton', 'hari'],
                ['Transportasi Material', 'trip'],
                ['Bahan Bakar Genset', 'liter'],
                ['Sewa Scaffolding', 'set'],
                ['Konsumsi Pekerja', 'hari'],
            ],
            'biaya_tak_terduga' => [
                ['Perbaikan Pipa Bocor', 'kali'],
                ['Penggantian Material Rusak', 'unit'],
                ['Biaya Lembur Darurat', 'hari'],
                ['Perbaikan Alat Rusak', 'kali'],
            ],
        ];

        $list = $items[$kategori] ?? [["Item {$index}", 'unit']];
        return $list[($index - 1) % count($list)];
    }
}
