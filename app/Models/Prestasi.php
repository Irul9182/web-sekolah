<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Prestasi extends Model
{
    //
    protected $fillable = ['ekstrakurikuler_id', 'judul', 'tingkat', 'tahun', 'deskripsi'];

    public function ekstrakurikuler(): BelongsTo
    {
        return $this->belongsTo(Ekstrakurikuler::class);
    }
}
