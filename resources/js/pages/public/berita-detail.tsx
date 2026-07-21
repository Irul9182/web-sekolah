import { Card, CardContent } from '@/components/ui/card';
import { formatDate } from '@/helpers/format';
import PublicLayout from '@/layouts/public-layout';
import { Link, usePage } from '@inertiajs/react';

interface BeritaDetailItem {
    id: number;
    judul: string;
    isi: string;
    tanggal: string;
    slug: string;
    berita_image?: { image_url: string } | null;
}

interface PageProps {
    berita: BeritaDetailItem;
    beritaLainnya: BeritaDetailItem[];
}

export default function PublicBeritaDetail() {
    const { berita, beritaLainnya } = usePage<PageProps>().props;

    return (
        <PublicLayout>
            <section className="mx-auto max-w-4xl px-4 py-16 pt-32">
                <Link href="/berita" className="mb-6 inline-block text-sm" style={{ color: 'var(--primary)' }}>
                    ← Kembali ke Berita
                </Link>

                <div className="mb-6 aspect-video overflow-hidden rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
                    <img
                        src={berita.berita_image?.image_url || '/images/default-img.png'}
                        alt={berita.judul}
                        className="h-full w-full object-cover"
                    />
                </div>

                <p className="mb-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                    {formatDate(berita.tanggal)}
                </p>
                <h1 className="mb-6 text-3xl font-bold" style={{ color: 'var(--foreground)' }}>
                    {berita.judul}
                </h1>

                <div className="prose max-w-none text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--foreground)' }}>
                    {berita.isi}
                </div>

                {beritaLainnya.length > 0 && (
                    <div className="mt-16">
                        <h2 className="mb-4 text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
                            Berita Lainnya
                        </h2>
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                            {beritaLainnya.map((b) => (
                                <Link key={b.id} href={route('public.berita.show', b.slug)}>
                                    <Card className="group overflow-hidden transition-shadow hover:shadow-lg" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
                                        <div className="aspect-video overflow-hidden" style={{ backgroundColor: 'var(--muted)' }}>
                                            <img
                                                src={b.berita_image?.image_url || '/images/default-img.png'}
                                                alt={b.judul}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        </div>
                                        <CardContent className="p-3">
                                            <p className="line-clamp-2 text-sm font-medium" style={{ color: 'var(--card-foreground)' }}>
                                                {b.judul}
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