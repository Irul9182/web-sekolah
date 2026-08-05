<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Prestasi;
use Illuminate\Http\Request;

class PrestasiController extends Controller
{
    public function store(Request $request, $ekstrakulikulerId)
    {
        $request->validate([
            'judul'     => 'required',
            'tingkat'   => 'nullable|string',
            'tahun'     => 'required|integer|min:2000|max:2100',
            'deskripsi' => 'nullable|string',
        ]);

        Prestasi::create([
            'ekstrakulikuler_id' => $ekstrakulikulerId,
            'judul'              => $request->judul,
            'tingkat'            => $request->tingkat,
            'tahun'              => $request->tahun,
            'deskripsi'          => $request->deskripsi,
        ]);

        return back()->with('success', 'Prestasi berhasil ditambahkan!');
    }

    public function update(Request $request, $id)
    {
        $prestasi = Prestasi::findOrFail($id);

        $request->validate([
            'judul'     => 'required',
            'tingkat'   => 'nullable|string',
            'tahun'     => 'required|integer|min:2000|max:2100',
            'deskripsi' => 'nullable|string',
        ]);

        $prestasi->update($request->only('judul', 'tingkat', 'tahun', 'deskripsi'));

        return back()->with('success', 'Prestasi berhasil diedit!');
    }

    public function destroy($id)
    {
        Prestasi::findOrFail($id)->delete();

        return back()->with('success', 'Prestasi berhasil dihapus!');
    }
}