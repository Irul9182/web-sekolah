import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

// ==========================================================================
// Pola geometris 8 sisi (rub el hizb) — motif khas arsitektur islami,
// dipakai berulang sebagai tekstur ambient di panel kiri. Ini elemen
// pembeda halaman ini: bukan ilustrasi dashboard generik, tapi identitas
// visual sekolah islam itu sendiri, digambar dengan garis tipis warna emas.
// ==========================================================================
function IslamicStarPattern({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 400 400" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
                <pattern id="star-8" width="100" height="100" patternUnits="userSpaceOnUse">
                    <g stroke="var(--color-gold, #C89B3C)" strokeWidth="0.75" opacity="0.35">
                        <path d="M50 5 L61 39 L95 39 L67 60 L78 95 L50 74 L22 95 L33 60 L5 39 L39 39 Z" />
                        <circle cx="50" cy="50" r="46" opacity="0.4" />
                    </g>
                </pattern>
            </defs>
            <rect width="400" height="400" fill="url(#star-8)" />
        </svg>
    );
}

interface LoginAdminForm {
    email: string;
    password: string;
    remember: boolean;
}

export default function LoginAdmin() {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm<LoginAdminForm>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <div className="flex min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
            <Head title="Login Admin" />

            {/* ================= Panel Kiri — Identitas ================= */}
            <div
                className="relative hidden w-full max-w-md flex-col justify-between overflow-hidden p-10 lg:flex xl:max-w-lg"
                style={{ backgroundColor: 'var(--primary)' }}
            >
                <IslamicStarPattern className="pointer-events-none absolute inset-0 h-full w-full" />
                <div
                    className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full blur-3xl"
                    style={{ backgroundColor: 'color-mix(in srgb, var(--color-gold, #C89B3C) 25%, transparent)' }}
                />

                {/* Logo & wordmark */}
                <Link href="/" className="relative z-10 flex items-center gap-3">
                    <img
                        src="/images/OIP.jpg"
                        alt="Logo SMK Islam Baidhaul Ahkam"
                        className="h-11 w-11 rounded-full object-cover"
                        style={{ border: '2px solid color-mix(in srgb, var(--color-gold, #C89B3C) 60%, transparent)' }}
                    />
                    <span className="text-sm leading-tight font-bold" style={{ color: 'var(--primary-foreground)' }}>
                        SMK Islam
                        <br />
                        Baidhaul Ahkam
                    </span>
                </Link>

                {/* Pesan utama */}
                <div className="relative z-10">
                    <p
                        className="mb-3 text-xs font-semibold tracking-[0.2em] uppercase"
                        style={{ color: 'var(--color-gold, #C89B3C)' }}
                    >
                        Panel Admin
                    </p>
                    <h1
                        className="mb-4 text-3xl leading-snug font-semibold"
                        style={{ color: 'var(--primary-foreground)', fontFamily: "'Fraunces', ui-serif, Georgia, serif" }}
                    >
                        Kelola informasi sekolah, satu pintu masuk yang terpercaya.
                    </h1>
                    <p className="max-w-xs text-sm leading-relaxed" style={{ color: 'color-mix(in srgb, var(--primary-foreground) 70%, transparent)' }}>
                        Berita, pengumuman, galeri, dan data jurusan — semua terhubung dari akun admin Anda.
                    </p>
                </div>

                <div
                    className="relative z-10 flex items-center gap-2 text-xs"
                    style={{ color: 'color-mix(in srgb, var(--primary-foreground) 55%, transparent)' }}
                >
                    <ShieldCheck className="h-4 w-4" />
                    Akses ini khusus untuk staf yang diberi wewenang
                </div>
            </div>

            {/* ================= Panel Kanan — Form Login ================= */}
            <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 sm:px-10">
                {/* Logo untuk mobile (panel kiri disembunyikan di layar kecil) */}
                <Link href="/" className="mb-8 flex items-center gap-3 lg:hidden">
                    <img
                        src="/images/OIP.jpg"
                        alt="Logo SMK Islam Baidhaul Ahkam"
                        className="h-10 w-10 rounded-full object-cover"
                        style={{ border: '1px solid var(--border)' }}
                    />
                    <span className="text-sm leading-tight font-bold" style={{ color: 'var(--color-success)' }}>
                        SMK Islam
                        <br />
                        Baidhaul Ahkam
                    </span>
                </Link>

                <div className="w-full max-w-sm">
                    <p className="mb-1 text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: 'var(--muted-foreground)' }}>
                        Masuk ke Akun
                    </p>
                    <h2
                        className="mb-1 text-2xl font-semibold"
                        style={{ color: 'var(--foreground)', fontFamily: "'Fraunces', ui-serif, Georgia, serif" }}
                    >
                        Selamat datang kembali
                    </h2>
                    <p className="mb-8 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                        Masukkan email dan kata sandi admin untuk melanjutkan.
                    </p>

                    <form onSubmit={submit} className="space-y-5">
                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Alamat email</Label>
                            <div className="relative">
                                <Mail
                                    className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
                                    style={{ color: 'var(--muted-foreground)' }}
                                />
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="admin@baidhaulahkam.sch.id"
                                    autoComplete="username"
                                    style={{ paddingLeft: '2.25rem' }}
                                    required
                                />
                            </div>
                            {errors.email && <p className="text-xs" style={{ color: 'var(--color-error)' }}>{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Kata sandi</Label>
                                <a href="#" className="text-xs font-medium hover:underline" style={{ color: 'var(--primary)' }}>
                                    Lupa kata sandi?
                                </a>
                            </div>
                            <div className="relative">
                                <Lock
                                    className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
                                    style={{ color: 'var(--muted-foreground)' }}
                                />
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    style={{ paddingLeft: '2.25rem', paddingRight: '2.25rem' }}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute top-1/2 right-3 -translate-y-1/2"
                                    style={{ color: 'var(--muted-foreground)' }}
                                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-xs" style={{ color: 'var(--color-error)' }}>{errors.password}</p>}
                        </div>

                        {/* Ingat saya */}
                        <label className="flex items-center gap-2 text-sm" style={{ color: 'var(--foreground)' }}>
                            <input
                                type="checkbox"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="h-4 w-4 rounded"
                                style={{ accentColor: 'var(--primary)' }}
                            />
                            Ingat saya di perangkat ini
                        </label>

                        <Button
                            type="submit"
                            disabled={processing}
                            className="w-full font-semibold"
                            style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
                        >
                            {processing ? 'Memproses…' : 'Masuk'}
                        </Button>
                    </form>

                    <Link
                        href="/"
                        className="mt-6 block text-center text-sm font-medium hover:underline"
                        style={{ color: 'var(--muted-foreground)' }}
                    >
                        ← Kembali ke beranda
                    </Link>
                </div>
            </div>
        </div>
    );
}