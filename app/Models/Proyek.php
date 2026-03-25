<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUlids;

class Proyek extends Model
{
    use HasFactory, HasUlids;

    protected $table = 'proyek';
    protected $primaryKey = 'proyek_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'nama_proyek',
        'tipe_proyek',
        'pagu_total',
        'tanggal_mulai',
        'tanggal_selesai',
        'pajak_persen',
        'uang_bahan_persen',
        'jasa_tukang_persen',
        'biaya_staff_perpajakan',
        'biaya_staff_entry_data',
        'biaya_tak_terduga_persen',
        'nama_klien',
        'status',
        'deskripsi_proyek',

    ];

    protected $casts = [
        'pagu_total' => 'decimal:2',
        'pajak_persen' => 'decimal:2',
        'uang_bahan_persen' => 'decimal:2',
        'jasa_tukang_persen' => 'decimal:2',
        'biaya_tak_terduga_persen' => 'decimal:2',
        'biaya_staff_perpajakan' => 'decimal:2',
        'biaya_staff_entry_data' => 'decimal:2',
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
    ];
}
