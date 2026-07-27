<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class JurusanController extends Controller
{
    public function tkj()
    {
        return Inertia::render('jurusan/tkj', [
            // isi dengan slug galeri kalau albumnya sudah dibuat di admin, misal: 'kegiatan-praktikum-tkj'
            'galeri_slug' => null,
        ]);
    }

    public function ap()
    {
        return Inertia::render('jurusan/ap', [
            'galeri_slug' => 'kegiatan-praktek-dan-pembelajaran-jurusan-administrasi-perkantoran-7-2026',
        ]);
    }

    public function ak()
    {
        return Inertia::render('jurusan/ak', [
            'galeri_slug' => 'kegiatan-praktek-dan-pembelajaran-jurusan-akutansi-7-2026',
        ]);
    }

    public function mavib()
    {
        return Inertia::render('jurusan/mavib', [
            'galeri_slug' => null,
        ]);
    }
}