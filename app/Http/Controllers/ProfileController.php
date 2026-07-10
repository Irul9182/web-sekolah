<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class ProfileController extends Controller
{
    public function visiMisi()
    {
        return Inertia::render('profile/visi-misi');
    }

    public function sejarah()
    {
        return Inertia::render('profile/sejarah');
    }

    public function struktur()
    {
        return Inertia::render('profile/struktur-organisasi');
    }
}