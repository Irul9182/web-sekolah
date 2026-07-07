<?php

namespace Database\Seeders;

use App\Models\Galeri;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class GaleriSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'judul' => 'Kegiatan Gotong Royong Desa',
                'isi' => 'Dokumentasi kegiatan gotong royong membersihkan lingkungan desa bersama seluruh warga.',
            ],
            [
                'judul' => 'Pelatihan UMKM',
                'isi' => 'Pelatihan pengembangan usaha mikro untuk meningkatkan kualitas produk lokal.',
            ],
            [
                'judul' => 'Peringatan Hari Kemerdekaan',
                'isi' => 'Rangkaian acara perlombaan dan upacara dalam rangka memperingati Hari Kemerdekaan Republik Indonesia.',
            ],
            [
                'judul' => 'Festival Budaya Lokal',
                'isi' => 'Festival budaya yang menampilkan tarian tradisional, musik daerah, dan kuliner khas.',
            ],
            [
                'judul' => 'Penanaman Pohon Bersama',
                'isi' => 'Kegiatan penghijauan dengan menanam ratusan bibit pohon di area sekitar desa.',
            ],
            [
                'judul' => 'Bakti Sosial Kesehatan',
                'isi' => 'Pemeriksaan kesehatan gratis bagi masyarakat yang bekerja sama dengan puskesmas setempat.',
            ],
            [
                'judul' => 'Lomba Kebersihan Lingkungan',
                'isi' => 'Kompetisi antar RT untuk menciptakan lingkungan yang bersih, sehat, dan nyaman.',
            ],
            [
                'judul' => 'Workshop Digital Marketing',
                'isi' => 'Pelatihan pemasaran digital bagi pelaku UMKM agar mampu memasarkan produk secara online.',
            ],
            [
                'judul' => 'Panen Raya Petani',
                'isi' => 'Momen panen raya hasil pertanian yang melibatkan kelompok tani dan pemerintah desa.',
            ],
            [
                'judul' => 'Kegiatan Posyandu Balita',
                'isi' => 'Pelayanan kesehatan rutin bagi balita meliputi penimbangan, imunisasi, dan penyuluhan gizi.',
            ],
        ];

        foreach ($data as $item) {
            Galeri::create([
                'judul' => $item['judul'],
                'isi' => $item['isi'],
                'slug' => Str::slug($item['judul']),
            ]);
        }
    }
}
