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
}