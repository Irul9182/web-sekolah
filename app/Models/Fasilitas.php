<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Fasilitas extends Model
{
    protected $fillable = ['slug'];

    public function images(): HasMany
    {
        return $this->hasMany(FasilitasImage::class);
    }
}