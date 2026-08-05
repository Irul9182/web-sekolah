<?php

namespace App\Http\Controllers;

use App\Models\Ekstrakulikuler;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicEkstrakulikulerController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search', '');

        $ekstrakulikulers = Ekstrakulikuler::withCount('prestasis')
            ->when($search, function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(9)
            ->withQueryString();

        return Inertia::render('public/ekstrakulikuler', [
            'ekstrakulikulers' => $ekstrakulikulers,
            'filters' => ['search' => $search],
        ]);
    }

    public function show($slug)
    {
        $ekstrakulikuler = Ekstrakulikuler::with(['images', 'prestasis'])
            ->where('slug', $slug)
            ->firstOrFail();

        $ekstrakulikulerLainnya = Ekstrakulikuler::where('id', '!=', $ekstrakulikuler->id)
            ->latest()
            ->take(3)
            ->get();

        return Inertia::render('public/ekstrakulikuler-detail', [
            'ekstrakulikuler' => $ekstrakulikuler,
            'ekstrakulikulerLainnya' => $ekstrakulikulerLainnya,
        ]);
    }
}