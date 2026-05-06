<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Validation\Rules\Password;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate(
            [
                'name'     => ['required', 'string', 'max:255'],
                'email'    => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:' . User::class],
                'password' => [
                    'required',
                    'confirmed',
                    Password::min(6)->mixedCase()->numbers()->symbols(),
                ],
            ],
            [
                'name.required'       => 'Nama wajib diisi.',
                'name.max'            => 'Nama maksimal 255 karakter.',
                'email.required'      => 'Email wajib diisi.',
                'email.email'         => 'Format email tidak valid.',
                'email.lowercase'     => 'Email harus huruf kecil semua.',
                'email.unique'        => 'Email sudah terdaftar.',
                'password.required'   => 'Password wajib diisi.',
                'password.confirmed'  => 'Konfirmasi password tidak cocok.',
                'password.min'        => 'Password minimal 6 karakter.',
                'password.mixed_case' => 'Password harus mengandung huruf kapital dan kecil.',
                'password.numbers'    => 'Password harus mengandung angka.',
                'password.symbols'    => 'Password harus mengandung karakter unik (!@#$...).',
            ]
        );

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        Auth::login($user);

        return to_route('dashboard');
    }
}
