<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Galeri;

class GaleriImage extends Model
{
    protected $table = 'galeri_image';
    protected $fillable = [
        'galeri_id',
        'image_url',
        'public_id',
    ];

    public function galeri_image()
    {
        return $this->belongsTo(Galeri::class);
    }
}
