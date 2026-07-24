<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pengumuman extends Model
{
    protected $table = 'pengumumans';
    protected $primaryKey = 'id';

    protected $fillable = [
        'judul',
        'deskripsi',
        'tanggal',
    ];
}