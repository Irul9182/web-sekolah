<?php

namespace App\Http\Controllers;

use App\Models\Pengumuman;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicPengumumanController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search', '');

        $pengumumans = Pengumuman::query()
            ->when($search, function ($q) use ($search) {
                $q->where('judul', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(9)
            ->withQueryString();

        return Inertia::render('public/pengumuman', [
            'pengumumans' => $pengumumans,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }
}
