<?php

namespace App\Http\Controllers;

use App\Models\Berita;
use App\Models\Galeri;
use App\Models\Pengumuman;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        return Inertia::render('welcome', [
            'beritas' => Berita::with('berita_image')->latest()->take(4)->get(),
            'pengumumans' => Pengumuman::latest()->take(2)->get(),
            'galeris' => Galeri::latest()->take(4)->get(),
        ]);
    }
}