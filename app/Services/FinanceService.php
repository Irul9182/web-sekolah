<?php

namespace App\Services;

use App\Models\Proyek;
use App\Models\Transaksi;
use Illuminate\Support\Collection;

class FinanceService
{
    /**
     * Hitung semua komponen biaya dari pagu proyek.
     * Sumber: field persentase di tabel proyek.
     */
    public function hitungAnggaranProyek(Proyek $proyek): array
    {
        $pagu = (float) $proyek->pagu_total;

        // 1. Potong pajak dulu
        $nilai_pajak        = $pagu * ($proyek->pajak_persen / 100);
        $dana_setelah_pajak = $pagu - $nilai_pajak;

        // 2. Hitung komponen dari dana setelah pajak
        $uang_bahan         = $dana_setelah_pajak * ($proyek->uang_bahan_persen / 100);
        $jasa_tukang        = $dana_setelah_pajak * ($proyek->jasa_tukang_persen / 100);
        $biaya_tak_terduga  = $dana_setelah_pajak * ($proyek->biaya_tak_terduga_persen / 100);

        // 3. Mandor = 1.5% dari jasa tukang
        $biaya_mandor       = $jasa_tukang * 0.015;

        // 4. Biaya staff (fixed, bukan persentase)
        $biaya_staff        = (float) $proyek->biaya_staff_perpajakan
            + (float) $proyek->biaya_staff_entry_data;

        // 5. Total pengeluaran yang dianggarkan
        $total_pengeluaran  = $jasa_tukang
            + $uang_bahan
            + $biaya_tak_terduga
            + $biaya_mandor
            + $biaya_staff;

        // 6. Netto = dana setelah pajak - semua pengeluaran
        $netto              = $dana_setelah_pajak - $total_pengeluaran;

        return [
            'pagu_total'            => $pagu,
            'nilai_pajak'           => $nilai_pajak,
            'dana_setelah_pajak'    => $dana_setelah_pajak,
            'uang_bahan'            => $uang_bahan,
            'jasa_tukang'           => $jasa_tukang,
            'biaya_tak_terduga'     => $biaya_tak_terduga,
            'biaya_mandor'          => $biaya_mandor,
            'biaya_staff'           => $biaya_staff,
            'total_pengeluaran'     => $total_pengeluaran,
            'netto'                 => $netto,
        ];
    }

    /**
     * Hitung cashflow aktual proyek dari tabel transaksi.
     * Sumber: transaksi yang sudah diinput staff finance.
     */
    public function hitungCashflowAktual(Proyek $proyek): array
    {
        $transaksi = $proyek->transaksi;

        $total_pengeluaran = $transaksi->sum('jumlah');

        // Pemasukan = pagu_total langsung
        $cashflow = (float) $proyek->pagu_total - $total_pengeluaran;

        $breakdown = $transaksi
            ->groupBy('kategori')
            ->map(fn($group) => $group->sum('jumlah'));

        return [
            'pemasukan'         => (float) $proyek->pagu_total,
            'total_pengeluaran' => $total_pengeluaran,
            'cashflow'          => $cashflow,
            'breakdown'         => $breakdown,
        ];
    }


    public function hitungRealisasiPerKategori(Proyek $proyek): array
    {
        $rencana  = $this->hitungAnggaranProyek($proyek);
        $transaksi = $proyek->relationLoaded('transaksi')
            ? $proyek->transaksi
            : $proyek->transaksi()->get();


        // Aktual per kategori dari transaksi
        $aktual = $transaksi->isNotEmpty()
            ? $transaksi->groupBy('kategori')->map(fn($group) => [
                'jumlah' => $group->sum('jumlah'),
                'items'  => $group->map(fn($t) => [
                    'transaksi_id' => $t->transaksi_id,
                    'persen'       => $t->persen,
                    'jumlah'       => $t->jumlah,
                    'tanggal'      => $t->tanggal,
                    'keterangan'   => $t->keterangan,
                ])
            ])
            : collect();

        // Gabungkan rencana vs aktual per kategori
        return [
            'jasa_tukang' => [
                'rencana' => $rencana['jasa_tukang'],
                'aktual'  => $aktual['jasa_tukang']['jumlah'] ?? 0,
                'items'   => $aktual['jasa_tukang']['items'] ?? [],
                'selisih' => $rencana['jasa_tukang'] - ($aktual['jasa_tukang']['jumlah'] ?? 0),
            ],
            'uang_bahan' => [
                'rencana' => $rencana['uang_bahan'],
                'aktual'  => $aktual['material']['jumlah'] ?? 0,
                'items'   => $aktual['material']['items'] ?? [],
                'selisih' => $rencana['uang_bahan'] - ($aktual['material']['jumlah'] ?? 0),
            ],
            'mandor' => [
                'rencana' => $rencana['biaya_mandor'],
                'aktual'  => $aktual['mandor']['jumlah'] ?? 0,
                'items'   => $aktual['mandor']['items'] ?? [],
                'selisih' => $rencana['biaya_mandor'] - ($aktual['mandor']['jumlah'] ?? 0),
            ],
            'staff_perpajakan' => [
                'rencana' => (float) $proyek->biaya_staff_perpajakan,
                'aktual'  => $aktual['staff_perpajakan']['jumlah'] ?? 0,
                'items'   => $aktual['staff_perpajakan']['items'] ?? [],
                'selisih' => (float) $proyek->biaya_staff_perpajakan - ($aktual['staff_perpajakan']['jumlah'] ?? 0),
            ],
            'staff_entry_data' => [
                'rencana' => (float) $proyek->biaya_staff_entry_data,
                'aktual'  => $aktual['staff_entry_data']['jumlah'] ?? 0,
                'items'   => $aktual['staff_entry_data']['items'] ?? [],
                'selisih' => (float) $proyek->biaya_staff_entry_data - ($aktual['staff_entry_data']['jumlah'] ?? 0),
            ],
            'biaya_tak_terduga' => [
                'rencana' => $rencana['biaya_tak_terduga'],
                'aktual'  => $aktual['biaya_tak_terduga']['jumlah'] ?? 0,
                'items'   => $aktual['biaya_tak_terduga']['items'] ?? [],
                'selisih' => $rencana['biaya_tak_terduga'] - ($aktual['biaya_tak_terduga']['jumlah'] ?? 0),
            ],
        ];
    }


    /**
     * Bandingkan anggaran vs aktual per proyek.
     * Berguna untuk halaman detail proyek & laporan.
     */
    public function hitungRealisasi(Proyek $proyek): array
    {
        $anggaran = $this->hitungAnggaranProyek($proyek);
        $aktual   = $this->hitungCashflowAktual($proyek);

        $selisih  = $aktual['cashflow'] - $anggaran['netto'];
        $status   = match (true) {
            $selisih > 0  => 'surplus',
            $selisih < 0  => 'defisit',
            default       => 'impas',
        };

        return [
            'anggaran'  => $anggaran,
            'aktual'    => $aktual,
            'selisih'   => $selisih,
            'status'    => $status,
        ];
    }

    /**
     * Agregasi cashflow bulanan seluruh perusahaan.
     * Output ini yang jadi input Prophet nanti di Step 7.
     *
     * Format return:
     * [
     *   ['ds' => '2024-01-01', 'y' => 105000000],
     *   ['ds' => '2024-02-01', 'y' => 80000000],
     *   ...
     * ]
     */
    public function aggregateCashflowBulanan(): Collection
    {
        // Pengeluaran aktual per bulan dari transaksi
        $pengeluaran = Transaksi::query()
            ->selectRaw("DATE_FORMAT(tanggal, '%Y-%m-01') as bulan, SUM(jumlah) as total")
            ->groupByRaw("DATE_FORMAT(tanggal, '%Y-%m-01')")
            ->pluck('total', 'bulan');

        // Pemasukan per bulan dari pagu proyek (berdasarkan tanggal mulai)
        $pemasukan = Proyek::query()
            ->selectRaw("DATE_FORMAT(tanggal_mulai, '%Y-%m-01') as bulan, SUM(pagu_total) as total")
            ->groupByRaw("DATE_FORMAT(tanggal_mulai, '%Y-%m-01')")
            ->pluck('total', 'bulan');

        // Gabungkan semua bulan
        $bulan = collect($pemasukan->keys()->merge($pengeluaran->keys())->unique()->sort());

        return $bulan->map(fn($b) => [
            'ds' => $b,
            'y'  => (float)($pemasukan[$b] ?? 0) - (float)($pengeluaran[$b] ?? 0),
        ])->values();
    }

    /**
     * Summary dashboard perusahaan — semua proyek.
     */
    public function summaryPerusahaan(): array
    {
        $proyeks = Proyek::with('transaksi')->get();

        $total_pagu            = $proyeks->sum('pagu_total');
        $total_pengeluaran     = $proyeks->sum(fn($p) => $p->transaksi->sum('jumlah'));
        $total_cashflow        = $total_pagu - $total_pengeluaran;
        $total_netto           = $proyeks->sum(fn($p) => $this->hitungAnggaranProyek($p)['netto']);

        return [
            'total_pagu'        => (float) $total_pagu,
            'total_pengeluaran' => (float) $total_pengeluaran,
            'total_cashflow'    => (float) $total_cashflow,
            'total_netto'       => (float) $total_netto,
            'total_proyek'      => $proyeks->count(),
            'proyek_berjalan'   => $proyeks->where('status', 'sedang_berjalan')->count(),
            'proyek_selesai'    => $proyeks->where('status', 'selesai')->count(),
            'proyek_dibatalkan' => $proyeks->where('status', 'dibatalkan')->count(),
        ];
    }
}
