<?php

namespace App\Http\Controllers;

use App\Models\Transaksi;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;
use App\Models\Proyek;
use App\Services\FinanceService;

class TransaksiController extends Controller
{

    protected FinanceService $financeService;

    public function __construct(FinanceService $financeService)
    {
        $this->financeService = $financeService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        //
        $search = $request->query('search');

        $query = Transaksi::select([
            'kategori',
            'jumlah',
            'tanggal',
            "persen",
            'tanggal_mulai',
            // 'keterangan',
        ]);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nama_proyek', 'like', "%$search%");
            });
        }
        $transaksi = Transaksi::with('proyek')
            ->paginate($request->input('per_page', 10));


        return Inertia::render('transaction/index', [
            'list_transaksi' => $transaksi,
            'filters' => [
                'search' => $search
            ]
        ]);
    }

    // search
    public function search(Request $request)
    {
        $query = $request->get('search', '');

        $proyeks = Proyek::query()
            ->when($query, fn($q) => $q->where('nama_proyek', 'like', "%{$query}%"))
            ->limit(20)
            ->get(['proyek_id', 'nama_proyek']);

        return response()->json($proyeks);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        return Inertia::render('transaction/create/index');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show($transaksi_id)
    {
        $transaksi = Transaksi::with('proyek')->findOrFail($transaksi_id);
        $anggaran  = $this->financeService->hitungAnggaranProyek($transaksi->proyek);

        return Inertia::render('transaction/detail/index', [
            'transaksi' => $transaksi,
            'anggaran'  => $anggaran,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(transaksi $transaksi)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, transaksi $transaksi)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($transaksi_id): RedirectResponse
    {
        $transaksi = Transaksi::findOrFail($transaksi_id);

        $transaksi->delete();

        return redirect()
            ->route('transaction.index')
            ->with(['success' => 'Transaksi berhasil dihapus!']);
    }
}
