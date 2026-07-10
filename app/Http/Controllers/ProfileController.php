<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class ProfileController extends Controller
{
    public function visi()
    {
        return Inertia::render('profile/visi');
    }

    public function misi()
    {
        return Inertia::render('profile/misi');
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
