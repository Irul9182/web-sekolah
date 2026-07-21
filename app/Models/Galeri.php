<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Galeri extends Model
{
    protected $fillable = [
        'judul',
        'isi',
        'slug',
        'bulan',
        'tahun',
    ];

    public function images()
    {
        return $this->hasMany(GaleriImage::class);
    }
}