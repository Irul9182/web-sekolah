<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\FinanceService;
use Inertia\Inertia;

class ForecastController extends Controller
{
    protected $financeService;

    public function __construct(FinanceService $financeService)
    {
        $this->financeService = $financeService;
    }

    public function index()
    {
        return Inertia::render('Forecast/Index', [
            'forecast' => null,
        ]);
    }

    public function generate(Request $request)
    {
        $request->validate([
            'periods' => 'nullable|integer|min:1|max:12',
        ]);

        $periods = $request->input('periods', 6);

        // 1. Ambil data cashflow bulanan dari DB
        $cashflowData = $this->getDummyData();

        // Validasi minimal data
        if (count($cashflowData) < 6) {
            return back()->withErrors([
                'data' => 'Data historis minimal 6 bulan diperlukan untuk forecasting.',
            ]);
        }

        // 2. Siapkan payload untuk Python
        $payload = json_encode([
            'periods' => $periods,
            'data'    => $cashflowData,
        ]);

        // 3. Panggil Python script via shell_exec
        $scriptPath = storage_path('app/python/prophet.py');
        $pythonBin  = env('PYTHON_BIN', 'python3');

        // Escape payload agar aman di shell
        $escapedPayload = escapeshellarg($payload);
        $command = "echo {$escapedPayload} | {$pythonBin} {$scriptPath} 2>&1";

        $output = shell_exec($command);

        // 4. Validasi output
        if (!$output) {
            return back()->withErrors([
                'forecast' => 'Gagal menjalankan script Python. Periksa instalasi Prophet.',
            ]);
        }

        $result = json_decode($output, true);

        if (!$result || ($result['status'] ?? '') !== 'success') {
            return back()->withErrors([
                'forecast' => 'Prophet error: ' . ($result['error'] ?? $output),
            ]);
        }

        // 5. Kembalikan ke React via Inertia
        return Inertia::render('Forecast/Index', [
            'forecast' => [
                'actual'   => $result['actual'],
                'forecast' => $result['forecast'],
                'periods'  => $result['periods'],
                'trained_on' => $result['trained_on'],
            ],
        ]);
    }

    private function getDummyData(): array
    {
        return [
            ['ds' => '2024-01-01', 'y' => 105000000],
            ['ds' => '2024-02-01', 'y' => 80000000],
            ['ds' => '2024-03-01', 'y' => 92000000],
            ['ds' => '2024-04-01', 'y' => 115000000],
            ['ds' => '2024-05-01', 'y' => 98000000],
            ['ds' => '2024-06-01', 'y' => 120000000],
            ['ds' => '2024-07-01', 'y' => 110000000],
            ['ds' => '2024-08-01', 'y' => 95000000],
            ['ds' => '2024-09-01', 'y' => 130000000],
            ['ds' => '2024-10-01', 'y' => 125000000],
            ['ds' => '2024-11-01', 'y' => 140000000],
            ['ds' => '2024-12-01', 'y' => 160000000],
        ];
    }
}
