import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Separator } from '@/components/ui/separator';
import { InstagramIcon, X, Youtube } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';

/* ============================================================
   DESIGN TOKENS — SMK Islam Baidhaul Ahkam (revisi minimalis)

   Prinsip revisi:
   - Semua warna diambil murni dari CSS variable yang sudah ada
     (--primary, --secondary, --accent, --muted, --destructive,
     --card, --border, --background, --foreground).
   - Tidak ada lagi warna hardcode (rgba(255,255,255,x), #ffffff
     manual, hover:bg-white/x) — semua opacity/varian dibangun
     lewat color-mix() di atas token yang sudah ada, supaya ikut
     berubah otomatis kalau tema (termasuk dark mode) di-adjust.
   - 4 jurusan tampil setara, dibedakan lewat nomor jalur & label,
     bukan warna berbeda-beda per-jurusan.
   - Latar blueprint-grid, gradient berlebih, dan bayangan berat
     dihapus. Ruang kosong & tipografi yang membawa hierarki.
   ============================================================ */

const FONT_LINK_ID = 'smk-ba-fonts';

interface Berita {
    id: number;
    judul: string;
    tanggal: string;
    img: string;
}

interface Pengumuman {
    id: number;
    judul: string;
    isi: string;
}

interface Galeri {
    id: number;
    nama: string;
    img: string;
}

interface Jurusan {
    kode: string;
    jalur: string;
    judul: string;
    img: string;
    deskripsi: string;
    link: string;
}

type JurusanKey = 'tkj' | 'dkv' | 'akuntansi' | 'perkantoran';

interface SosmedItem {
    label: string;
    icon: React.ReactNode;
}

const berita: Berita[] = [
    { id: 1, judul: 'Kegiatan Study Tour Bandung', tanggal: '12 Mei 2025', img: '/images/card1.jpg' },
    { id: 2, judul: 'Lomba Sains Antar Sekolah', tanggal: '8 Mei 2025', img: '/images/card2.png' },
    { id: 3, judul: 'Peringatan Hari Kartini', tanggal: '21 April 2025', img: '/images/card3.jpg' },
    { id: 4, judul: 'Pengumuman PPDB', tanggal: '10 Juni 2025', img: '/images/ppdb.jpg' },
];

const pengumuman: Pengumuman[] = [
    { id: 1, judul: 'Penerimaan Siswa Baru 2025', isi: 'Pendaftaran dibuka mulai 1 Juni 2025. Kuota terbatas, segera amankan tempatmu.' },
    {
        id: 2,
        judul: 'Jadwal Ujian Akhir Semester',
        isi: 'Ujian akhir semester akan dimulai pada 20 Juni 2025. Cek jadwal lengkap di papan pengumuman.',
    },
];

const galeri: Galeri[] = [
    { id: 1, nama: 'Perpustakaan', img: '/images/perpus.jpg' },
    { id: 2, nama: 'Wisuda', img: '/images/wisuda.png' },
    { id: 3, nama: 'Olahraga', img: '/images/olahraga.webp' },
    { id: 4, nama: 'Kegiatan Praktikum', img: '/images/praktikum.jpeg' },
];

const dataJurusan: Record<JurusanKey, Jurusan> = {
    tkj: {
        kode: 'TKJ',
        jalur: '01',
        judul: 'Teknik Komputer & Jaringan',
        img: '/images/tkj.jpg',
        deskripsi:
            'Jurusan TKJ mempelajari instalasi jaringan komputer, troubleshooting hardware, dan administrasi sistem. Lulusan siap bekerja sebagai teknisi jaringan dan IT support.',
        link: '/tkj',
    },
    dkv: {
        kode: 'DKV',
        jalur: '02',
        judul: 'Desain Komunikasi Visual',
        img: '/images/dkv.jpg',
        deskripsi:
            'Jurusan DKV mempelajari desain grafis, fotografi, dan multimedia kreatif. Lulusan siap berkarir di industri kreatif, periklanan, dan media digital.',
        link: '/dkv',
    },
    akuntansi: {
        kode: 'AK',
        jalur: '03',
        judul: 'Akuntansi & Keuangan',
        img: '/images/akuntansi.jpg',
        deskripsi:
            'Jurusan Akuntansi mempelajari pembukuan, laporan keuangan, dan perpajakan. Lulusan siap bekerja di perusahaan maupun membuka usaha sendiri.',
        link: '/akuntansi',
    },
    perkantoran: {
        kode: 'OTKP',
        jalur: '04',
        judul: 'Otomatisasi & Tata Kelola Perkantoran',
        img: '/images/perkantoran.jpg',
        deskripsi:
            'Jurusan Perkantoran mempelajari administrasi bisnis, korespondensi, dan manajemen arsip. Lulusan siap bekerja sebagai staf administrasi profesional.',
        link: '/perkantoran',
    },
};

const statistik: { angka: string; label: string }[] = [
    { angka: '4', label: 'Jalur Kejuruan' },
    { angka: '850+', label: 'Siswa Aktif' },
    { angka: '92%', label: 'Lulusan Terserap Kerja' },
    { angka: 'A', label: 'Akreditasi BAN-S/M' },
];

const sosmed: SosmedItem[] = [
    { label: 'Facebook', icon: <FaceBookIcon /> },
    { label: 'Instagram', icon: <InstagramIcon size={18} /> },
    { label: 'YouTube', icon: <Youtube size={18} /> },
    { label: 'Twitter/X', icon: <X size={18} /> },
];

const navLinks: string[] = ['Beranda', 'Berita', 'Galeri'];

export default function SMKBaidhaulAhkam(): React.JSX.Element {
    // ---- state (auth) ----
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [showLogin, setShowLogin] = useState<boolean>(false);

    // ---- state (navbar) ----
    const [scrolled, setScrolled] = useState<boolean>(false);

    // ---- state (login dialog) ----
    const [mode, setMode] = useState<'login' | 'daftar'>('login');
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    // ---- state (jurusan modal) ----
    const [activeJurusan, setActiveJurusan] = useState<JurusanKey | null>(null);

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 80);
        window.addEventListener('scroll', handler);
        return () => window.removeEventListener('scroll', handler);
    }, []);

    // Inject display / body / mono fonts once
    useEffect(() => {
        if (document.getElementById(FONT_LINK_ID)) return;
        const link = document.createElement('link');
        link.id = FONT_LINK_ID;
        link.rel = 'stylesheet';
        link.href =
            'https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap';
        document.head.appendChild(link);
    }, []);

    const handleDropdownMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.currentTarget.style.backgroundColor = 'var(--accent)';
        e.currentTarget.style.color = 'var(--accent-foreground)';
    };

    const handleDropdownMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.currentTarget.style.backgroundColor = '';
        e.currentTarget.style.color = 'var(--foreground)';
    };

    const handleNavbarCtaMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
        e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--primary) 88%, black)';
    };

    const handleNavbarCtaMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
        e.currentTarget.style.backgroundColor = 'var(--primary)';
    };

    const handleMasuk = () => {
        if (!username) return void alert('Username wajib diisi');
        if (!password) return void alert('Password wajib diisi');
        if (username === 'admin' && password === '123') {
            alert('Login berhasil');
            setIsLoggedIn(true);
            setShowLogin(false);
        } else {
            alert('Username atau password salah');
        }
    };

    const jurusanKeys = Object.keys(dataJurusan) as JurusanKey[];

    return (
        <div
            className="min-h-screen"
            style={{
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)',
                fontFamily: "'Inter', sans-serif",
            }}
        >
            <style>{`
                .font-display { font-family: 'Poppins', sans-serif; letter-spacing: -0.02em; }
                .font-mono-label { font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.08em; }
                @media (prefers-reduced-motion: reduce) {
                    .group * { transition: none !important; }
                }
            `}</style>

            {/* ============ NAVBAR ============ */}
            <header
                className={`fixed top-0 right-0 left-0 z-50 border-b transition-colors duration-300`}
                style={{
                    backgroundColor: scrolled ? 'color-mix(in srgb, var(--background) 92%, transparent)' : 'var(--background)',
                    borderColor: scrolled ? 'var(--border)' : 'transparent',
                    backdropFilter: scrolled ? 'blur(8px)' : 'none',
                }}
            >
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
                    <div className="flex flex-shrink-0 items-center gap-3">
                        <img
                            src="/images/OIP.jpg"
                            alt="Logo SMK"
                            className="h-10 w-10 rounded-full object-cover"
                            style={{ border: '1px solid var(--border)' }}
                        />
                        <div className="hidden sm:block">
                            <p className="font-display text-sm leading-none font-bold" style={{ color: 'var(--foreground)' }}>
                                Baidhaul Ahkam
                            </p>
                            <p className="font-mono-label mt-1 text-[10px] uppercase" style={{ color: 'var(--muted-foreground)' }}>
                                SMK Islam · Terakreditasi A
                            </p>
                        </div>
                    </div>

                    <NavigationMenu className="hidden lg:flex">
                        <NavigationMenuList>
                            {navLinks.map((item) => (
                                <NavigationMenuItem key={item}>
                                    <NavigationMenuLink
                                        href="#"
                                        className="px-4 py-2 text-sm font-medium transition-colors"
                                        style={{ color: 'var(--foreground)' }}
                                    >
                                        {item}
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            ))}

                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="text-sm font-medium">Jurusan</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-52 gap-1 p-2">
                                        {jurusanKeys.map((key) => (
                                            <li key={key}>
                                                <NavigationMenuLink
                                                    href="#jurusan"
                                                    className="block rounded-md px-3 py-2 text-sm transition-colors"
                                                    style={{ color: 'var(--foreground)' }}
                                                    onMouseEnter={handleDropdownMouseEnter}
                                                    onMouseLeave={handleDropdownMouseLeave}
                                                >
                                                    {dataJurusan[key].kode} — {dataJurusan[key].judul}
                                                </NavigationMenuLink>
                                            </li>
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="text-sm font-medium">Kontak</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-40 gap-1 p-2">
                                        {['Facebook', 'Instagram', 'WhatsApp'].map((s) => (
                                            <li key={s}>
                                                <NavigationMenuLink
                                                    href="#"
                                                    className="block rounded-md px-3 py-2 text-sm transition-colors"
                                                    style={{ color: 'var(--foreground)' }}
                                                    onMouseEnter={handleDropdownMouseEnter}
                                                    onMouseLeave={handleDropdownMouseLeave}
                                                >
                                                    {s}
                                                </NavigationMenuLink>
                                            </li>
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>

                    <Button
                        size="sm"
                        className="hidden sm:inline-flex"
                        style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
                        onMouseEnter={handleNavbarCtaMouseEnter}
                        onMouseLeave={handleNavbarCtaMouseLeave}
                    >
                        Daftar Sekarang
                    </Button>
                </div>
            </header>

            {/* ============ LOGIN DIALOG ============ */}
            <Dialog open={showLogin} onOpenChange={setShowLogin}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{mode === 'login' ? 'Login Admin' : 'Daftar Admin'}</DialogTitle>
                        <DialogDescription>
                            {mode === 'login' ? 'Masukkan kredensial untuk mengakses panel admin.' : 'Buat akun admin baru.'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label htmlFor="dlg-username">Username</Label>
                            <Input id="dlg-username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Masukkan username" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dlg-password">Password</Label>
                            <Input
                                id="dlg-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Masukkan password"
                            />
                        </div>

                        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                            {mode === 'login' ? (
                                <>
                                    Belum punya akun?{' '}
                                    <button
                                        onClick={() => setMode('daftar')}
                                        className="font-medium hover:underline"
                                        style={{ color: 'var(--primary)' }}
                                    >
                                        Daftar
                                    </button>
                                </>
                            ) : (
                                <>
                                    Sudah punya akun?{' '}
                                    <button
                                        onClick={() => setMode('login')}
                                        className="font-medium hover:underline"
                                        style={{ color: 'var(--primary)' }}
                                    >
                                        Login
                                    </button>
                                </>
                            )}
                        </p>

                        <Button
                            onClick={handleMasuk}
                            className="w-full"
                            style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
                        >
                            Masuk
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <main>
                {/* ============ HERO ============ */}
                <section className="relative overflow-hidden pt-16" style={{ backgroundColor: 'var(--primary)' }}>
                    <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 py-20 lg:grid-cols-2 lg:py-28">
                        <div>
                            <span
                                className="font-mono-label inline-block rounded-full px-3 py-1 text-[11px] uppercase"
                                style={{
                                    backgroundColor: 'color-mix(in srgb, var(--primary-foreground) 14%, transparent)',
                                    color: 'var(--primary-foreground)',
                                }}
                            >
                                PPDB 2025/2026 Dibuka
                            </span>
                            <h1
                                className="font-display mt-5 text-4xl leading-[1.08] font-extrabold sm:text-5xl lg:text-[3.25rem]"
                                style={{ color: 'var(--primary-foreground)' }}
                            >
                                Belajar Keterampilan,
                                <br />
                                Siap Kerja Sejak Kelas X.
                            </h1>
                            <p
                                className="mt-5 max-w-md text-base leading-relaxed"
                                style={{ color: 'color-mix(in srgb, var(--primary-foreground) 85%, transparent)' }}
                            >
                                SMK Islam Baidhaul Ahkam membekali siswa dengan empat jalur kejuruan, praktik langsung di lab dan industri, serta
                                nilai-nilai keislaman sebagai fondasi karakter.
                            </p>
                            <div className="mt-8 flex flex-wrap gap-3">
                                <Button size="lg" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}>
                                    Daftar Sekarang →
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    style={{
                                        backgroundColor: 'transparent',
                                        borderColor: 'color-mix(in srgb, var(--primary-foreground) 40%, transparent)',
                                        color: 'var(--primary-foreground)',
                                    }}
                                >
                                    Lihat Jurusan
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {statistik.map((s) => (
                                <div
                                    key={s.label}
                                    className="rounded-xl p-5"
                                    style={{
                                        backgroundColor: 'color-mix(in srgb, var(--primary-foreground) 10%, transparent)',
                                        border: '1px solid color-mix(in srgb, var(--primary-foreground) 18%, transparent)',
                                    }}
                                >
                                    <p className="font-display text-3xl font-bold" style={{ color: 'var(--primary-foreground)' }}>
                                        {s.angka}
                                    </p>
                                    <p
                                        className="font-mono-label mt-1 text-[11px] uppercase"
                                        style={{ color: 'color-mix(in srgb, var(--primary-foreground) 75%, transparent)' }}
                                    >
                                        {s.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ---- Signature: strip Jalur Jurusan menjembatani hero ke seksi jurusan ---- */}
                    <div className="relative z-10 border-t" style={{ borderColor: 'color-mix(in srgb, var(--primary-foreground) 15%, transparent)' }}>
                        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x md:grid-cols-4">
                            {jurusanKeys.map((key) => {
                                const j = dataJurusan[key];
                                return (
                                    <a
                                        key={key}
                                        href="#jurusan"
                                        className="flex flex-col gap-1 px-4 py-4 transition-colors sm:px-6"
                                        style={{ borderColor: 'color-mix(in srgb, var(--primary-foreground) 15%, transparent)' }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--primary-foreground) 6%, transparent)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }}
                                    >
                                        <span
                                            className="font-mono-label text-[11px]"
                                            style={{ color: 'color-mix(in srgb, var(--primary-foreground) 60%, transparent)' }}
                                        >
                                            Jalur {j.jalur}
                                        </span>
                                        <span className="font-display text-sm font-semibold" style={{ color: 'var(--primary-foreground)' }}>
                                            {j.kode}
                                        </span>
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* ============ BERITA ============ */}
                <section className="mx-auto max-w-6xl px-4 py-16" style={{ backgroundColor: 'var(--background)' }}>
                    <div className="mb-8 flex items-end justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="h-6 w-1 rounded-full" style={{ backgroundColor: 'var(--primary)' }} />
                            <div>
                                <p className="font-mono-label text-[11px] uppercase" style={{ color: 'var(--primary)' }}>
                                    Kabar Sekolah
                                </p>
                                <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                                    Berita Terbaru
                                </h2>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" style={{ color: 'var(--primary)' }}>
                            Semua berita →
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {berita.map((b) => (
                            <Card
                                key={b.id}
                                className="group cursor-pointer overflow-hidden py-0 shadow-none transition-colors duration-200"
                                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
                            >
                                <div className="aspect-video overflow-hidden" style={{ backgroundColor: 'var(--muted)' }}>
                                    <img
                                        src={b.img}
                                        alt={b.judul}
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        onError={() => {}}
                                    />
                                </div>
                                <CardContent className="p-4">
                                    <p className="mb-1 line-clamp-2 text-sm font-semibold" style={{ color: 'var(--card-foreground)' }}>
                                        {b.judul}
                                    </p>
                                    <p className="font-mono-label text-[11px]" style={{ color: 'var(--muted-foreground)' }}>
                                        {b.tanggal}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* ============ PENGUMUMAN ============ */}
                <section className="py-16" style={{ backgroundColor: 'var(--muted)' }}>
                    <div className="mx-auto max-w-6xl px-4">
                        <div className="mb-8 flex items-center gap-3">
                            <div className="h-6 w-1 rounded-full" style={{ backgroundColor: 'var(--primary)' }} />
                            <div>
                                <p className="font-mono-label text-[11px] uppercase" style={{ color: 'var(--muted-foreground)' }}>
                                    Penting
                                </p>
                                <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                                    Pengumuman Sekolah
                                </h2>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            {pengumuman.map((p) => (
                                <Card
                                    key={p.id}
                                    className="border-l-4 shadow-none"
                                    style={{ borderLeftColor: 'var(--primary)', borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
                                >
                                    <CardContent className="p-5">
                                        <Badge
                                            className="mb-2 border-0"
                                            style={{
                                                backgroundColor: 'var(--accent)',
                                                color: 'var(--accent-foreground)',
                                            }}
                                        >
                                            Pengumuman
                                        </Badge>
                                        <p className="mb-1 font-bold" style={{ color: 'var(--card-foreground)' }}>
                                            {p.judul}
                                        </p>
                                        <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                                            {p.isi}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ============ JURUSAN ============ */}
                <section id="jurusan" className="mx-auto max-w-6xl px-4 py-16" style={{ backgroundColor: 'var(--background)' }}>
                    <div className="mb-8 flex items-center gap-3">
                        <div className="h-6 w-1 rounded-full" style={{ backgroundColor: 'var(--primary)' }} />
                        <div>
                            <p className="font-mono-label text-[11px] uppercase" style={{ color: 'var(--primary)' }}>
                                4 Jalur Kejuruan
                            </p>
                            <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                                Pilih Jurusan Sesuai Minatmu
                            </h2>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {jurusanKeys.map((key) => {
                            const j = dataJurusan[key];
                            return (
                                <Card
                                    key={key}
                                    onClick={() => setActiveJurusan(key)}
                                    className="group cursor-pointer overflow-hidden py-0 shadow-none transition-colors duration-200 hover:border-[var(--primary)]"
                                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
                                >
                                    <div className="relative aspect-video overflow-hidden" style={{ backgroundColor: 'var(--muted)' }}>
                                        <img
                                            src={j.img}
                                            alt={j.judul}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            onError={() => {}}
                                        />
                                        <span
                                            className="font-mono-label absolute top-2 left-2 rounded-full px-2 py-0.5 text-[10px]"
                                            style={{
                                                backgroundColor: 'color-mix(in srgb, var(--foreground) 65%, transparent)',
                                                color: 'var(--background)',
                                            }}
                                        >
                                            Jalur {j.jalur}
                                        </span>
                                    </div>
                                    <CardContent className="p-4">
                                        <span
                                            style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}
                                            className="font-mono-label inline-block rounded-full px-3 py-1 text-xs font-semibold"
                                        >
                                            {j.kode}
                                        </span>
                                        <p className="mt-2 text-sm leading-snug font-semibold" style={{ color: 'var(--card-foreground)' }}>
                                            {j.judul}
                                        </p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    <Dialog
                        open={!!activeJurusan}
                        onOpenChange={(o) => {
                            if (!o) setActiveJurusan(null);
                        }}
                    >
                        {activeJurusan && (
                            <DialogContent className="sm:max-w-lg">
                                <img
                                    src={dataJurusan[activeJurusan]?.img}
                                    alt={dataJurusan[activeJurusan]?.judul}
                                    className="mb-2 h-48 w-full rounded-lg object-cover"
                                    onError={() => {}}
                                />
                                <DialogHeader>
                                    <DialogTitle>{dataJurusan[activeJurusan]?.judul}</DialogTitle>
                                    <DialogDescription>{dataJurusan[activeJurusan]?.deskripsi}</DialogDescription>
                                </DialogHeader>
                                <Button asChild className="mt-2" style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}>
                                    <a href={dataJurusan[activeJurusan]?.link}>Lihat Detail Jurusan →</a>
                                </Button>
                            </DialogContent>
                        )}
                    </Dialog>
                </section>

                {/* ============ GALERI ============ */}
                <section className="py-16" style={{ backgroundColor: 'var(--muted)' }}>
                    <div className="mx-auto max-w-6xl px-4">
                        <div className="mb-8 flex items-center gap-3">
                            <div className="h-6 w-1 rounded-full" style={{ backgroundColor: 'var(--primary)' }} />
                            <div>
                                <p className="font-mono-label text-[11px] uppercase" style={{ color: 'var(--muted-foreground)' }}>
                                    Dokumentasi
                                </p>
                                <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                                    Galeri Sekolah
                                </h2>
                            </div>
                        </div>
                        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                            {galeri.map((g) => (
                                <div key={g.id} className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl">
                                    <img
                                        src={g.img}
                                        alt={g.nama}
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                        onError={() => {}}
                                    />
                                    <div
                                        className="absolute inset-0 flex items-end p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                        style={{
                                            background: `linear-gradient(to top, color-mix(in srgb, var(--foreground) 70%, transparent), transparent)`,
                                        }}
                                    >
                                        <span className="text-sm font-medium" style={{ color: 'var(--background)' }}>
                                            {g.nama}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="text-center">
                            <Button variant="outline" style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}>
                                Lihat Semua Foto →
                            </Button>
                        </div>
                    </div>
                </section>

                {/* ============ CTA BANNER ============ */}
                <section className="px-4 py-16" style={{ backgroundColor: 'var(--secondary)' }}>
                    <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center">
                        <h2 className="font-display max-w-xl text-2xl font-bold sm:text-3xl" style={{ color: 'var(--secondary-foreground)' }}>
                            Siap Menempuh Pendidikan Kejuruan yang Berkarakter?
                        </h2>
                        <p className="max-w-md text-sm" style={{ color: 'color-mix(in srgb, var(--secondary-foreground) 85%, transparent)' }}>
                            Pendaftaran siswa baru tahun ajaran 2025/2026 telah dibuka. Kuota tiap jurusan terbatas.
                        </p>
                        <Button size="lg" style={{ backgroundColor: 'var(--card)', color: 'var(--secondary)' }}>
                            Daftar Sekarang →
                        </Button>
                    </div>
                </section>
            </main>

            {/* ============ FOOTER ============ */}
            <footer style={{ backgroundColor: 'var(--foreground)' }}>
                <div className="mx-auto max-w-6xl px-4 py-12">
                    <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
                        <div className="space-y-3 sm:col-span-2">
                            <p className="font-display mb-2 text-lg font-bold" style={{ color: 'var(--background)' }}>
                                SMK Islam Baidhaul Ahkam
                            </p>
                            <p className="max-w-sm text-sm" style={{ color: 'color-mix(in srgb, var(--background) 75%, transparent)' }}>
                                Mendidik siswa menjadi lulusan yang terampil, berdaya saing, dan berakhlak sesuai nilai-nilai keislaman.
                            </p>
                            <div className="mt-4 space-y-2 text-sm" style={{ color: 'color-mix(in srgb, var(--background) 80%, transparent)' }}>
                                <div className="flex items-center gap-2">
                                    <span>📍</span>
                                    <span>Jl. Bla bla bla</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>✉️</span>
                                    <span>Info@sekolah.sch.id</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>📱</span>
                                    <span>08121212112</span>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center gap-2">
                                {!isLoggedIn ? (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowLogin(true)}
                                        className="rounded-full text-xs!"
                                        style={{
                                            color: 'var(--background)',
                                            borderColor: 'color-mix(in srgb, var(--background) 30%, transparent)',
                                        }}
                                    >
                                        Login Admin
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={() => setIsLoggedIn(false)}
                                        variant="outline"
                                        size="sm"
                                        className="rounded-full text-xs"
                                        style={{ color: 'var(--destructive)', borderColor: 'var(--destructive)' }}
                                    >
                                        Logout
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div>
                            <p className="font-mono-label mb-4 text-xs uppercase" style={{ color: 'var(--background)' }}>
                                Media Sosial
                            </p>
                            <div className="flex gap-3">
                                {sosmed.map((s) => (
                                    <div
                                        key={s.label}
                                        aria-label={s.label}
                                        className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold transition-colors"
                                        style={{
                                            backgroundColor: 'color-mix(in srgb, var(--background) 10%, transparent)',
                                            color: 'var(--background)',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--background) 20%, transparent)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--background) 10%, transparent)';
                                        }}
                                    >
                                        {s.icon}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <Separator className="my-8" style={{ backgroundColor: 'color-mix(in srgb, var(--background) 15%, transparent)' }} />
                    <p className="text-center text-sm" style={{ color: 'color-mix(in srgb, var(--background) 50%, transparent)' }}>
                        © Copyright 2025 SMK Baidhaul Ahkam
                    </p>
                </div>
            </footer>
        </div>
    );
}

function FaceBookIcon(): React.JSX.Element {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none" />
            <path
                fill="currentColor"
                d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95"
            />
        </svg>
    );
}
