<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Jurusan;
use App\Models\JurusanImage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JurusanController extends Controller
{
    public const DAFTAR_JURUSAN = [
        'tkj' => [
            'nama' => 'Teknik Komputer & Jaringan',
            'deskripsi' => 'Jurusan TKJ mempelajari instalasi jaringan komputer, troubleshooting hardware, dan administrasi sistem. Lulusan siap bekerja sebagai teknisi jaringan dan IT support.',
        ],
        'ap' => [
            'nama' => 'Otomatisasi & Tata Kelola Perkantoran',
            'deskripsi' => 'Jurusan Perkantoran mempelajari administrasi bisnis, korespondensi, dan manajemen arsip. Lulusan siap bekerja sebagai staf administrasi profesional.',
        ],
        'ak' => [
            'nama' => 'Akuntansi & Keuangan',
            'deskripsi' => 'Jurusan Akuntansi mempelajari pembukuan, laporan keuangan, dan perpajakan. Lulusan siap bekerja di perusahaan maupun membuka usaha sendiri.',
        ],
        'mavib' => [
            'nama' => 'Multimedia Audio Visual & Broadcasting',
            'deskripsi' => 'Jurusan MAVIB mempelajari desain grafis, fotografi, dan multimedia kreatif. Lulusan siap berkarir di industri kreatif, periklanan, dan media digital.',
        ],
    ];

    public function index()
    {
        foreach (self::DAFTAR_JURUSAN as $slug => $info) {
            Jurusan::firstOrCreate(['slug' => $slug]);
        }

        $jurusans = Jurusan::with('images')
            ->orderByRaw("FIELD(slug, '" . implode("','", array_keys(self::DAFTAR_JURUSAN)) . "')")
            ->get()
            ->map(function ($j) {
                $j->nama = self::DAFTAR_JURUSAN[$j->slug]['nama'];
                $j->deskripsi = self::DAFTAR_JURUSAN[$j->slug]['deskripsi'];
                return $j;
            });

        return Inertia::render('jurusan/index', [
            'jurusans' => $jurusans,
        ]);
    }

    public function uploadFoto(Request $request, $slug)
    {
        abort_unless(array_key_exists($slug, self::DAFTAR_JURUSAN), 404);

        $request->validate([
            'foto' => 'required|array|min:1',
            'foto.*' => 'image|max:4096',
        ]);

        $jurusan = Jurusan::where('slug', $slug)->firstOrFail();

        foreach ($request->file('foto') as $file) {
            $path = $file->store('jurusan', 'public');
            JurusanImage::create([
                'jurusan_id' => $jurusan->id,
                'image_url' => '/storage/' . $path,
            ]);
        }

        return redirect()->back()->with('success', 'Foto berhasil ditambahkan.');
    }

    public function hapusFoto($slug, $imageId)
    {
        $image = JurusanImage::whereHas('jurusan', fn ($q) => $q->where('slug', $slug))
            ->findOrFail($imageId);

        $image->delete();

        return redirect()->back()->with('success', 'Foto berhasil dihapus.');
    }
}