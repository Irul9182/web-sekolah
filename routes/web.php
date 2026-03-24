<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::get('project', function () {
        return Inertia::render('project/index');
    })->name('project');
    Route::get('project/edit', function () {
        return Inertia::render('project/edit/index');
    })->name('project/edit');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
