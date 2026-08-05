import { Card, CardContent } from '@/components/ui/card';
import PublicLayout from '@/layouts/public-layout';
import { Link, usePage } from '@inertiajs/react';
import { Trophy } from 'lucide-react';

interface EkstrakulikulerImage {
    id: number;
    image_url: string;
}

interface Prestasi {
    id: number;
    judul: string;
    tingkat: string | null;
    tahun: number;
    deskripsi: string | null;
}

interface EkstrakulikulerDetailItem {
    id: number;
    nama: string;
    deskripsi: string;
    slug: string;
    thumbnail: string | null;
    images: EkstrakulikulerImage[];
    prestasis: Prestasi[];
}

interface EkstrakulikulerLainnyaItem {
    id: number;
    nama: string;
    slug: string;
    thumbnail: string | null;
}

interface PageProps {
    ekstrakulikuler: EkstrakulikulerDetailItem;
    ekstrakulikulerLainnya: EkstrakulikulerLainnyaItem[];
}

export default function PublicEkstrakulikulerDetail() {
    const { ekstrakulikuler, ekstrakulikulerLainnya } = usePage<PageProps>().props;

    return (
        <PublicLayout>
            <section className="mx-auto max-w-4xl px-4 py-16 pt-32">
                <Link href="/ekstrakulikuler" className="mb-6 inline-block text-sm" style={{ color: 'var(--primary)' }}>
                    ← Kembali ke Ekstrakulikuler
                </Link>

                <div className="mb-6 aspect-video overflow-hidden rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
                    <img
                        src={ekstrakulikuler.thumbnail || '/images/default-img.png'}
                        alt={ekstrakulikuler.nama}
                        className="h-full w-full object-cover"
                    />
                </div>

                <h1 className="mb-4 text-3xl font-bold" style={{ color: 'var(--foreground)' }}>
                    {ekstrakulikuler.nama}
                </h1>

                <div className="prose mb-10 max-w-none text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--foreground)' }}>
                    {ekstrakulikuler.deskripsi}
                </div>

                {ekstrakulikuler.images.length > 0 && (
                    <div className="mb-10">
                        <h2 className="mb-4 text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
                            Dokumentasi Kegiatan
                        </h2>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {ekstrakulikuler.images.map((img) => (
                                <div
                                    key={img.id}
                                    className="aspect-square overflow-hidden rounded-lg"
                                    style={{ backgroundColor: 'var(--muted)' }}
                                >
                                    <img src={img.image_url} alt={ekstrakulikuler.nama} className="h-full w-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {ekstrakulikuler.prestasis.length > 0 && (
                    <div className="mb-10">
                        <h2 className="mb-4 text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
                            Prestasi
                        </h2>
                        <div className="space-y-3">
                            {ekstrakulikuler.prestasis.map((p) => (
                                <div
                                    key={p.id}
                                    className="flex items-start gap-3 rounded-lg border p-4"
                                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
                                >
                                    <Trophy className="mt-0.5 h-5 w-5 shrink-0" style={{ color: 'var(--primary)' }} />
                                    <div>
                                        <p className="font-medium" style={{ color: 'var(--card-foreground)' }}>
                                            {p.judul}
                                        </p>
                                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                                            {[p.tingkat, p.tahun].filter(Boolean).join(' · ')}
                                        </p>
                                        {p.deskripsi && (
                                            <p className="mt-1 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                                                {p.deskripsi}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {ekstrakulikulerLainnya.length > 0 && (
                    <div className="mt-16">
                        <h2 className="mb-4 text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
                            Ekstrakulikuler Lainnya
                        </h2>
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                            {ekstrakulikulerLainnya.map((e) => (
                                <Link key={e.id} href={route('public.ekstrakulikuler.show', e.slug)}>
                                    <Card
                                        className="group overflow-hidden transition-shadow hover:shadow-lg"
                                        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
                                    >
                                        <div className="aspect-video overflow-hidden" style={{ backgroundColor: 'var(--muted)' }}>
                                            <img
                                                src={e.thumbnail || '/images/default-img.png'}
                                                alt={e.nama}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        </div>
                                        <CardContent className="p-3">
                                            <p className="line-clamp-2 text-sm font-medium" style={{ color: 'var(--card-foreground)' }}>
                                                {e.nama}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </section>
        </PublicLayout>
    );
}