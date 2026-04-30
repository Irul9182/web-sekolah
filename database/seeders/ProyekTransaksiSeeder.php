<?php

namespace Database\Seeders;

use App\Models\Proyek;
use App\Models\Transaksi;
use App\Models\ItemTransaksi;
use App\Services\FinanceService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

/**
 * Seeder yang menghasilkan data cashflow dengan pola yang bisa diprediksi Prophet.
 *
 * Strategi:
 * 1. Pemasukan (pagu) masuk di awal proyek — bergelombang musiman (lebih banyak
 *    proyek mulai di Q1 & Q3, lebih sedikit di Q2 & Q4).
 * 2. Pengeluaran mengikuti kurva S-curve proyek konstruksi:
 *    - Bulan 1–2: rendah (mobilisasi)
 *    - Bulan 3–(n-1): tinggi (puncak pelaksanaan)
 *    - Bulan terakhir: rendah (finishing)
 * 3. Setiap kategori transaksi punya proporsi tetap dari dana proyek
 *    sehingga rasio pemasukan/pengeluaran konsisten dan bisa dideteksi Prophet.
 */
class ProyekTransaksiSeeder extends Seeder
{
    // Proporsi pengeluaran per kategori dari dana_setelah_pajak
    private const PROPORSI = [
        'material'          => 0.40,
        'jasa_tukang'       => 0.11,
        'mandor'            => 0.015,
        'biaya_tak_terduga' => 0.05,
        'staff_perpajakan'  => null, // fixed
        'staff_entry_data'  => null, // fixed
    ];

    // Nilai fixed (bukan persentase)
    private const FIXED = [
        'staff_perpajakan' => 300_000,
        'staff_entry_data' => 1_600_000,
    ];

    public function run(): void
    {
        $financeService = new FinanceService();
        $kategoriIds    = \App\Models\KategoriProyek::pluck('id')->toArray();
        $jenisIds       = \App\Models\JenisProyek::pluck('id')->toArray();

        if (empty($kategoriIds) || empty($jenisIds)) {
            $this->command->error('Kategori atau Jenis proyek belum ada.');
            return;
        }

        // ── Buat 30 proyek tersebar dalam 24 bulan terakhir ───────────────────
        // Distribusi musiman: Q1 & Q3 lebih banyak proyek baru
        $proyekDefs = $this->generateProyekSchedule(30);

        foreach ($proyekDefs as $def) {
            $tanggalMulai   = $def['mulai'];
            $tanggalSelesai = $def['selesai'];
            $pagu           = $def['pagu'];
            $status         = $tanggalSelesai->isPast() ? 'selesai' : 'sedang_berjalan';

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

            $this->buatTransaksi($proyek, $dana, $tanggalMulai, $tanggalSelesai);
        }

        $this->command->info('Seeder selesai: 30 proyek dengan cashflow berpola.');
    }

    // ── Generate jadwal proyek dengan distribusi musiman ─────────────────────

    private function generateProyekSchedule(int $total): array
    {
        $now   = Carbon::now()->startOfMonth();
        $start = $now->copy()->subMonths(24);
        $defs  = [];

        // Bobot per kuartal — Q1 & Q3 lebih aktif (musim proyek konstruksi)
        $quarterWeight = [1 => 3, 2 => 1, 3 => 3, 4 => 2];
        $totalWeight   = array_sum($quarterWeight);

        // Tentukan berapa proyek per kuartal
        $perQuarter = [];
        $assigned   = 0;
        foreach ($quarterWeight as $q => $w) {
            $perQuarter[$q] = (int) round($total * $w / $totalWeight);
            $assigned += $perQuarter[$q];
        }
        // Koreksi pembulatan
        $perQuarter[1] += ($total - $assigned);

        for ($q = 1; $q <= 4; $q++) {
            for ($p = 0; $p < $perQuarter[$q]; $p++) {
                // Pilih bulan mulai acak dalam kuartal ini, dalam 24 bulan terakhir
                $qStartMonth = ($q - 1) * 3; // 0, 3, 6, 9
                $bulanOffset = rand(0, 5) * 4; // tersebar dalam 24 bulan (4 siklus per kuartal)
                $mulai       = $start->copy()->addMonths($qStartMonth + $bulanOffset + rand(0, 2));

                // Jangan melebihi hari ini
                if ($mulai->gt($now)) {
                    $mulai = $now->copy()->subMonths(rand(1, 3));
                }

                $durasi  = rand(2, 8); // 2–8 bulan
                $selesai = $mulai->copy()->addMonths($durasi)->endOfMonth();

                // Pagu: proyek Q1 & Q3 cenderung lebih besar (kontrak awal tahun)
                $paguMin = $q % 2 === 1 ? 200_000_000 : 80_000_000;
                $paguMax = $q % 2 === 1 ? 500_000_000 : 300_000_000;
                $pagu    = rand($paguMin / 1_000_000, $paguMax / 1_000_000) * 1_000_000;

                $defs[] = [
                    'mulai'   => $mulai,
                    'selesai' => $selesai,
                    'pagu'    => $pagu,
                ];
            }
        }

        return $defs;
    }

    // ── Buat transaksi mengikuti S-curve konstruksi ───────────────────────────
    // S-curve: mobilisasi rendah → puncak di tengah → finishing rendah

    private function buatTransaksi(
        Proyek $proyek,
        float $dana,
        Carbon $mulai,
        Carbon $selesai
    ): void {
        $maxTanggal = $selesai->isPast() ? $selesai : Carbon::now();

        // Hitung bobot S-curve per fase (awal/tengah/akhir)
        $durasiHari = max(1, $mulai->diffInDays($maxTanggal));

        foreach (self::PROPORSI as $kategori => $proporsi) {
            if (isset(self::FIXED[$kategori])) {
                // Biaya fixed: satu transaksi di awal proyek
                $tanggal = $mulai->copy()->addDays(rand(0, 7));
                if ($tanggal->gt($maxTanggal)) {
                    $tanggal = $maxTanggal->copy();
                }

                Transaksi::create([
                    'proyek_id'  => $proyek->proyek_id,
                    'kategori'   => $kategori,
                    'jumlah'     => self::FIXED[$kategori],
                    'persen'     => null,
                    'tanggal'    => $tanggal,
                    'keterangan' => "Biaya tetap {$kategori}",
                ]);
                continue;
            }

            $totalKategori = $dana * $proporsi;

            if (in_array($kategori, Transaksi::KATEGORI_DENGAN_ITEM)) {
                // Kategori dengan item: buat 2–4 transaksi tersebar mengikuti S-curve
                $jumlahBatch  = rand(2, 4);
                $bobotSCurve  = $this->sCurveWeights($jumlahBatch);
                $sisaDana     = $totalKategori;
                $transaksiList = [];

                foreach ($bobotSCurve as $idx => $bobot) {
                    $porsi   = ($idx === $jumlahBatch - 1)
                        ? $sisaDana  // sisa semua ke transaksi terakhir
                        : round($totalKategori * $bobot);
                    $sisaDana -= $porsi;

                    // Tanggal sesuai posisi dalam durasi proyek
                    $progressPct = ($idx + 1) / $jumlahBatch;
                    $offsetHari  = (int) ($durasiHari * $progressPct * 0.9);
                    $tanggal     = $mulai->copy()->addDays($offsetHari + rand(-3, 3));
                    $tanggal     = $tanggal->max($mulai)->min($maxTanggal);

                    $transaksi = Transaksi::create([
                        'proyek_id'  => $proyek->proyek_id,
                        'kategori'   => $kategori,
                        'jumlah'     => 0,
                        'persen'     => null,
                        'tanggal'    => $tanggal,
                        'keterangan' => "Termin " . ($idx + 1) . " - {$kategori}",
                    ]);

                    // Buat item untuk transaksi ini
                    $totalItem = $this->buatItemTransaksi($transaksi, $porsi, $kategori, $tanggal, $maxTanggal);

                    $persen = $dana > 0 ? round(($totalItem / $dana) * 100, 2) : 0;
                    $transaksi->update(['jumlah' => $totalItem, 'persen' => $persen]);

                    $transaksiList[] = $transaksi;
                }
            } else {
                // jasa_tukang & mandor: bayar per termin mengikuti progress
                $jumlahTermin = rand(2, 4);
                $bobotSCurve  = $this->sCurveWeights($jumlahTermin);
                $sisaDana     = $totalKategori;

                foreach ($bobotSCurve as $idx => $bobot) {
                    $jumlah  = ($idx === $jumlahTermin - 1)
                        ? $sisaDana
                        : round($totalKategori * $bobot);
                    $sisaDana -= $jumlah;

                    $progressPct = ($idx + 1) / $jumlahTermin;
                    $offsetHari  = (int) ($durasiHari * $progressPct * 0.9);
                    $tanggal     = $mulai->copy()->addDays($offsetHari + rand(-3, 3));
                    $tanggal     = $tanggal->max($mulai)->min($maxTanggal);

                    $persen = $dana > 0 ? round(($jumlah / $dana) * 100, 2) : 0;

                    Transaksi::create([
                        'proyek_id'  => $proyek->proyek_id,
                        'kategori'   => $kategori,
                        'jumlah'     => $jumlah,
                        'persen'     => $persen,
                        'tanggal'    => $tanggal,
                        'keterangan' => "Termin " . ($idx + 1) . " - {$kategori}",
                    ]);
                }
            }
        }
    }

    // ── S-curve weights: rendah–tinggi–rendah ────────────────────────────────

    private function sCurveWeights(int $n): array
    {
        if ($n === 1) return [1.0];

        // Profil distribusi S-curve: awal kecil, tengah besar, akhir kecil
        $raw = [];
        for ($i = 0; $i < $n; $i++) {
            $t      = $i / ($n - 1); // 0.0 → 1.0
            // Bell curve miring ke tengah-kanan (puncak di 60% durasi)
            $raw[]  = exp(-pow(($t - 0.6) * 2.5, 2));
        }

        $sum = array_sum($raw);
        return array_map(fn($v) => $v / $sum, $raw);
    }

    // ── Buat item transaksi ───────────────────────────────────────────────────

    private function buatItemTransaksi(
        Transaksi $transaksi,
        float $targetTotal,
        string $kategori,
        Carbon $tanggalAwal,
        Carbon $maxTanggal
    ): float {
        $jumlahItem  = rand(2, 5);
        $totalAktual = 0;

        for ($j = 1; $j <= $jumlahItem; $j++) {
            $tanggalItem = Carbon::createFromTimestamp(
                rand($tanggalAwal->timestamp, $maxTanggal->timestamp)
            );

            // Sesuaikan qty & harga agar total mendekati targetTotal
            $porsiItem = $j === $jumlahItem
                ? max(1, $targetTotal - $totalAktual)
                : round($targetTotal / $jumlahItem * (0.8 + lcg_value() * 0.4));

            $harga    = rand(50_000, 500_000);
            $qty      = max(1, (int) round($porsiItem / $harga));
            $subtotal = $qty * $harga;
            $totalAktual += $subtotal;

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

        return (float) $totalAktual;
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
