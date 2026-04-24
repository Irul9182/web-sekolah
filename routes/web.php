<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProyekController;
use App\Http\Controllers\TransaksiController;
use App\Http\Controllers\ItemTransaksiController;
use App\Http\Controllers\KategoriProyekController;
use App\Http\Controllers\JenisProyekController;

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
    Route::get('/project/create', [ProyekController::class, 'create'])->name('project.create');
    Route::post('/project', [ProyekController::class, 'store'])->name('project.store');
    Route::get('/project/{id}/edit', [ProyekController::class, 'edit'])->name(('project.edit'));

    Route::put('/project/{id}', [ProyekController::class, 'update'])->name('project.update');
    Route::patch('/project/{id}', [ProyekController::class, 'updateStatus'])->name('project.updateStatus');
    Route::delete('/project/{id}', [ProyekController::class, 'destroy'])->name('project.destroy');


    // Transaction =====================
    Route::get('/transaction', [TransaksiController::class, 'index'])->name('transaction.index');
    Route::get('/transaction/create', [TransaksiController::class, 'create'])->name('transaction.create');
    Route::get('/transaction/search-nama-proyek', [TransaksiController::class, 'search'])->name('transaction.search-nama-proyek');
    Route::get('/transaction/used-kategori', [TransaksiController::class, 'usedKategori'])
        ->name('transaction.used-kategori');
    Route::post('/transaction', [TransaksiController::class, 'store'])->name('transaction.store');

    Route::get('/transaction/{id}/edit', [TransaksiController::class, 'edit'])->name('transaction.edit');
    Route::put('/transaction/{transaksi}', [TransaksiController::class, 'update'])
        ->name('transaction.update');
    Route::get('/transaction/{id}/detail', [TransaksiController::class, 'show'])->name('transaction.show');
    Route::delete('/transaction/{id}', [TransaksiController::class, 'destroy'])->name('transaction.destroy');


    Route::prefix('transaction/{id}/items')->name('transaction.items.')->group(function () {
        Route::get('/',             [ItemTransaksiController::class, 'index'])->name('index');
        Route::post('/',            [ItemTransaksiController::class, 'store'])->name('store');
        Route::put('/{item_id}',    [ItemTransaksiController::class, 'update'])->name('update');
        Route::delete('/{item_id}', [ItemTransaksiController::class, 'destroy'])->name('destroy');
    });



    Route::prefix('config')->name('config.')->group(function () {
        Route::get('/project-config', [KategoriProyekController::class, 'index'])->name('project-config.index');

        // Kategori
        Route::post('/project-config/project-category',           [KategoriProyekController::class, 'store'])->name('project-category.store');
        Route::put('/project-config/project-category/{kategoriProyek}',    [KategoriProyekController::class, 'update'])->name('project-category.update');
        Route::delete('/project-config/project-category/{kategoriProyek}', [KategoriProyekController::class, 'destroy'])->name('project-category.destroy');

        // Jenis
        Route::post('/project-config/project-type',              [KategoriProyekController::class, 'store'])->name('project-type.store');
        Route::put('/project-config/project-type/{jenisProyek}', [KategoriProyekController::class, 'update'])->name('project-type.update');
        Route::delete('/project-config/project-type/{jenisProyek}', [KategoriProyekController::class, 'destroy'])->name('project-type.destroy');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
