<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class ProfileController extends Controller
{
    /**
     * Halaman profil sekolah gabungan: Visi & Misi, Sejarah, dan Struktur
     * Organisasi dalam satu halaman (sebelumnya tiga halaman terpisah).
     * File React: resources/js/pages/profile/index.tsx
     */
    public function index()
    {
        return Inertia::render('profile/index');
    }
}