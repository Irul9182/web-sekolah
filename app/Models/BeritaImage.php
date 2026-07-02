<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Berita;

class BeritaImage extends Model
{
    protected $table = 'berita_image';
    protected $fillable = [
        'berita_id',
        'image_url',
        'public_id',
    ];

    public function berita_image()
    {
        return $this->belongsTo(Berita::class);
    }
}
