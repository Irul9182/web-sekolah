<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ItemTransaksi extends Model
{
    protected $table = 'item_transaksi';
    protected $primaryKey = 'item_id';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'transaksi_id',
        'tanggal',
        'nama_item',
        'satuan',
        'qty',
        'harga_satuan',
        'subtotal',
        'keterangan',
    ];

    protected $casts = [
        'qty'          => 'decimal:2',
        'harga_satuan' => 'decimal:2',
        'subtotal'     => 'decimal:2',
        'tanggal'      => 'date',
    ];

    public function transaksi(): BelongsTo
    {
        return $this->belongsTo(Transaksi::class, 'transaksi_id', 'transaksi_id');
    }
}
