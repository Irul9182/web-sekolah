<?php

namespace Database\Seeders;

use App\Models\Galeri;
use App\Models\GaleriImage;
use Illuminate\Database\Seeder;

class GaleriImageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $images = [
            'https://picsum.photos/seed/galeri1/1200/800',
            'https://picsum.photos/seed/galeri2/1200/800',
            'https://picsum.photos/seed/galeri3/1200/800',
            'https://picsum.photos/seed/galeri4/1200/800',
            'https://picsum.photos/seed/galeri5/1200/800',
            'https://picsum.photos/seed/galeri6/1200/800',
            'https://picsum.photos/seed/galeri7/1200/800',
            'https://picsum.photos/seed/galeri8/1200/800',
            'https://picsum.photos/seed/galeri9/1200/800',
            'https://picsum.photos/seed/galeri10/1200/800',
        ];

        foreach (Galeri::all() as $galeri) {
            $jumlahGambar = rand(2, 4);

            for ($i = 0; $i < $jumlahGambar; $i++) {
                GaleriImage::create([
                    'galeri_id' => $galeri->id,
                    'image_url' => $images[array_rand($images)],
                    'public_id' => null,
                ]);
            }
        }
    }
}
