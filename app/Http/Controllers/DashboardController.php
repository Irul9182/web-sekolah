<?php

namespace App\Http\Controllers;

use App\Models\Berita;
use App\Models\Pengumuman;
use App\Models\Galeri;
use Inertia\Inertia;
use Throwable;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('dashboard', [
            'stats' => $this->getStats(),
            'recentBerita' => $this->recentBerita(),
            'recentPengumuman' => $this->recentPengumuman(),
            'recentGaleri' => $this->recentGaleri(),
        ]);
    }

    private function getStats(): array
    {
        return [
            [
                'label'       => 'Total Berita',
                'value'       => $this->safeCount(Berita::class),
                'description' => $this->publishedDescription(Berita::class),
            ],
            [
                'label'       => 'Total Pengumuman',
                'value'       => $this->safeCount(Pengumuman::class),
                'description' => $this->publishedDescription(Pengumuman::class),
            ],
            [
                'label' => 'Total Galeri',
                'value' => $this->safeCount(Galeri::class),
            ],
        ];
    }

    private function safeCount(string $model): int
    {
        try {
            return $model::count();
        } catch (Throwable $e) {
            return 0;
        }
    }

    private function publishedDescription(string $model): ?string
    {
        try {
            $published = $model::where('status', 'published')->count();
            return "{$published} dipublikasikan";
        } catch (Throwable $e) {
            return null;
        }
    }

    /**
     * 5 berita paling baru, lengkap dengan gambar (kalau ada), untuk ditampilkan
     * di dashboard. Diurutkan pakai kolom "tanggal" karena itu yang sudah dipakai
     * di halaman publik berita.
     */
    private function recentBerita()
    {
        try {
            return Berita::with('berita_image')
                ->latest('tanggal')
                ->take(5)
                ->get(['id', 'judul', 'slug', 'tanggal']);
        } catch (Throwable $e) {
            return [];
        }
    }

    /**
     * 5 pengumuman paling baru. Diurutkan pakai created_at (bukan "tanggal")
     * karena tabel pengumuman semula tidak punya kolom tanggal terpisah —
     * kalau ternyata sekarang sudah ada kolom "tanggal" di tabelmu, tinggal
     * ganti latest() jadi latest('tanggal') di bawah.
     */
    private function recentPengumuman()
    {
        try {
            return Pengumuman::latest()
                ->take(5)
                ->get(['id', 'judul', 'created_at']);
        } catch (Throwable $e) {
            return [];
        }
    }

    /**
     * 5 galeri (album) paling baru, lengkap dengan foto pertama tiap album
     * sebagai thumbnail.
     */
    private function recentGaleri()
    {
        try {
            return Galeri::with('images')
                ->latest()
                ->take(5)
                ->get(['id', 'judul', 'slug']);
        } catch (Throwable $e) {
            return [];
        }
    }
}
