<?php

namespace App\Http\Controllers;

use App\Models\Proyek;
use App\Models\Transaksi;
use App\Services\FinanceService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct(protected FinanceService $financeService) {}

    public function index(Request $request)
    {
        return Inertia::render('dashboard', [
            'summary'               => $this->financeService->summaryPerusahaan(),
            'chartPemasukanBulanan' => $this->chartPemasukanPengeluaranBulanan(),
            'chartCashflowBulanan'  => $this->chartCashflowBulanan(),
            'chartStatusProyek'     => $this->chartStatusProyek(),
            'chartTopProyek'        => $this->chartTopProyek(),
        ]);
    }

    // ─── Chart 1: Pemasukan & Pengeluaran Bulanan (6 bulan terakhir) ─────────

    private function chartPemasukanPengeluaranBulanan(int $bulanTerakhir = 6): array
    {
        $start = Carbon::now()->startOfMonth()->subMonths($bulanTerakhir - 1);
        $end   = Carbon::now()->startOfMonth();

        $pengeluaran = Transaksi::query()
            ->selectRaw("DATE_FORMAT(tanggal, '%Y-%m-01') as bulan, SUM(jumlah) as total")
            ->whereBetween('tanggal', [$start, $end->copy()->endOfMonth()])
            ->groupByRaw("DATE_FORMAT(tanggal, '%Y-%m-01')")
            ->pluck('total', 'bulan');

        $pemasukan = Proyek::query()
            ->selectRaw("DATE_FORMAT(tanggal_mulai, '%Y-%m-01') as bulan, SUM(pagu_total) as total")
            ->whereBetween('tanggal_mulai', [$start, $end->copy()->endOfMonth()])
            ->groupByRaw("DATE_FORMAT(tanggal_mulai, '%Y-%m-01')")
            ->pluck('total', 'bulan');

        $labels          = [];
        $dataPemasukan   = [];
        $dataPengeluaran = [];

        $cursor = $start->copy();
        while ($cursor->lte($end)) {
            $bulan             = $cursor->format('Y-m-01');
            $labels[]          = $cursor->translatedFormat('M Y');
            $dataPemasukan[]   = (float) ($pemasukan[$bulan] ?? 0);
            $dataPengeluaran[] = (float) ($pengeluaran[$bulan] ?? 0);
            $cursor->addMonth();
        }

        return [
            'labels'      => $labels,
            'pemasukan'   => $dataPemasukan,
            'pengeluaran' => $dataPengeluaran,
        ];
    }

    // ─── Chart 2: Cashflow Bulanan Netto (6 bulan terakhir) ──────────────────

    private function chartCashflowBulanan(int $bulanTerakhir = 6): array
    {
        $bulanan = $this->financeService->aggregateCashflowBulanan();

        // takeLast() tidak ada di Laravel Collection — gunakan slice dari belakang
        $bulanan = $bulanan->slice(max(0, $bulanan->count() - $bulanTerakhir))->values();

        return [
            'labels'   => $bulanan->map(
                fn($b) => Carbon::parse($b['ds'])->translatedFormat('M Y')
            )->values()->toArray(),
            'cashflow' => $bulanan->pluck('y')->values()->toArray(),
        ];
    }

    // ─── Chart 3: Status Proyek (Pie/Donut) ──────────────────────────────────

    private function chartStatusProyek(): array
    {
        $counts = Proyek::query()
            ->selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        $statusMap = [
            'sedang_berjalan' => 'Berjalan',
            'selesai'         => 'Selesai',
            'dibatalkan'      => 'Dibatalkan',
        ];

        $labels = [];
        $data   = [];

        foreach ($statusMap as $key => $label) {
            $labels[] = $label;
            $data[]   = (int) ($counts[$key] ?? 0);
        }

        return compact('labels', 'data');
    }

    // ─── Chart 4: Top 5 Proyek by Pagu ───────────────────────────────────────

    private function chartTopProyek(int $limit = 5): array
    {
        $proyeks = Proyek::query()
            ->select('nama_proyek', 'pagu_total', 'status')
            ->orderByDesc('pagu_total')
            ->limit($limit)
            ->get();

        return [
            'labels' => $proyeks->pluck('nama_proyek')->toArray(),
            'pagu'   => $proyeks->pluck('pagu_total')->map(fn($v) => (float) $v)->toArray(),
            'status' => $proyeks->pluck('status')->toArray(),
        ];
    }
}
