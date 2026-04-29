<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Database\Seeders\ProyekSeeder;
use Database\Seeders\TransaksiSeeder;
use Database\Seeders\ProyekTransaksiSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'herkaltest',
            'email' => 'herkal@test.com',
            'password' => 'herkal123',
        ]);
        $this->call([
            KategoriProyekSeeder::class,
            JenisProyekSeeder::class,
            ProyekTransaksiSeeder::class,
        ]);

        // $this->call(ProyekSeeder::class);
        // $this->call(TransaksiSeeder::class);
    }
}
