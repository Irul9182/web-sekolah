<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ekstrakulikuler;
use App\Models\EkstrakulikulerImage;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class EkstrakulikulerController extends Controller
{
    public function index(Request $request)
    {
        $search  = $request->query('search', '');
        $perPage = $request->query('per_page', 10);

        $ekstrakulikulers = Ekstrakulikuler::with('images')
            ->withCount('prestasis')
            ->when($search, function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('ekstrakulikuler/index', [
            'ekstrakulikulers' => $ekstrakulikulers,
            'filters' => [
                'search'   => $search,
                'per_page' => $perPage,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama'      => 'required',
            'deskripsi' => 'required',
            'thumbnail' => 'nullable|image|max:4096',
            'foto'      => 'nullable|array',
            'foto.*'    => 'image|max:4096',
        ]);

        $data = [
            'nama'      => $request->nama,
            'slug'      => Str::slug($request->nama),
            'deskripsi' => $request->deskripsi,
        ];

        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('ekstrakulikuler', 'public');
            $data['thumbnail'] = '/storage/' . $path;
        }

        $ekstrakulikuler = Ekstrakulikuler::create($data);

        if ($request->hasFile('foto')) {
            foreach ($request->file('foto') as $file) {
                $path = $file->store('ekstrakulikuler', 'public');
                EkstrakulikulerImage::create([
                    'ekstrakulikuler_id' => $ekstrakulikuler->id,
                    'image_url' => '/storage/' . $path,
                ]);
            }
        }

        return redirect()->route('ekstrakulikuler.index')
            ->with('success', 'Ekstrakulikuler berhasil ditambahkan!');
    }

    public function update(Request $request, $id)
    {
        $ekstrakulikuler = Ekstrakulikuler::with('images')->findOrFail($id);

        $request->validate([
            'nama'      => 'required',
            'deskripsi' => 'required',
            'thumbnail' => 'nullable|image|max:4096',
            'foto'      => 'nullable|array',
            'foto.*'    => 'image|max:4096',
        ]);

        $data = [
            'nama'      => $request->nama,
            'slug'      => Str::slug($request->nama),
            'deskripsi' => $request->deskripsi,
        ];

        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('ekstrakulikuler', 'public');
            $data['thumbnail'] = '/storage/' . $path;
        }

        $ekstrakulikuler->update($data);

        if ($request->filled('hapus_foto')) {
            $ekstrakulikuler->images()->whereIn('id', $request->input('hapus_foto'))->delete();
        }

        if ($request->hasFile('foto')) {
            foreach ($request->file('foto') as $file) {
                $path = $file->store('ekstrakulikuler', 'public');
                EkstrakulikulerImage::create([
                    'ekstrakulikuler_id' => $ekstrakulikuler->id,
                    'image_url' => '/storage/' . $path,
                ]);
            }
        }

        return redirect()->route('ekstrakulikuler.index')
            ->with('success', 'Ekstrakulikuler berhasil diedit!');
    }

    public function destroy($id)
    {
        $ekstrakulikuler = Ekstrakulikuler::with('images')->findOrFail($id);
        $ekstrakulikuler->images()->delete();
        $ekstrakulikuler->prestasis()->delete();
        $ekstrakulikuler->delete();

        return redirect()->route('ekstrakulikuler.index')
            ->with('success', 'Ekstrakulikuler berhasil dihapus!');
    }

    public function show($id)
    {
        $ekstrakulikuler = Ekstrakulikuler::with(['images', 'prestasis'])->findOrFail($id);

        return Inertia::render('Admin/Ekstrakulikuler/Show', [
            'ekstrakulikuler' => $ekstrakulikuler,
        ]);
    }

    public function edit($id)
    {
        $ekstrakulikuler = Ekstrakulikuler::with(['images', 'prestasis'])->findOrFail($id);

        return Inertia::render('Admin/Ekstrakulikuler/Edit', [
            'ekstrakulikuler' => $ekstrakulikuler,
        ]);
    }
}