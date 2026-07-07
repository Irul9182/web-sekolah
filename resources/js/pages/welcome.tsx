import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatDate } from '@/helpers/format';
import PublicLayout, { SectionHeader } from '@/layouts/public-layout';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

type ThemeColor = 'info' | 'gold' | 'success' | 'warning' | 'error' | 'default';

interface BeritaItem {
    id: number;
    judul: string;
    created_at: string;
    berita_image?: { image_url: string } | null;
}

interface PengumumanItem {
    id: number;
    judul: string;
    deskripsi: string;
    created_at: string;
}

interface GaleriItem {
    id: number;
    judul: string;
    gambar: string | null;
}

interface PageProps {
    beritas: BeritaItem[];
    pengumumans: PengumumanItem[];
    galeris: GaleriItem[];
}

interface JurusanData {
    judul: string;
    img: string;
    deskripsi: string;
    link: string;
    varColor: ThemeColor;
}

// Disamakan dengan navbar: TKJ, AP, AK, MAVIB
type JurusanKey = 'tkj' | 'ap' | 'ak' | 'mavib';

const dataJurusan: Record<JurusanKey, JurusanData> = {
    tkj: {
        judul: 'Teknik Komputer & Jaringan',
        img: '/images/tkj.jpg',
        deskripsi:
            '[Placeholder] Jurusan TKJ mempelajari instalasi jaringan komputer, troubleshooting hardware, dan administrasi sistem. Ganti teks ini dengan deskripsi resmi.',
        link: '/tkj',
        varColor: 'info',
    },
    ap: {
        judul: 'Administrasi Perkantoran',
        img: '/images/ap.jpg',
        deskripsi:
            '[Placeholder] Jurusan AP mempelajari administrasi bisnis, korespondensi, dan manajemen arsip perkantoran. Ganti teks ini dengan deskripsi resmi.',
        link: '/ap',
        varColor: 'gold',
    },
    ak: {
        judul: 'Akuntansi & Keuangan',
        img: '/images/ak.jpg',
        deskripsi: '[Placeholder] Jurusan AK mempelajari pembukuan, laporan keuangan, dan perpajakan. Ganti teks ini dengan deskripsi resmi.',
        link: '/ak',
        varColor: 'success',
    },
    mavib: {
        judul: 'Multimedia Audio Visual & Broadcasting',
        img: '/images/mavib.jpg',
        deskripsi:
            '[Placeholder] Jurusan MAVIB mempelajari produksi video, fotografi, dan siaran multimedia. Ganti teks ini dengan deskripsi resmi.',
        link: '/mavib',
        varColor: 'warning',
    },
};

interface JurusanBadgeProps {
    varColor: ThemeColor;
    label: string;
}

function JurusanBadge({ varColor, label }: JurusanBadgeProps) {
    return (
        <span
            style={{
                backgroundColor: `color-mix(in srgb, var(--color-${varColor}) 15%, transparent)`,
                color: `var(--color-${varColor})`,
            }}
            className="inline-block rounded-full px-3 py-1 text-xs font-semibold"
        >
            {label}
        </span>
    );
}

function HeroSection() {
    return (
        <section
            className="relative flex min-h-[520px] items-center justify-center overflow-hidden pt-16"
            style={{ backgroundColor: 'var(--primary)' }}
        >
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/5" />
                <div className="absolute bottom-0 -left-20 h-72 w-72 rounded-full bg-white/5" />
            </div>

            <div className="relative z-10 px-4 py-16 text-center">
                <Badge
                    className="mb-4 border"
                    style={{
                        backgroundColor: 'color-mix(in srgb, var(--primary-foreground) 15%, transparent)',
                        color: 'var(--primary-foreground)',
                        borderColor: 'color-mix(in srgb, var(--primary-foreground) 30%, transparent)',
                    }}
                >
                    🏫 Sekolah Unggulan
                </Badge>
                <h1
                    className="mx-auto mb-4 max-w-2xl text-3xl leading-tight font-bold sm:text-4xl md:text-5xl"
                    style={{ color: 'var(--primary-foreground)' }}
                >
                    Selamat Datang Di Sekolah Baidhaul Ahkam
                </h1>
                <p className="mb-8 text-lg" style={{ color: 'color-mix(in srgb, var(--primary-foreground) 75%, transparent)' }}>
                    Sekolah Unggulan Berbasis Teknologi
                </p>
                <Button size="lg" className="font-semibold shadow-lg" style={{ backgroundColor: 'var(--background)', color: 'var(--primary)' }}>
                    Lihat Profile Sekolah →
                </Button>
            </div>
        </section>
    );
}

function BeritaSection({ data }: { data: BeritaItem[] }) {
    return (
        <section className="mx-auto max-w-7xl px-4 py-12" style={{ backgroundColor: 'var(--background)' }}>
            <SectionHeader title="Berita Terbaru" />
            {data.length === 0 ? (
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                    Belum ada berita.
                </p>
            ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {data.map((b) => (
                        <Card
                            key={b.id}
                            className="group cursor-pointer overflow-hidden transition-shadow duration-300 hover:shadow-lg"
                            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
                        >
                            <div className="aspect-video overflow-hidden" style={{ backgroundColor: 'var(--muted)' }}>
                                <img
                                    src={b.berita_image?.image_url || '/images/default-img.png'}
                                    alt={b.judul}
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>
                            <CardContent className="p-4">
                                <p className="mb-1 line-clamp-2 text-sm font-semibold" style={{ color: 'var(--card-foreground)' }}>
                                    {b.judul}
                                </p>
                                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                                    {formatDate(b.created_at)}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                    <div className="text-center">
                    <Link
                        href="/berita"
                        className="inline-block rounded-md border px-4 py-2 text-sm font-medium"
                        style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
                    >
                        Lihat Semua Foto →
                    </Link>
                    </div>
                </div>
            )}
        </section>
    );
}

function PengumumanSection({ data }: { data: PengumumanItem[] }) {
    return (
        <section className="py-12" style={{ backgroundColor: 'var(--secondary)' }}>
            <div className="mx-auto max-w-7xl px-4">
                <SectionHeader title="Pengumuman Sekolah" />
                {data.length === 0 ? (
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                        Belum ada pengumuman.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        {data.map((p) => (
                            <Card
                                key={p.id}
                                className="border-l-4"
                                style={{
                                    borderLeftColor: 'var(--primary)',
                                    borderColor: 'var(--border)',
                                    backgroundColor: 'var(--card)',
                                }}
                            >
                                <CardContent className="p-5">
                                    <Badge
                                        className="mb-2 border-0"
                                        style={{
                                            backgroundColor: 'color-mix(in srgb, var(--color-info) 15%, transparent)',
                                            color: 'var(--color-info)',
                                        }}
                                    >
                                        Pengumuman
                                    </Badge>
                                    <p className="mb-1 font-bold" style={{ color: 'var(--card-foreground)' }}>
                                        {p.judul}
                                    </p>
                                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                                        {p.deskripsi}
                                    </p>
                                    <p className="mt-2 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                                        {formatDate(p.created_at)}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

function JurusanSection() {
    const [activeJurusan, setActiveJurusan] = useState<JurusanKey | null>(null);
    const jurusanKeys = Object.keys(dataJurusan) as JurusanKey[];

    return (
        <section className="mx-auto max-w-7xl px-4 py-12" style={{ backgroundColor: 'var(--background)' }}>
            <SectionHeader title="Jurusan di SMK Islam Baidhaul Ahkam" />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {jurusanKeys.map((key) => {
                    const j = dataJurusan[key];
                    return (
                        <Card
                            key={key}
                            onClick={() => setActiveJurusan(key)}
                            className="group cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
                        >
                            <div className="aspect-video overflow-hidden" style={{ backgroundColor: 'var(--muted)' }}>
                                <img
                                    src={j.img}
                                    alt={j.judul}
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                        e.currentTarget.src = '/images/default-img.png';
                                    }}
                                />
                            </div>
                            <CardContent className="p-4 text-center">
                                <JurusanBadge varColor={j.varColor} label={key.toUpperCase()} />
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <Dialog
                open={!!activeJurusan}
                onOpenChange={(o) => {
                    if (!o) setActiveJurusan(null);
                }}
            >
                {activeJurusan && (
                    <DialogContent className="sm:max-w-lg">
                        <img
                            src={dataJurusan[activeJurusan].img}
                            alt={dataJurusan[activeJurusan].judul}
                            className="mb-2 h-48 w-full rounded-lg object-cover"
                            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                e.currentTarget.src = '/images/default-img.png';
                            }}
                        />
                        <DialogHeader>
                            <DialogTitle>{dataJurusan[activeJurusan].judul}</DialogTitle>
                            <DialogDescription>{dataJurusan[activeJurusan].deskripsi}</DialogDescription>
                        </DialogHeader>
                        <Button asChild className="mt-2" style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}>
                            <Link href={dataJurusan[activeJurusan].link}>Lihat Detail Jurusan →</Link>
                        </Button>
                    </DialogContent>
                )}
            </Dialog>
        </section>
    );
}

function GaleriSection({ data }: { data: GaleriItem[] }) {
    return (
        <section className="py-12" style={{ backgroundColor: 'var(--secondary)' }}>
            <div className="mx-auto max-w-7xl px-4">
                <SectionHeader title="Galeri Sekolah" />
                {data.length === 0 ? (
                    <p className="mb-8 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                        Belum ada foto galeri.
                    </p>
                ) : (
                    <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                        {data.map((g) => (
                            <div key={g.id} className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl">
                                <img
                                    src={g.gambar ? `/storage/${g.gambar}` : '/images/default-img.png'}
                                    alt={g.judul}
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                    <span className="text-sm font-medium text-white">{g.judul}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div className="text-center">
                    <Link
                        href="/galeri"
                        className="inline-block rounded-md border px-4 py-2 text-sm font-medium"
                        style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
                    >
                        Lihat Semua Foto →
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default function SMKBaidhaulAhkam() {
    const { beritas, pengumumans, galeris } = usePage<PageProps>().props;

    return (
        <PublicLayout>
            <HeroSection />
            <BeritaSection data={beritas ?? []} />
            <PengumumanSection data={pengumumans ?? []} />
            <JurusanSection />
            <GaleriSection data={galeris ?? []} />
        </PublicLayout>
    );
}