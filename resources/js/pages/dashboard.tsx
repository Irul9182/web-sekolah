import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ImageIcon, Network } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

interface Stat {
    label: string;
    value: number;
    description?: string | null;
    format?: 'currency' | 'number';
}

interface RecentBerita {
    id: number;
    judul: string;
    slug: string;
    tanggal: string;
    berita_image?: { image_url: string } | null;
}


interface RecentGaleriImage {
    id: number;
    image_url: string;
}

interface RecentGaleri {
    id: number;
    judul: string;
    slug: string;
    images: RecentGaleriImage[];
}

// Ringkasan struktur organisasi -- cuma butuh 2 posisi teratas untuk preview, bukan semua 11.
interface StrukturOrganisasiSummary {
    ketua_yayasan: string;
    kepala_sekolah: string;
    updated_at: string | null;
}

interface DashboardPageProps {
    stats: Stat[];
    recentBerita: RecentBerita[];
    recentGaleri: RecentGaleri[];
    strukturOrganisasi: StrukturOrganisasiSummary;
    [key: string]: unknown;
}

function formatValue(stat: Stat) {
    if (stat.format === 'currency') {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(stat.value);
    }
    return new Intl.NumberFormat('id-ID').format(stat.value);
}

function formatDate(dateString: string) {
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(dateString));
}

// Thumbnail kecil dipakai berulang di 2 daftar (Berita & Galeri) --
// dipisah jadi komponen kecil biar tidak duplikat markup yang sama.
function Thumbnail({ src, alt }: { src?: string | null; alt: string }) {
    return (
        <div className="bg-muted h-10 w-10 shrink-0 overflow-hidden rounded-md">
            {src ? (
                <img src={src} alt={alt} className="h-full w-full object-cover" />
            ) : (
                <div className="text-muted-foreground flex h-full w-full items-center justify-center">
                    <ImageIcon className="h-4 w-4" />
                </div>
            )}
        </div>
    );
}

function EmptyState({ text }: { text: string }) {
    return <p className="text-muted-foreground text-sm">{text}</p>;
}

export default function Dashboard() {
    const { stats, recentBerita,  recentGaleri, strukturOrganisasi } = usePage<DashboardPageProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="w-full space-y-6 p-4">
                {/* Kartu ringkasan */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    {stats?.map((stat) => (
                        <Card key={stat.label}>
                            <CardHeader className="pb-2">
                                <CardDescription>{stat.label}</CardDescription>
                                <CardTitle className="text-2xl font-semibold tabular-nums">{formatValue(stat)}</CardTitle>
                            </CardHeader>
                            {stat.description && <CardContent className="text-muted-foreground text-xs">{stat.description}</CardContent>}
                        </Card>
                    ))}

                    {/* Struktur Organisasi -- bukan angka, jadi bukan bagian dari `stats` generic,
                        tapi tetap ditaruh di baris yang sama biar baris atas simetris 4-kolom. */}
                    <Card className="border-primary border-2">
                        <CardHeader className="pb-2">
                            <CardDescription className="flex items-center gap-1.5">
                                <Network className="h-3.5 w-3.5" />
                                Struktur Organisasi
                            </CardDescription>
                            <CardTitle className="text-sm font-medium">
                                {strukturOrganisasi?.updated_at ? `Diperbarui ${formatDate(strukturOrganisasi.updated_at)}` : 'Belum ada perubahan'}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                {/* Konten terbaru */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                    {/* Berita terbaru */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                            <CardTitle className="text-base truncate">Berita Terbaru</CardTitle>
                            <Link href={route('berita.index')} className="text-primary shrink-0 text-xs font-medium whitespace-nowrap hover:underline">
                                Lihat semua
                            </Link>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {recentBerita?.length ? (
                                recentBerita.map((b) => (
                                    <div key={b.id} className="flex items-center gap-3">
                                        <Thumbnail src={b.berita_image?.image_url} alt={b.judul} />
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium">{b.judul}</p>
                                            <p className="text-muted-foreground text-xs">{formatDate(b.tanggal)}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <EmptyState text="Belum ada berita." />
                            )}
                        </CardContent>
                    </Card>

                    {/* Galeri terbaru */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                            <CardTitle className="text-base truncate">Galeri Terbaru</CardTitle>
                            <Link href={route('galeri.index')} className="text-primary shrink-0 text-xs font-medium whitespace-nowrap hover:underline">
                                Lihat semua
                            </Link>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {recentGaleri?.length ? (
                                recentGaleri.map((g) => (
                                    <div key={g.id} className="flex items-center gap-3">
                                        <Thumbnail src={g.images?.[0]?.image_url} alt={g.judul} />
                                        <p className="min-w-0 truncate text-sm font-medium">{g.judul}</p>
                                    </div>
                                ))
                            ) : (
                                <EmptyState text="Belum ada galeri." />
                            )}
                        </CardContent>
                    </Card>

                    {/* Struktur Organisasi -- bukan daftar, cuma shortcut + preview 2 posisi teratas */}
                    <Card className="border-primary border-2">
                        <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                            <CardTitle className="text-base flex items-center gap-2 truncate">
                                <Network className="text-primary h-4 w-4" />
                                Struktur Organisasi
                            </CardTitle>
                            <Link href={route('struktur-organisasi.index')} className="text-primary shrink-0 text-xs font-medium whitespace-nowrap hover:underline">
                                Kelola
                            </Link>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p className="text-sm">
                                <span className="text-muted-foreground">Ketua Yayasan: </span>
                                {strukturOrganisasi?.ketua_yayasan ?? '-'}
                            </p>
                            <p className="text-sm">
                                <span className="text-muted-foreground">Kepala Sekolah: </span>
                                {strukturOrganisasi?.kepala_sekolah ?? '-'}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}