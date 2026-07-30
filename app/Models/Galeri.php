<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Berita;

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

    public function beritas()
    {
        return $this->hasMany(Berita::class);
    }
}