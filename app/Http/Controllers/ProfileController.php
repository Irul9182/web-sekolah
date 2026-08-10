<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Admin\FasilitasController;
use App\Models\Fasilitas;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function index()
    {
        $fasilitas = Fasilitas::with('images')
            ->whereIn('slug', array_keys(FasilitasController::DAFTAR_FASILITAS))
            ->get()
            ->keyBy('slug');

        $fasilitasData = collect(FasilitasController::DAFTAR_FASILITAS)->map(function ($info, $slug) use ($fasilitas) {
            $row = $fasilitas->get($slug);

            return [
                'slug' => $slug,
                'nama' => $info['nama'],
                'deskripsi' => $info['deskripsi'],
                'images' => $row?->images->pluck('image_url')->values() ?? [],
            ];
        })->values();

        return Inertia::render('profile/index', [
            'fasilitas' => $fasilitasData,
        ]);
    }
}