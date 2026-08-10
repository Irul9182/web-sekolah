<?php

namespace App\Http\Controllers;

use App\Models\Berita;
use App\Models\Ekstrakulikuler;
use App\Models\Galeri;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $ekstrakulikulers = Ekstrakulikuler::orderByRaw(
            "FIELD(slug, '" . implode("','", array_keys(\App\Http\Controllers\Admin\EkstrakulikulerController::DAFTAR_EKSKUL)) . "')"
        )->get();

        // Ambil foto pertama dari album Galeri terkait tiap ekskul (kalau galeri_slug-nya diisi admin)
        $galeriSlugs = $ekstrakulikulers->pluck('galeri_slug')->filter()->all();
        $galeriMap = Galeri::with('images')->whereIn('slug', $galeriSlugs)->get()->keyBy('slug');

        $ekstrakulikulers = $ekstrakulikulers->map(function ($e) use ($galeriMap) {
            $galeri = $e->galeri_slug ? $galeriMap->get($e->galeri_slug) : null;
            $e->thumbnail = $galeri?->images->first()?->image_url;
            return $e;
        });

        return Inertia::render('welcome', [
            'beritas' => Berita::with('berita_image')->orderBy('tanggal', 'desc')->take(4)->get(),
            'galeris' => Galeri::with('images')->latest()->take(4)->get(),
            'ekstrakulikulers' => $ekstrakulikulers,
        ]);
    }
}