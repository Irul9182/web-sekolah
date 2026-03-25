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
    Route::get('/project', [ProyekController::class, 'index'])->name('project.index');
    Route::get('/project/{id}/detail', [ProyekController::class, 'show'])->name('project.detail');
    Route::get('/project/create', function () {
        return Inertia::render('project/create/index');
    });
    Route::post('/project', [ProyekController::class, 'store'])->name('project.store');
    Route::get('/project/{id}/edit', [ProyekController::class, 'edit'])->name(('project.edit'));

    Route::put('/project/{id}', [ProyekController::class, 'update'])->name('project.update');
    Route::delete('/project/{id}', [ProyekController::class, 'destroy'])->name('project.destroy');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
