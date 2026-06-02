<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\BeritaController;
use App\Http\Controllers\Admin\GaleriController;
use App\Http\Controllers\Admin\PengumumanController;
use Illuminate\Support\Facades\Route;

// Halaman publik
Route::get('/', [HomeController::class, 'index'])->name('home');

// Route login admin (Blade)
Route::get('/admin/login', [AuthController::class, 'showLogin'])->name('admin.login');
Route::post('/admin/login', [AuthController::class, 'login']);

// Route admin (Blade, butuh login)
Route::middleware('auth')->prefix('admin')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');
    Route::post('/logout', [AuthController::class, 'logout'])->name('admin.logout');
    Route::resource('berita', BeritaController::class)->names('admin.berita');
    Route::resource('galeri', GaleriController::class)->names('admin.galeri');
    Route::resource('pengumuman', PengumumanController::class)->names('admin.pengumuman');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
