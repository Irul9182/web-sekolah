<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Berita;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BeritaController extends Controller
{
    public function index()
    {
        $beritas = Berita::latest()->get();
        return view('admin.berita.index', compact('beritas'));
    }

    public function create()
    {
        return view('admin.berita.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'judul'  => 'required',
            'isi'    => 'required',
            'gambar' => 'nullable|image|max:2048',
        ]);

        $gambar = null;
        if ($request->hasFile('gambar')) {
            $gambar = $request->file('gambar')->store('berita', 'public');
        }

        Berita::create([
            'judul'  => $request->judul,
            'isi'    => $request->isi,
            'gambar' => $gambar,
            'slug'   => Str::slug($request->judul),
        ]);

        return redirect('/admin/berita')->with('success', 'Berita berhasil ditambahkan!');
    }

    public function edit($id)
    {
        $berita = Berita::findOrFail($id);
        return view('admin.berita.edit', compact('berita'));
    }

    public function update(Request $request, $id)
    {
        $berita = Berita::findOrFail($id);

        $request->validate([
            'judul'  => 'required',
            'isi'    => 'required',
            'gambar' => 'nullable|image|max:2048',
        ]);

        $gambar = $berita->gambar;
        if ($request->hasFile('gambar')) {
            $gambar = $request->file('gambar')->store('berita', 'public');
        }

        $berita->update([
            'judul'  => $request->judul,
            'isi'    => $request->isi,
            'gambar' => $gambar,
            'slug'   => Str::slug($request->judul),
        ]);

        return redirect('/admin/berita')->with('success', 'Berita berhasil diupdate!');
    }

    public function destroy($id)
    {
        $berita = Berita::findOrFail($id);
        $berita->delete();
        return redirect('/admin/berita')->with('success', 'Berita berhasil dihapus!');
    }

    
}