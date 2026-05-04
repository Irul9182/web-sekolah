<?php

namespace Database\Seeders;

use App\Models\Proyek;
use App\Models\Transaksi;
use App\Models\ItemTransaksi;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class ProyekTransaksiSeeder extends Seeder
{
    // Total pengeluaran = 62% dari pagu → cashflow selalu positif ~38%
    private const PROPORSI_PERSEN = [
        'material'          => 0.35,
        'operasional'       => 0.05,
        'jasa_tukang'       => 0.11,
        'mandor'            => 0.015,
        'biaya_tak_terduga' => 0.04,
    ];

    private const PROPORSI_FIXED = [
        'staff_perpajakan' => 300_000,
        'staff_entry_data' => 1_600_000,
    ];

    private const KATEGORI_DENGAN_ITEM = ['material', 'operasional', 'biaya_tak_terduga'];

    public function run(): void
    {
        $kategoriIds = \App\Models\KategoriProyek::pluck('id')->toArray();
        $jenisIds    = \App\Models\JenisProyek::pluck('id')->toArray();

        if (empty($kategoriIds) || empty($jenisIds)) {
            $this->command->error('Kategori atau Jenis proyek belum ada.');
            return;
        }

        $jadwal = $this->generateJadwal(30);

        foreach ($jadwal as $def) {
            $mulai   = $def['mulai'];
            $selesai = $def['selesai'];
            $pagu    = $def['pagu'];
            $pajak   = $def['pajak'];
            $status  = $selesai->isPast() ? 'selesai' : 'sedang_berjalan';

            $proyek = Proyek::create([
                'nama_proyek'        => 'Proyek ' . fake()->words(3, true),
                'kategori_proyek_id' => $kategoriIds[array_rand($kategoriIds)],
                'jenis_proyek_id'    => $jenisIds[array_rand($jenisIds)],
                'pagu_total'         => $pagu,
                'tanggal_mulai'      => $mulai,
                'tanggal_selesai'    => $selesai,
                'pajak_persen'       => $pajak,
                'nama_klien'         => fake()->company(),
                'status'             => $status,
                'deskripsi_proyek'   => fake()->sentence(10),
            ]);

            // Basis pengeluaran = pagu langsung (bukan dana_setelah_pajak)
            // sehingga total pengeluaran pasti < pagu → cashflow selalu positif
            $this->buatTransaksiPengeluaran($proyek, (float) $pagu, $mulai, $selesai);
        }

        $this->command->info('✓ Seeder selesai: 30 proyek, cashflow 24 bulan, pengeluaran < pagu.');
    }

    private function generateJadwal(int $total): array
    {
        $now         = Carbon::now()->startOfDay();
        $windowStart = $now->copy()->subMonths(24)->startOfMonth();
        $windowEnd   = $now->copy();

        $bobotQ     = [1 => 3, 2 => 1, 3 => 3, 4 => 2];
        $totalBobot = array_sum($bobotQ);

        $perQ     = [];
        $assigned = 0;
        foreach ($bobotQ as $q => $b) {
            $perQ[$q] = (int) round($total * $b / $totalBobot);
            $assigned += $perQ[$q];
        }
        $perQ[1] += ($total - $assigned);

        $defs = [];

        for ($siklus = 0; $siklus < 2; $siklus++) {
            for ($q = 1; $q <= 4; $q++) {
                $jumlahSlot = (int) ceil($perQ[$q] / 2);
                if ($siklus === 1) {
                    $jumlahSlot = $perQ[$q] - (int) ceil($perQ[$q] / 2);
                }

                $bulanKuartalAwal = ($q - 1) * 3;
                $offsetSiklus     = $siklus * 12;
                $slotMulai        = $windowStart->copy()->addMonths($bulanKuartalAwal + $offsetSiklus);
                $slotAkhir        = $slotMulai->copy()->addMonths(3)->subDay()->min($windowEnd);

                if ($slotMulai->gt($windowEnd)) continue;

                for ($p = 0; $p < $jumlahSlot; $p++) {
                    $mulai = Carbon::createFromTimestamp(
                        rand($slotMulai->timestamp, $slotAkhir->timestamp)
                    )->startOfDay();

                    $durasi  = rand(2, 8);
                    $selesai = $mulai->copy()->addMonths($durasi)->endOfMonth();

                    [$paguMin, $paguMax] = ($q % 2 === 1)
                        ? [200_000_000, 500_000_000]
                        : [80_000_000,  300_000_000];

                    $pagu  = (int) round(rand($paguMin, $paguMax) / 5_000_000) * 5_000_000;
                    $pajak = fake()->randomElement([10, 11, 12]);

                    $defs[] = [
                        'mulai'   => $mulai,
                        'selesai' => $selesai,
                        'pagu'    => $pagu,
                        'pajak'   => $pajak,
                    ];
                }
            }
        }

        shuffle($defs);
        return array_slice($defs, 0, $total);
    }

    private function buatTransaksiPengeluaran(
        Proyek $proyek,
        float  $pagu,
        Carbon $mulai,
        Carbon $selesai
    ): void {
        $maxTanggal = $selesai->isPast() ? $selesai->copy() : Carbon::now()->startOfDay();
        if ($maxTanggal->lt($mulai)) $maxTanggal = $mulai->copy();

        $durasiHari = max(1, (int) $mulai->diffInDays($maxTanggal));

        $alokasi = [];
        foreach (self::PROPORSI_PERSEN as $kat => $pct) {
            $alokasi[$kat] = (int) round($pagu * $pct);
        }
        foreach (self::PROPORSI_FIXED as $kat => $nominal) {
            $alokasi[$kat] = (int) $nominal;
        }

        $batasMaks    = (int) ($pagu * 0.75);
        $totalAlokasi = array_sum($alokasi);
        if ($totalAlokasi > $batasMaks) {
            $faktor = $batasMaks / $totalAlokasi;
            foreach ($alokasi as $kat => &$val) {
                $val = (int) floor($val * $faktor);
            }
            unset($val);
        }

        // Batas akhir transaksi = akhir bulan tanggal_mulai
        // Semua pengeluaran WAJIB dalam bulan yang sama dengan pemasukan
        $batasBulanMulai = $mulai->copy()->endOfMonth()->min($maxTanggal);

        foreach ($alokasi as $kategori => $budget) {
            if ($budget <= 0) continue;

            if (isset(self::PROPORSI_FIXED[$kategori])) {
                $tanggal = Carbon::createFromTimestamp(
                    rand($mulai->timestamp, $batasBulanMulai->timestamp)
                );

                Transaksi::create([
                    'proyek_id'  => $proyek->proyek_id,
                    'kategori'   => $kategori,
                    'jumlah'     => $budget,
                    'persen'     => $this->hitungPersen($budget, $pagu),
                    'tanggal'    => $tanggal,
                    'keterangan' => "Biaya tetap {$kategori}",
                ]);
                continue;
            }

            $jumlahTermin = rand(2, 4);
            $bobotTermin  = $this->sCurveWeights($jumlahTermin);
            $sisaBudget   = $budget;

            foreach ($bobotTermin as $idx => $bobot) {
                $isTerminAkhir = ($idx === $jumlahTermin - 1);

                $jumlah     = $isTerminAkhir
                    ? $sisaBudget
                    : (int) round($budget * $bobot);
                $jumlah     = max(1, min($jumlah, $sisaBudget));
                $sisaBudget -= $jumlah;

                // Semua termin dalam bulan yang sama dengan tanggal_mulai
                $tanggal = Carbon::createFromTimestamp(
                    rand($mulai->timestamp, $batasBulanMulai->timestamp)
                );

                $keterangan = "Termin " . ($idx + 1) . " – {$kategori}";

                if (in_array($kategori, self::KATEGORI_DENGAN_ITEM, true)) {
                    $transaksi = Transaksi::create([
                        'proyek_id'  => $proyek->proyek_id,
                        'kategori'   => $kategori,
                        'jumlah'     => 0,
                        'persen'     => null,
                        'tanggal'    => $tanggal,
                        'keterangan' => $keterangan,
                    ]);

                    $totalItem = $this->buatItemTransaksi(
                        $transaksi,
                        $jumlah,
                        $kategori,
                        $mulai,
                        $batasBulanMulai
                    );

                    $transaksi->update([
                        'jumlah' => $totalItem,
                        'persen' => $this->hitungPersen($totalItem, $pagu),
                    ]);
                } else {
                    Transaksi::create([
                        'proyek_id'  => $proyek->proyek_id,
                        'kategori'   => $kategori,
                        'jumlah'     => $jumlah,
                        'persen'     => $this->hitungPersen($jumlah, $pagu),
                        'tanggal'    => $tanggal,
                        'keterangan' => $keterangan,
                    ]);
                }

                if ($sisaBudget <= 0) break;
            }
        }
    }

    private function buatItemTransaksi(
        Transaksi $transaksi,
        int       $targetTotal,
        string    $kategori,
        Carbon    $tanggalAwal,
        Carbon    $maxTanggal
    ): int {
        $jumlahItem   = rand(2, 5);
        $sisaAnggaran = $targetTotal;
        $totalAktual  = 0;

        for ($j = 1; $j <= $jumlahItem; $j++) {
            $isItemAkhir = ($j === $jumlahItem);

            $tFrom = $tanggalAwal->copy();
            $tTo   = $maxTanggal->copy();
            if ($tFrom->gt($tTo)) $tFrom = $tTo->copy();

            $tanggalItem = Carbon::createFromTimestamp(
                rand($tFrom->timestamp, $tTo->timestamp)
            );

            [$namaItem, $satuan] = $this->generateItem($kategori, $j);

            if ($isItemAkhir) {
                $subtotal = max(1, $sisaAnggaran);
                $harga    = rand(10_000, 500_000);
                $qty      = max(1, (int) round($subtotal / $harga));
                $harga    = (int) round($subtotal / $qty);
                $subtotal = $qty * $harga;
            } else {
                $porsiBase = (int) round($sisaAnggaran / ($jumlahItem - $j + 1));
                $porsi     = (int) ($porsiBase * (0.80 + lcg_value() * 0.40));
                $porsi     = max(1_000, min($porsi, $sisaAnggaran - ($jumlahItem - $j) * 1_000));

                $harga    = rand(10_000, 500_000);
                $qty      = max(1, (int) round($porsi / $harga));
                $harga    = (int) round($porsi / $qty);
                $subtotal = $qty * $harga;
            }

            $sisaAnggaran -= $subtotal;
            $totalAktual  += $subtotal;

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

        return $totalAktual;
    }

    private function sCurveWeights(int $n): array
    {
        if ($n === 1) return [1.0];

        $raw = [];
        for ($i = 0; $i < $n; $i++) {
            $t     = $i / ($n - 1);
            $raw[] = exp(-pow(($t - 0.6) * 2.5, 2));
        }

        $sum = array_sum($raw);
        return array_map(static fn($v) => $v / $sum, $raw);
    }

    private function hitungPersen(float $jumlah, float $pagu): float
    {
        return $pagu > 0 ? round(($jumlah / $pagu) * 100, 2) : 0.0;
    }

    private function generateItem(string $kategori, int $index): array
    {
        static $katalog = [
            'material' => [
                ['Semen Tiga Roda 50kg',   'sak'],
                ['Besi Beton 10mm',         'batang'],
                ['Pasir Beton',             'm³'],
                ['Batu Split 2/3',          'm³'],
                ['Kayu Bekisting 4/6',      'lembar'],
                ['Cat Tembok Interior',     'kaleng'],
                ['Keramik 60×60 Polished',  'dus'],
                ['Pipa PVC AW 4 inch',      'batang'],
                ['Triplek 12mm',            'lembar'],
                ['Kawat Bindrat',           'kg'],
            ],
            'operasional' => [
                ['Sewa Excavator',         'hari'],
                ['Sewa Molen Beton',       'hari'],
                ['Transportasi Material',  'trip'],
                ['Bahan Bakar Genset',     'liter'],
                ['Sewa Scaffolding',       'set'],
                ['Konsumsi Pekerja',       'hari'],
                ['Sewa Stamper Kuda',      'hari'],
                ['Biaya Pengujian Beton',  'kali'],
            ],
            'biaya_tak_terduga' => [
                ['Perbaikan Pipa Bocor',           'kali'],
                ['Penggantian Material Rusak',     'unit'],
                ['Biaya Lembur Darurat',           'hari'],
                ['Perbaikan Alat Berat Rusak',     'kali'],
                ['Bahan Tambahan Tidak Terencana', 'unit'],
            ],
        ];

        $list = $katalog[$kategori] ?? [["Item {$index}", 'unit']];
        return $list[($index - 1) % count($list)];
    }
}
