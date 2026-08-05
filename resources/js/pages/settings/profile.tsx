import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;

    // ==== Form data akun (nama & email) ====
    const {
        data: profileData,
        setData: setProfileData,
        patch,
        errors: profileErrors,
        processing: profileProcessing,
    } = useForm({
        name: auth.user.name,
        email: auth.user.email,
    });

    const submitProfile: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Berhasil memperbarui data akun.');
            },
            onError: () => {
                toast.error('Gagal memperbarui data akun, periksa kembali data yang dimasukkan.');
            },
        });
    };

    // ==== Form ubah password ====
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const {
        data: passwordData,
        setData: setPasswordData,
        errors: passwordErrors,
        put,
        reset: resetPassword,
        processing: passwordProcessing,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => {
                resetPassword();
                toast.success('Berhasil mengubah kata sandi.');
            },
            onError: (errors) => {
                if (errors.password) {
                    resetPassword('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    resetPassword('current_password');
                    currentPasswordInput.current?.focus();
                }

                toast.error('Gagal mengubah kata sandi, periksa kembali data yang dimasukkan.');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-10">
                    {/* ==== Data akun ==== */}
                    <div className="space-y-6">
                        <HeadingSmall title="Profile information" description="Update your name and email address" />

                        <form onSubmit={submitProfile} className="space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>

                                <Input
                                    id="name"
                                    className="mt-1 block w-full"
                                    value={profileData.name}
                                    onChange={(e) => setProfileData('name', e.target.value)}
                                    required
                                    autoComplete="name"
                                    placeholder="Full name"
                                />

                                <InputError className="mt-2" message={profileErrors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>

                                <Input
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full"
                                    value={profileData.email}
                                    onChange={(e) => setProfileData('email', e.target.value)}
                                    required
                                    autoComplete="username"
                                    placeholder="Email address"
                                />

                                <InputError className="mt-2" message={profileErrors.email} />
                            </div>

                            {mustVerifyEmail && auth.user.email_verified_at === null && (
                                <div>
                                    <p className="mt-2 text-sm text-neutral-800">
                                        Your email address is unverified.
                                        <Link
                                            href={route('verification.send')}
                                            method="post"
                                            as="button"
                                            className="rounded-md text-sm text-neutral-600 underline hover:text-neutral-900 focus:ring-2 focus:ring-offset-2 focus:outline-hidden"
                                        >
                                            Click here to re-send the verification email.
                                        </Link>
                                    </p>

                                    {status === 'verification-link-sent' && (
                                        <div className="mt-2 text-sm font-medium text-green-600">
                                            A new verification link has been sent to your email address.
                                        </div>
                                    )}
                                </div>
                            )}

                            <Button disabled={profileProcessing}>Save</Button>
                        </form>
                    </div>

                    {/* ==== Ubah password ==== */}
                    <div className="space-y-6">
                        <HeadingSmall title="Update password" description="Ensure your account is using a long, random password to stay secure" />

                        <form onSubmit={updatePassword} className="space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="current_password">Current password</Label>

                                <Input
                                    id="current_password"
                                    ref={currentPasswordInput}
                                    value={passwordData.current_password}
                                    onChange={(e) => setPasswordData('current_password', e.target.value)}
                                    type="password"
                                    className="mt-1 block w-full"
                                    autoComplete="current-password"
                                    placeholder="Current password"
                                />

                                <InputError message={passwordErrors.current_password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">New password</Label>

                                <Input
                                    id="password"
                                    ref={passwordInput}
                                    value={passwordData.password}
                                    onChange={(e) => setPasswordData('password', e.target.value)}
                                    type="password"
                                    className="mt-1 block w-full"
                                    autoComplete="new-password"
                                    placeholder="New password"
                                />

                                <InputError message={passwordErrors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">Confirm password</Label>

                                <Input
                                    id="password_confirmation"
                                    value={passwordData.password_confirmation}
                                    onChange={(e) => setPasswordData('password_confirmation', e.target.value)}
                                    type="password"
                                    className="mt-1 block w-full"
                                    autoComplete="new-password"
                                    placeholder="Confirm password"
                                />

                                <InputError message={passwordErrors.password_confirmation} />
                            </div>

                            <Button disabled={passwordProcessing}>Save password</Button>
                        </form>
                    </div>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}