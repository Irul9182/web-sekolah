<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Jurusan extends Model
{
    protected $fillable = ['slug'];

    public function images(): HasMany
    {
        return $this->hasMany(JurusanImage::class);
    }
}