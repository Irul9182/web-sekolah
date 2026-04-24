<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\JenisProyek;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\RedirectResponse;

class JenisProyekController extends Controller
{


    public function store(Request $request): RedirectResponse
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

    public function update(Request $request, JenisProyek $jenisProyek): RedirectResponse
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

    public function destroy(JenisProyek $jenisProyek): RedirectResponse
    {
        $jenisProyek->delete();

        return back()->with('success', 'Jenis proyek berhasil dihapus.');
    }
}
