<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Admin\FasilitasController as AdminFasilitasController;
use App\Models\Fasilitas;
use Inertia\Inertia;

class PublicFasilitasController extends Controller
{
    public function show($slug)
    {
        abort_unless(array_key_exists($slug, AdminFasilitasController::DAFTAR_FASILITAS), 404);

        $info = AdminFasilitasController::DAFTAR_FASILITAS[$slug];
        $fasilitas = Fasilitas::with('images')->where('slug', $slug)->first();

        return Inertia::render('public/fasilitas-detail', [
            'fasilitas' => [
                'slug' => $slug,
                'nama' => $info['nama'],
                'deskripsi' => $info['deskripsi'],
                'images' => $fasilitas?->images->pluck('image_url')->values() ?? [],
            ],
        ]);
    }
}