<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Kelola Berita - Admin</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background: #f0f2f5; }

        .sidebar {
            width: 250px; height: 100vh; background: #1f009c;
            position: fixed; top: 0; left: 0; padding: 20px 0; color: white;
        }
        .sidebar h2 { text-align: center; font-size: 14px; padding: 0 20px 20px; border-bottom: 1px solid rgba(255,255,255,0.2); }
        .sidebar ul { list-style: none; margin-top: 20px; }
        .sidebar ul li a { display: block; padding: 12px 24px; color: white; text-decoration: none; transition: background 0.3s; }
        .sidebar ul li a:hover { background: rgba(255,255,255,0.1); }

        .main { margin-left: 250px; padding: 30px; }
        .topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .topbar h1 { font-size: 22px; color: #333; }

        .btn { padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; text-decoration: none; font-size: 14px; }
        .btn-primary { background: #1f009c; color: white; }
        .btn-warning { background: #f39c12; color: white; }
        .btn-danger  { background: #e74c3c; color: white; }

        .alert { padding: 12px; border-radius: 8px; margin-bottom: 20px; background: #d4edda; color: #155724; }

        table { width: 100%; border-collapse: collapse; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        th { background: #1f009c; color: white; padding: 12px 16px; text-align: left; }
        td { padding: 12px 16px; border-bottom: 1px solid #eee; }
        tr:last-child td { border-bottom: none; }

        .gambar-thumb { width: 80px; height: 50px; object-fit: cover; border-radius: 4px; }
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
    <div class="topbar">
        <h1>Kelola Berita</h1>
        <a href="/admin/berita/create" class="btn btn-primary">+ Tambah Berita</a>
    </div>

    @if(session('success'))
        <div class="alert">{{ session('success') }}</div>
    @endif

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Gambar</th>
                <th>Judul</th>
                <th>Tanggal</th>
                <th>Aksi</th>
            </tr>
        </thead>
        <tbody>
            @forelse($beritas as $i => $berita)
            <tr>
                <td>{{ $i + 1 }}</td>
                <td>
                    @if($berita->gambar)
                        <img src="{{ asset('storage/'.$berita->gambar) }}" class="gambar-thumb">
                    @else
                        <span style="color:#aaa">Tidak ada</span>
                    @endif
                </td>
                <td>{{ $berita->judul }}</td>
                <td>{{ $berita->created_at->format('d M Y') }}</td>
                <td>
                    <a href="/admin/berita/{{ $berita->id }}/edit" class="btn btn-warning">Edit</a>
                    <form method="POST" action="/admin/berita/{{ $berita->id }}" style="display:inline">
                        @csrf
                        @method('DELETE')
                        <button class="btn btn-danger" onclick="return confirm('Hapus berita ini?')">Hapus</button>
                    </form>
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="5" style="text-align:center; color:#aaa; padding:30px">Belum ada berita</td>
            </tr>
            @endforelse
        </tbody>
    </table>
</div>

</body>
</html>     