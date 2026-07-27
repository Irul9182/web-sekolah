<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Berita;
use App\Models\Galeri;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class BeritaController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search', '');
        $perPage = $request->query('per_page', 10);

        $beritas = Berita::query()
            ->with([
                'berita_image',
                'galeri',
            ])
            ->when($search, function ($q) use ($search) {
                $q->where('judul', 'like', "%{$search}%");
            })
            ->orderBy('tanggal', 'desc')
            ->paginate($perPage)
            ->withQueryString();

        $galeris = Galeri::select('id', 'judul', 'slug')
            ->orderBy('judul')
            ->get();

        return Inertia::render('berita/index', [
            'beritas' => $beritas,
            'galeris' => $galeris,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul' => [
                'required',
                'string',
                'max:255',
            ],

            'isi' => [
                'required',
                'string',
            ],

            'tanggal' => [
                'required',
                'date',
            ],

            'galeri_id' => [
                'nullable',
                'exists:galeris,id',
            ],

            'uploaded_image' => [
                'nullable',
                'image',
                'max:5120',
            ],
        ]);

        $berita = Berita::create([
            'judul' => $validated['judul'],
            'isi' => $validated['isi'],
            'tanggal' => $validated['tanggal'],
            'galeri_id' => $validated['galeri_id'] ?? null,
            'slug' => Str::slug($validated['judul']),
        ]);

        if ($request->hasFile('uploaded_image')) {
            $image = $request->file('uploaded_image');

            $cloudinary = app(\Cloudinary\Cloudinary::class);

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

        return back()->with(
            'success',
            'Berita berhasil ditambahkan!'
        );
    }

    public function update(Request $request, string $id)
    {
        $berita = Berita::findOrFail($id);

        $validated = $request->validate([
            'judul' => [
                'required',
                'string',
                'max:255',
            ],

            'isi' => [
                'required',
                'string',
            ],

            'tanggal' => [
                'required',
                'date',
            ],

            'galeri_id' => [
                'nullable',
                'exists:galeris,id',
            ],

            'uploaded_image' => [
                'nullable',
                'image',
                'max:5120',
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Upload Foto Baru
        |--------------------------------------------------------------------------
        */

        if ($request->hasFile('uploaded_image')) {
            $cloudinary = app(\Cloudinary\Cloudinary::class);

            // Hapus foto lama dari Cloudinary
            if (
                $berita->berita_image &&
                $berita->berita_image->public_id
            ) {
                $cloudinary
                    ->uploadApi()
                    ->destroy(
                        $berita->berita_image->public_id
                    );

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

        /*
        |--------------------------------------------------------------------------
        | Update Data Berita
        |--------------------------------------------------------------------------
        */

        $berita->update([
            'judul' => $validated['judul'],
            'isi' => $validated['isi'],
            'tanggal' => $validated['tanggal'],
            'galeri_id' => $validated['galeri_id'] ?? null,
            'slug' => Str::slug($validated['judul']),
        ]);

        return back()->with(
            'success',
            'Berita berhasil diedit!'
        );
    }

    public function destroy(string $id)
    {
        $berita = Berita::findOrFail($id);

        $cloudinary = app(\Cloudinary\Cloudinary::class);

        if ($berita->berita_image) {
            if (
                !empty($berita->berita_image->public_id)
            ) {
                $cloudinary
                    ->uploadApi()
                    ->destroy(
                        $berita->berita_image->public_id
                    );
            }

            $berita->berita_image->delete();
        }

        $berita->delete();

        return redirect()
            ->route('berita.index')
            ->with(
                'success',
                'Berita berhasil dihapus!'
            );
    }
}