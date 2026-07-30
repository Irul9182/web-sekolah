<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GaleriImage extends Model
{
    protected $table = 'galeri_image';

    protected $fillable = [
        'galeri_id',
        'image_url',
        'public_id',
    ];

    public function galeri()
    {
        return $this->belongsTo(Galeri::class);
    }
}