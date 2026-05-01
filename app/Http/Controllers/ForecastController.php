<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\FinanceService;
use Inertia\Inertia;
use Carbon\Carbon;

class ForecastController extends Controller
{
    protected FinanceService $financeService;

    public function __construct(FinanceService $financeService)
    {
        $this->financeService = $financeService;
    }

    public function index(Request $request)
    {


        return Inertia::render('forecasting/index', [
            'forecasting' => null,
        ]);
    }
    public function list_cashflow(Request $request)
    {
        $request->validate([
            'start_date' => 'nullable|date',
            'end_date'   => 'nullable|date',
        ]);

        $start = $request->query('start_date')
            ? Carbon::parse($request->query('start_date'))->startOfMonth()
            : null;

        $end = $request->query('end_date')
            ? Carbon::parse($request->query('end_date'))->endOfMonth()
            : null;

        $cashflow = $this->financeService->aggregateCashflowDetail($start, $end);

        return response()->json([
            'list_cashflow' => $cashflow,
        ]);
    }

    public function generate(Request $request)
    {
        $request->validate([
            'periods' => 'nullable|integer|min:1',
            'training_months' => 'nullable|integer|min:6',
        ]);

        $periods = $request->input('periods');
        $trainingMonths = $request->input('training_months');
        // Ambil SEMUA data historis — tanpa filter periode
        $cashflowData = $this->financeService->aggregateCashflowBulanantAll()->toArray();

        if (count($cashflowData) < 6) {
            return back()->withErrors([
                'data' => 'Data historis minimal 6 bulan diperlukan. '
                    . 'Saat ini hanya tersedia ' . count($cashflowData) . ' bulan.',
            ]);
        }

        $payload = json_encode([
            'periods' => $periods,
            'training_months' => $trainingMonths,
            'data' => $cashflowData,
        ]);
        $encoded        = base64_encode($payload);
        $scriptPath     = base_path('app/python/prophet_runner.py');
        $pythonBin      = env('PYTHON_BIN', 'python');
        $command        = "{$pythonBin} {$scriptPath} {$encoded} 2>&1";
        $output         = shell_exec($command);

        if (empty($output)) {
            return back()->withErrors([
                'forecast' => 'Gagal menjalankan script Python.',
            ]);
        }

        // Ambil hanya baris JSON terakhir — abaikan log Prophet
        $lines      = array_filter(explode("\n", trim($output)));
        $lastLine   = end($lines);
        $result     = json_decode($lastLine, true);

        if (!$result || ($result['status'] ?? '') !== 'success') {
            return back()->withErrors([
                'forecast' => 'Prophet error: ' . ($result['error'] ?? $output),
            ]);
        }

        return Inertia::render('forecasting/index', [
            'forecasting' => [
                'actual'     => $result['actual'],
                'forecast'   => $result['forecast'],
                'periods'    => $result['periods'],
                'trained_on' => $result['trained_on'],
                'mae'        => $result['mae'],   // ← tambah
                'rmse'  => $result['rmse'],
                'smape' => $result['smape'],
                'mape'  => $result['mape'],
                'summary'    => $this->financeService->summaryPerusahaan(), // pakai default
            ],
        ]);
    }
}
