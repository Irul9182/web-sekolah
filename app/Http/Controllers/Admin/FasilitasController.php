<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Fasilitas;
use App\Models\FasilitasImage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FasilitasController extends Controller
{
    public const DAFTAR_FASILITAS = [
        'masjid' => [
            'nama' => 'Masjid',
            'deskripsi' => 'Tempat ibadah dan kegiatan keagamaan bagi seluruh warga sekolah.',
        ],
        'lapangan' => [
            'nama' => 'Lapangan Olahraga',
            'deskripsi' => 'Digunakan untuk kegiatan olahraga, upacara, dan kegiatan siswa lainnya.',
        ],
        'lab-komputer' => [
            'nama' => 'Laboratorium Komputer',
            'deskripsi' => 'Dilengkapi unit komputer untuk mendukung pembelajaran praktik jurusan TKJ dan mata pelajaran lain.',
        ],
        'ruang-kelas' => [
            'nama' => 'Ruang Kelas',
            'deskripsi' => 'Ruang belajar yang nyaman untuk kegiatan belajar mengajar sehari-hari.',
        ],
        'kantin' => [
            'nama' => 'Kantin Sekolah',
            'deskripsi' => 'Menyediakan makanan dan minuman sehat bagi siswa dan staf sekolah.',
        ],
    ];

    public function index()
    {
        foreach (self::DAFTAR_FASILITAS as $slug => $info) {
            Fasilitas::firstOrCreate(['slug' => $slug]);
        }

        $fasilitas = Fasilitas::with('images')
            ->orderByRaw("FIELD(slug, '" . implode("','", array_keys(self::DAFTAR_FASILITAS)) . "')")
            ->get()
            ->map(function ($f) {
                $f->nama = self::DAFTAR_FASILITAS[$f->slug]['nama'];
                $f->deskripsi = self::DAFTAR_FASILITAS[$f->slug]['deskripsi'];
                return $f;
            });

        return Inertia::render('fasilitas/index', [
            'fasilitas' => $fasilitas,
        ]);
    }

    public function uploadFoto(Request $request, $slug)
    {
        abort_unless(array_key_exists($slug, self::DAFTAR_FASILITAS), 404);

        $request->validate([
            'foto' => 'required|array|min:1',
            'foto.*' => 'image|max:4096',
        ]);

        $fasilitas = Fasilitas::where('slug', $slug)->firstOrFail();

        foreach ($request->file('foto') as $file) {
            $path = $file->store('fasilitas', 'public');
            FasilitasImage::create([
                'fasilitas_id' => $fasilitas->id,
                'image_url' => '/storage/' . $path,
            ]);
        }

        return redirect()->back()->with('success', 'Foto berhasil ditambahkan.');
    }

    public function hapusFoto($slug, $imageId)
    {
        $image = FasilitasImage::whereHas('fasilitas', fn ($q) => $q->where('slug', $slug))
            ->findOrFail($imageId);

        $image->delete();

        return redirect()->back()->with('success', 'Foto berhasil dihapus.');
    }
}