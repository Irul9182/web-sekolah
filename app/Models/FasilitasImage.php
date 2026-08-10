<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FasilitasImage extends Model
{
    protected $fillable = ['fasilitas_id', 'image_url'];

    public function fasilitas(): BelongsTo
    {
        return $this->belongsTo(Fasilitas::class);
    }
}