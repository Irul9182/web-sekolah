<?php

use App\Http\Controllers\Admin\BeritaController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Admin\GaleriController;
use App\Http\Controllers\Admin\PengumumanController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\HomeController;

Route::get('/', [HomeController::class, 'index'])->name('home');

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
    Route::post('/pengumuman', [PengumumanController::class, 'store'])->name('pengumuman.store');
    Route::post('/pengumuman/{id}', [PengumumanController::class, 'update'])->name('pengumuman.update');
    Route::delete('/pengumuman/{id}', [PengumumanController::class, 'destroy'])->name('pengumuman.destroy');


    // Galeri =======================
    Route::get('/galeri', [GaleriController::class, 'index'])->name('galeri.index');
    Route::post('/galeri', [GaleriController::class, 'store'])->name('galeri.store');
    Route::post('/galeri/{id}', [GaleriController::class, 'update'])->name('galeri.update');
    Route::delete('/galeri/{id}', [GaleriController::class, 'destroy'])->name('galeri.destroy');

    Route::get('/profile/visi', [ProfileController::class, 'visi'])->name('profile.visi');
    Route::get('/profile/misi', [ProfileController::class, 'misi'])->name('profile.misi');
    Route::get('/profile/sejarah', [ProfileController::class, 'sejarah'])->name('profile.sejarah');
    Route::get('/profile/struktur-organisasi', [ProfileController::class, 'struktur'])->name('profile.struktur');

});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
