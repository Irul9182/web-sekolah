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
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { FaFacebook, FaInstagram, FaYoutube, FaXTwitter } from 'react-icons/fa6';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { formatDate } from '@/helpers/format';
import { cn } from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

type ThemeColor = 'info' | 'gold' | 'success' | 'warning' | 'error' | 'default';

// ==== Tipe data sesuai kolom asli di database ====
interface BeritaItem {
    id: number;
    judul: string;
    slug: string;
    tanggal: string;
    berita_image?: { image_url: string } | null;
}

interface PengumumanItem {
    id: number;
    judul: string;
    deskripsi: string;
    created_at: string;
}

interface GaleriImage {
    id: number;
    image_url: string;
}

interface GaleriItem {
    id: number;
    judul: string;
    slug: string;
    images: GaleriImage[];
}

interface PageProps {
    beritas: BeritaItem[];
    pengumumans: PengumumanItem[];
    galeris: GaleriItem[];
}

interface JurusanData {
    judul: string;
    img: string;
    deskripsi: string;
    link: string;
    varColor: ThemeColor;
}

type JurusanKey = 'tkj' | 'dkv' | 'akuntansi' | 'perkantoran';

// Jurusan masih statis (bukan dari database) karena kontennya jarang berubah.
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

const sosmed: Array<{ label: string; icon: React.ElementType; href: string }> = [
    { label: 'Facebook', icon: FaFacebook, href: 'https://www.facebook.com/profile.php?id=100052537687507' },
    { label: 'Instagram', icon: FaInstagram, href: 'https://www.instagram.com/khoirulmauludi/' },
    { label: 'YouTube', icon: FaYoutube, href: 'https://youtube.com' },
    { label: 'X', icon: FaXTwitter, href: 'https://x.com/' },
];

// Menu dropdown "Profile" -> arahkan href sesuai routing profil sekolah kamu
const profileMenu: Array<{ label: string; href: string }> = [
    { label: 'Visi & Misi', href: '/profile/visi-misi' },
    { label: 'Sejarah', href: '/profile/sejarah' },
    { label: 'Struktur Organisasi', href: '/profile/struktur-organisasi' },
];

// Menu dropdown "Jurusan" -> arahkan href sesuai routing jurusan kamu
const jurusanMenu: Array<{ label: string; href: string }> = [
    { label: 'TKJ', href: '/tkj' },
    { label: 'AP', href: '/ap' },
    { label: 'AK', href: '/ak' },
    { label: 'MAVIB', href: '/mavib' },
];

// Menu dropdown "Kontak" -> link sosial media/kontak sekolah (dibuka di tab baru)
const kontakMenu: Array<{ label: string; href: string }> = [
    { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=100052537687507' },
    { label: 'Instagram', href: 'https://www.instagram.com/khoirulmauludi/' },
    { label: 'WhatsApp', href: 'https://wa.me/6285778601851' },
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
                            <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), 'bg-transparent! hover:bg-accent!')}>
                                <Link href="/">Beranda</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        {/* Profile: Visi, Misi, Sejarah, Struktur Organisasi */}
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className="bg-transparent! text-sm font-medium hover:bg-accent!">Profile</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-52 gap-1 p-2">
                                    {profileMenu.map((p) => (
                                        <li key={p.label}>
                                            <NavigationMenuLink
                                                asChild
                                                className="block rounded-md px-3 py-2 text-sm transition-colors"
                                                style={{ color: 'var(--foreground)' }}
                                                onMouseEnter={handleDropdownMouseEnter}
                                                onMouseLeave={handleDropdownMouseLeave}
                                            >
                                                <Link href={p.href}>{p.label}</Link>
                                            </NavigationMenuLink>
                                        </li>
                                    ))}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>

                        {/* Jurusan: TKJ, AP, AK, MAVIB */}
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className="bg-transparent! text-sm font-medium hover:bg-accent!">Jurusan</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-40 gap-1 p-2">
                                    {jurusanMenu.map((j) => (
                                        <li key={j.label}>
                                            <NavigationMenuLink
                                                asChild
                                                className="block rounded-md px-3 py-2 text-sm transition-colors"
                                                style={{ color: 'var(--foreground)' }}
                                                onMouseEnter={handleDropdownMouseEnter}
                                                onMouseLeave={handleDropdownMouseLeave}
                                            >
                                                <Link href={j.href}>{j.label}</Link>
                                            </NavigationMenuLink>
                                        </li>
                                    ))}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), 'bg-transparent! hover:bg-accent!')}>
                                <Link href="/berita">Berita</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), 'bg-transparent! hover:bg-accent!')}>
                                <Link href="/pengumuman">Pengumuman</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), 'bg-transparent! hover:bg-accent!')}>
                                <Link href="/galeri">Galeri</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuTrigger className="bg-transparent! text-sm font-medium hover:bg-accent!">Kontak</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-40 gap-1 p-2">
                                    {kontakMenu.map((k) => (
                                        <li key={k.label}>
                                            <NavigationMenuLink
                                                href={k.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block rounded-md px-3 py-2 text-sm transition-colors"
                                                style={{ color: 'var(--foreground)' }}
                                                onMouseEnter={handleDropdownMouseEnter}
                                                onMouseLeave={handleDropdownMouseLeave}
                                            >
                                                {k.label}
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
                        <Link
                            href="/login"
                            className="rounded-xl px-4 py-2 text-xs font-semibold text-white"
                            style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
                        >
                            Login Admin
                        </Link>
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
                                <Link
                                    href="/"
                                    className="rounded-lg px-4 py-3 text-sm font-medium transition-colors"
                                    style={{ color: 'var(--foreground)' }}
                                    onMouseEnter={handleDropdownMouseEnter}
                                    onMouseLeave={handleDropdownMouseLeave}
                                >
                                    Beranda
                                </Link>

                                <p className="mt-2 px-4 text-xs font-semibold tracking-wide uppercase" style={{ color: 'var(--muted-foreground)' }}>
                                    Profile
                                </p>
                                {profileMenu.map((p) => (
                                    <Link
                                        key={p.label}
                                        href={p.href}
                                        className="rounded-lg px-6 py-2 text-sm transition-colors"
                                        style={{ color: 'var(--foreground)' }}
                                        onMouseEnter={handleDropdownMouseEnter}
                                        onMouseLeave={handleDropdownMouseLeave}
                                    >
                                        {p.label}
                                    </Link>
                                ))}

                                <p className="mt-2 px-4 text-xs font-semibold tracking-wide uppercase" style={{ color: 'var(--muted-foreground)' }}>
                                    Jurusan
                                </p>
                                {jurusanMenu.map((j) => (
                                    <Link
                                        key={j.label}
                                        href={j.href}
                                        className="rounded-lg px-6 py-2 text-sm transition-colors"
                                        style={{ color: 'var(--foreground)' }}
                                        onMouseEnter={handleDropdownMouseEnter}
                                        onMouseLeave={handleDropdownMouseLeave}
                                    >
                                        {j.label}
                                    </Link>
                                ))}

                                <Link
                                    href="/berita"
                                    className="mt-2 rounded-lg px-4 py-3 text-sm font-medium transition-colors"
                                    style={{ color: 'var(--foreground)' }}
                                    onMouseEnter={handleDropdownMouseEnter}
                                    onMouseLeave={handleDropdownMouseLeave}
                                >
                                    Berita
                                </Link>
                                <Link
                                    href="/pengumuman"
                                    className="rounded-lg px-4 py-3 text-sm font-medium transition-colors"
                                    style={{ color: 'var(--foreground)' }}
                                    onMouseEnter={handleDropdownMouseEnter}
                                    onMouseLeave={handleDropdownMouseLeave}
                                >
                                    Pengumuman
                                </Link>
                                <Link
                                    href="/galeri"
                                    className="rounded-lg px-4 py-3 text-sm font-medium transition-colors"
                                    style={{ color: 'var(--foreground)' }}
                                    onMouseEnter={handleDropdownMouseEnter}
                                    onMouseLeave={handleDropdownMouseLeave}
                                >
                                    Galeri
                                </Link>

                                <p className="mt-2 px-4 text-xs font-semibold tracking-wide uppercase" style={{ color: 'var(--muted-foreground)' }}>
                                    Kontak
                                </p>
                                {kontakMenu.map((k) => (
                                    <a
                                        key={k.label}
                                        href={k.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="rounded-lg px-6 py-2 text-sm transition-colors"
                                        style={{ color: 'var(--foreground)' }}
                                        onMouseEnter={handleDropdownMouseEnter}
                                        onMouseLeave={handleDropdownMouseLeave}
                                    >
                                        {k.label}
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

// ==== Section yang sudah tersambung ke database ====

function BeritaSection({ data }: { data: BeritaItem[] }) {
    return (
        <section className="mx-auto max-w-7xl px-4 py-12" style={{ backgroundColor: 'var(--background)' }}>
            <SectionHeader title="Berita Terbaru" />
            {data.length === 0 ? (
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                    Belum ada berita.
                </p>
            ) : (
                <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {data.map((b) => (
                        <Link key={b.id} href={route('public.berita.show', b.slug)}>
                            <Card
                                className="group cursor-pointer overflow-hidden transition-shadow duration-300 hover:shadow-lg"
                                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
                            >
                                <div className="aspect-video overflow-hidden" style={{ backgroundColor: 'var(--muted)' }}>
                                    <img
                                        src={b.berita_image?.image_url || '/images/default-img.png'}
                                        alt={b.judul}
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                                <CardContent className="p-4">
                                    <p className="mb-1 line-clamp-2 text-sm font-semibold" style={{ color: 'var(--card-foreground)' }}>
                                        {b.judul}
                                    </p>
                                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                                        {formatDate(b.tanggal)}
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
            <div className="text-center">
                <Link
                    href="/berita"
                    className="inline-block rounded-md border px-4 py-2 text-sm font-medium"
                    style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
                >
                    Lihat Semua Berita →
                </Link>
            </div>
        </section>
    );
}

function PengumumanSection({ data }: { data: PengumumanItem[] }) {
    return (
        <section className="py-12" style={{ backgroundColor: 'var(--secondary)' }}>
            <div className="mx-auto max-w-7xl px-4">
                <SectionHeader title="Pengumuman Sekolah" />
                {data.length === 0 ? (
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                        Belum ada pengumuman.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        {data.map((p) => (
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
                                        {p.deskripsi}
                                    </p>
                                    <p className="mt-2 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                                        {formatDate(p.created_at)}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
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
                        />
                        <DialogHeader>
                            <DialogTitle>{dataJurusan[activeJurusan].judul}</DialogTitle>
                            <DialogDescription>{dataJurusan[activeJurusan].deskripsi}</DialogDescription>
                        </DialogHeader>
                        <Button asChild className="mt-2" style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}>
                            <Link href={dataJurusan[activeJurusan].link}>Lihat Detail Jurusan →</Link>
                        </Button>
                    </DialogContent>
                )}
            </Dialog>
        </section>
    );
}

function GaleriSection({ data }: { data: GaleriItem[] }) {
    return (
        <section className="py-12" style={{ backgroundColor: 'var(--secondary)' }}>
            <div className="mx-auto max-w-7xl px-4">
                <SectionHeader title="Galeri Sekolah" />
                {data.length === 0 ? (
                    <p className="mb-8 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                        Belum ada foto galeri.
                    </p>
                ) : (
                    <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                        {data.map((g) => (
                            <Link
                                key={g.id}
                                href={route('public.galeri.show', g.slug)}
                                className="group relative aspect-square block overflow-hidden rounded-xl"
                            >
                                <img
                                    src={g.images?.[0]?.image_url || '/images/default-img.png'}
                                    alt={g.judul}
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                    <span className="text-sm font-medium text-white">{g.judul}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
                <div className="text-center">
                    <Link
                        href="/galeri"
                        className="inline-block rounded-md border px-4 py-2 text-sm font-medium"
                        style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
                    >
                        Lihat Semua Foto →
                    </Link>
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
                            <span>✉️</span>
                            <span>Info@sekolah.sch.id</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <span>📱</span>
                            <span>08121212112</span>
                        </div>
                        <div
                            className="mt-3 overflow-hidden rounded-lg"
                            style={{ border: '1px solid color-mix(in srgb, var(--primary-foreground) 25%, transparent)' }}
                        >
                            <iframe
                                src="https://maps.google.com/maps?q=SMK+Islam+Baidhaul+Ahkam&output=embed"
                                width="100%"
                                height="180"
                                style={{ border: 0 }}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Lokasi SMK Islam Baidhaul Ahkam"
                            />
                        </div>
                    </div>

                    <div>
                        <p className="mb-4 font-semibold">Media Sosial</p>
                        <div className="flex gap-3">
                            {sosmed.map((s) => (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={s.label}
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                                    style={{ color: 'var(--primary-foreground)' }}
                                >
                                    <s.icon size={18} />
                                </a>
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
    const { beritas, pengumumans, galeris } = usePage<PageProps>().props;
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [showLogin, setShowLogin] = useState<boolean>(false);

    return (
        <div className="min-h-screen font-sans" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
            <Navbar isLoggedIn={isLoggedIn} onLoginClick={() => setShowLogin(true)} onLogout={() => setIsLoggedIn(false)} />

            <LoginDialog open={showLogin} onOpenChange={setShowLogin} onLoginSuccess={() => setIsLoggedIn(true)} />

            <main>
                <HeroSection />
                <BeritaSection data={beritas ?? []} />
                <PengumumanSection data={pengumumans ?? []} />
                <JurusanSection />
                <GaleriSection data={galeris ?? []} />
            </main>

            <Footer />
        </div>
    );
}