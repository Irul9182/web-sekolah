<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProyekController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Project =====================
    Route::get('project', [ProyekController::class, 'index'])->name('project');
    Route::get('project/create', function () {
        return Inertia::render('project/create/index');
    })->name('project/create');
    Route::get('/project/{id}/edit', function ($id) {
        return Inertia::render('project/create/index', [
            'proyek_id' => $id
        ]);
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
