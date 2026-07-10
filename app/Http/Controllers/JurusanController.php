<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class JurusanController extends Controller
{
    public function tkj()
    {
        return Inertia::render('jurusan/tkj');
    }

    public function ap()
    {
        return Inertia::render('jurusan/ap');
    }

    public function ak()
    {
        return Inertia::render('jurusan/ak');
    }

    public function mavib()
    {
        return Inertia::render('jurusan/mavib');
    }
}