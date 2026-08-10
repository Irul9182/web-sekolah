import { Card, CardContent } from '@/components/ui/card';
import PublicLayout, { SectionHeader } from '@/layouts/public-layout';
import { Link, usePage } from '@inertiajs/react';

interface EkstrakulikulerItem {
    slug: string;
    nama: string;
    deskripsi: string | null;
    thumbnail?: string | null;
}

interface PageProps {
    ekstrakulikulers: EkstrakulikulerItem[];
}

export default function PublicEkstrakulikulerIndex() {
    const { ekstrakulikulers } = usePage<PageProps>().props;

    return (
        <PublicLayout>
            <section className="mx-auto max-w-7xl px-4 py-16 pt-32">
                <SectionHeader title="Ekstrakulikuler" />

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {ekstrakulikulers.map((e) => (
                        <Link key={e.slug} href={route('public.ekstrakulikuler.show', e.slug)}>
                            <Card
                                className="group overflow-hidden transition-shadow duration-300 hover:shadow-lg"
                                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
                            >
                                <div className="aspect-video overflow-hidden" style={{ backgroundColor: 'var(--muted)' }}>
                                    <img
                                        src={e.thumbnail || '/images/default-img.png'}
                                        alt={e.nama}
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                                <CardContent className="p-4">
                                    <p className="mb-1 font-semibold" style={{ color: 'var(--card-foreground)' }}>
                                        {e.nama}
                                    </p>
                                    {e.deskripsi && (
                                        <p className="line-clamp-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                                            {e.deskripsi}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </section>
        </PublicLayout>
    );
}