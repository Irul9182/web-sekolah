import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

// Menu dropdown "Profile" -> arahkan href sesuai routing profil sekolah kamu
const profileMenu: Array<{ label: string; href: string }> = [
    { label: 'Visi', href: '/profile/visi' },
    { label: 'Misi', href: '/profile/misi' },
    { label: 'Sejarah', href: '/profile/sejarah' },
    { label: 'Struktur Organisasi', href: '/profile/struktur-organisasi' },
];

// Menu dropdown "Jurusan" -> TKJ, AP, AK, MAVIB
const jurusanMenu: Array<{ label: string; href: string }> = [
    { label: 'TKJ', href: '/tkj' },
    { label: 'AP', href: '/ap' },
    { label: 'AK', href: '/ak' },
    { label: 'MAVIB', href: '/mavib' },
];

const sosmed: Array<{ label: string; icon: string }> = [
    { label: 'Facebook', icon: 'f' },
    { label: 'Instagram', icon: 'in' },
    { label: 'YouTube', icon: 'yt' },
    { label: 'Twitter/X', icon: 'x' },
];

export interface SectionHeaderProps {
    title: string;
}

export function SectionHeader({ title }: SectionHeaderProps) {
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
                <Link href="/" className="flex flex-shrink-0 items-center gap-3">
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
                </Link>

                {/* Desktop Nav */}
                <NavigationMenu className="hidden lg:flex">
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuLink href="/" className={cn(navigationMenuTriggerStyle())}>
                                Beranda
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        {/* Profile: Visi, Misi, Sejarah, Struktur Organisasi */}
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className="text-sm font-medium">Profile</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-52 gap-1 p-2">
                                    {profileMenu.map((p) => (
                                        <li key={p.label}>
                                            <NavigationMenuLink
                                                href={p.href}
                                                className="block rounded-md px-3 py-2 text-sm transition-colors"
                                                style={{ color: 'var(--foreground)' }}
                                                onMouseEnter={handleDropdownMouseEnter}
                                                onMouseLeave={handleDropdownMouseLeave}
                                            >
                                                {p.label}
                                            </NavigationMenuLink>
                                        </li>
                                    ))}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>

                        {/* Jurusan: TKJ, AP, AK, MAVIB */}
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className="text-sm font-medium">Jurusan</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-40 gap-1 p-2">
                                    {jurusanMenu.map((j) => (
                                        <li key={j.label}>
                                            <NavigationMenuLink
                                                href={j.href}
                                                className="block rounded-md px-3 py-2 text-sm transition-colors"
                                                style={{ color: 'var(--foreground)' }}
                                                onMouseEnter={handleDropdownMouseEnter}
                                                onMouseLeave={handleDropdownMouseLeave}
                                            >
                                                {j.label}
                                            </NavigationMenuLink>
                                        </li>
                                    ))}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuLink href="/berita" className={cn(navigationMenuTriggerStyle())}>
                                Berita
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuLink href="/pengumuman" className={cn(navigationMenuTriggerStyle())}>
                                Pengumuman
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuLink href="/galeri" className={cn(navigationMenuTriggerStyle())}>
                                Galeri
                            </NavigationMenuLink>
                        </NavigationMenuItem>

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
                                <a
                                    href="/"
                                    className="rounded-lg px-4 py-3 text-sm font-medium transition-colors"
                                    style={{ color: 'var(--foreground)' }}
                                    onMouseEnter={handleDropdownMouseEnter}
                                    onMouseLeave={handleDropdownMouseLeave}
                                >
                                    Beranda
                                </a>

                                <p className="mt-2 px-4 text-xs font-semibold tracking-wide uppercase" style={{ color: 'var(--muted-foreground)' }}>
                                    Profile
                                </p>
                                {profileMenu.map((p) => (
                                    <a
                                        key={p.label}
                                        href={p.href}
                                        className="rounded-lg px-6 py-2 text-sm transition-colors"
                                        style={{ color: 'var(--foreground)' }}
                                        onMouseEnter={handleDropdownMouseEnter}
                                        onMouseLeave={handleDropdownMouseLeave}
                                    >
                                        {p.label}
                                    </a>
                                ))}

                                <p className="mt-2 px-4 text-xs font-semibold tracking-wide uppercase" style={{ color: 'var(--muted-foreground)' }}>
                                    Jurusan
                                </p>
                                {jurusanMenu.map((j) => (
                                    <a
                                        key={j.label}
                                        href={j.href}
                                        className="rounded-lg px-6 py-2 text-sm transition-colors"
                                        style={{ color: 'var(--foreground)' }}
                                        onMouseEnter={handleDropdownMouseEnter}
                                        onMouseLeave={handleDropdownMouseLeave}
                                    >
                                        {j.label}
                                    </a>
                                ))}

                                <a
                                    href="/berita"
                                    className="mt-2 rounded-lg px-4 py-3 text-sm font-medium transition-colors"
                                    style={{ color: 'var(--foreground)' }}
                                    onMouseEnter={handleDropdownMouseEnter}
                                    onMouseLeave={handleDropdownMouseLeave}
                                >
                                    Berita
                                </a>
                                <a
                                    href="/pengumuman"
                                    className="rounded-lg px-4 py-3 text-sm font-medium transition-colors"
                                    style={{ color: 'var(--foreground)' }}
                                    onMouseEnter={handleDropdownMouseEnter}
                                    onMouseLeave={handleDropdownMouseLeave}
                                >
                                    Pengumuman
                                </a>
                                <a
                                    href="/galeri"
                                    className="rounded-lg px-4 py-3 text-sm font-medium transition-colors"
                                    style={{ color: 'var(--foreground)' }}
                                    onMouseEnter={handleDropdownMouseEnter}
                                    onMouseLeave={handleDropdownMouseLeave}
                                >
                                    Galeri
                                </a>
                                <a
                                    href="#"
                                    className="rounded-lg px-4 py-3 text-sm font-medium transition-colors"
                                    style={{ color: 'var(--foreground)' }}
                                    onMouseEnter={handleDropdownMouseEnter}
                                    onMouseLeave={handleDropdownMouseLeave}
                                >
                                    Kontak
                                </a>
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

interface PublicLayoutProps {
    children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [showLogin, setShowLogin] = useState<boolean>(false);

    return (
        <div className="min-h-screen font-sans" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
            <Navbar isLoggedIn={isLoggedIn} onLoginClick={() => setShowLogin(true)} onLogout={() => setIsLoggedIn(false)} />

            <LoginDialog open={showLogin} onOpenChange={setShowLogin} onLoginSuccess={() => setIsLoggedIn(true)} />

            <main>{children}</main>

            <Footer />
        </div>
    );
}
