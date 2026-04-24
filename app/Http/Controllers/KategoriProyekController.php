<?php

namespace App\Http\Controllers;

use App\Models\KategoriProyek;
use App\Models\JenisProyek;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class KategoriProyekController extends Controller
{
    // =====================
    // KATEGORI PROYEK
    // =====================

    public function index(Request $request)
    {

        $searchKategori  = $request->query('searchKategori', '');
        $perPageKategori = $request->query('per_pageKategori', 10);

        $kategori = KategoriProyek::query()
            ->with('jenisProyek')
            ->when($searchKategori, fn($q) => $q->where('nama', 'like', "%{$searchKategori}%"))
            ->latest()
            ->paginate($perPageKategori)
            ->withQueryString();

        $searchJenis  = $request->query('searchJenis', '');
        $perPageJenis = $request->query('per_pageJenis', 10);

        $jenis = JenisProyek::query()
            ->with('kategoriProyek')
            ->when($searchJenis, function ($q) use ($searchJenis) {
                $q->where('nama', 'like', "%{$searchJenis}%")
                    ->orWhereHas('kategoriProyek', fn($q) => $q->where('nama', 'like', "%{$searchJenis}%"));
            })
            ->latest()
            ->paginate($perPageJenis)
            ->withQueryString();

        return Inertia::render('config/project-config/index', [
            'list_kategori'   => $kategori,
            'filtersKategori' => [
                'searchKategori'   => $searchKategori,
                'per_pageKategori' => $perPageKategori,
            ],
            'list_jenis'   => $jenis,
            'filtersJenis' => [
                'searchJenis'   => $searchJenis,
                'per_pageJenis' => $perPageJenis,
            ],
        ]);
    }

    public function storeKategori(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:255', 'unique:kategori_proyek,nama'],
        ], [
            'nama.required' => 'Nama kategori wajib diisi.',
            'nama.unique'   => 'Nama kategori sudah ada.',
        ]);

        KategoriProyek::create($validated);

        return back()->with('success', 'Kategori berhasil ditambahkan.');
    }

    public function updateKategori(Request $request, KategoriProyek $kategoriProyek): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => [
                'required',
                'string',
                'max:255',
                'unique:kategori_proyek,nama,' . $kategoriProyek->id,
            ],
        ], [
            'nama.required' => 'Nama kategori wajib diisi.',
            'nama.unique'   => 'Nama kategori sudah ada.',
        ]);

        $kategoriProyek->update($validated);

        return back()->with('success', 'Kategori berhasil diperbarui.');
    }

    public function destroyKategori(KategoriProyek $kategoriProyek): RedirectResponse
    {
        // Cek apakah masih punya jenis proyek
        if ($kategoriProyek->jenisProyek()->exists()) {
            return back()->withErrors([
                'kategori' => 'Kategori tidak bisa dihapus karena masih memiliki jenis proyek.',
            ]);
        }

        $kategoriProyek->delete();

        return back()->with('success', 'Kategori berhasil dihapus.');
    }

    // =====================
    // JENIS PROYEK
    // =====================

    public function storeJenis(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'kategori_proyek_id' => ['required', 'exists:kategori_proyek,id'],
            'nama'               => [
                'required',
                'string',
                'max:255',
                'unique:jenis_proyek,nama,NULL,id,kategori_proyek_id,' . $request->kategori_proyek_id,
            ],
        ], [
            'kategori_proyek_id.required' => 'Kategori wajib dipilih.',
            'kategori_proyek_id.exists'   => 'Kategori tidak ditemukan.',
            'nama.required'               => 'Nama jenis proyek wajib diisi.',
            'nama.unique'                 => 'Nama jenis proyek sudah ada di kategori ini.',
        ]);

        JenisProyek::create($validated);

        return back()->with('success', 'Jenis proyek berhasil ditambahkan.');
    }

    public function updateJenis(Request $request, JenisProyek $jenisProyek): RedirectResponse
    {
        $validated = $request->validate([
            'kategori_proyek_id' => ['required', 'exists:kategori_proyek,id'],
            'nama'               => [
                'required',
                'string',
                'max:255',
                'unique:jenis_proyek,nama,' . $jenisProyek->id . ',id,kategori_proyek_id,' . $request->kategori_proyek_id,
            ],
        ], [
            'kategori_proyek_id.required' => 'Kategori wajib dipilih.',
            'nama.required'               => 'Nama jenis proyek wajib diisi.',
            'nama.unique'                 => 'Nama jenis proyek sudah ada di kategori ini.',
        ]);

        $jenisProyek->update($validated);

        return back()->with('success', 'Jenis proyek berhasil diperbarui.');
    }

    public function destroyJenis(JenisProyek $jenisProyek): RedirectResponse
    {
        $jenisProyek->delete();

        return back()->with('success', 'Jenis proyek berhasil dihapus.');
    }
}
