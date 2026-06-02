<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Admin - SMK Islam Baidhaul Ahkam</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
            background: #f0f2f5;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }

        .login-box {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            width: 400px;
        }

        .login-box h2 {
            text-align: center;
            margin-bottom: 30px;
            color: #1f009c;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            margin-bottom: 6px;
            color: #555;
            font-size: 14px;
        }

        .form-group input {
            width: 100%;
            padding: 10px 14px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 14px;
            outline: none;
            transition: border 0.3s;
        }

        .form-group input:focus {
            border-color: #1f009c;
        }

        .error-msg {
            background: #ffe0e0;
            color: #c0392b;
            padding: 10px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 13px;
        }

        .btn-login {
            width: 100%;
            padding: 12px;
            background: #1f009c;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 15px;
            cursor: pointer;
            transition: background 0.3s;
        }

        .btn-login:hover {
            background: #3a00d4;
        }
    </style>
</head>

<body>

    <div class="login-box">
        <h2>Login Admin</h2>
        <h3 style="text-align:center; font-size:13px; color:#888; margin-bottom:25px;">
            SMK Islam Baidhaul Ahkam
        </h3>

        {{-- Tampilkan error jika login gagal --}}
        @if ($errors->any())
        <div class="error-msg">
            {{ $errors->first('email') }}
        </div>
        @endif

        <form method="POST" action="/admin/login">
            @csrf

            <div class="form-group">
                <label>Email</label>
                <input type="email" name="email" value="{{ old('email') }}" required>
            </div>

            <div class="form-group">
                <label>Password</label>
                <input type="password" name="password" required>
            </div>

            <button type="submit" class="btn-login">Masuk</button>
        </form>
    </div>

</body>

</html>