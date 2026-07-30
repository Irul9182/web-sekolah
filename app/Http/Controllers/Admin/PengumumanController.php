<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Pengumuman;

class PengumumanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
{
    $search  = $request->query('search', '');
    $perPage = $request->query('per_page', 10);

    $pengumuman = Pengumuman::query()
        ->when($search, function ($q) use ($search) {
            $q->where('judul', 'like', "%{$search}%");
        })
        ->latest()
        ->paginate($perPage)
        ->withQueryString();

    return Inertia::render('pengumuman/index', [
        'pengumumans' => $pengumuman,
        'filters' => [
            'search'   => $search,
            'per_page' => $perPage,
        ],
    ]);
}

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
    $request->validate([
        'judul'     => 'required',
        'deskripsi' => 'required',
        'tanggal'   => 'nullable|date',
    ]);

    Pengumuman::create([
        'judul'     => $request->judul,
        'deskripsi' => $request->deskripsi,
        'tanggal'   => $request->tanggal,
    ]);

    return redirect()->route('pengumuman.index')
        ->with('success', 'Pengumuman berhasil ditambahkan!');
    }
    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $pengumuman = Pengumuman::findOrFail($id);

        $request->validate([
            'judul'     => 'required',
            'tanggal'   => 'required',
            'deskripsi' => 'required',
        ]);

        $pengumuman->update([
            'judul'     => $request->judul,
            'tanggal'   => $request->tanggal,
            'deskripsi' => $request->deskripsi,
        ]);

    return redirect()->route('pengumuman.index')
        ->with('success', 'Pengumuman berhasil diedit!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $pengumuman = Pengumuman::findOrFail($id);
        $pengumuman->delete();

        return redirect()->route('pengumuman.index')
            ->with('success', 'Pengumuman berhasil dihapus!');
    }
}
