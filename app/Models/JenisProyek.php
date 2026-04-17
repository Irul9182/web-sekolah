<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUlids;

class JenisProyek extends Model
{
    use HasFactory, HasUlids;

    protected $table = 'jenis_proyek';
    protected $primaryKey = 'jenis_proyek_id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [

        'kategori_proyek_id',
        'nama',

    ];
}
