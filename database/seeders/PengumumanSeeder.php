<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PengumumanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('pengumuman')->insert([
            [
                'judul' => 'Libur Hari Kemerdekaan',
                'deskripsi' => 'Kegiatan belajar mengajar diliburkan pada tanggal 17 Agustus dalam rangka Hari Kemerdekaan Republik Indonesia.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'judul' => 'Pembayaran SPP Semester Baru',
                'deskripsi' => 'Seluruh siswa diharapkan melakukan pembayaran SPP sebelum batas waktu yang telah ditentukan.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'judul' => 'Jadwal Ujian Tengah Semester',
                'deskripsi' => 'Ujian Tengah Semester akan dilaksanakan mulai tanggal 10 Oktober sesuai jadwal masing-masing kelas.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'judul' => 'Pendaftaran Ekstrakurikuler',
                'deskripsi' => 'Pendaftaran kegiatan ekstrakurikuler dibuka hingga akhir bulan ini.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'judul' => 'Kerja Bakti Sekolah',
                'deskripsi' => 'Seluruh siswa diwajibkan mengikuti kegiatan kerja bakti pada hari Sabtu pukul 07.00 WIB.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'judul' => 'Lomba Antar Kelas',
                'deskripsi' => 'Akan diadakan lomba antar kelas dalam rangka memperingati hari jadi sekolah.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'judul' => 'Pengambilan Raport',
                'deskripsi' => 'Raport semester dapat diambil oleh orang tua/wali siswa sesuai jadwal yang telah ditentukan.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'judul' => 'Seminar Karier',
                'deskripsi' => 'Seminar karier dan persiapan dunia kerja akan dilaksanakan di aula utama sekolah.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'judul' => 'Perbaikan Sistem Akademik',
                'deskripsi' => 'Sistem akademik akan mengalami maintenance pada hari Minggu pukul 00.00 - 06.00 WIB.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'judul' => 'Kegiatan Study Tour',
                'deskripsi' => 'Pendaftaran study tour dibuka mulai minggu depan dengan kuota terbatas.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
