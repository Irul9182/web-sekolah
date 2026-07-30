<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Database\Seeders\GaleriSeeder;
use Database\Seeders\GaleriImageSeeder;
use Database\Seeders\PengumumanSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // Pakai updateOrCreate (bukan create) supaya seeder ini AMAN dijalankan
        // berkali-kali — tidak akan error "duplicate email" kalau akunnya
        // sudah ada, dan password selalu ke-hash dengan benar lewat Hash::make().
        User::updateOrCreate(
            ['email' => 'herkal@test.com'],
            [
                'name' => 'herkaltest',
                'password' => Hash::make('herkal123'),
            ],
        );

        $this->call([
            BeritaSeeder::class,
            PengumumanSeeder::class,
            GaleriSeeder::class,
            GaleriImageSeeder::class,
        ]);

        // $this->call(ProyekSeeder::class);
        // $this->call(TransaksiSeeder::class);
    }
}