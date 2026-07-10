import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { formatDate } from '@/helpers/format';
import PublicLayout, { SectionHeader } from '@/layouts/public-layout';
import { Link, router, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';

interface BeritaItem {
    id: number;
    judul: string;
    isi?: string;
    created_at: string;
    berita_image?: { image_url: string } | null;
}

interface PaginatedBerita {
    data: BeritaItem[];
    current_page: number;
    last_page: number;
    total: number;
}

interface PageProps {
    beritas: PaginatedBerita;
    filters: { search: string };
}

export default function PublicBeritaIndex() {
    const { beritas, filters } = usePage<PageProps>().props;
    const [search, setSearch] = useState(filters?.search ?? '');
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleSearch = (val: string) => {
        setSearch(val);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            router.get(route('public.berita'), { search: val }, { preserveState: true, replace: true });
        }, 400);
    };

    const goToPage = (page: number) => {
        router.get(route('public.berita'), { search, page }, { preserveState: true, preserveScroll: true });
    };

    return (
        <PublicLayout>
            <section className="mx-auto max-w-7xl px-4 py-16 pt-32">
                <SectionHeader title="Berita Sekolah" />

                <div className="mb-8 max-w-sm">
                    <Input placeholder="Cari berita..." value={search} onChange={(e) => handleSearch(e.target.value)} />
                </div>

                {beritas.data.length === 0 ? (
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                        Belum ada berita.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {beritas.data.map((b) => (
                            <Card
                                key={b.id}
                                className="group overflow-hidden transition-shadow duration-300 hover:shadow-lg"
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
                                    <p className="mb-1 line-clamp-2 font-semibold" style={{ color: 'var(--card-foreground)' }}>
                                        {b.judul}
                                    </p>
                                    <p className="mb-2 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                                        {formatDate(b.created_at)}
                                    </p>
                                    {b.isi && (
                                        <p className="line-clamp-3 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                                            {b.isi}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {beritas.last_page > 1 && (
                    <div className="mt-10 flex items-center justify-center gap-2">
                        {Array.from({ length: beritas.last_page }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => goToPage(page)}
                                className="rounded-md px-3 py-1.5 text-sm font-medium"
                                style={{
                                    backgroundColor: page === beritas.current_page ? 'var(--primary)' : 'var(--secondary)',
                                    color: page === beritas.current_page ? 'var(--primary-foreground)' : 'var(--foreground)',
                                }}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                )}
            </section>
        </PublicLayout>
    );
}
