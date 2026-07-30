import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Tambah Akun', href: '/admin/akun/tambah' },
];

interface TambahAkunForm {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export default function TambahAkun() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm<TambahAkunForm>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/akun/tambah', {
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Akun" />
            <div className="mx-auto flex w-full justify-center p-4">
                <div className="w-full max-w-lg">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tambah Akun Admin</CardTitle>
                            <CardDescription>Buat akun baru untuk staf yang akan mengelola konten sekolah.</CardDescription>
                        </CardHeader>
                        <CardContent>
                        <form onSubmit={submit} className="space-y-5">
                            {/* Nama */}
                            <div className="space-y-2">
                                <Label htmlFor="name">Nama lengkap</Label>
                                <div className="relative">
                                    <User className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Nama sesuai identitas"
                                        autoComplete="name"
                                        style={{ paddingLeft: '2.25rem' }}
                                        required
                                    />
                                </div>
                                {errors.name && <p className="text-destructive text-xs">{errors.name}</p>}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Alamat email</Label>
                                <div className="relative">
                                    <Mail className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
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
                                {errors.email && <p className="text-destructive text-xs">{errors.email}</p>}
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password">Kata sandi</Label>
                                <div className="relative">
                                    <Lock className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Minimal 8 karakter"
                                        autoComplete="new-password"
                                        style={{ paddingLeft: '2.25rem', paddingRight: '2.25rem' }}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((v) => !v)}
                                        className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2"
                                        aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-destructive text-xs">{errors.password}</p>}
                            </div>

                            {/* Konfirmasi Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation">Konfirmasi kata sandi</Label>
                                <div className="relative">
                                    <Lock className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                    <Input
                                        id="password_confirmation"
                                        type={showConfirm ? 'text' : 'password'}
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder="Ulangi kata sandi"
                                        autoComplete="new-password"
                                        style={{ paddingLeft: '2.25rem', paddingRight: '2.25rem' }}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm((v) => !v)}
                                        className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2"
                                        aria-label={showConfirm ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                                    >
                                        {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {errors.password_confirmation && (
                                    <p className="text-destructive text-xs">{errors.password_confirmation}</p>
                                )}
                            </div>

                            <Button type="submit" disabled={processing} className="w-full font-semibold">
                                {processing ? 'Memproses…' : 'Tambah Akun'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
                </div>
            </div>
        </AppLayout>
    );
}