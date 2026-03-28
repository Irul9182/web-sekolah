<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaksi extends Model
{
    protected $table = 'transaksi';
    protected $primaryKey = 'transaksi_id';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'proyek_id',
        'kategori',
        'jumlah',
        'tanggal',
        'keterangan',
    ];

    protected $casts = [
        'jumlah'  => 'decimal:2',
        'tanggal' => 'date',
    ];

    const KATEGORI = [
        'material',
        'operasional',
        'jasa_tukang',
        'mandor',
        'staff_perpajakan',
        'staff_entry_data',
        'biaya_tak_terduga',
    ];

    public function proyek(): BelongsTo
    {
        return $this->belongsTo(Proyek::class, 'proyek_id', 'proyek_id');
    }

    public function scopeForProyek($query, string $proyekId)
    {
        return $query->where('proyek_id', $proyekId);
    }

    public function scopePerBulan($query, int $year, int $month)
    {
        return $query->whereYear('tanggal', $year)
            ->whereMonth('tanggal', $month);
    }
}
