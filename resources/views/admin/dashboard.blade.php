<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Dashboard Admin - SMK Islam Baidhaul Ahkam</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background: #f0f2f5; }

        .sidebar {
            width: 250px;
            height: 100vh;
            background: #1f009c;
            position: fixed;
            top: 0; left: 0;
            padding: 20px 0;
            color: white;
        }

        .sidebar h2 {
            text-align: center;
            font-size: 14px;
            padding: 0 20px 20px;
            border-bottom: 1px solid rgba(255,255,255,0.2);
        }

        .sidebar ul {
            list-style: none;
            margin-top: 20px;
        }

        .sidebar ul li a {
            display: block;
            padding: 12px 24px;
            color: white;
            text-decoration: none;
            transition: background 0.3s;
        }

        .sidebar ul li a:hover {
            background: rgba(255,255,255,0.1);
        }

        .main {
            margin-left: 250px;
            padding: 30px;
        }

        .topbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
        }

        .topbar h1 { font-size: 22px; color: #333; }

        .btn-logout {
            background: #e74c3c;
            color: white;
            border: none;
            padding: 8px 18px;
            border-radius: 6px;
            cursor: pointer;
        }

        .cards {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
        }

        .card {
            background: white;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .card h3 { color: #888; font-size: 13px; margin-bottom: 8px; }
        .card p  { font-size: 28px; font-weight: bold; color: #1f009c; }
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
            <h1>Dashboard Admin</h1>
            <form method="POST" action="/admin/logout">
                @csrf
                <button type="submit" class="btn-logout">Logout</button>
            </form>
        </div>

        <div class="cards">
            <div class="card">
                <h3>Total Berita</h3>
                <p>0</p>
            </div>
            <div class="card">
                <h3>Total Galeri</h3>
                <p>0</p>
            </div>
            <div class="card">
                <h3>Total Pengumuman</h3>
                <p>0</p>
            </div>
        </div>
    </div>

</body>
</html>