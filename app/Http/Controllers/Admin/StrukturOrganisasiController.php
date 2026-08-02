<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\StrukturOrganisasi;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StrukturOrganisasiController extends Controller
{
    public function index(): Response
    {
        // Tabel ini cuma 1 baris (id=1). firstOrCreate jaga-jaga kalau seeder belum pernah dijalankan.
        $struktur = StrukturOrganisasi::firstOrCreate(['id' => 1]);

        return Inertia::render('StrukturOrganisasi/index', [
            'struktur' => $struktur,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ketua_yayasan' => 'required|string|max:255',
            'kepala_sekolah' => 'required|string|max:255',
            'komite_sekolah' => 'required|string|max:255',
            'wakasek_kurikulum' => 'required|string|max:255',
            'wakasek_kesiswaan' => 'required|string|max:255',
            'kaprodi_akuntansi' => 'required|string|max:255',
            'kaprodi_manajemen_perkantoran' => 'required|string|max:255',
            'kaprodi_tjkt' => 'required|string|max:255',
            'kaprodi_dkv' => 'required|string|max:255',
            'badan_konseling' => 'required|string|max:255',
            'operator_sekolah' => 'required|string|max:255',
        ]);

        $struktur = StrukturOrganisasi::firstOrCreate(['id' => 1]);
        $struktur->update($validated);

        return redirect()->back()->with('success', 'Struktur organisasi berhasil diperbarui.');
    }
}