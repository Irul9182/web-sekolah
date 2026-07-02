<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\BeritaImage;

class Berita extends Model
{
    protected $fillable = [
        'judul',
        'isi',
        'gambar',
        'slug',
    ];

    public function berita_image()
    {
        return $this->hasOne(BeritaImage::class);
    }
}
