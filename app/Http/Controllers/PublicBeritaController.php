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
            ->latest()
            ->paginate(9)
            ->withQueryString();

        return Inertia::render('public/berita', [
            'beritas' => $beritas,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }
}
