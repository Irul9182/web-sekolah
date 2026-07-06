<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Galeri extends Model
{
    protected $fillable = [
        'judul',
        'isi',
        'gambar',
        'slug',
    ];


    public function galeri_image()
    {
        return $this->hasOne(GaleriImage::class);
    }
}
