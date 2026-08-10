<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Admin\EkstrakulikulerController as AdminEkstrakulikulerController;
use App\Models\Ekstrakulikuler;
use App\Models\Galeri;
use Inertia\Inertia;

class PublicEkstrakulikulerController extends Controller
{
    public function index()
    {
        $ekstrakulikulers = Ekstrakulikuler::orderByRaw(
            "FIELD(slug, '" . implode("','", array_keys(AdminEkstrakulikulerController::DAFTAR_EKSKUL)) . "')"
        )->get();

        $galeriSlugs = $ekstrakulikulers->pluck('galeri_slug')->filter()->all();
        $galeriMap = Galeri::with('images')->whereIn('slug', $galeriSlugs)->get()->keyBy('slug');

        $ekstrakulikulers = $ekstrakulikulers->map(function ($e) use ($galeriMap) {
            $galeri = $e->galeri_slug ? $galeriMap->get($e->galeri_slug) : null;
            $e->deskripsi = AdminEkstrakulikulerController::DAFTAR_EKSKUL[$e->slug]['deskripsi'];
            $e->thumbnail = $galeri?->images->first()?->image_url;
            return $e;
        });

        return Inertia::render('public/ekstrakulikuler', [
            'ekstrakulikulers' => $ekstrakulikulers,
        ]);
    }

    public function show($slug)
    {
        abort_unless(array_key_exists($slug, AdminEkstrakulikulerController::DAFTAR_EKSKUL), 404);

        $ekstrakulikuler = Ekstrakulikuler::where('slug', $slug)->firstOrFail();
        $ekstrakulikuler->deskripsi = AdminEkstrakulikulerController::DAFTAR_EKSKUL[$slug]['deskripsi'];

        $galeri = $ekstrakulikuler->galeri_slug
            ? Galeri::with('images')->where('slug', $ekstrakulikuler->galeri_slug)->first()
            : null;

        return Inertia::render('public/ekstrakulikuler-detail', [
            'ekstrakulikuler' => $ekstrakulikuler,
            'galeri' => $galeri,
        ]);
    }
}