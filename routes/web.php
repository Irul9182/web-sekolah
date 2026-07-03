<?php

use App\Http\Controllers\Admin\BeritaController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProyekController;
use App\Http\Controllers\TransaksiController;
use App\Http\Controllers\ItemTransaksiController;
use App\Http\Controllers\KategoriProyekController;
use App\Http\Controllers\JenisProyekController;
use App\Http\Controllers\ForecastController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Admin\GaleriController;
use App\Http\Controllers\Admin\PengumumanController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {

    // Dashboard =====================
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard.index');

    // Berita =======================


    Route::get('/berita', [BeritaController::class, 'index'])->name('berita.index');
    Route::post('/berita', [BeritaController::class, 'store'])->name('berita.store');
    Route::post('/berita/{id}', [BeritaController::class, 'update'])->name('berita.update');
    Route::delete('/berita/{id}', [BeritaController::class, 'destroy'])->name('berita.destroy');

    // Route::resource('berita', BeritaController::class)->names([
    //     'index'   => 'berita.index',
    //     'create'  => 'berita.create',
    //     'store'   => 'berita.store',
    //     'edit'    => 'berita.edit',
    //     'update'  => 'berita.update',
    //     'delete' => 'berita.destroy',
    // ]);




    // Pengumuman =======================
    Route::get('/pengumuman', [PengumumanController::class, 'index'])->name('pengumuman.index');
    // Galeri =======================
    Route::get('/galeri', [GaleriController::class, 'index'])->name('galeri.index');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
