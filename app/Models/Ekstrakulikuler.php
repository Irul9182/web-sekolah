<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ekstrakulikuler extends Model
{
    protected $fillable = ['slug', 'nama', 'deskripsi', 'prestasi', 'galeri_slug'];
}