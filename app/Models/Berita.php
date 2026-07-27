<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\BeritaImage;
use App\Models\Galeri;

class Berita extends Model
{
    protected $fillable = [
    'judul',
    'isi',
    'gambar',
    'slug',
    'tanggal',
    'galeri_id',
    ];

    public function berita_image()
    {
        return $this->hasOne(BeritaImage::class);
    }

    public function galeri()
    {
    return $this->belongsTo(Galeri::class);
    }
}