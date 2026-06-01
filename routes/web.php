<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\BeritaController;

// Halaman publik
Route::get('/', [HomeController::class, 'index']);

// Redirect login default ke admin login
Route::get('/login', function() {
    return redirect('/admin/login');
})->name('login');

// Route login admin
Route::get('/admin/login', [AuthController::class, 'showLogin'])->name('admin.login');
Route::post('/admin/login', [AuthController::class, 'login']);

// Route admin (butuh login)
Route::middleware('auth')->prefix('admin')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');
    Route::post('/logout', [AuthController::class, 'logout'])->name('admin.logout');
    Route::resource('berita', BeritaController::class)->names('admin.berita');
});