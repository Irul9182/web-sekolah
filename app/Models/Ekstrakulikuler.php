<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Ekstrakulikuler extends Model
{
    //
    protected $fillable = ['nama', 'slug', 'deskripsi', 'thumbnail', 'thumbnail_public_id'];

    public function images(): HasMany
    {
        return $this->hasMany(EkstrakurikulerImage::class);
    }

    public function prestasis(): HasMany
    {
        return $this->hasMany(Prestasi::class);
    }
}
