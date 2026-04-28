<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\FinanceService;
use Inertia\Inertia;

class ForecastController extends Controller
{
    protected FinanceService $financeService;

    public function __construct(FinanceService $financeService)
    {
        $this->financeService = $financeService;
    }

    public function index()
    {
        return Inertia::render('forecasting/index', [
            'forecasting' => null,
        ]);
    }

    public function generate(Request $request)
    {
        $request->validate([
            'periods' => 'nullable|integer|min:6',
        ]);

        $periods = $request->input('periods', 6);

        // 1. Ambil cashflow bulanan dari FinanceService
        //    Format: Collection of ['ds' => 'YYYY-MM-01', 'y' => float]
        $cashflowData = $this->financeService->aggregateCashflowBulanan()->toArray();

        // 2. Validasi minimal data historis
        if (count($cashflowData) < 6) {
            return back()->withErrors([
                'data' => 'Data historis minimal 6 bulan diperlukan untuk forecasting. '
                    . 'Saat ini hanya tersedia ' . count($cashflowData) . ' bulan.',
            ]);
        }

        // 3. Siapkan payload untuk Python
        $payload = json_encode([
            'periods' => $periods,
            'data'    => $cashflowData,
        ]);

        $encoded = base64_encode($payload);


        // 4. Panggil Python Prophet via shell_exec
        $scriptPath = base_path('app/python/prophet_runner.py');
        $pythonBin      = env('PYTHON_BIN', 'python');
        $escapedPayload = escapeshellarg($payload);
        $command = "{$pythonBin} {$scriptPath} {$encoded} 2>&1";
        $output = shell_exec($command);


        // 5. Validasi output Python
        if (empty($output)) {
            return back()->withErrors([
                'forecast' => 'Gagal menjalankan script Python. Periksa instalasi Prophet dan path: ' . $scriptPath,
            ]);
        }

        $result = json_decode($output, true);

        if (! $result || ($result['status'] ?? '') !== 'success') {
            return back()->withErrors([
                'forecast' => 'Prophet error: ' . ($result['error'] ?? $output),
            ]);
        }

        // 6. Kembalikan ke React via Inertia
        return Inertia::render('forecasting/index', [
            'forecasting' => [
                'actual'      => $result['actual'],
                'forecast'    => $result['forecast'],
                'periods'     => $result['periods'],
                'trained_on'  => $result['trained_on'],
                // Tambahan konteks keuangan untuk ditampilkan di UI
                'summary'     => $this->financeService->summaryPerusahaan(),
            ],
        ]);
    }
}
