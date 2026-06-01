import { Button } from '@/components/ui-shadcn/button';
import { Input } from '@/components/ui-shadcn/input';
import { Label } from '@/components/ui-shadcn/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface LoginForm {
    email: string;
    password: string;
}

interface LoginAdminProps {
    errors?: Partial<Record<keyof LoginForm, string>>;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LoginAdmin({ errors: serverErrors }: LoginAdminProps) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/login');
    };

    // Gabungkan error dari Inertia + server-side Laravel
    const emailError = errors.email ?? serverErrors?.email;
    const passwordError = errors.password ?? serverErrors?.password;

    return (
        <div className="flex min-h-screen items-center justify-center px-4" style={{ backgroundColor: 'var(--secondary)' }}>
            <div
                className="w-full max-w-md rounded-2xl p-10 shadow-lg"
                style={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                }}
            >
                <div className="mb-8 text-center">
                    <h1 className="mb-1 text-2xl font-bold" style={{ color: 'var(--primary)' }}>
                        Login Admin
                    </h1>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                        SMK Islam Baidhaul Ahkam
                    </p>
                </div>

                {emailError && (
                    <Alert
                        className="mb-6"
                        style={{
                            backgroundColor: 'color-mix(in srgb, var(--color-error) 10%, transparent)',
                            borderColor: 'color-mix(in srgb, var(--color-error) 40%, transparent)',
                        }}
                    >
                        <AlertDescription style={{ color: 'var(--color-error)' }}>{emailError}</AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="email" style={{ color: 'var(--foreground)' }}>
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="admin@sekolah.sch.id"
                            autoComplete="email"
                            required
                            style={{
                                borderColor: emailError ? 'var(--color-error)' : 'var(--border)',
                            }}
                        />
                        {emailError && (
                            <p className="text-xs" style={{ color: 'var(--color-error)' }}>
                                {emailError}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" style={{ color: 'var(--foreground)' }}>
                            Password
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            required
                            style={{
                                borderColor: passwordError ? 'var(--color-error)' : 'var(--border)',
                            }}
                        />
                        {passwordError && (
                            <p className="text-xs" style={{ color: 'var(--color-error)' }}>
                                {passwordError}
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="mt-2 w-full"
                        disabled={processing}
                        style={{
                            backgroundColor: 'var(--primary)',
                            color: 'var(--primary-foreground)',
                            opacity: processing ? 0.7 : 1,
                        }}
                    >
                        {processing ? 'Memproses...' : 'Masuk'}
                    </Button>
                </form>
            </div>
        </div>
    );
}
