<?php

namespace App\Http\Controllers;

use App\Models\Berita;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicBeritaController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search', '');

        $beritas = Berita::query()
            ->with('berita_image')
            ->when($search, function ($q) use ($search) {
                $q->where('judul', 'like', "%{$search}%");
            })
            ->orderBy('tanggal', 'desc')
            ->paginate(9)
            ->withQueryString();

        return Inertia::render('public/berita', [
            'beritas' => $beritas,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function show(string $slug)
    {
    $berita = Berita::with('berita_image')
        ->where('slug', $slug)
        ->firstOrFail();

    $beritaLainnya = Berita::with('berita_image')
        ->where('id', '!=', $berita->id)
        ->orderBy('tanggal', 'desc')
        ->take(3)
        ->get();

    return Inertia::render('public/berita-detail', [
        'berita' => $berita,
        'beritaLainnya' => $beritaLainnya,
        ]);
    }
}
