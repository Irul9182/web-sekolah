<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Admin\EkstrakulikulerController;
use App\Http\Controllers\Admin\FasilitasController;
use App\Models\Berita;
use App\Models\Galeri;
use App\Models\StrukturOrganisasi;
use Inertia\Inertia;
use Throwable;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('dashboard', [
            'stats' => $this->getStats(),
            'recentBerita' => $this->recentBerita(),
            'recentGaleri' => $this->recentGaleri(),
            'strukturOrganisasi' => $this->strukturOrganisasi(),
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
                'label' => 'Total Ekstrakulikuler',
                'value' => count(EkstrakulikulerController::DAFTAR_EKSKUL),
            ],
            [
                'label' => 'Total Fasilitas',
                'value' => count(FasilitasController::DAFTAR_FASILITAS),
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

    /**
     * Cuma butuh 2 posisi teratas (Ketua Yayasan & Kepala Sekolah) untuk preview
     * di card dashboard -- bukan seluruh 11 posisi. Tabelnya cuma 1 baris (id=1).
     * updated_at dipakai buat subtitle di card ringkasan baris atas.
     */
    private function strukturOrganisasi(): array
    {
        try {
            $struktur = StrukturOrganisasi::first();
            return [
                'ketua_yayasan' => $struktur?->ketua_yayasan ?? '-',
                'kepala_sekolah' => $struktur?->kepala_sekolah ?? '-',
                'updated_at' => $struktur?->updated_at?->toIso8601String(),
            ];
        } catch (Throwable $e) {
            return [
                'ketua_yayasan' => '-',
                'kepala_sekolah' => '-',
                'updated_at' => null,
            ];
        }
    }
}