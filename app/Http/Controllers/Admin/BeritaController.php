<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Berita;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class BeritaController extends Controller
{
    public function index(Request $request)
    {
        $search  = $request->query('search', '');
        $perPage = $request->query('per_page', 10);

        $beritas = Berita::query()->with('berita_image')
        ->when($search, function ($q) use ($search) {
            $q->where('judul', 'like', "%{$search}%");
        })
        ->orderBy('tanggal', 'desc')
        ->paginate($perPage)
        ->withQueryString();

        return Inertia::render('berita/index', [
            'beritas' => $beritas,
            'filters' => [
                'search'   => $search,
                'per_page' => $perPage,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('berita/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'judul'   => 'required',
            'isi'     => 'required',
            'tanggal' => 'nullable|date',
            'uploaded_image' => 'nullable|image|max:5120',
        ]);

        $berita = Berita::create([
            'judul'   => $request->judul,
            'isi'     => $request->isi,
            'tanggal' => $request->tanggal,
            'slug'    => Str::slug($request->judul),
        ]);

        if ($request->hasFile('uploaded_image')) {

            $image = $request->file('uploaded_image');

            $cloudinary = app(\Cloudinary\Cloudinary::class);

            $result = $cloudinary
                ->uploadApi()
                ->upload(
                    $image->getRealPath(),
                    [
                        'folder' => 'web_sekolah/berita'
                    ]
                );

            $berita->berita_image()->create([
                'image_url' => $result['secure_url'],
                'public_id' => $result['public_id'],
            ]);
        }

        return back()->with('success', 'Berita berhasil ditambahkan!');
    }

    public function edit($id)
    {
        $berita = Berita::findOrFail($id);
        return Inertia::render('berita/edit', ['berita' => $berita]);
    }

    public function update(Request $request, string $id)
    {
        $berita = Berita::findOrFail($id);

        $request->validate([
            'judul'   => 'required',
            'isi'     => 'required',
            'tanggal' => 'nullable|date',
            'uploaded_image' => 'nullable|image|max:5120',
        ]);

        $cloudinary = app(\Cloudinary\Cloudinary::class);

        // upload foto baru
        if ($request->hasFile('uploaded_image')) {

            // hapus foto lama
            if ($berita->berita_image && $berita->berita_image->public_id) {
                $cloudinary
                    ->uploadApi()
                    ->destroy($berita->berita_image->public_id);

                $berita->berita_image->delete();
            }

            $image = $request->file('uploaded_image');

            $result = $cloudinary
                ->uploadApi()
                ->upload(
                    $image->getRealPath(),
                    [
                        'folder' => 'web_sekolah/berita',
                    ]
                );

            $berita->berita_image()->create([
                'image_url' => $result['secure_url'],
                'public_id' => $result['public_id'],
            ]);
        }

        $berita->update([
            'judul'   => $request->judul,
            'isi'     => $request->isi,
            'tanggal' => $request->tanggal,
            'slug'    => Str::slug($request->judul),
        ]);

        return back()->with('success', 'Berita berhasil diedit!');
    }

    public function destroy($id)
    {
        $berita = Berita::findOrFail($id);

        $cloudinary = app(\Cloudinary\Cloudinary::class);

        if ($berita->berita_image) {

            if (!empty($berita->berita_image->public_id)) {
                $cloudinary
                    ->uploadApi()
                    ->destroy($berita->berita_image->public_id);
            }

            $berita->berita_image->delete();
        }


        $berita->delete();

        return redirect()->route('berita.index')
            ->with('success', 'Berita berhasil dihapus!');
    }
}
