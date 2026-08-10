<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ekstrakulikuler;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EkstrakulikulerController extends Controller
{
    // Daftar fixed ekskul -- persis pola 4 Jurusan yang hardcode di JurusanController,
    // cuma di sini bentuknya array karena field-nya seragam (bukan 4 method beda).
    public const DAFTAR_EKSKUL = [
        'futsal' => [
            'nama' => 'Futsal',
            'deskripsi' => 'Ekstrakulikuler yang melatih kemampuan bermain futsal, kerja sama tim, dan sportivitas siswa melalui latihan rutin dan pertandingan persahabatan.',
        ],
        'tari-tradisional' => [
            'nama' => 'Tari Tradisional',
            'deskripsi' => 'Melestarikan dan mengembangkan bakat seni tari daerah, sekaligus menumbuhkan kecintaan siswa terhadap budaya Indonesia.',
        ],
        'pramuka' => [
            'nama' => 'Pramuka',
            'deskripsi' => 'Membentuk karakter disiplin, kemandirian, dan jiwa kepemimpinan siswa melalui kegiatan kepramukaan.',
        ],
        'marawis' => [
            'nama' => 'Marawis',
            'deskripsi' => 'Mengasah bakat seni musik islami siswa melalui latihan rebana dan marawis, sering tampil di acara-acara keagamaan sekolah.',
        ],
        'paskibra' => [
            'nama' => 'Paskibra',
            'deskripsi' => 'Melatih kedisiplinan, ketegasan, dan kekompakan siswa melalui latihan baris-berbaris dan pengibaran bendera.',
        ],
    ];

    public function index()
    {
        foreach (self::DAFTAR_EKSKUL as $slug => $info) {
            Ekstrakulikuler::firstOrCreate(['slug' => $slug], ['nama' => $info['nama']]);
        }

        $ekstrakulikulers = Ekstrakulikuler::orderByRaw(
            "FIELD(slug, '" . implode("','", array_keys(self::DAFTAR_EKSKUL)) . "')"
        )->get()->map(function ($e) {
            $e->deskripsi = self::DAFTAR_EKSKUL[$e->slug]['deskripsi'];
            return $e;
        });

        $galeris = \App\Models\Galeri::select('id', 'judul', 'slug')->orderBy('judul')->get();

        return Inertia::render('ekstrakulikuler/index', [
            'ekstrakulikulers' => $ekstrakulikulers,
            'galeris' => $galeris,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'ekstrakulikulers' => 'required|array',
            'ekstrakulikulers.*.slug' => 'required|string|in:' . implode(',', array_keys(self::DAFTAR_EKSKUL)),
            'ekstrakulikulers.*.prestasi' => 'nullable|string',
            'ekstrakulikulers.*.galeri_slug' => 'nullable|string',
        ]);

        foreach ($validated['ekstrakulikulers'] as $item) {
            Ekstrakulikuler::where('slug', $item['slug'])->update([
                'prestasi' => $item['prestasi'] ?? null,
                'galeri_slug' => $item['galeri_slug'] ?? null,
            ]);
        }

        return redirect()->back()->with('success', 'Ekstrakulikuler berhasil diperbarui.');
    }
}