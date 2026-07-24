<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Admin\BeritaController;
use App\Http\Controllers\Admin\GaleriController;
use App\Http\Controllers\Admin\PengumumanController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\JurusanController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PublicBeritaController;
use App\Http\Controllers\PublicGaleriController;
use App\Http\Controllers\PublicPengumumanController;
use Illuminate\Support\Facades\Route;


Route::middleware('guest')->group(function () {
    Route::get('login', [AuthenticatedSessionController::class, 'create'])
        ->name('login');

    Route::post('login', [AuthenticatedSessionController::class, 'store']);
});

// Hanya route logout yang perlu login — jadi grup ini ditutup
// segera setelahnya, tidak "membungkus" route-route publik di bawah.
Route::middleware('auth')->group(function () {
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');
});

Route::get('/', [HomeController::class, 'index'])->name('home');

// ==== Halaman publik: bisa diakses siapa saja, tanpa login ====

// Profile
Route::get('/profile/visi-misi', [ProfileController::class, 'visiMisi'])->name('profile.visi-misi');
Route::get('/profile/sejarah', [ProfileController::class, 'sejarah'])->name('profile.sejarah');
Route::get('/profile/struktur-organisasi', [ProfileController::class, 'struktur'])->name('profile.struktur');

// Jurusan
Route::get('/tkj', [JurusanController::class, 'tkj'])->name('jurusan.tkj');
Route::get('/ap', [JurusanController::class, 'ap'])->name('jurusan.ap');
Route::get('/ak', [JurusanController::class, 'ak'])->name('jurusan.ak');
Route::get('/mavib', [JurusanController::class, 'mavib'])->name('jurusan.mavib');

// Berita, Pengumuman, Galeri (publik, read-only — beda dari panel admin)
Route::get('/berita', [PublicBeritaController::class, 'index'])->name('public.berita');
Route::get('/berita/{slug}', [PublicBeritaController::class, 'show'])->name('public.berita.show');

Route::get('/pengumuman', [PublicPengumumanController::class, 'index'])->name('public.pengumuman');

Route::get('/galeri', [PublicGaleriController::class, 'index'])->name('public.galeri');
Route::get('/galeri/{slug}', [PublicGaleriController::class, 'show'])->name('public.galeri.show');

// ==== Panel Admin: butuh login, URL dipindah ke /admin/... ====
// Nama route (berita.index, dst) TIDAK berubah, jadi kode admin
// yang sudah pakai route('berita.index') dkk tetap jalan normal.

Route::middleware(['auth'])->prefix('admin')->group(function () {

    // Dashboard =====================
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard.index');

    // Berita =======================
    Route::get('/berita', [BeritaController::class, 'index'])->name('berita.index');
    Route::post('/berita', [BeritaController::class, 'store'])->name('berita.store');
    Route::post('/berita/{id}', [BeritaController::class, 'update'])->name('berita.update');
    Route::delete('/berita/{id}', [BeritaController::class, 'destroy'])->name('berita.destroy');

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

    // Akun (tambah admin baru) =======================
    // Dipindah dari route publik /register — sekarang cuma admin yang
    // sudah login yang bisa menambah akun admin baru.
    Route::get('/akun/tambah', [RegisteredUserController::class, 'create'])->name('akun.create');
    Route::post('/akun/tambah', [RegisteredUserController::class, 'store'])->name('akun.store');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
