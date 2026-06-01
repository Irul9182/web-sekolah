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
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useEffect, useState } from 'react';


type ThemeColor = 'info' | 'gold' | 'success' | 'warning' | 'error' | 'default';

interface BeritaItem {
    id: number;
    judul: string;
    tanggal: string;
    img: string;
}

interface PengumumanItem {
    id: number;
    judul: string;
    isi: string;
}

interface GaleriItem {
    id: number;
    nama: string;
    img: string;
}

interface JurusanData {
    judul: string;
    img: string;
    deskripsi: string;
    link: string;
    varColor: ThemeColor;
}

type JurusanKey = 'tkj' | 'dkv' | 'akuntansi' | 'perkantoran';


const berita: BeritaItem[] = [
    { id: 1, judul: 'Kegiatan Study Tour Bandung', tanggal: '12 Mei 2025', img: '/images/card1.jpg' },
    { id: 2, judul: 'Lomba Sains Antar Sekolah', tanggal: '8 Mei 2025', img: '/images/card2.png' },
    { id: 3, judul: 'Peringatan Hari Kartini', tanggal: '21 April 2025', img: '/images/card3.jpg' },
    { id: 4, judul: 'Pengumuman PPDB', tanggal: '10 Juni 2025', img: '/images/ppdb.jpg' },
];

const pengumuman: PengumumanItem[] = [
    { id: 1, judul: 'Penerimaan Siswa Baru 2025', isi: 'Pendaftaran Dibuka Mulai 1 Juni 2025' },
    { id: 2, judul: 'Jadwal Ujian Akhir Semester', isi: 'Ujian Akhir Semester Akan Dimulai pada 20 Juni 2025' },
];

const galeri: GaleriItem[] = [
    { id: 1, nama: 'Perpustakaan', img: '/images/perpus.jpg' },
    { id: 2, nama: 'Wisuda', img: '/images/wisuda.png' },
    { id: 3, nama: 'Olahraga', img: '/images/olahraga.webp' },
    { id: 4, nama: 'Kegiatan Praktikum', img: '/images/praktikum.jpeg' },
];

const dataJurusan: Record<JurusanKey, JurusanData> = {
    tkj: {
        judul: 'Teknik Komputer & Jaringan',
        img: '/images/tkj.jpg',
        deskripsi:
            'Jurusan TKJ mempelajari instalasi jaringan komputer, troubleshooting hardware, dan administrasi sistem. Lulusan siap bekerja sebagai teknisi jaringan dan IT support.',
        link: '/tkj',
        varColor: 'info',
    },
    dkv: {
        judul: 'Desain Komunikasi Visual',
        img: '/images/dkv.jpg',
        deskripsi:
            'Jurusan DKV mempelajari desain grafis, fotografi, dan multimedia kreatif. Lulusan siap berkarir di industri kreatif, periklanan, dan media digital.',
        link: '/dkv',
        varColor: 'gold',
    },
    akuntansi: {
        judul: 'Akuntansi & Keuangan',
        img: '/images/akuntansi.jpg',
        deskripsi:
            'Jurusan Akuntansi mempelajari pembukuan, laporan keuangan, dan perpajakan. Lulusan siap bekerja di perusahaan maupun membuka usaha sendiri.',
        link: '/akuntansi',
        varColor: 'success',
    },
    perkantoran: {
        judul: 'Otomatisasi & Tata Kelola Perkantoran',
        img: '/images/perkantoran.jpg',
        deskripsi:
            'Jurusan Perkantoran mempelajari administrasi bisnis, korespondensi, dan manajemen arsip. Lulusan siap bekerja sebagai staf administrasi profesional.',
        link: '/perkantoran',
        varColor: 'warning',
    },
};

const sosmed: Array<{ label: string; icon: string }> = [
    { label: 'Facebook', icon: 'f' },
    { label: 'Instagram', icon: 'in' },
    { label: 'YouTube', icon: 'yt' },
    { label: 'Twitter/X', icon: 'x' },
];


interface JurusanBadgeProps {
    varColor: ThemeColor;
    label: string;
}

function JurusanBadge({ varColor, label }: JurusanBadgeProps) {
    return (
        <span
            style={{
                backgroundColor: `color-mix(in srgb, var(--color-${varColor}) 15%, transparent)`,
                color: `var(--color-${varColor})`,
            }}
            className="inline-block rounded-full px-3 py-1 text-xs font-semibold"
        >
            {label}
        </span>
    );
}

interface SectionHeaderProps {
    title: string;
}

function SectionHeader({ title }: SectionHeaderProps) {
    return (
        <div className="mb-6 flex items-center gap-3">
            <div className="h-6 w-1 rounded-full" style={{ backgroundColor: 'var(--primary)' }} />
            <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
                {title}
            </h2>
        </div>
    );
}


interface NavbarProps {
    isLoggedIn: boolean;
    onLoginClick: () => void;
    onLogout: () => void;
}

function Navbar({ isLoggedIn, onLoginClick, onLogout }: NavbarProps) {
    const [scrolled, setScrolled] = useState<boolean>(false);

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 80);
        window.addEventListener('scroll', handler);
        return () => window.removeEventListener('scroll', handler);
    }, []);

    const handleDropdownMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.currentTarget.style.backgroundColor = 'var(--accent)';
        e.currentTarget.style.color = 'var(--accent-foreground)';
    };

    const handleDropdownMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.currentTarget.style.backgroundColor = '';
        e.currentTarget.style.color = 'var(--foreground)';
    };

    return (
        <header
            className={`fixed top-0 right-0 left-0 z-50 border-b transition-all duration-300 ${scrolled ? 'shadow-md backdrop-blur' : ''}`}
            style={{
                backgroundColor: scrolled ? 'color-mix(in srgb, var(--background) 95%, transparent)' : 'var(--background)',
                borderColor: 'var(--border)',
            }}
        >
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
                {/* Logo */}
                <div className="flex flex-shrink-0 items-center gap-3">
                    <img
                        src="/images/OIP.jpg"
                        alt="Logo SMK"
                        className="h-10 w-10 rounded-full object-cover"
                        style={{ border: '1px solid var(--border)' }}
                    />
                    <span className="hidden text-sm leading-tight font-bold sm:block" style={{ color: 'var(--color-success)' }}>
                        SMK Islam
                        <br />
                        Baidhaul Ahkam
                    </span>
                </div>

                {/* Desktop Nav */}
                <NavigationMenu className="hidden lg:flex">
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuLink
                                href="#"
                                className="px-4 py-2 text-sm font-medium transition-colors"
                                style={{ color: 'var(--foreground)' }}
                            >
                                Beranda
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuTrigger className="text-sm font-medium">Profile</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-40 gap-1 p-2">
                                    {(['TKJ', 'AP', 'AK', 'MAVIB'] as const).map((j) => (
                                        <li key={j}>
                                            <NavigationMenuLink
                                                href="#"
                                                className="block rounded-md px-3 py-2 text-sm transition-colors"
                                                style={{ color: 'var(--foreground)' }}
                                                onMouseEnter={handleDropdownMouseEnter}
                                                onMouseLeave={handleDropdownMouseLeave}
                                            >
                                                {j}
                                            </NavigationMenuLink>
                                        </li>
                                    ))}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>

                        {(['Berita', 'Galeri'] as const).map((item) => (
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
                            <NavigationMenuTrigger className="text-sm font-medium">Kontak</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-40 gap-1 p-2">
                                    {(['Facebook', 'Instagram', 'WhatsApp'] as const).map((s) => (
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

                {/* Auth Buttons */}
                <div className="flex items-center gap-2">
                    {!isLoggedIn ? (
                        <Button
                            onClick={onLoginClick}
                            size="sm"
                            className="text-xs"
                            style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
                        >
                            Login Admin
                        </Button>
                    ) : (
                        <Button
                            onClick={onLogout}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            style={{ color: 'var(--color-error)', borderColor: 'var(--color-error)' }}
                        >
                            Logout
                        </Button>
                    )}

                    {/* Mobile Hamburger */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="lg:hidden">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-64">
                            <nav className="mt-8 flex flex-col gap-1">
                                {(['Beranda', 'Profile', 'Berita', 'Galeri', 'Kontak'] as const).map((m) => (
                                    <a
                                        key={m}
                                        href="#"
                                        className="rounded-lg px-4 py-3 text-sm font-medium transition-colors"
                                        style={{ color: 'var(--foreground)' }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = 'var(--accent)';
                                            e.currentTarget.style.color = 'var(--accent-foreground)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = '';
                                            e.currentTarget.style.color = 'var(--foreground)';
                                        }}
                                    >
                                        {m}
                                    </a>
                                ))}
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}


interface LoginDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onLoginSuccess: () => void;
}

type LoginMode = 'login' | 'daftar';

function LoginDialog({ open, onOpenChange, onLoginSuccess }: LoginDialogProps) {
    const [mode, setMode] = useState<LoginMode>('login');
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleMasuk = (): void => {
        if (!username) return void alert('Username wajib diisi');
        if (!password) return void alert('Password wajib diisi');
        if (username === 'admin' && password === '123') {
            alert('Login berhasil');
            onLoginSuccess();
            onOpenChange(false);
        } else {
            alert('Username atau password salah');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
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
                                <button onClick={() => setMode('daftar')} className="font-medium hover:underline" style={{ color: 'var(--primary)' }}>
                                    Daftar
                                </button>
                            </>
                        ) : (
                            <>
                                Sudah punya akun?{' '}
                                <button onClick={() => setMode('login')} className="font-medium hover:underline" style={{ color: 'var(--primary)' }}>
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
    );
}


function HeroSection() {
    return (
        <section
            className="relative flex min-h-[520px] items-center justify-center overflow-hidden pt-16"
            style={{ backgroundColor: 'var(--primary)' }}
        >
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/5" />
                <div className="absolute bottom-0 -left-20 h-72 w-72 rounded-full bg-white/5" />
            </div>

            <div className="relative z-10 px-4 py-16 text-center">
                <Badge
                    className="mb-4 border"
                    style={{
                        backgroundColor: 'color-mix(in srgb, var(--primary-foreground) 15%, transparent)',
                        color: 'var(--primary-foreground)',
                        borderColor: 'color-mix(in srgb, var(--primary-foreground) 30%, transparent)',
                    }}
                >
                    🏫 Sekolah Unggulan
                </Badge>
                <h1
                    className="mx-auto mb-4 max-w-2xl text-3xl leading-tight font-bold sm:text-4xl md:text-5xl"
                    style={{ color: 'var(--primary-foreground)' }}
                >
                    Selamat Datang Di Sekolah Baidhaul Ahkam
                </h1>
                <p className="mb-8 text-lg" style={{ color: 'color-mix(in srgb, var(--primary-foreground) 75%, transparent)' }}>
                    Sekolah Unggulan Berbasis Teknologi
                </p>
                <Button size="lg" className="font-semibold shadow-lg" style={{ backgroundColor: 'var(--background)', color: 'var(--primary)' }}>
                    Lihat Profile Sekolah →
                </Button>
            </div>
        </section>
    );
}

function BeritaSection() {
    return (
        <section className="mx-auto max-w-7xl px-4 py-12" style={{ backgroundColor: 'var(--background)' }}>
            <SectionHeader title="Berita Terbaru" />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {berita.map((b) => (
                    <Card
                        key={b.id}
                        className="group cursor-pointer overflow-hidden transition-shadow duration-300 hover:shadow-lg"
                        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
                    >
                        <div className="aspect-video overflow-hidden" style={{ backgroundColor: 'var(--muted)' }}>
                            <img
                                src={b.img}
                                alt={b.judul}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                }}
                            />
                        </div>
                        <CardContent className="p-4">
                            <p className="mb-1 line-clamp-2 text-sm font-semibold" style={{ color: 'var(--card-foreground)' }}>
                                {b.judul}
                            </p>
                            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                                {b.tanggal}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}

function PengumumanSection() {
    return (
        <section className="py-12" style={{ backgroundColor: 'var(--secondary)' }}>
            <div className="mx-auto max-w-7xl px-4">
                <SectionHeader title="Pengumuman Sekolah" />
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {pengumuman.map((p) => (
                        <Card
                            key={p.id}
                            className="border-l-4"
                            style={{
                                borderLeftColor: 'var(--primary)',
                                borderColor: 'var(--border)',
                                backgroundColor: 'var(--card)',
                            }}
                        >
                            <CardContent className="p-5">
                                <Badge
                                    className="mb-2 border-0"
                                    style={{
                                        backgroundColor: 'color-mix(in srgb, var(--color-info) 15%, transparent)',
                                        color: 'var(--color-info)',
                                    }}
                                >
                                    Pengumuman
                                </Badge>
                                <p className="mb-1 font-bold" style={{ color: 'var(--card-foreground)' }}>
                                    {p.judul}
                                </p>
                                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                                    {p.isi}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}

function JurusanSection() {
    const [activeJurusan, setActiveJurusan] = useState<JurusanKey | null>(null);
    const jurusanKeys = Object.keys(dataJurusan) as JurusanKey[];

    return (
        <section className="mx-auto max-w-7xl px-4 py-12" style={{ backgroundColor: 'var(--background)' }}>
            <SectionHeader title="Sekilas Sekolah SMK Islam Baidhaul Ahkam" />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {jurusanKeys.map((key) => {
                    const j = dataJurusan[key];
                    return (
                        <Card
                            key={key}
                            onClick={() => setActiveJurusan(key)}
                            className="group cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
                        >
                            <div className="aspect-video overflow-hidden" style={{ backgroundColor: 'var(--muted)' }}>
                                <img
                                    src={j.img}
                                    alt={j.judul}
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                    }}
                                />
                            </div>
                            <CardContent className="p-4 text-center">
                                <JurusanBadge varColor={j.varColor} label={key.toUpperCase()} />
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
                            src={dataJurusan[activeJurusan].img}
                            alt={dataJurusan[activeJurusan].judul}
                            className="mb-2 h-48 w-full rounded-lg object-cover"
                            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                            }}
                        />
                        <DialogHeader>
                            <DialogTitle>{dataJurusan[activeJurusan].judul}</DialogTitle>
                            <DialogDescription>{dataJurusan[activeJurusan].deskripsi}</DialogDescription>
                        </DialogHeader>
                        <Button asChild className="mt-2" style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}>
                            <a href={dataJurusan[activeJurusan].link}>Lihat Detail Jurusan →</a>
                        </Button>
                    </DialogContent>
                )}
            </Dialog>
        </section>
    );
}

function GaleriSection() {
    return (
        <section className="py-12" style={{ backgroundColor: 'var(--secondary)' }}>
            <div className="mx-auto max-w-7xl px-4">
                <SectionHeader title="Galeri Sekolah" />
                <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {galeri.map((g) => (
                        <div key={g.id} className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl">
                            <img
                                src={g.img}
                                alt={g.nama}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                }}
                            />
                            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                <span className="text-sm font-medium text-white">{g.nama}</span>
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
    );
}

function Footer() {
    return (
        <footer style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}>
            <div className="mx-auto max-w-7xl px-4 py-10">
                <div className="flex flex-col justify-between gap-8 sm:flex-row">
                    <div className="space-y-3">
                        <p className="mb-4 text-lg font-bold">SMK Islam Baidhaul Ahkam</p>
                        <div className="flex items-center gap-2 text-sm">
                            <span>📍</span>
                            <span>Jl. Bla bla bla</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <span>✉️</span>
                            <span>Info@sekolah.sch.id</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <span>📱</span>
                            <span>08121212112</span>
                        </div>
                    </div>

                    <div>
                        <p className="mb-4 font-semibold">Media Sosial</p>
                        <div className="flex gap-3">
                            {sosmed.map((s) => (
                                <button
                                    key={s.label}
                                    aria-label={s.label}
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xs font-bold transition-colors hover:bg-white/20"
                                    style={{ color: 'var(--primary-foreground)' }}
                                >
                                    {s.icon}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <Separator className="my-6" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-foreground) 25%, transparent)' }} />
                <p className="text-center text-sm" style={{ color: 'color-mix(in srgb, var(--primary-foreground) 65%, transparent)' }}>
                    © Copyright 2025 SMK Baidhaul Ahkam
                </p>
            </div>
        </footer>
    );
}


export default function SMKBaidhaulAhkam() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [showLogin, setShowLogin] = useState<boolean>(false);

    return (
        <div className="min-h-screen font-sans" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
            <Navbar isLoggedIn={isLoggedIn} onLoginClick={() => setShowLogin(true)} onLogout={() => setIsLoggedIn(false)} />

            <LoginDialog open={showLogin} onOpenChange={setShowLogin} onLoginSuccess={() => setIsLoggedIn(true)} />

            <main>
                <HeroSection />
                <BeritaSection />
                <PengumumanSection />
                <JurusanSection />
                <GaleriSection />
            </main>

            <Footer />
        </div>
    );
}
