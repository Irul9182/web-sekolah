<html>

<head>
    <title>SMK Baidhaul Ahkam</title>
    <link rel="stylesheet" href="{{ asset('css/belajar1.css') }}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://kit.fontawesome.com/8f271db5c7.js" crossorigin="anonymous"></script>
</head>

<body>
    <div class="SectionA">
        <div class="Logo">
            <img src="{{ asset('images/OIP.jpg') }}" class="Gambar">
            <h3 class="teks">SMK Islam Baidhaul Ahkam</h3>
        </div>
        <nav class="menu">
            <ul>
                <li><a href="#">Beranda</a></li>
                <li><a href="#">Profile</a>
                    <ul class="dropdown">
                        <li><a href="#">TKJ</a></li>
                        <li><a href="#">AP</a></li>
                        <li><a href="#">AK</a></li>
                        <li><a href="#">MAVIB</a></li>
                    </ul>
                </li>
                <li><a href="#">Berita</a></li>
                <li><a href="#">Galeri</a></li>
                <li><a href="#">Kontak</a>
                    <ul class="dropdown1">
                        <li><a href="#">Facebook</a></li>
                        <li><a href="#">Instagram</a></li>
                        <li><a href="#">WhatsApp</a></li>
                    </ul>
                </li>
            </ul>
        </nav>
        <nav class="hamburger_menu">
            <div class="hamburger_icon" id="hamburger">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <ul id="menuList">
                <li><a href="#">Beranda</a></li>
                <li><a href="#">Profile</a></li>
                <li><a href="#">Berita</a></li>
                <li><a href="#">Galeri</a></li>
                <li><a href="#">Kontak</a></li>
            </ul>
        </nav>
        <div class="Login">
            <a href="/admin/login" class="tombol_login">Login Admin</a>
        </div>
        <div class="Logout">
            <input type="button" Value="Logout" id="logout" class="tombol_logout">
        </div>
    </div>
    <div class="menuLogin">
        <div class="login_box">
            <span class="close">X</span>
            <div class="form_login active">
                <h2>Login Admin</h2>
                <div class="akun">
                    <input type="text" id="username" required>
                    <label>Username</label>
                </div>
                <div class="akun">
                    <input type="password" id="password" required>
                    <label>Password</label>
                </div>
                <p class="switch">Belum punya akun? <span id="toDaftar">Daftar</span></p>
            </div>

            <!-- DAFTAR -->
            <div class="form_daftar">
                <h2>Daftar Admin</h2>
                <div class="akun">
                    <input type="text" id="username" required>
                    <label>Username</label>
                </div>
                <div class="akun">
                    <input type="password" id="password" required>
                    <label>Password</label>
                </div>
                <p class="switch">Sudah punya akun? <span id="toLogin">Login</span></p>
            </div>
            <br />
            <center>
                <button class="Masuk" id="masuk">masuk</button>
            </center>
        </div>
    </div>
    <div class="hero-box">
        <div class="hero_text">
            <center>
                <h1>Selamat Datang Di Sekolah Baidhaul Ahkam</h1>
                <p>Sekolah Unggulan Berbasis Teknologi</p>
                <input type="button" class="tombol_profile" value="Lihat Profile Sekolah >">
            </center>
        </div>
    </div>
    <br>
    <p>Berita Terbaru</p>
    <div class="SectionB">
        <div class="Berita">
            <div class="card">
                <img src="{{ asset('images/card1.jpg') }}">
                <div class="content">
                    <center>
                        <p>Kegiatan Study Tour Bandung</p>
                        <p>12 Mei 2025</p>
                    </center>
                </div>
            </div>
            <div class="card">
                <img src="{{ asset('images/card2.png') }}">
                <div class="content">
                    <center>
                        <p>Lomba Sains Antar Sekolah</p>
                        <p>8 Mei 2025</p>
                    </center>
                </div>
            </div>
            <div class="card">
                <img src="{{ asset('images/card3.jpg') }}">
                <div class="content">
                    <center>
                        <p>Peringatan Hari Kartini</p>
                        <p>21 April 2025</p>
                    </center>
                </div>
            </div>
            <div class="card">
                <img src="{{ asset('images/ppdb.jpg') }}">
                <div class="content">
                    <center>
                        <p>Pengumuman PPDB</p>
                        <p>10 juni 2025</p>
                    </center>
                </div>
            </div>
        </div>
    </div>
    <p>Pengumuman Sekolah</p>
    <div class="SectionC">
        <div class="pengumuman">
            <div class="card">
                <p>Penerimaan Siswa Baru 2022</p>
                <br>
                <p>Pendaftaran Dibuka Mulai 1 Juni 2025 </p>
            </div>
            <div class="card">
                <p>Jadwal Ujian Akhir Semester</p>
                <br>
                <p>Ujian Akhir Semester Akan Dimulai pada 20 Juni 2025</p>
            </div>
        </div>
    </div>
    <br>
    <p>Sekilas Sekolah SMK Islam Baidhaul Ahkam</p>
    <div class="SectionD">
        <div class="jurusan">
            <div class="card" onclick="bukaModal('tkj')">
                <img src="{{ asset('images/tkj.jpg') }}">
                <div class="content">
                    <center>
                        <p>TKJ</p>
                    </center>
                </div>
            </div>
            <div class="card" onclick="bukaModal('dkv')">
                <img src="{{ asset('images/dkv.jpg') }}">
                <div class="content">
                    <center>
                        <p>DKV</p>
                    </center>
                </div>
            </div>
            <div class="card" onclick="bukaModal('akuntansi')">
                <img src="{{ asset('images/akuntansi.jpg') }}">
                <div class="content">
                    <center>
                        <p>akuntansi</p>
                    </center>
                </div>
            </div>
            <div class="card" onclick="bukaModal('perkantoran')">
                <img src="{{ asset('images/perkantoran.jpg') }}">
                <div class="content">
                    <center>
                        <p>Perkantoran</p>
                    </center>
                </div>
            </div>
        </div>
    </div>
    <div id="modalJurusan" class="modal-overlay" onclick="tutupModal(event)">
        <div class="modal-box">
            <button class="modal-close" onclick="tutupModal()">X</button>
            <img id="modal-img" src="" alt="">
            <h2 id="modal-judul"></h2>
            <p id="modal-deskripsi"></p>
            <a id="modal-link" href="#">
                <button class="tombol-detail">Lihat Detail Jurusan</button>
            </a>
        </div>
    </div>
    <br>
    <p>Galeri Sekolah</p>
    <div class="SectionE">
        <div class="Galeri">
            <div class="card">
                <img src="{{ asset('images/perpus.jpg') }}">
                <div class="content">
                    <center>
                        <p>perpus</p>
                    </center>
                </div>
            </div>
            <div class="card">
                <img src="{{ asset('images/wisuda.png') }}">
                <div class="content">
                    <center>
                        <p>wisuda</p>
                    </center>
                </div>
            </div>
            <div class="card">
                <img src="{{ asset('images/olahraga.webp') }}">
                <div class="content">
                    <center>
                        <p>Olahraga</p>
                    </center>
                </div>
            </div>
            <div class="card">
                <img src="{{ asset('images/praktikum.jpeg') }}">
                <div class="content">
                    <center>
                        <p>Kegiatan Praktikum</p>
                    </center>
                </div>
            </div>
            <br>
        </div>
    </div>
    <center>
        <input type="button" value="Lihat Semua Foto >" class="tombol_galeri">
    </center>
    <script>
        const navbar = document.querySelector(".SectionA");

        window.addEventListener("scroll", function() {
            if (window.scrollY > 80) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }
        });

        document.getElementById('hamburger').addEventListener('click', function() {
            document.getElementById('menuList').classList.toggle('show');
        });

        window.addEventListener("load", function() {
            document.querySelector(".hero_text").classList.add("show");

            const counters = document.querySelectorAll(".counter");
        });
        const dataJurusan = {
            tkj: {
                judul: "Teknik Komputer & Jaringan",
                img: "tkj.jpg",
                deskripsi: "Jurusan TKJ mempelajari instalasi jaringan komputer, troubleshooting hardware, dan administrasi sistem. Lulusan siap bekerja sebagai teknisi jaringan dan IT support.",
                link: "tkj.html"
            },
            dkv: {
                judul: "Desain Komunikasi Visual",
                img: "dkv.jpg",
                deskripsi: "Jurusan DKV mempelajari desain grafis, fotografi, dan multimedia kreatif. Lulusan siap berkarir di industri kreatif, periklanan, dan media digital.",
                link: "dkv.html"
            },
            akuntansi: {
                judul: "Akuntansi & Keuangan",
                img: "akuntansi.jpg",
                deskripsi: "Jurusan Akuntansi mempelajari pembukuan, laporan keuangan, dan perpajakan. Lulusan siap bekerja di perusahaan maupun membuka usaha sendiri.",
                link: "akuntansi.html"
            },
            perkantoran: {
                judul: "Otomatisasi & Tata Kelola Perkantoran",
                img: "perkantoran.jpg",
                deskripsi: "Jurusan Perkantoran mempelajari administrasi bisnis, korespondensi, dan manajemen arsip. Lulusan siap bekerja sebagai staf administrasi profesional.",
                link: "perkantoran.html"
            }
        };

        function bukaModal(jurusan) {
            const data = dataJurusan[jurusan];
            document.getElementById('modal-img').src = data.img;
            document.getElementById('modal-judul').textContent = data.judul;
            document.getElementById('modal-deskripsi').textContent = data.deskripsi;
            document.getElementById('modal-link').href = data.link;
            document.getElementById('modalJurusan').classList.add('aktif');
        }

        function tutupModal(event) {
            if (!event || event.target === document.getElementById('modalJurusan')) {
                document.getElementById('modalJurusan').classList.remove('aktif');
            }
        };
    </script>
</body>
<footer>
    <br />
    <div class="SectionF">
        <div class="card_top">
            <div class="card_left">
                <i class="fa-solid fa-location-dot"></i>
                <p>Jl. Bla bla bla</p>
                <i class="fa-solid fa-envelope"></i>
                <p>Info@sekolah.sch.id</p>
                <i class="fa-brands fa-whatsapp"></i>
                <p>08121212112</p>
            </div>
            <div class="card_right">
                <i class="fa-brands fa-facebook"></i>
                <i class="fa-brands fa-instagram"></i>
                <i class="fa-brands fa-square-youtube"></i>
                <i class="fa-brands fa-x-twitter"></i>
            </div>
        </div>
        <div class="card_bottom">
            <p>© Copyright 2025 SMK Baidhaul Ahkam</p>
        </div>
    </div>
</footer>

</html>