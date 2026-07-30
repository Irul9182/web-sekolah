<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Tampilkan halaman tambah akun (di dalam panel admin, butuh login).
     * File React: resources/js/pages/akun-tambah.tsx
     */
    public function create(): Response
    {
        return Inertia::render('tambah-akun');
    }

    /**
     * Proses tambah akun admin baru.
     *
     * PENTING: tidak lagi memanggil Auth::login($user) di sini — kalau
     * admin yang sedang login (A) menambah akun untuk admin lain (B),
     * Auth::login() akan menukar sesi A menjadi sesi B, alias A malah
     * ke-logout dari akunnya sendiri. Admin yang bikin akun tetap login
     * sebagai dirinya sendiri, akun barunya cukup tersimpan di database.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()
            ->route('dashboard.index')
            ->with('success', 'Akun admin baru berhasil dibuat.');
    }
}