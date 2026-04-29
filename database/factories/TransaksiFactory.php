<?php

namespace Database\Factories;

use App\Models\Proyek;
use App\Models\Transaksi;
use App\Services\FinanceService;
use Illuminate\Database\Eloquent\Factories\Factory;

class TransaksiFactory extends Factory
{
    public function definition(): array
    {
        return [
            'proyek_id' => Proyek::factory(),
            'kategori'  => $this->faker->randomElement(Transaksi::KATEGORI),
            'jumlah'    => 0,
            'persen'    => null,
            'tanggal'   => $this->faker->dateTimeBetween('-30 months', 'now'),
            'keterangan' => $this->faker->sentence(),
        ];
    }
}
