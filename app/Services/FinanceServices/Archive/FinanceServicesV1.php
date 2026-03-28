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

        $total_pemasukan   = $transaksi
            ->where('tipe', Transaksi::TIPE_PEMASUKAN)
            ->sum('jumlah');

        $total_pengeluaran = $transaksi
            ->where('tipe', Transaksi::TIPE_PENGELUARAN)
            ->sum('jumlah');

        $cashflow = $total_pemasukan - $total_pengeluaran;

        // Breakdown pengeluaran per kategori
        $breakdown = $transaksi
            ->where('tipe', Transaksi::TIPE_PENGELUARAN)
            ->groupBy('kategori')
            ->map(fn($group) => $group->sum('jumlah'));

        return [
            'total_pemasukan'   => $total_pemasukan,
            'total_pengeluaran' => $total_pengeluaran,
            'cashflow'          => $cashflow,
            'breakdown'         => $breakdown,
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
        return Transaksi::query()
            ->selectRaw("
                DATE_FORMAT(tanggal, '%Y-%m-01') as ds,
                SUM(CASE WHEN tipe = 'pemasukan'   THEN jumlah ELSE 0 END) as total_pemasukan,
                SUM(CASE WHEN tipe = 'pengeluaran' THEN jumlah ELSE 0 END) as total_pengeluaran,
                SUM(CASE WHEN tipe = 'pemasukan'   THEN jumlah ELSE 0 END) -
                SUM(CASE WHEN tipe = 'pengeluaran' THEN jumlah ELSE 0 END) as y
            ")
            ->groupByRaw("DATE_FORMAT(tanggal, '%Y-%m-01')")
            ->orderBy('ds')
            ->get()
            ->map(fn($row) => [
                'ds' => $row->ds,
                'y'  => (float) $row->y,
            ]);
    }

    /**
     * Summary dashboard perusahaan — semua proyek.
     */
    public function summaryPerusahaan(): array
    {
        $semua = Transaksi::all();

        $total_pemasukan   = $semua->where('tipe', Transaksi::TIPE_PEMASUKAN)->sum('jumlah');
        $total_pengeluaran = $semua->where('tipe', Transaksi::TIPE_PENGELUARAN)->sum('jumlah');

        return [
            'total_pemasukan'   => $total_pemasukan,
            'total_pengeluaran' => $total_pengeluaran,
            'cashflow'          => $total_pemasukan - $total_pengeluaran,
            'total_proyek'      => Proyek::count(),
            'proyek_berjalan'   => Proyek::where('status', 'sedang_berjalan')->count(),
            'proyek_selesai'    => Proyek::where('status', 'selesai')->count(),
        ];
    }
}
