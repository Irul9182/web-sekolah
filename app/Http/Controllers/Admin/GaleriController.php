<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Models\Galeri;

class GaleriController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search  = $request->query('search', '');
        $perPage = $request->query('per_page', 10);

        $galeris = Galeri::query()->with('galeri_image')
            ->when($search, function ($q) use ($search) {
                $q->where('judul', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('galeri/index', [
            'galeris' => $galeris,
            'filters' => [
                'search'   => $search,
                'per_page' => $perPage,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $request->validate([
            'judul'  => 'required',
            'isi'    => 'required',
            'uploaded_image' => 'nullable|image|max:5120',
        ]);



        $galeri = Galeri::create([
            'judul'  => $request->judul,
            'isi'    => $request->isi,
            'slug'   => Str::slug($request->judul),
        ]);

        if ($request->hasFile('uploaded_image')) {

            $image = $request->file('uploaded_image');

            $cloudinary = app(\Cloudinary\Cloudinary::class);

            $result = $cloudinary
                ->uploadApi()
                ->upload(
                    $image->getRealPath(),
                    [
                        'folder' => 'web_sekolah/galeri'
                    ]
                );

            $galeri->galeri_image()->create([
                'image_url' => $result['secure_url'],
                'public_id' => $result['public_id'],
            ]);
        }

        return back()->with('success', 'Foto berhasil ditambahkan!');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
        $galeri = Galeri::findOrFail($id);

        $request->validate([
            'judul'  => 'required',
            // 'gambar' => 'nullable|image|max:5120',
            'isi'    => 'required',
            'uploaded_image' => 'nullable|image|max:5120',
        ]);



        $cloudinary = app(\Cloudinary\Cloudinary::class);

        // upload foto baru
        if ($request->hasFile('uploaded_image')) {

            // hapus foto lama
            if ($galeri->galeri_image && $galeri->galeri_image->public_id) {
                $cloudinary
                    ->uploadApi()
                    ->destroy($galeri->galeri_image->public_id);

                $galeri->galeri_image->delete();
            }

            $image = $request->file('uploaded_image');

            $result = $cloudinary
                ->uploadApi()
                ->upload(
                    $image->getRealPath(),
                    [
                        'folder' => 'web_sekolah/galeri',
                    ]
                );

            $galeri->galeri_image()->create([
                'image_url' => $result['secure_url'],
                'public_id' => $result['public_id'],
            ]);
        }
        $galeri->update([
            'judul'  => $request->judul,
            'isi'    => $request->isi,
            'slug'   => Str::slug($request->judul),
        ]);


        return back()->with('success', 'Galeri berhasil diedit!.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        $galeri = Galeri::findOrFail($id);

        $cloudinary = app(\Cloudinary\Cloudinary::class);

        if ($galeri->galeri_image) {

            if (!empty($galeri->galeri_image->public_id)) {
                $cloudinary
                    ->uploadApi()
                    ->destroy($galeri->galeri_image->public_id);
            }

            $galeri->galeri_image->delete();
        }

        $galeri->delete();

        return redirect()->route('galeri.index')
            ->with('success', 'Galeri berhasil dihapus!');
    }
}
