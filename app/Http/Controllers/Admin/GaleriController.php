<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Models\Galeri;

class GaleriController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
{
    $search  = $request->query('search', '');
    $perPage = $request->query('per_page', 10);

    $galeris = Galeri::query()
        ->when($search, function ($q) use ($search) {
            $q->where('judul', 'like', "%{$search}%");
        })
        ->latest()
        ->paginate($perPage)
        ->withQueryString();

    return Inertia::render('galeri/index', [
        'galeris' => $galeris,
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
        //
         $request->validate([
        'judul'  => 'required',
        'gambar' => 'required|image|max:5120',
        ]);

        $path = $request->file('gambar')->store('galeri', 'public');

        Galeri::create([
            'judul'  => $request->judul,
            'gambar' => $path,
        ]);

        return redirect()->route('galeri.index')
            ->with('success', 'Foto berhasil ditambahkan!');
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
        //
        $galeri = Galeri::findOrFail($id);

        $request->validate([
            'judul'  => 'required',
            'gambar' => 'nullable|image|max:5120',
        ]);

        $data = [
            'judul' => $request->judul,
        ];

        if ($request->hasFile('gambar')) {
            if ($galeri->gambar && Storage::disk('public')->exists($galeri->gambar)) {
                Storage::disk('public')->delete($galeri->gambar);
            }

            $data['gambar'] = $request->file('gambar')->store('galeri', 'public');
        }

        $galeri->update($data);

        return redirect()->route('galeri.index')
            ->with('success', 'Foto berhasil diedit!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
            $galeri = Galeri::findOrFail($id);

        if ($galeri->gambar && Storage::disk('public')->exists($galeri->gambar)) {
            Storage::disk('public')->delete($galeri->gambar);
        }

        $galeri->delete();

        return redirect()->route('galeri.index')
            ->with('success', 'Foto berhasil dihapus!');
    }
}
