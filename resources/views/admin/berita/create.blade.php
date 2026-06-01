<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Tambah Berita - Admin</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background: #f0f2f5; }
        .sidebar { width: 250px; height: 100vh; background: #1f009c; position: fixed; top: 0; left: 0; padding: 20px 0; color: white; }
        .sidebar h2 { text-align: center; font-size: 14px; padding: 0 20px 20px; border-bottom: 1px solid rgba(255,255,255,0.2); }
        .sidebar ul { list-style: none; margin-top: 20px; }
        .sidebar ul li a { display: block; padding: 12px 24px; color: white; text-decoration: none; }
        .sidebar ul li a:hover { background: rgba(255,255,255,0.1); }
        .main { margin-left: 250px; padding: 30px; }
        .form-box { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); max-width: 700px; }
        .form-box h2 { margin-bottom: 24px; color: #333; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 6px; color: #555; font-size: 14px; }
        .form-group input, .form-group textarea {
            width: 100%; padding: 10px; border: 1px solid #ddd;
            border-radius: 8px; font-size: 14px; outline: none;
        }
        .form-group textarea { height: 200px; resize: vertical; }
        .btn { padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; text-decoration: none; }
        .btn-primary { background: #1f009c; color: white; }
        .btn-secondary { background: #aaa; color: white; }
        .error { color: red; font-size: 12px; margin-top: 4px; }
    </style>
</head>
<body>

<div class="sidebar">
    <h2>SMK Islam Baidhaul Ahkam</h2>
    <ul>
        <li><a href="/admin/dashboard">📊 Dashboard</a></li>
        <li><a href="/admin/berita">📰 Berita</a></li>
        <li><a href="/admin/galeri">🖼️ Galeri</a></li>
        <li><a href="/admin/pengumuman">📢 Pengumuman</a></li>
    </ul>
</div>

<div class="main">
    <div class="form-box">
        <h2>Tambah Berita</h2>

        <form method="POST" action="/admin/berita" enctype="multipart/form-data">
            @csrf

            <div class="form-group">
                <label>Judul Berita</label>
                <input type="text" name="judul" value="{{ old('judul') }}" placeholder="Masukkan judul berita">
                @error('judul') <span class="error">{{ $message }}</span> @enderror
            </div>

            <div class="form-group">
                <label>Isi Berita</label>
                <textarea name="isi" placeholder="Tulis isi berita di sini...">{{ old('isi') }}</textarea>
                @error('isi') <span class="error">{{ $message }}</span> @enderror
            </div>

            <div class="form-group">
                <label>Gambar (opsional)</label>
                <input type="file" name="gambar" accept="image/*">
                @error('gambar') <span class="error">{{ $message }}</span> @enderror
            </div>

            <div style="display:flex; gap:10px">
                <button type="submit" class="btn btn-primary">Simpan</button>
                <a href="/admin/berita" class="btn btn-secondary">Batal</a>
            </div>
        </form>
    </div>
</div>

</body>
</html>