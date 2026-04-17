<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\KategoriProyek;

class KategoriProyekSeeder extends Seeder
{
    public function run(): void
    {
        KategoriProyek::insert([
            [
                'id' => 1,
                'nama' => 'Gedung',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'nama' => 'Irigasi',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 3,
                'nama' => 'Jalan',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
