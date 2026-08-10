<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Admin\BeritaController;
use App\Http\Controllers\Admin\GaleriController;
use App\Http\Controllers\Admin\StrukturOrganisasiController;
use App\Http\Controllers\Admin\EkstrakulikulerController;
use App\Http\Controllers\Admin\FasilitasController;
use App\Http\Controllers\Admin\JurusanController as AdminJurusanController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PublicFasilitasController;
use App\Http\Controllers\JurusanController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PublicBeritaController;
use App\Http\Controllers\PublicGaleriController;
use App\Http\Controllers\PublicEkstrakulikulerController;
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

// Profile — satu halaman gabungan (Visi & Misi, Sejarah, Struktur Organisasi)
Route::get('/profile', [ProfileController::class, 'index'])->name('profile.index');

// Jurusan
Route::get('/tkj', [JurusanController::class, 'tkj'])->name('jurusan.tkj');
Route::get('/ap', [JurusanController::class, 'ap'])->name('jurusan.ap');
Route::get('/ak', [JurusanController::class, 'ak'])->name('jurusan.ak');
Route::get('/mavib', [JurusanController::class, 'mavib'])->name('jurusan.mavib');

// Berita, Galeri, Ekstrakulikuler (publik, read-only — beda dari panel admin)
Route::get('/berita', [PublicBeritaController::class, 'index'])->name('public.berita');
Route::get('/berita/{slug}', [PublicBeritaController::class, 'show'])->name('public.berita.show');

Route::get('/galeri', [PublicGaleriController::class, 'index'])->name('public.galeri');
Route::get('/galeri/{slug}', [PublicGaleriController::class, 'show'])->name('public.galeri.show');

Route::get('/ekstrakulikuler', [PublicEkstrakulikulerController::class, 'index'])->name('public.ekstrakulikuler');
Route::get('/ekstrakulikuler/{slug}', [PublicEkstrakulikulerController::class, 'show'])->name('public.ekstrakulikuler.show');

Route::get('/fasilitas/{slug}', [PublicFasilitasController::class, 'show'])->name('public.fasilitas.show');

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

    
    // Galeri =======================
    Route::get('/galeri/{id}', [GaleriController::class, 'show'])
    ->name('galeri.show');
    Route::get('/galeri/{id}/edit', [GaleriController::class, 'edit'])
    ->name('galeri.edit');
    Route::get('/galeri', [GaleriController::class, 'index'])->name('galeri.index');
    Route::post('/galeri', [GaleriController::class, 'store'])->name('galeri.store');
    Route::post('/galeri/{id}', [GaleriController::class, 'update'])->name('galeri.update');
    Route::delete('/galeri/{id}', [GaleriController::class, 'destroy'])->name('galeri.destroy');

    // Ekstrakulikuler
    Route::get('/ekstrakulikuler', [EkstrakulikulerController::class, 'index'])->name('ekstrakulikuler.index');
    Route::put('/ekstrakulikuler', [EkstrakulikulerController::class, 'update'])->name('ekstrakulikuler.update');

    // Fasilitas
    Route::get('/fasilitas', [FasilitasController::class, 'index'])->name('fasilitas.index');
    Route::post('/fasilitas/{slug}/foto', [FasilitasController::class, 'uploadFoto'])->name('fasilitas.foto.store');
    Route::delete('/fasilitas/{slug}/foto/{imageId}', [FasilitasController::class, 'hapusFoto'])->name('fasilitas.foto.destroy');
    
    // Jurusan
    Route::get('/jurusan', [\App\Http\Controllers\Admin\JurusanController::class, 'index'])->name('jurusan.index');
    Route::post('/jurusan/{slug}/foto', [\App\Http\Controllers\Admin\JurusanController::class, 'uploadFoto'])->name('jurusan.foto.store');
    Route::delete('/jurusan/{slug}/foto/{imageId}', [\App\Http\Controllers\Admin\JurusanController::class, 'hapusFoto'])->name('jurusan.foto.destroy');

    // Akun (tambah admin baru) =======================
    // Dipindah dari route publik /register — sekarang cuma admin yang
    // sudah login yang bisa menambah akun admin baru.
    Route::get('/akun/tambah', [RegisteredUserController::class, 'create'])->name('akun.create');
    Route::post('/akun/tambah', [RegisteredUserController::class, 'store'])->name('akun.store');

    Route::get('struktur-organisasi', [StrukturOrganisasiController::class, 'index'])->name('struktur-organisasi.index');
    Route::put('struktur-organisasi', [StrukturOrganisasiController::class, 'update'])->name('struktur-organisasi.update');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';