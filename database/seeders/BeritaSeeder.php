<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class BeritaSeeder extends Seeder
{
    public function run(): void
    {
        $beritas = [
            [
                'judul' => 'Prestasi Siswa SMK Baidhaul Ahkam di Lomba IT Nasional',

                'isi' => 'Siswa berhasil meraih juara 1 dalam lomba IT tingkat nasional dengan inovasi aplikasi berbasis web.',
                'status' => false
            ],
            [
                'judul' => 'Kegiatan MPLS Tahun Ajaran Baru Berjalan Lancar',

                'isi' => 'MPLS diikuti oleh seluruh siswa baru dengan berbagai kegiatan pengenalan sekolah.',
                'status' => false
            ],
            [
                'judul' => 'Workshop Web Development Bersama Praktisi Industri',

                'isi' => 'Siswa mendapatkan pelatihan langsung tentang React, Laravel, dan API integration.',
                'status' => false
            ],
            [
                'judul' => 'Sekolah Mengadakan Pelatihan Soft Skill',

                'isi' => 'Pelatihan komunikasi dan leadership untuk meningkatkan kesiapan kerja siswa.',
                'status' => false
            ],
            [
                'judul' => 'Kunjungan Industri ke Perusahaan Teknologi',

                'isi' => 'Siswa mengunjungi perusahaan IT untuk melihat langsung dunia kerja.',
                'status' => false
            ],
            [
                'judul' => 'Lomba Desain Grafis Antar Kelas',

                'isi' => 'Siswa DKV menunjukkan kreativitas dalam lomba desain tingkat sekolah.',
                'status' => false
            ],
            [
                'judul' => 'Perpustakaan Digital Resmi Diluncurkan',

                'isi' => 'Sekolah meluncurkan sistem perpustakaan digital berbasis web.',
                'status' => false
            ],
            [
                'judul' => 'Ujian Akhir Semester Berbasis Komputer',

                'isi' => 'Ujian dilaksanakan menggunakan sistem CBT untuk meningkatkan efisiensi.',
                'status' => false
            ],
            [
                'judul' => 'Ekstrakurikuler Coding Club Semakin Aktif',

                'isi' => 'Coding Club rutin mengadakan kelas tambahan setiap minggu.',
                'status' => false
            ],
            [
                'judul' => 'Kerja Sama Sekolah dengan Industri IT Lokal',

                'isi' => 'Sekolah menjalin kerja sama untuk program magang siswa.',
                'status' => false
            ],
        ];

        foreach ($beritas as $item) {
            DB::table('beritas')->insert([
                'judul' => $item['judul'],
                'isi' => $item['isi'],
                'slug' => Str::slug($item['judul']) . '-' . rand(1000, 9999),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
