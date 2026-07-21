<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Galeri;
use App\Models\GaleriImage;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class GaleriController extends Controller
{
    public function index(Request $request)
    {
        $search  = $request->query('search', '');
        $perPage = $request->query('per_page', 10);

        $galeris = Galeri::with('images')
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

    public function store(Request $request)
    {
        $request->validate([
            'judul'   => 'required',
            'bulan'   => 'required|integer|min:1|max:12',
            'tahun'   => 'required|integer|min:2000|max:2100',
            'gambar'  => 'required|array|min:1',
            'gambar.*' => 'image|max:4096',
        ]);

        $galeri = Galeri::create([
            'judul' => $request->judul,
            'isi'   => $request->isi ?? '',
            'slug'  => Str::slug($request->judul . '-' . $request->bulan . '-' . $request->tahun),
            'bulan' => $request->bulan,
            'tahun' => $request->tahun,
        ]);

        foreach ($request->file('gambar') as $file) {
            $path = $file->store('galeri', 'public');
            GaleriImage::create([
                'galeri_id' => $galeri->id,
                'image_url' => '/storage/' . $path,
            ]);
        }

        return redirect()->route('galeri.index')
            ->with('success', 'Galeri berhasil ditambahkan!');
    }

    public function destroy($id)
    {
        $galeri = Galeri::with('images')->findOrFail($id);
        $galeri->images()->delete();
        $galeri->delete();

        return redirect()->route('galeri.index')
            ->with('success', 'Galeri berhasil dihapus!');
    }
}