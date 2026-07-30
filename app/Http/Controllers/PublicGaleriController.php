<?php

namespace App\Http\Controllers;

use App\Models\Galeri;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicGaleriController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search', '');

        $galeris = Galeri::query()
            ->with('images')
            ->when($search, function ($q) use ($search) {
                $q->where('judul', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('public/galeri', [
            'galeris' => $galeris,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function show(string $slug)
    {
        $galeri = Galeri::with('images')
            ->where('slug', $slug)
            ->firstOrFail();

        return Inertia::render('public/galeri-detail', [
            'galeri' => $galeri,
        ]);
    }
}