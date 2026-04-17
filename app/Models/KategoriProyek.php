<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUlids;

class KategoriProyek extends Model
{
    use HasFactory, HasUlids;

    protected $table = 'kategori_proyek';
    protected $primaryKey = 'kategori_proyek_id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [

        'proyek_id',
        'nama',

    ];
}
